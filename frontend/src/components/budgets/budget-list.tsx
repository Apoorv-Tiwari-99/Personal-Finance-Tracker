'use client';

import React from 'react';
import { Budget } from '@/types';
import BudgetItem from './budget-item';

interface BudgetListProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function BudgetList({ budgets, onEdit, onDelete, loading }: BudgetListProps) {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Your Budgets</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 animate-pulse">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full w-full mb-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Your Budgets</h3>
        </div>
        <div className="px-6 py-12 text-center">
          <div className="text-gray-300 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets yet</h3>
          <p className="text-gray-500">Set up budgets to track your spending against limits.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Your Budgets</h3>
        <p className="text-sm text-gray-600 mt-1">Track your spending against set limits</p>
      </div>
      <div className="divide-y divide-gray-100">
        {budgets.map((budget) => (
          <BudgetItem
            key={budget._id}
            budget={budget}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}