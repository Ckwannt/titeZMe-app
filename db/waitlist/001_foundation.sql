-- Dedicated database only. Never run against the marketplace database.
-- Migration identity needs CREATE ROLE/extension privileges. No runtime login is created.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='waitlist_owner') THEN CREATE ROLE waitlist_owner NOLOGIN; END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='waitlist_api') THEN CREATE ROLE waitlist_api NOLOGIN; END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='waitlist_privacy') THEN CREATE ROLE waitlist_privacy NOLOGIN; END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='waitlist_delivery') THEN CREATE ROLE waitlist_delivery NOLOGIN; END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS waitlist AUTHORIZATION waitlist_owner;
REVOKE ALL ON SCHEMA waitlist FROM PUBLIC;
GRANT USAGE ON SCHEMA waitlist TO waitlist_api,waitlist_privacy;

CREATE TABLE waitlist.policy (
  singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
  enabled boolean NOT NULL DEFAULT false,
  privacy_approved boolean NOT NULL DEFAULT false,
  rates_approved boolean NOT NULL DEFAULT false,
  privacy_version text,
  consent_version text NOT NULL DEFAULT 'city-notification-v1',
  retention_months integer NOT NULL DEFAULT 12 CHECK(retention_months BETWEEN 1 AND 24),
  suppression_days integer CHECK(suppression_days BETWEEN 1 AND 3650),
  network_limit integer NOT NULL DEFAULT 5 CHECK(network_limit>0),
  email_limit integer NOT NULL DEFAULT 3 CHECK(email_limit>0),
  global_limit integer NOT NULL DEFAULT 100 CHECK(global_limit>0)
);
INSERT INTO waitlist.policy(singleton) VALUES(true);
CREATE TABLE waitlist.private_keys (
  singleton boolean PRIMARY KEY CHECK(singleton), lookup_secret bytea NOT NULL, receipt_secret bytea NOT NULL
);
INSERT INTO waitlist.private_keys VALUES(true,public.gen_random_bytes(32),public.gen_random_bytes(32));
CREATE TABLE waitlist.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_lookup text NOT NULL UNIQUE,
  email_delivery text NOT NULL UNIQUE CHECK(length(email_delivery)<=254),
  country text NOT NULL CHECK(country ~ '^[A-Z]{2}$'),
  city text NOT NULL CHECK(char_length(city) BETWEEN 1 AND 120),
  place_id text,
  place_region text NOT NULL CHECK(char_length(place_region)<=120),
  missing_place boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  purpose text NOT NULL DEFAULT 'city_availability_notification_v1' CHECK(purpose='city_availability_notification_v1'),
  consent_version text NOT NULL,
  consent_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  privacy_version text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK(status IN('active','notification_sent','suppressed')),
  expires_at timestamptz NOT NULL,
  receipt_hash text NOT NULL UNIQUE,
  CHECK((missing_place AND place_id IS NULL) OR (NOT missing_place AND place_id ~ '^geonames:[0-9]+$'))
);
CREATE INDEX subscriptions_expiry ON waitlist.subscriptions(expires_at);
CREATE INDEX subscriptions_city ON waitlist.subscriptions(country,place_id,status);
CREATE TABLE waitlist.suppressions (
  email_lookup text PRIMARY KEY, reason text NOT NULL CHECK(reason IN('withdrawal','deletion','expiry','complaint')),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(), expires_at timestamptz NOT NULL
);
CREATE TABLE waitlist.idempotency (
  key_hash text PRIMARY KEY, fingerprint text NOT NULL, receipt text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT clock_timestamp()+interval '24 hours'
);
-- Receipts are capabilities, encrypted at rest here; never exported/logged. Only the
-- procedure owner can read them. Caching the original result permits safe retries.
CREATE TABLE waitlist.rate_buckets (key text PRIMARY KEY, count integer NOT NULL, reset_at timestamptz NOT NULL);

CREATE FUNCTION waitlist.take_budget(p_key text,p_limit integer,p_seconds integer) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,waitlist AS $$
DECLARE used integer;
BEGIN
  INSERT INTO waitlist.rate_buckets AS b VALUES(p_key,1,clock_timestamp()+make_interval(secs=>p_seconds))
  ON CONFLICT(key) DO UPDATE SET count=CASE WHEN b.reset_at<=clock_timestamp() THEN 1 ELSE b.count+1 END,
    reset_at=CASE WHEN b.reset_at<=clock_timestamp() THEN clock_timestamp()+make_interval(secs=>p_seconds) ELSE b.reset_at END
  RETURNING count INTO used;
  RETURN used<=p_limit;
END $$;

CREATE FUNCTION waitlist.register(p_payload jsonb,p_idempotency text,p_network text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,waitlist AS $$
DECLARE policy waitlist.policy; keys waitlist.private_keys; lookup text; idem text; fingerprint text;
  receipt text; previous waitlist.idempotency; network text;
BEGIN
  SELECT * INTO policy FROM waitlist.policy WHERE singleton;
  IF NOT policy.enabled OR NOT policy.privacy_approved OR NOT policy.rates_approved OR policy.suppression_days IS NULL OR policy.privacy_version IS NULL THEN
    RETURN jsonb_build_object('code','enrollment_disabled');
  END IF;
  IF p_payload IS NULL OR jsonb_typeof(p_payload)<>'object' OR NOT p_payload ?& ARRAY['country','city','email','placeId','placeRegion','missingPlace','consent','consentVersion','privacyVersion']
    OR (p_payload - ARRAY['country','city','email','placeId','placeRegion','missingPlace','consent','consentVersion','privacyVersion'])<>'{}'::jsonb
    OR p_payload->'consent'<>'true'::jsonb OR p_payload->>'consentVersion'<>policy.consent_version OR p_payload->>'privacyVersion'<>policy.privacy_version
    OR p_idempotency IS NULL OR p_network IS NULL OR p_idempotency !~ '^[A-Za-z0-9_-]{32,80}$' OR length(p_network)>128 THEN
    RETURN jsonb_build_object('code','invalid_request');
  END IF;
  IF EXISTS(SELECT FROM jsonb_each(p_payload) AS f(k,v) WHERE k IN('country','city','email','placeRegion','consentVersion','privacyVersion') AND jsonb_typeof(v)<>'string')
    OR jsonb_typeof(p_payload->'missingPlace')<>'boolean' OR p_payload->'consent' IS DISTINCT FROM 'true'::jsonb
    OR p_payload->>'consentVersion' IS DISTINCT FROM policy.consent_version OR p_payload->>'privacyVersion' IS DISTINCT FROM policy.privacy_version
    OR p_payload->>'country' !~ '^[A-Z]{2}$' OR char_length(p_payload->>'city') NOT BETWEEN 1 AND 120
    OR char_length(p_payload->>'placeRegion')>120 OR char_length(p_payload->>'email') NOT BETWEEN 3 AND 254
    OR p_payload->>'email' !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    OR p_payload->>'city' ~ '[[:cntrl:]]' OR p_payload->>'placeRegion' ~ '[[:cntrl:]]'
    OR NOT ((p_payload->'missingPlace'='true'::jsonb AND p_payload->'placeId'='null'::jsonb AND length(btrim(p_payload->>'placeRegion'))>0)
      OR (p_payload->'missingPlace'='false'::jsonb AND jsonb_typeof(p_payload->'placeId')='string' AND p_payload->>'placeId' ~ '^geonames:[0-9]+$')) THEN
    RETURN jsonb_build_object('code','invalid_request');
  END IF;
  SELECT * INTO keys FROM waitlist.private_keys WHERE singleton;
  lookup:=encode(public.hmac(convert_to('email:'||(p_payload->>'email'),'UTF8'),keys.lookup_secret,'sha256'),'hex');
  idem:=encode(public.hmac(convert_to('idem:'||p_idempotency,'UTF8'),keys.lookup_secret,'sha256'),'hex');
  fingerprint:=encode(public.hmac(convert_to(p_payload::text,'UTF8'),keys.lookup_secret,'sha256'),'hex');
  network:=encode(public.hmac(convert_to('network:'||p_network,'UTF8'),keys.lookup_secret,'sha256'),'hex');
  -- Retries keep the same result, but must not bypass request abuse budgets.
  IF NOT waitlist.take_budget('global',policy.global_limit,60)
    OR NOT waitlist.take_budget('network:'||network,policy.network_limit,900) THEN
    RETURN jsonb_build_object('code','rate_limited');
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('idem:'||idem,0));
  SELECT * INTO previous FROM waitlist.idempotency WHERE key_hash=idem AND expires_at>clock_timestamp();
  IF FOUND THEN
    IF previous.fingerprint<>fingerprint THEN RETURN jsonb_build_object('code','idempotency_conflict'); END IF;
    receipt:=public.pgp_sym_decrypt(decode(previous.receipt,'hex'),encode(keys.receipt_secret,'hex'));
    RETURN jsonb_build_object('status','processed','withdrawalReceipt',receipt);
  END IF;
  IF NOT waitlist.take_budget('email:'||lookup,policy.email_limit,86400) THEN
    RETURN jsonb_build_object('code','rate_limited');
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('email:'||lookup,0));
  receipt:=encode(public.gen_random_bytes(32),'hex');
  IF NOT EXISTS(SELECT FROM waitlist.suppressions WHERE email_lookup=lookup AND expires_at>clock_timestamp()) THEN
    INSERT INTO waitlist.subscriptions(email_lookup,email_delivery,country,city,place_id,place_region,missing_place,consent_version,privacy_version,expires_at,receipt_hash)
    VALUES(lookup,p_payload->>'email',p_payload->>'country',p_payload->>'city',p_payload->>'placeId',p_payload->>'placeRegion',(p_payload->>'missingPlace')::boolean,
      policy.consent_version,policy.privacy_version,clock_timestamp()+make_interval(months=>policy.retention_months),encode(public.digest(receipt,'sha256'),'hex'))
    ON CONFLICT DO NOTHING;
  END IF;
  INSERT INTO waitlist.idempotency VALUES(idem,fingerprint,encode(public.pgp_sym_encrypt(receipt,encode(keys.receipt_secret,'hex')),'hex'),clock_timestamp()+interval '24 hours')
    ON CONFLICT(key_hash) DO UPDATE SET fingerprint=excluded.fingerprint,receipt=excluded.receipt,expires_at=excluded.expires_at;
  RETURN jsonb_build_object('status','processed','withdrawalReceipt',receipt);
END $$;

CREATE FUNCTION waitlist.remove_subscription(p_receipt text,p_mode text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,waitlist AS $$
DECLARE matched waitlist.subscriptions; days integer;
BEGIN
  IF NOT waitlist.take_budget('privacy-global',(SELECT global_limit FROM waitlist.policy WHERE singleton),60) THEN
    RETURN jsonb_build_object('code','rate_limited');
  END IF;
  IF p_receipt !~ '^[a-f0-9]{64}$' OR p_mode NOT IN('withdrawal','deletion') THEN RETURN jsonb_build_object('status','processed'); END IF;
  SELECT * INTO matched FROM waitlist.subscriptions WHERE receipt_hash=encode(public.digest(p_receipt,'sha256'),'hex');
  IF NOT FOUND THEN RETURN jsonb_build_object('status','processed'); END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended('email:'||matched.email_lookup,0));
  SELECT * INTO matched FROM waitlist.subscriptions WHERE id=matched.id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('status','processed'); END IF;
  SELECT suppression_days INTO days FROM waitlist.policy WHERE singleton;
  IF days IS NULL THEN RETURN jsonb_build_object('code','enrollment_disabled'); END IF;
  INSERT INTO waitlist.suppressions(email_lookup,reason,expires_at) VALUES(matched.email_lookup,p_mode,clock_timestamp()+make_interval(days=>days))
    ON CONFLICT(email_lookup) DO NOTHING;
  DELETE FROM waitlist.subscriptions WHERE id=matched.id;
  RETURN jsonb_build_object('status','processed');
END $$;

CREATE FUNCTION waitlist.purge_expired() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,waitlist AS $$
DECLARE item waitlist.subscriptions; days integer;
BEGIN
  SELECT suppression_days INTO days FROM waitlist.policy WHERE singleton;
  IF days IS NULL THEN RETURN; END IF;
  FOR item IN SELECT * FROM waitlist.subscriptions WHERE expires_at<=clock_timestamp() LOOP
    PERFORM pg_advisory_xact_lock(hashtextextended('email:'||item.email_lookup,0));
    INSERT INTO waitlist.suppressions(email_lookup,reason,expires_at) VALUES(item.email_lookup,'expiry',clock_timestamp()+make_interval(days=>days)) ON CONFLICT DO NOTHING;
    DELETE FROM waitlist.subscriptions WHERE id=item.id AND expires_at<=clock_timestamp();
  END LOOP;
  DELETE FROM waitlist.suppressions WHERE expires_at<=clock_timestamp();
  DELETE FROM waitlist.idempotency WHERE expires_at<=clock_timestamp();
  DELETE FROM waitlist.rate_buckets WHERE reset_at<=clock_timestamp();
END $$;

ALTER TABLE waitlist.policy OWNER TO waitlist_owner;
ALTER TABLE waitlist.private_keys OWNER TO waitlist_owner;
ALTER TABLE waitlist.subscriptions OWNER TO waitlist_owner;
ALTER TABLE waitlist.suppressions OWNER TO waitlist_owner;
ALTER TABLE waitlist.idempotency OWNER TO waitlist_owner;
ALTER TABLE waitlist.rate_buckets OWNER TO waitlist_owner;
ALTER FUNCTION waitlist.take_budget(text,integer,integer) OWNER TO waitlist_owner;
ALTER FUNCTION waitlist.register(jsonb,text,text) OWNER TO waitlist_owner;
ALTER FUNCTION waitlist.remove_subscription(text,text) OWNER TO waitlist_owner;
ALTER FUNCTION waitlist.purge_expired() OWNER TO waitlist_owner;
REVOKE ALL ON ALL TABLES IN SCHEMA waitlist FROM PUBLIC,waitlist_api,waitlist_privacy,waitlist_delivery;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA waitlist FROM PUBLIC,waitlist_api,waitlist_privacy,waitlist_delivery;
GRANT EXECUTE ON FUNCTION waitlist.register(jsonb,text,text),waitlist.remove_subscription(text,text) TO waitlist_api;
GRANT EXECUTE ON FUNCTION waitlist.purge_expired() TO waitlist_privacy;
ALTER DEFAULT PRIVILEGES FOR ROLE waitlist_owner IN SCHEMA waitlist REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
COMMIT;
