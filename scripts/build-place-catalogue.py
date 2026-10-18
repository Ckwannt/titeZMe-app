"""Build country shards from the public GeoNames dump; no visitor data or remote search."""
import collections, gzip, hashlib, io, json, pathlib, urllib.request, zipfile

root = pathlib.Path(__file__).resolve().parents[1]
archive = root / 'design-audit/final-release/geonames-allCountries.zip'
output = root / 'data/places'
output.mkdir(parents=True, exist_ok=True)
with urllib.request.urlopen('https://download.geonames.org/export/dump/admin1CodesASCII.txt') as response:
    regions = {row[0]: row[1] for line in io.TextIOWrapper(response, encoding='utf-8') if (row := line.rstrip('\n').split('\t')) and len(row) >= 2}
countries = collections.defaultdict(list)
with zipfile.ZipFile(archive) as zipped, zipped.open('allCountries.txt') as source:
    for line in io.TextIOWrapper(source, encoding='utf-8'):
        row = line.rstrip('\n').split('\t')
        if len(row) < 19 or row[6] != 'P' or row[7] in {'PPLQ', 'PPLW', 'PPLH', 'PPLCH'} or not row[8]:
            continue
        country = row[8]
        countries[country].append([row[0], row[1], regions.get(country + '.' + row[10], row[10]), row[2] + ',' + row[3], int(row[14] or 0)])
for country, places in countries.items():
    places.sort(key=lambda place: (-place[4], place[1]))
    with gzip.open(output / (country + '.json.gz'), 'wt', encoding='utf-8', compresslevel=9) as destination:
        json.dump(places, destination, ensure_ascii=False, separators=(',', ':'))
manifest = {'source': 'https://download.geonames.org/export/dump/allCountries.zip', 'archiveSha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'licence': 'CC BY 4.0', 'attribution': 'GeoNames, https://www.geonames.org/', 'selection': 'Current feature-class P populated places; historical/abandoned/destroyed feature codes excluded. No population threshold.', 'counts': {country: len(places) for country, places in sorted(countries.items())}, 'total': sum(map(len, countries.values()))}
(output / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(json.dumps({'countries': len(countries), 'places': manifest['total'], 'compressedBytes': sum(file.stat().st_size for file in output.glob('*.gz'))}))
