import React, { useState, useEffect } from 'react';
import { search } from '../utils/api';

const SearchPrompt: React.FC<{ token: string }> = ({ token }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist state in sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem('searchPromptState');
    if (savedState) {
      try {
        const { query: savedQuery, result: savedResult, error: savedError } = JSON.parse(savedState);
        if (savedQuery) setQuery(savedQuery);
        if (savedResult) setResult(savedResult);
        if (savedError) setError(savedError);
      } catch (e) {
        console.error('Failed to parse saved search state:', e);
      }
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    const stateToSave = { query, result, error };
    sessionStorage.setItem('searchPromptState', JSON.stringify(stateToSave));
  }, [query, result, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await search(query, token);
      setResult(res);
      setError(null);
    } catch (err: any) {
      console.error('Search error:', err);
      if (err.response?.status === 500) {
        setError('Search service is temporarily unavailable. Please try again later.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Search failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg md:shadow-xl">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 text-center">Search Prompt</h2>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
        <input
          className="w-full p-2 sm:p-3 md:p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base md:text-lg"
          type="text"
          placeholder="Enter query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="w-full p-2 sm:p-3 md:p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 disabled:opacity-50 text-sm sm:text-base md:text-lg"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>
      {error && <p className="mt-3 sm:mt-4 md:mt-5 text-red-500 dark:text-red-400 text-center text-sm sm:text-base md:text-lg">{error}</p>}
      {result && <p className="mt-3 sm:mt-4 md:mt-5 p-2 sm:p-3 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm sm:text-base md:text-lg">{result}</p>}
    </div>
  );
};

export default SearchPrompt;