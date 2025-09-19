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
      
      // First try to get suggestions from our backend API
      const response = await api.get('/suggestions');
      
      if (response.data.success && response.data.data) {
        setSuggestions(response.data.data.suggestions || []);
      } else {
        // Fallback to mock suggestions if API is not available
        setSuggestions(getMockSuggestions());
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError('Unable to load suggestions at this time');
      // Fallback to mock suggestions
      setSuggestions(getMockSuggestions());
    } finally {
      setLoading(false);
    }
  };

  // Mock suggestions for demo purposes
  const getMockSuggestions = (): Suggestion[] => {
    return [
      {
        type: 'warning',
        message: 'You\'re spending 85% of your Food budget. Consider reducing dining out expenses.',
        category: 'Food',
        spent: 8500,
        budgeted: 10000,
        percentage: 85
      },
      {
        type: 'positive',
        message: 'Great job! You\'ve saved 25% on Transportation compared to last month.',
        category: 'Transportation',
        spent: 3000,
        budgeted: 4000,
        percentage: 75
      },
      {
        type: 'info',
        message: 'You have ₹15,000 remaining across all budgets this month.',
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

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">{error}</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">🤖</div>
        <h3 className="text-lg font-semibold text-gray-900">Smart Suggestions</h3>
      </div>
      
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
      
      {suggestions.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View all suggestions ({suggestions.length})
          </button>
        </div>
      )}
    </div>
  );
}