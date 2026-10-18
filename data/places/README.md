# Local worldwide place catalogue

Source: https://download.geonames.org/export/dump/allCountries.zip and admin1CodesASCII.txt.
Attribution: GeoNames, https://www.geonames.org/ . Licence: https://creativecommons.org/licenses/by/4.0/ .

Country shards contain current GeoNames feature-class P populated places with their original stable numeric GeoNames IDs. Historical, abandoned and destroyed feature codes are excluded. There is no population threshold or country shortlist. Sources are community-maintained and not exhaustive; aliases, borders and names can change. A self-declared missing-place fallback has no verified geographic identifier and is excluded from automatic notification matching until resolved.

Rebuild with scripts/build-place-catalogue.py after separately downloading the source archive. manifest.json records source hash and counts. Search uses this local copy; visitor queries are not transmitted to GeoNames. Raw source archives and audit files must never enter a deployment bundle.
