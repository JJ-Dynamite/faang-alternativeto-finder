'use client';
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AlternativeTo Finder</title>
        <meta name="description" content="Find free app alternatives" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AlternativeTo
            </h1>
            <p className="text-gray-400 text-xl mb-8">Find free app alternatives</p>
            <form onSubmit={search} className="mb-12">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for software alternatives..."
                  className="flex-1 px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl"
                >
                  {loading ? '...' : 'Search'}
                </button>
              </div>
            </form>
            <div className="space-y-4">
              {results.map((r, i) => (
                <div key={i} className="bg-gray-800/50 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{r.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{r.name}</h3>
                      <p className="text-gray-400">{r.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded">{r.price}</span>
                        <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded">⭐ {r.rating}</span>
                        {r.platform?.map((p: string, j: number) => (
                          <span key={j} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
