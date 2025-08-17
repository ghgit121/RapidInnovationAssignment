import React, { useState, useEffect } from 'react';
import { generateImage } from '../utils/api';

const ImagePrompt: React.FC<{ token: string }> = ({ token }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist state in sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem('imagePromptState');
    if (savedState) {
      try {
        const { prompt: savedPrompt, image: savedImage, error: savedError } = JSON.parse(savedState);
        if (savedPrompt) setPrompt(savedPrompt);
        if (savedImage) setImage(savedImage);
        if (savedError) setError(savedError);
      } catch (e) {
        console.error('Failed to parse saved image state:', e);
      }
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    const stateToSave = { prompt, image, error };
    sessionStorage.setItem('imagePromptState', JSON.stringify(stateToSave));
  }, [prompt, image, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateImage(prompt, token);
      setImage(imageUrl);
      setError(null);
    } catch (err: any) {
      console.error('Image generation error:', err);
      if (err.response?.status === 500) {
        setError('Image generation service is temporarily unavailable. Please try again later.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Image generation failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
  };

  return (
    <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg md:shadow-xl">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 text-center">Image Generation Prompt</h2>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
        <input
          className="w-full p-2 sm:p-3 md:p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base md:text-lg"
          type="text"
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="w-full p-2 sm:p-3 md:p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 disabled:opacity-50 text-sm sm:text-base md:text-lg"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {error && <p className="mt-3 sm:mt-4 text-red-500 dark:text-red-400 text-center text-sm sm:text-base md:text-lg">{error}</p>}
      {image && (
        <div className="mt-3 sm:mt-4 relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading image...</p>
              </div>
            </div>
          )}
          <img 
            src={image} 
            alt="Generated" 
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-md" 
            onLoadStart={handleImageLoadStart}
            onLoad={handleImageLoad}
            onError={handleImageLoad}
          />
        </div>
      )}
    </div>
  );
};

export default ImagePrompt;