import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import SearchPrompt from './components/SearchPrompt';
import ImagePrompt from './components/ImagePrompt';
import Dashboard from './components/Dashboard';
import { validateToken, type User } from './utils/api';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null); 
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          console.log('Validating token:', storedToken); // Debug log
          const userData = await validateToken(storedToken);
          console.log('Token validated successfully, user data:', userData);
          setToken(storedToken);
          setUser(userData);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('No token found in localStorage');
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (newToken: string) => {
    console.log('Login successful, setting token:', newToken);
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    
    // Fetch user data after login
    try {
      const userData = await validateToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user data after login:', error);
    }
  };

  const handleLogout = () => {
    console.log('Logging out, clearing token');
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>;
  }

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-100 via-blue-50 to-white'}`}>
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-12 2xl:px-16 2xl:py-14">
          {/* Header Section */}
          <div className="flex flex-col items-center space-y-4 lg:flex-row lg:justify-center lg:space-y-0 lg:space-x-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center leading-normal sm:leading-relaxed md:leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto px-4 sm:px-6">
              AI Content & Image Explorer
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="self-center lg:self-auto px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gray-200 dark:bg-gray-700 rounded-full text-xs sm:text-sm md:text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {!token ? (
            <div className="w-full">
              <nav className="mb-6 sm:mb-8 md:mb-10">
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 md:space-x-8">
                  {/* <Link 
                    to="/login" 
                    className="px-6 py-2 sm:px-8 sm:py-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-sm sm:text-base md:text-lg transition-colors duration-300 border-b-2 border-transparent hover:border-indigo-600 dark:hover:border-indigo-400"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-2 sm:px-8 sm:py-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-sm sm:text-base md:text-lg transition-colors duration-300 border-b-2 border-transparent hover:border-indigo-600 dark:hover:border-indigo-400"
                  >
                    Register
                  </Link> */}
                </div>
              </nav>
              <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register onRegister={handleLogin} />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          ) : (
            <div className="w-full">
              {/* Navigation for authenticated users */}
              <nav className="mb-6 sm:mb-8 md:mb-10">
                {/* Desktop Navigation */}
                <div className="hidden md:flex justify-center items-center space-x-6 lg:space-x-8">
                  <Link 
                    to="/search" 
                    className="px-6 py-2.5 lg:px-8 lg:py-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-base lg:text-lg transition-colors duration-300 border-b-2 border-transparent hover:border-indigo-600 dark:hover:border-indigo-400"
                  >
                    🔍 Search
                  </Link>
                  <Link 
                    to="/image" 
                    className="px-6 py-2.5 lg:px-8 lg:py-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-base lg:text-lg transition-colors duration-300 border-b-2 border-transparent hover:border-indigo-600 dark:hover:border-indigo-400"
                  >
                    🎨 Image
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="px-6 py-2.5 lg:px-8 lg:py-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-base lg:text-lg transition-colors duration-300 border-b-2 border-transparent hover:border-indigo-600 dark:hover:border-indigo-400"
                  >
                    📊 Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="px-6 py-2.5 lg:px-8 lg:py-3 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold text-base lg:text-lg transition-colors duration-300 border-b-2 border-transparent hover:border-purple-600 dark:hover:border-purple-400"
                    >
                      👑 Admin
                    </Link>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400 px-2">
                    Welcome, {user?.username} ({user?.role})
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 lg:px-8 lg:py-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold text-base lg:text-lg transition-colors duration-300 border-b-2 border-transparent hover:border-red-600 dark:hover:border-red-400"
                  >
                    🚪 Logout
                  </button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                  {/* Mobile Menu Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="inline-flex items-center p-2 rounded-md text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      <span className="sr-only">Open main menu</span>
                      {!mobileMenuOpen ? (
                        <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      ) : (
                        <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Mobile Menu Items */}
                  {mobileMenuOpen && (
                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link 
                          to="/search" 
                          className="block px-3 py-2 rounded-md text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-semibold text-base transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          🔍 Search
                        </Link>
                        <Link 
                          to="/image" 
                          className="block px-3 py-2 rounded-md text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-semibold text-base transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          🎨 Image
                        </Link>
                        <Link 
                          to="/dashboard" 
                          className="block px-3 py-2 rounded-md text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-semibold text-base transition-colors duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          📊 Dashboard
                        </Link>
                        {user?.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            className="block px-3 py-2 rounded-md text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-semibold text-base transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            👑 Admin
                          </Link>
                        )}
                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                          {user?.username} ({user?.role})
                        </div>
                        <hr className="border-gray-200 dark:border-gray-700 my-2" />
                        <button
                          onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                          className="block w-full text-left px-3 py-2 rounded-md text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-base transition-colors duration-200"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </nav>
              <Routes>
                <Route 
                  path="/search" 
                  element={
                    <ProtectedRoute isAuthenticated={!!token}>
                      <SearchPrompt token={token} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/image" 
                  element={
                    <ProtectedRoute isAuthenticated={!!token}>
                      <ImagePrompt token={token} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute isAuthenticated={!!token}>
                      <Dashboard token={token} />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute isAuthenticated={!!token}>
                      <AdminRoute user={user}>
                        <AdminDashboard token={token!} />
                      </AdminRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route path="/" element={<Navigate to="/search" replace />} />
                <Route path="*" element={<Navigate to="/search" replace />} />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;