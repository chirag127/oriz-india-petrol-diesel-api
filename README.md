# oriz-india-petrol-diesel-api

> Daily city-wise petrol and diesel rates for India.

Scraped by GitHub Actions, served as static JSON via GitHub Pages and `raw.githubusercontent.com`. No Cloudflare Workers, no ongoing cost.

## Endpoints

| URL | Description |
| --- | --- |
| `https://fuel.api.oriz.in/latest.json` | Most recent scrape (CNAME → GH Pages; DNS may be pending) |
| `https://chirag127.github.io/oriz-india-petrol-diesel-api/latest.json` | Direct GitHub Pages |
| `https://raw.githubusercontent.com/chirag127/oriz-india-petrol-diesel-api/main/data/latest.json` | Raw, no Pages dependency |
| `.../data/<YYYY-MM-DD>.json` | Dated snapshot |

## Schedule

Cron: `0 5 * * *` (UTC). Re-runnable manually via the **scrape** workflow.

## Local run

```bash
npm install
node scripts/scrape.mjs
```

## License

MIT — see [LICENSE](./LICENSE).

---

_Source: see [knowledge/decisions/architecture/api-scraping-tos-audit.md](https://github.com/chirag127/oriz/blob/main/knowledge/decisions/architecture/api-scraping-tos-audit.md). Attribution required. Non-commercial public-data redistribution._
