// Single entry point for the iso-639-1 package.
//
// Why this exists: `iso-639-1` is shipped as CommonJS with
// `module.exports = class ISO6391 { static getAllNames() {...} }`.
// Different Next.js / webpack interop paths sometimes expose that class as
// `m.default`, sometimes as `m` itself, and (under certain build flags) as
// a one-key wrapped namespace. Spreading that fragility across multiple
// callsites is what caused the repeated settings-page crash. This module
// hides the interop quirks behind two stable async helpers and caches the
// resolved class so it only loads once per session.

type LanguageOption = { value: string; label: string };

let _ISO6391: any = null;

export async function getISO6391(): Promise<any> {
  if (_ISO6391) return _ISO6391;

  try {
    const mod: any = await import('iso-639-1');
    _ISO6391 = mod?.default ?? mod;

    // Some bundler interop paths wrap the class one level deeper, e.g.
    // `{ default: { default: class ISO6391 {} } }`. If our resolved value
    // doesn't actually expose the expected static methods, probe one key
    // deeper and re-assign if we find them there.
    if (typeof _ISO6391?.getAllNames !== 'function') {
      const keys = Object.keys(_ISO6391 || {});
      if (keys.length > 0) {
        const inner = _ISO6391[keys[0]];
        if (typeof inner?.getAllNames === 'function') {
          _ISO6391 = inner;
        }
      }
    }
  } catch (e) {
    console.error('iso-639-1 load failed:', e);
  }

  return _ISO6391;
}

// Returns the language options used by every <Select isMulti> language
// picker in the app. Shape is { value: <english name>, label: <english name> }
// to remain compatible with already-saved user records that store full
// language names (e.g. ["English", "Spanish"]).
export async function getLanguageOptions(): Promise<LanguageOption[]> {
  const ISO6391 = await getISO6391();
  if (!ISO6391) return [];

  try {
    return ISO6391.getAllNames().map((name: string) => ({
      value: name,
      label: name,
    }));
  } catch (e) {
    console.error('Language options failed:', e);
    return [];
  }
}
