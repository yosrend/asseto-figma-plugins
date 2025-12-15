import React, { useState } from 'react';

interface UpdateAPIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (apiKey: string) => void;
  errorMessage?: string;
}

export default function UpdateAPIKeyModal({ 
  isOpen, 
  onClose, 
  onUpdate,
  errorMessage 
}: UpdateAPIKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    if (apiKey.length < 20) {
      setError('API key seems too short. Please check and try again.');
      return;
    }

    onUpdate(apiKey.trim());
    setApiKey('');
    setError('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setApiKey(text.trim());
      setError('');
    } catch (err) {
      setError('Failed to read clipboard. Please paste manually.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          API Quota Exceeded
        </h2>

        {/* Error message */}
        <p className="text-sm text-gray-600 text-center mb-4">
          {errorMessage || 'Your Google AI API has reached its quota limit. Please update your API key or check your quota at Google AI Studio.'}
        </p>

        {/* Get new API Key button */}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mb-4"
        >
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Check Quota / Get New Key
          </button>
        </a>

        {/* API Key Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Update Your Google AI API Key:
          </label>
          <div className="relative">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="AIza..."
              className={`w-full px-4 py-2 pr-12 border-2 rounded-lg focus:outline-none transition-colors ${
                error
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-indigo-500'
              }`}
            />
            <button
              onClick={handlePaste}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Paste from clipboard"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Update API Key
          </button>
        </div>
      </div>
    </div>
  );
}
