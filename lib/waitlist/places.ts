import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';
import { Country } from 'country-state-city';

type Row = [string, string, string, string, number];
export interface Place { id: string; name: string; region: string; country: string }
const cache = new Map<string, Promise<Row[]>>();
const fold = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
async function rows(country: string): Promise<Row[]> {
  if (!/^[A-Z]{2}$/.test(country) || !Country.getCountryByCode(country)) return [];
  let pending = cache.get(country);
  if (!pending) {
    if (cache.size >= 3) cache.delete(cache.keys().next().value as string);
    pending = readFile(path.join(process.cwd(), 'data', 'places', `${country}.json.gz`)).then(buffer => JSON.parse(gunzipSync(buffer).toString('utf8')) as Row[]).catch(() => []);
    cache.set(country, pending);
  }
  return pending;
}
export async function searchPlaces(country: string, query: string): Promise<Place[]> {
  const terms = fold(query.trim()).split(/\s+/).filter(Boolean);
  if (query.length < 2 || query.length > 120 || !terms.length) return [];
  const all = await rows(country);
  const found: { row: Row; rank: number }[] = [];
  for (const row of all) {
    const name = fold(row[1]), aliases = fold(row[3]);
    if (terms.every(term => name.includes(term) || aliases.includes(term))) found.push({ row, rank: name === fold(query) ? 0 : name.startsWith(terms[0]) ? 1 : 2 });
  }
  return found.sort((a, b) => a.rank - b.rank || b.row[4] - a.row[4]).slice(0, 20).map(({ row }) => ({ id: `geonames:${row[0]}`, name: row[1], region: row[2], country }));
}
export async function resolvePlace(country: string, id: string): Promise<Place | undefined> {
  const row = (await rows(country)).find(item => `geonames:${item[0]}` === id);
  return row ? { id, name: row[1], region: row[2], country } : undefined;
}
