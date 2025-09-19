'use client';

import React, { useState, useEffect } from 'react';
import api from '@/services/api';

interface Suggestion {
  type: 'info' | 'warning' | 'danger' | 'positive';
  message: string;
  category?: string;
  spent?: number;
  budgeted?: number;
  percentage?: number;
}

export default function SmartSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/suggestions');
      console.log("Suggestions response:", response);
      
      if (response.data.success && response.data.data) {
        // Success case - Python service is working
        setSuggestions(response.data.data.suggestions || []);
      } else if (response.data.success === false) {
        // Python service error case
        setError(response.data.message || 'Unable to fetch suggestions');
        setSuggestions(getMockSuggestions());
      } else {
        // Unexpected format
        setSuggestions(getMockSuggestions());
        setError('Using demo suggestions (API returned unexpected format)');
      }
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Failed to fetch')) {
        setError('Cannot connect to suggestion service. Please check if the Python service is running.');
      } else if (error.response?.status === 502) {
        setError('Suggestion service is temporarily unavailable. Please try again later.');
      } else {
        setError('Unable to load suggestions at this time');
      }
      
      setSuggestions(getMockSuggestions());
    } finally {
      setLoading(false);
    }
  };

  // Mock suggestions for demo purposes
  const getMockSuggestions = (): Suggestion[] => {
    return [
      {
        type: 'info',
        message: 'Smart suggestions will appear here once the Python service is connected.',
      },
      {
        type: 'warning',
        message: 'Currently using demo data. Connect to Python service for personalized suggestions.',
      },
      {
        type: 'positive',
        message: 'Tip: Regularly review your budgets to optimize spending habits.',
      }
    ];
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'danger': return '🚨';
      case 'positive': return '✅';
      default: return '💡';
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger': return 'bg-red-50 border-red-200 text-red-800';
      case 'positive': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">🤖</div>
        <h3 className="text-lg font-semibold text-gray-900">Smart Suggestions</h3>
      </div>
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {suggestions.slice(0, 5).map((suggestion, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getSuggestionColor(suggestion.type)}`}
          >
            <div className="flex items-start">
              <span className="text-lg mr-3">{getSuggestionIcon(suggestion.type)}</span>
              <div className="flex-1">
                <p className="font-medium">{suggestion.message}</p>
                {suggestion.category && (
                  <div className="mt-2 text-sm opacity-80">
                    <span className="capitalize">{suggestion.category}: </span>
                    <span>₹{suggestion.spent?.toLocaleString()} / ₹{suggestion.budgeted?.toLocaleString()}</span>
                    {suggestion.percentage && (
                      <span> ({suggestion.percentage}%)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Debug information */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          Service Status: {error ? '❌ Connection Issue' : '✅ Connected'}
          <br />
          Endpoint: {process.env.NEXT_PUBLIC_API_URL}/api/suggestions
          <br />
          Python Service: https://python-service-fxlm.onrender.com
        </p>
      </div>
    </div>
  );
}