import React, { useState, useEffect } from 'react';
import { getDashboard, updateHistory, deleteHistory } from '../utils/api';

interface HistoryItem {
  id: number;
  user_id: number;
  type: string;
  query: string;
  result: string;
  meta_data?: string;
  created_at: string;
}

const Dashboard: React.FC<{ token: string }> = ({ token }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    keyword: '',
    dateStart: '',
    dateEnd: ''
  });
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ query: '', result: '' });
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});

  // Load dashboard data
  useEffect(() => {
    setLoading(true);
    setError(null);
    getDashboard(token)
      .then((res) => {
        console.log('Dashboard data received:', res);
        setHistory(res);
        setFilteredHistory(res);
      })
      .catch((err) => {
        console.error('Dashboard load error:', err);
        setError('Dashboard load failed');
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Apply filters
  useEffect(() => {
    let filtered = [...history];

    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    if (filters.keyword) {
      filtered = filtered.filter(item => 
        item.query.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        item.result.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.dateStart) {
      filtered = filtered.filter(item => 
        new Date(item.created_at) >= new Date(filters.dateStart)
      );
    }

    if (filters.dateEnd) {
      filtered = filtered.filter(item => 
        new Date(item.created_at) <= new Date(filters.dateEnd + 'T23:59:59')
      );
    }

    setFilteredHistory(filtered);
  }, [history, filters]);

  const handleEdit = (item: HistoryItem) => {
    setEditingItem(item.id);
    setEditForm({ query: item.query, result: item.result });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await updateHistory(id, editForm.query, editForm.result, token);
      setHistory(history.map(item => 
        item.id === id ? { ...item, query: editForm.query, result: editForm.result } : item
      ));
      setEditingItem(null);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update item');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteHistory(id, token);
        setHistory(history.filter(item => item.id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete item');
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Convert to Indian Standard Time (IST)
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      keyword: '',
      dateStart: '',
      dateEnd: ''
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Your Dashboard
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your search and image generation history
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔍 Filter Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="search">🔍 Search</option>
                <option value="image">🎨 Image</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keyword
              </label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                placeholder="Search in queries and results..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateStart}
                onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateEnd}
                onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Clear Filters
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredHistory.length} of {history.length} items
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
              Loading your dashboard...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-center text-lg font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredHistory.length === 0 && history.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No activity yet. Start by searching or generating images!
            </p>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && filteredHistory.length === 0 && history.length > 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No items match your filters. Try adjusting your search criteria.
            </p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-6">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 overflow-hidden"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Hover overlay with additional info - positioned to not overlap with buttons */}
              {hoveredItem === item.id && (
                <div className="absolute top-2 left-31.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10 max-w-xs">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Created:</strong> {formatDate(item.created_at)}
                  </p>
                  {item.type === 'image' && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Type:</strong> Image Generation
                    </p>
                  )}
                  {item.type === 'search' && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Type:</strong> Search Query
                    </p>
                  )}
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 w-fit">
                      {item.type === 'search' ? '🔍' : '🎨'} {item.type.toUpperCase()}
                    </span>
                    <time className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {formatDate(item.created_at)}
                    </time>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto sm:ml-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {editingItem === item.id ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Query:
                      </label>
                      <input
                        type="text"
                        value={editForm.query}
                        onChange={(e) => setEditForm({ ...editForm, query: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Result:
                      </label>
                      <textarea
                        value={editForm.result}
                        onChange={(e) => setEditForm({ ...editForm, result: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="space-y-4">
                    {/* Query - Always show on hover or when not hovered */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Query:
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        {item.query}
                      </p>
                    </div>

                    {/* Result - Show based on hover state */}
                    {hoveredItem === item.id && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {item.type === 'image' ? 'Generated Image:' : 'Search Results:'}
                        </h4>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 max-h-48 overflow-y-auto">
                          {item.type === 'image' && item.result.startsWith('http') ? (
                            <div className="relative">
                              {imageLoadingStates[item.id] !== false && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg min-h-[200px]">
                                  <div className="flex flex-col items-center space-y-2">
                                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Loading image...</p>
                                  </div>
                                </div>
                              )}
                              <img 
                                src={item.result} 
                                alt="Generated image" 
                                className={`w-full max-w-md rounded-lg shadow-md transition-opacity duration-300 ${imageLoadingStates[item.id] !== false ? 'opacity-0' : 'opacity-100'}`}
                                onLoad={() => setImageLoadingStates(prev => ({ ...prev, [item.id]: false }))}
                                onError={() => setImageLoadingStates(prev => ({ ...prev, [item.id]: false }))}
                              />
                            </div>
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                              {item.result}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Metadata is intentionally hidden from display but still saved in database */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Results Summary */}
        {filteredHistory.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Displaying {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
              {filteredHistory.length !== history.length && ` of ${history.length} total`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;