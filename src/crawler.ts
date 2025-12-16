import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

interface WebIDEntry {
  url: string;
  name?: string;
  lastUpdated: string;
  status: 'active' | 'inactive';
}

interface CrawlData {
  lastCrawl: string;
  entries: WebIDEntry[];
}

const DATA_FILE = path.join(__dirname, '../data/webids.json');

// Example WebID sources to crawl
const WEBID_SOURCES = [
  'https://www.w3.org/People/Berners-Lee/card#i',
  'https://timbl.inrupt.net/profile/card#me',
];

async function loadExistingData(): Promise<CrawlData> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error loading existing data:', error);
  }
  
  return {
    lastCrawl: new Date().toISOString(),
    entries: [],
  };
}

async function checkWebID(url: string): Promise<WebIDEntry> {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/turtle, application/ld+json, application/rdf+xml',
      },
      timeout: 10000,
    });
    
    const status = response.ok ? 'active' : 'inactive';
    
    return {
      url,
      lastUpdated: new Date().toISOString(),
      status,
    };
  } catch (error) {
    console.error(`Error checking ${url}:`, error instanceof Error ? error.message : error);
    return {
      url,
      lastUpdated: new Date().toISOString(),
      status: 'inactive',
    };
  }
}

async function crawl(): Promise<void> {
  console.log('Starting WebID crawler...');
  
  const existingData = await loadExistingData();
  const newEntries: WebIDEntry[] = [];
  
  for (const source of WEBID_SOURCES) {
    console.log(`Checking: ${source}`);
    const entry = await checkWebID(source);
    newEntries.push(entry);
  }
  
  const newData: CrawlData = {
    lastCrawl: new Date().toISOString(),
    entries: newEntries,
  };
  
  // Ensure data directory exists
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Save the data
  fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
  
  console.log(`Crawl completed. Found ${newEntries.length} WebIDs.`);
  console.log(`Data saved to: ${DATA_FILE}`);
  
  // Log summary
  const activeCount = newEntries.filter(e => e.status === 'active').length;
  console.log(`Active: ${activeCount}, Inactive: ${newEntries.length - activeCount}`);
}

// Run the crawler
crawl().catch(error => {
  console.error('Crawler failed:', error);
  process.exit(1);
});
