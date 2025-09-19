'use client';

import React from 'react';
import { Budget } from '@/types';

interface BudgetItemProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export default function BudgetItem({ budget, onEdit, onDelete }: BudgetItemProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'over':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'over':
        return 'Over Budget';
      case 'warning':
        return 'Near Limit';
      default:
        return 'Within Budget';
    }
  };

  const formatMonthYear = (month: number, year: number) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const progressPercentage = budget.percentage || 0;

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 capitalize">
              {budget.category}
            </h4>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
              {getStatusText(budget.status)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {formatMonthYear(budget.month, budget.year)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Spent: ₹{budget.spent?.toLocaleString() || '0'}</span>
          <span>Budget: ₹{budget.monthlyLimit.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div
            className={`h-2.5 rounded-full ${
              progressPercentage >= 100 
                ? 'bg-red-500' 
                : progressPercentage >= 80 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 text-right">
          {progressPercentage.toFixed(1)}% used
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-gray-700">
          {budget.spent !== undefined && (
            <span>
              ₹{(budget.monthlyLimit - budget.spent).toLocaleString()} remaining
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onEdit(budget)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => budget._id && onDelete(budget._id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}