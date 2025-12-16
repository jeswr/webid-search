# WebID Search

A Next.js web application and crawler for discovering, indexing, and searching Solid WebIDs from the decentralized web.

**Live Demo:** [webid-search.vercel.app](https://webid-search.vercel.app)

## What is a WebID?

A [WebID](https://www.w3.org/wiki/WebID) is a unique URI that identifies a person on the web. In the [Solid](https://solidproject.org/) ecosystem, WebIDs point to profile documents that contain information about the user, including links to their data pods and connections to other users via `foaf:knows` relationships.

## Features

### Web Application
- 🔍 **Search Interface** - Search for WebIDs by name or WebID URL
- 📊 **Multiple Response Formats** - API returns JSON, JSON-LD, or Turtle based on `Accept` header
- 🔗 **Shareable URLs** - Search queries are reflected in the URL for easy sharing

### Crawler
- 🕸️ **Social Graph Traversal** - Follow `foaf:knows` links to discover connected WebIDs
- 📥 **Solid Catalog Integration** - Automatically fetches WebIDs from the [Solid Catalog](https://github.com/solid/catalog)
- ⏸️ **Resumable** - Resumes from previously crawled profiles
- 🛡️ **OIDC Validation** - Only indexes WebIDs with valid `solid:oidcIssuer` declarations

## Want Your WebID Listed?

If you want your WebID to appear in search results, submit your information to the [Solid Catalog](https://solidproject.solidcommunity.net/catalog/). WebIDs registered there are automatically discovered and indexed by this crawler.

## Installation

```bash
npm install
```

## Quick Start

### Run the Web Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

### Crawl WebIDs

```bash
# Run crawler with default settings (fetches from Solid Catalog + existing profiles)
npm run crawl

# Add additional seed WebIDs
npm run crawl -- https://example.com/profile/card#me
```

### Prepare Search Data

After crawling, generate the search index:

```bash
npm run build:data
```

## API Usage

The search API is available at `/api/search` and supports content negotiation.

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `q` | Yes | Search query (matches against name and WebID URL) |

### Response Formats

The API returns different formats based on the `Accept` header:

| Accept Header | Content-Type | Description |
|---------------|--------------|-------------|
| `application/json` | `application/json` | Simple JSON with webid, name, and img |
| `application/ld+json` | `application/ld+json` | Full JSON-LD with semantic context |
| `text/turtle` | `text/turtle` | RDF Turtle format |

### Examples

**JSON (default):**
```bash
curl "https://webid-search.vercel.app/api/search?q=tim"
```

Response:
```json
{
  "query": "tim",
  "count": 2,
  "results": [
    {
      "webid": "https://example.com/tim/profile/card#me",
      "name": "Tim Example",
      "img": "https://example.com/tim/photo.jpg"
    }
  ]
}
```

**JSON-LD:**
```bash
curl "https://webid-search.vercel.app/api/search?q=tim" \
  -H "Accept: application/ld+json"
```

**Turtle:**
```bash
curl "https://webid-search.vercel.app/api/search?q=tim" \
  -H "Accept: text/turtle"
```

Response:
```turtle
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix solid: <http://www.w3.org/ns/solid/terms#> .
@prefix pim: <http://www.w3.org/ns/pim/space#> .
@prefix schema: <https://schema.org/> .

<https://example.com/tim/profile/card#me> foaf:name "Tim Example" .
<https://example.com/tim/profile/card#me> foaf:img <https://example.com/tim/photo.jpg> .
```

## Project Structure

```
webid-search/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Main search page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles (Tailwind)
│   ├── api/
│   │   └── search/
│   │       └── route.ts      # Search API endpoint
│   └── components/
│       └── SearchComponent.tsx  # React search UI
├── src/
│   ├── crawler.ts            # WebID crawler script
│   ├── prepareData.ts        # Builds search index from crawled data
│   └── ldo/                   # LDO (Linked Data Objects) type definitions
├── shapes/
│   ├── solidProfile.shex     # ShEx shape for Solid profiles
│   └── catalogPerson.shex    # ShEx shape for Solid Catalog entries
├── webids/                   # Crawled WebID Turtle files
├── public/
│   ├── profiles.json         # Generated search index (JSON-LD)
│   └── profiles.ttl          # Generated search index (Turtle)
└── package.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Full build (LDO shapes → TypeScript → search data → Next.js) |
| `npm run build:ldo` | Generate LDO type definitions from ShEx shapes |
| `npm run build:tsc` | Compile TypeScript |
| `npm run build:data` | Generate `profiles.json` from crawled WebIDs |
| `npm run build:next` | Build Next.js application |
| `npm run crawl` | Run the WebID crawler |
| `npm run start` | Start production server |

## How the Crawler Works

1. **Seed Collection**: Gathers initial WebIDs from:
   - Previously crawled profiles in the `webids/` directory
   - The [Solid Catalog](https://github.com/solid/catalog) (fetched automatically)
   - Command-line arguments (additional seeds)

2. **Profile Fetching**: Requests each WebID URL with `Accept: text/turtle`

3. **Validation**: Only stores profiles that have a `solid:oidcIssuer` declaration (indicating a valid Solid WebID)

4. **Social Graph Traversal**: Extracts `foaf:knows` links and adds them to the queue (up to depth 3)

5. **Storage**: Saves valid profiles as Turtle files in `webids/` (URL-encoded filenames)

## Data Preparation

The `prepareData.ts` script:

1. Reads all `.ttl` files from `webids/`
2. Parses each profile using [LDO](https://ldo.js.org/) with ShEx validation
3. Extracts key fields: `foaf:name`, `schema:name`, `solid:oidcIssuer`, `pim:storage`, `foaf:img`
4. Generates `public/profiles.json` (JSON-LD) and `public/profiles.ttl` (Turtle)

## Technologies

- **[Next.js](https://nextjs.org/)** - React framework with App Router
- **[LDO (Linked Data Objects)](https://ldo.js.org/)** - Type-safe RDF manipulation
- **[ShEx](https://shex.io/)** - Shape Expressions for RDF validation
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[JSON-LD](https://json-ld.org/)** - JSON for Linked Data

## Ethical Considerations

This crawler is designed to be respectful of server resources:

- **Concurrent request limiting**: Maximum 100 simultaneous requests
- **Public data only**: Only indexes publicly accessible profile information
- **OIDC validation**: Only stores confirmed Solid WebIDs

Please use responsibly and respect the privacy of WebID owners.

## License

MIT
