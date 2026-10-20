-- Forward correction for an already initialized isolated database; no policy activation.
BEGIN;
CREATE OR REPLACE FUNCTION waitlist.remove_subscription(p_receipt text,p_mode text) RETURNS jsonb
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
    ON CONFLICT(email_lookup) DO UPDATE SET reason=excluded.reason,created_at=excluded.created_at,expires_at=excluded.expires_at
    WHERE waitlist.suppressions.expires_at<=clock_timestamp();
  DELETE FROM waitlist.subscriptions WHERE id=matched.id;
  RETURN jsonb_build_object('status','processed');
END $$;

CREATE OR REPLACE FUNCTION waitlist.purge_expired() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,waitlist AS $$
DECLARE item waitlist.subscriptions; days integer;
BEGIN
  SELECT suppression_days INTO days FROM waitlist.policy WHERE singleton;
  IF days IS NULL THEN RETURN; END IF;
  FOR item IN SELECT * FROM waitlist.subscriptions WHERE expires_at<=clock_timestamp() LOOP
    PERFORM pg_advisory_xact_lock(hashtextextended('email:'||item.email_lookup,0));
    INSERT INTO waitlist.suppressions(email_lookup,reason,expires_at) VALUES(item.email_lookup,'expiry',clock_timestamp()+make_interval(days=>days))
      ON CONFLICT(email_lookup) DO UPDATE SET reason=excluded.reason,created_at=excluded.created_at,expires_at=excluded.expires_at
      WHERE waitlist.suppressions.expires_at<=clock_timestamp();
    DELETE FROM waitlist.subscriptions WHERE id=item.id AND expires_at<=clock_timestamp();
  END LOOP;
  DELETE FROM waitlist.suppressions WHERE expires_at<=clock_timestamp();
  DELETE FROM waitlist.idempotency WHERE expires_at<=clock_timestamp();
  DELETE FROM waitlist.rate_buckets WHERE reset_at<=clock_timestamp();
END $$;

COMMIT;
