import { readFile } from 'node:fs/promises';
import { gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import { setImmediate as yieldWork } from 'node:timers/promises';
import path from 'node:path';
import { Country } from 'country-state-city';

type Row = [string, string, string, string, number, string];
export interface Place { id: string; name: string; region: string; country: string }
const cache = new Map<string, Promise<Row[]>>();
const decompress = promisify(gunzip);
let searches = 0;
export class PlaceSearchBusyError extends Error {}
const fold = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
async function rows(country: string): Promise<Row[]> {
  if (!/^[A-Z]{2}$/.test(country) || !Country.getCountryByCode(country)) return [];
  let pending = cache.get(country);
  if (!pending) {
    if (cache.size >= 1) cache.delete(cache.keys().next().value as string);
    pending = readFile(path.join(process.cwd(), 'data', 'places', 'normalized', `${country}.json.gz`)).then(buffer => decompress(buffer)).then(buffer => JSON.parse(buffer.toString('utf8')) as Row[]).catch(error => { cache.delete(country); throw error; });
    cache.set(country, pending);
  }
  return pending;
}
export async function searchPlaces(country: string, query: string): Promise<Place[]> {
  const normalized = fold(query.trim());
  const terms = normalized.split(/\s+/).filter(Boolean);
  if (normalized.length < 2 || query.length > 120 || !terms.length) return [];
  if (searches >= 2) throw new PlaceSearchBusyError('Search capacity unavailable');
  searches++;
  try {
  const all = await rows(country);
  const found: { row: Row; rank: number }[] = [];
  for (let index = 0; index < all.length; index++) {
    if (index % 4096 === 0) await yieldWork();
    const row = all[index], name = row[5], aliases = row[3];
    if (!terms.every(term => name.includes(term) || aliases.includes(term))) continue;
    const candidate = { row, rank: name === normalized ? 0 : name.startsWith(terms[0]) ? 1 : 2 };
    const position = found.findIndex(item => candidate.rank < item.rank || (candidate.rank === item.rank && row[4] > item.row[4]));
    if (position >= 0) found.splice(position, 0, candidate);
    else if (found.length < 20) found.push(candidate);
    if (found.length > 20) found.pop();
  }
  return found.map(({ row }) => ({ id: `geonames:${row[0]}`, name: row[1], region: row[2], country }));
  } finally { searches--; }
}
export async function resolvePlace(country: string, id: string): Promise<Place | undefined> {
  const row = (await rows(country)).find(item => `geonames:${item[0]}` === id);
  return row ? { id, name: row[1], region: row[2], country } : undefined;
}
