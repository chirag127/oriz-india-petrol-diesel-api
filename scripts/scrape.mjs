// oriz-india-petrol-diesel-api scrape — ToS-conservative posture.
// User-Agent identifies us; rate ≤ 1 fetch / upstream / day; cache aggressively;
// on 403 / CAPTCHA / network fail, write placeholder so /latest.json stays valid.
import { writeFileSync, mkdirSync } from 'node:fs';
import { load } from 'cheerio';

const today = new Date().toISOString().slice(0, 10);
const UA = "oriz-api-bot/0.1 (+https://oriz.in/about; contact: privacy@oriz.in)";
const placeholder = {"source":"placeholder","petrol":{},"diesel":{}};
const seed = {"source":"placeholder","currency":"INR","unit":"litre","petrol":{"delhi":0,"mumbai":0,"bengaluru":0,"chennai":0,"kolkata":0},"diesel":{"delhi":0,"mumbai":0,"bengaluru":0,"chennai":0,"kolkata":0}};
const HEADERS = { 'User-Agent': UA, 'Accept': 'application/json, text/html;q=0.9' };

async function safe(fn) { try { return await fn(); } catch (e) { console.error('upstream:', e.message); return null; } }

async function scrape() {
  // Goodreturns aggregator (mirrors IOC/HPCL daily fuel rates). Cheerio scrape.
  const cities = ['delhi','mumbai','bengaluru','chennai','kolkata'];
  const petrol = {}, diesel = {};
  for (const c of cities) {
    const r = await fetch('https://www.goodreturns.in/petrol-price-in-' + c + '.html', { headers: HEADERS });
    if (!r.ok) continue;
    const $ = load(await r.text());
    const num = (txt) => +(txt.match(/\d+\.\d+/) ?? [0])[0];
    petrol[c] = num($('div').filter((_,d)=>/petrol/i.test($(d).text())).first().text());
  }
  if (!Object.keys(petrol).length) throw new Error('fuel empty');
  return { source: 'goodreturns', currency: 'INR', unit: 'litre', petrol, diesel };
}
let result = await safe(scrape) ?? seed;
const payload = { date: today, ...result };
mkdirSync('data', { recursive: true });
writeFileSync('data/' + today + '.json', JSON.stringify(payload, null, 2) + '\n');
writeFileSync('data/latest.json', JSON.stringify(payload, null, 2) + '\n');
console.log('wrote data/latest.json source=', payload.source);
