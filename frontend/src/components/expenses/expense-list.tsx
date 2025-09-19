'use client';

import React from 'react';
import { Expense } from '@/types';
import ExpenseItem from './expense-item';
import { FiPieChart, FiTrendingUp } from 'react-icons/fi';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function ExpenseList({ expenses = [], onEdit, onDelete, loading }: ExpenseListProps) {
  const safeExpenses = expenses || [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5" />
            Recent Expenses
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between items-center">
                <div className="space-y-3 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2 ml-4">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-px bg-gray-200 mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (safeExpenses.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiPieChart className="w-5 h-5" />
            Your Expenses
          </h3>
        </div>
        <div className="px-6 py-12 text-center">
          <div className="text-gray-300 text-6xl mb-4">💸</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your spending by adding your first expense.</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 mx-auto rounded-full"></div>
        </div>
      </div>
    );
  }

  // Calculate total amount for the header
  const totalAmount = safeExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with total */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5 text-indigo-600" />
            Recent Expenses
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">₹{totalAmount.toLocaleString()}</p>
            <p className="text-sm text-gray-600">{safeExpenses.length} transactions</p>
          </div>
        </div>
      </div>

      {/* Expenses Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {safeExpenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
        
        {/* Summary Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Showing {safeExpenses.length} expenses</span>
            <span>Total: ₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}