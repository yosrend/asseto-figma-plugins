import React, { useState } from 'react';

interface APIKeySetupProps {
  onAPIKeySet: (apiKey: string) => void;
}

export default function APIKeySetup({ onAPIKeySet }: APIKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey) {
      setError('Please enter your API key');
      return;
    }

    if (trimmedKey.length < 20) {
      setError('API key seems too short. Please check and try again.');
      return;
    }

    // Basic format validation (Google AI keys usually start with "AIza")
    if (!trimmedKey.startsWith('AIza')) {
      setError('Invalid API key format. Google AI keys typically start with "AIza".');
      return;
    }

    setError('');
    onAPIKeySet(trimmedKey);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl mb-4 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ASSETO AI Generate
          </h1>
          <p className="text-gray-600">
            Generate stunning images with AI
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome! Let's Get Started
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              To use this plugin, you need a <strong>Google AI Studio API key</strong> for image generation.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>First Time Setup Required:</strong> You must enter your API key to continue.
              </p>
            </div>
          </div>

          {/* Get API Key Button */}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full mb-6"
          >
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Get API Key from Google AI Studio
            </button>
          </a>

          {/* API Key Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Your Google AI API Key Here:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="AIza..."
                  autoFocus
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition-colors ${
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
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleSubmit}
              disabled={!apiKey.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              Save and Continue
            </button>
            
            {/* Keyboard hint */}
            <p className="text-xs text-gray-500 text-center mt-2">
              Press Enter to continue
            </p>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Your API key is secure</p>
                <p className="text-blue-700">
                  The key is stored locally in your browser session and never sent to any third party.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 space-y-2">
          <div>
            Created by <span className="font-semibold text-gray-700">Yosep Rendi</span>
          </div>
          <div>
            <a 
              href="mailto:support.asseto@gmail.com" 
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Support: support.asseto@gmail.com
            </a>
          </div>
          <div className="flex items-center justify-center gap-3 text-xs">
            <a 
              href="https://github.com/yoseprendi/asseto-ai-generate" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Documentation
            </a>
            <span className="text-gray-300">•</span>
            <a 
              href="https://github.com/yoseprendi/asseto-ai-generate/blob/main/PRIVACY_POLICY.md" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Privacy Policy
            </a>
          </div>
          <div className="text-xs text-gray-400">
            Version 2.8.0
          </div>
        </div>
      </div>
    </div>
  );
}
