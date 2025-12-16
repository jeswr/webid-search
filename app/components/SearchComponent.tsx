'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface WebIDResult {
  webid: string;
  name: string;
  img: string | null;
}

interface SearchResults {
  query: string;
  count: number;
  results: WebIDResult[];
}

interface SearchComponentProps {
  initialQuery?: string;
}

function InfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Documentation</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Endpoint</h3>
              <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm">
                GET /api/search?q=&#123;query&#125;
              </code>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Response Formats</h3>
              <p className="mb-3">Use the <code className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">Accept</code> header to specify the response format:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 pr-4">Accept Header</th>
                      <th className="text-left py-2">Format</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 pr-4"><code className="text-xs">application/json</code></td>
                      <td className="py-2">Simple JSON (default)</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 pr-4"><code className="text-xs">application/ld+json</code></td>
                      <td className="py-2">JSON-LD with context</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4"><code className="text-xs">text/turtle</code></td>
                      <td className="py-2">RDF Turtle</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Examples</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">JSON (default):</p>
                  <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                    curl &quot;https://webid-search.vercel.app/api/search?q=tim&quot;
                  </code>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">JSON-LD:</p>
                  <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                    curl &quot;https://webid-search.vercel.app/api/search?q=tim&quot; -H &quot;Accept: application/ld+json&quot;
                  </code>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Turtle:</p>
                  <code className="block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                    curl &quot;https://webid-search.vercel.app/api/search?q=tim&quot; -H &quot;Accept: text/turtle&quot;
                  </code>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">JSON Response</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
{`{
  "query": "tim",
  "count": 1,
  "results": [
    {
      "webid": "https://example.com/tim#me",
      "name": "Tim Example",
      "img": "https://example.com/photo.jpg"
    }
  ]
}`}
              </pre>
            </section>

            <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Want Your WebID Listed?</h3>
              <p className="text-sm">
                Submit your information to the{' '}
                <a 
                  href="https://solidproject.solidcommunity.net/catalog/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Solid Catalog
                </a>
                {' '}to have your WebID appear in search results.
              </p>
            </section>

            <section>
              <p className="text-sm">
                <a 
                  href="https://github.com/jeswr/webid-search" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View full documentation on GitHub →
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchComponent({ initialQuery = '' }: SearchComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Perform search on initial load if there's a query parameter
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams, performSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      // Clear the URL parameter if query is empty
      router.push('/');
      return;
    }

    // Update URL with query parameter
    router.push(`/?q=${encodeURIComponent(query)}`);
    
    await performSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            WebID Search
          </h1>
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="API Documentation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Search for WebIDs by name or content
        </p>
      </div>

      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Enter search query..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <div className="text-gray-600 dark:text-gray-400">
            Found {results.count} result{results.count !== 1 ? 's' : ''} for &quot;{results.query}&quot;
          </div>

          {results.results.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                No WebIDs found matching your search query.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.results.map((result) => (
                <div
                  key={result.webid}
                  className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {result.img && (
                      <div className="flex-shrink-0">
                        <Image
                          src={result.img}
                          alt={`Profile picture of ${result.name}`}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        {result.name}
                      </h3>
                      <a
                        href={result.webid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {result.webid}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
