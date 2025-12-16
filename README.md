# WebID Search Crawler

A daily automated crawler for WebID discovery and monitoring.

## Overview

This project implements an automated daily crawler that:
- Checks WebID URLs for availability
- Stores the results in a JSON file
- Automatically creates pull requests when updates are detected
- Auto-merges the PRs when all checks pass

## Project Structure

```
webid-search/
├── .github/
│   └── workflows/
│       └── daily-crawler.yml    # GitHub Actions workflow for daily crawling
├── src/
│   └── crawler.ts               # Main crawler implementation
├── data/
│   └── webids.json             # Crawled WebID data (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Features

### Daily Automated Crawling
- Runs automatically every day at 2:00 AM UTC via GitHub Actions
- Can also be triggered manually from the Actions tab

### Automatic PR Creation
- Detects changes in crawled data
- Creates a pull request with the updates
- Includes detailed information about the crawler run

### Auto-merge
- PRs are automatically configured for merge
- Merges when all required checks pass
- Uses squash merge to keep history clean

## Local Development

### Prerequisites
- Node.js 20 or later
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/jeswr/webid-search.git
cd webid-search
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run the crawler:
```bash
npm run crawl
```

### Development Mode

Run the crawler in development mode with TypeScript:
```bash
npm run dev
```

## Configuration

### Adding WebID Sources

Edit `src/crawler.ts` and add URLs to the `WEBID_SOURCES` array:

```typescript
const WEBID_SOURCES = [
  'https://www.w3.org/People/Berners-Lee/card#i',
  'https://timbl.inrupt.net/profile/card#me',
  // Add more WebIDs here
];
```

### Adjusting the Schedule

Edit `.github/workflows/daily-crawler.yml` to change the CRON schedule:

```yaml
on:
  schedule:
    # Run daily at 2:00 AM UTC
    - cron: '0 2 * * *'
```

CRON format: `minute hour day month weekday`

Examples:
- `0 2 * * *` - Daily at 2:00 AM UTC
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Weekly on Sunday at midnight

## GitHub Actions Workflow

The workflow performs the following steps:

1. **Checkout** - Checks out the repository
2. **Setup** - Installs Node.js and dependencies
3. **Build** - Compiles TypeScript to JavaScript
4. **Crawl** - Runs the crawler
5. **Detect Changes** - Checks if data has been updated
6. **Create PR** - Creates a pull request if changes exist
7. **Enable Automerge** - Configures the PR for automatic merging

## Data Format

The crawler stores data in `data/webids.json`:

```json
{
  "lastCrawl": "2025-12-16T00:00:00.000Z",
  "entries": [
    {
      "url": "https://example.org/profile#me",
      "lastUpdated": "2025-12-16T00:00:00.000Z",
      "status": "active"
    }
  ]
}
```

## License

MIT - See LICENSE file for details

## Author

Jesse Wright
