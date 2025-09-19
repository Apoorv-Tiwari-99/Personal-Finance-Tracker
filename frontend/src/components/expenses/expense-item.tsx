'use client';

import React from 'react';
import { Expense } from '@/types';
import { FiEdit2, FiTrash2, FiCreditCard, FiCalendar, FiTag, FiDollarSign, FiSmartphone, FiDatabase } from 'react-icons/fi';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
   console.log("rendering expense",expense);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: 'bg-green-100 text-green-800 border-green-200',
      Rent: 'bg-blue-100 text-blue-800 border-blue-200',
      Shopping: 'bg-purple-100 text-purple-800 border-purple-200',
      Transportation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Entertainment: 'bg-pink-100 text-pink-800 border-pink-200',
      Healthcare: 'bg-red-100 text-red-800 border-red-200',
      Education: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Utilities: 'bg-gray-100 text-gray-800 border-gray-200',
      Other: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentIcon = (method: string) => {
    // Convert to lowercase for case-insensitive matching
    const lowerMethod = method.toLowerCase();
    
    if (lowerMethod.includes('credit') || lowerMethod.includes('debit')) {
      return <FiCreditCard className="w-4 h-4 text-gray-600" />;
    } else if (lowerMethod.includes('bank') || lowerMethod.includes('transfer')) {
      return <FiDatabase className="w-4 h-4 text-gray-600" />;
    } else if (lowerMethod.includes('upi')) {
      return <FiSmartphone className="w-4 h-4 text-gray-600" />;
    } else if (lowerMethod.includes('cash')) {
      return <FiDollarSign className="w-4 h-4 text-gray-600" />;
    }
    
    return <FiDollarSign className="w-4 h-4 text-gray-600" />; // Default icon
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-indigo-100 max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Amount and Category */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h4 className="text-xl font-bold text-gray-900">₹{expense.amount.toLocaleString()}</h4>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense.category)} shrink-0`}>
              <FiTag className="w-3 h-3 mr-1" />
              {expense.category}
            </span>
          </div>

          {/* Notes */}
          {expense.notes && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 break-words">
              {expense.notes}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <FiCalendar className="w-4 h-4 flex-shrink-0 text-gray-600" />
              {formatDate(expense.date)}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              {getPaymentIcon(expense.paymentMethod)}
              {expense.paymentMethod}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit expense"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => expense._id && onDelete(expense._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete expense"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}