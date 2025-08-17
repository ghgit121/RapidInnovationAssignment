import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../utils/api';

const Register: React.FC<{ onRegister: (token: string) => void }> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = await register(username, password, 'user');
      onRegister(token);
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 transition-all duration-300">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">
            Create Account
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
            Join us and start exploring AI content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Username
            </label>
            <input
              className="w-full px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base md:text-lg placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label className="block text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Password
            </label>
            <input
              className="w-full px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base md:text-lg placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
              type="password"
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base md:text-lg lg:text-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 sm:mt-5 md:mt-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-center text-sm sm:text-base md:text-lg font-medium">
              {error}
            </p>
          </div>
        )}

        <div className="mt-6 sm:mt-8 md:mt-10 text-center">
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;