'use client';

import React, { useState, useEffect } from 'react';
import { Expense } from '@/types';
import { FiX } from 'react-icons/fi';

interface ExpenseFormProps {
  expense?: Expense | null;
  onSubmit: (expense: Omit<Expense, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const categories = [
  'Food', 'Rent', 'Shopping', 'Transportation', 
  'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Other'
];

const paymentMethods = [
  'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other'
];

export default function ExpenseForm({ expense, onSubmit, onCancel, loading }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date.split('T')[0],
        paymentMethod: expense.paymentMethod,
        notes: expense.notes || ''
      });
    }
  }, [expense]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className={`pl-8 w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900 ${
                errors.amount ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount}</p>}
        </div>

        {/* Category and Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900 ${
                errors.category ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-300'
              }`}
            >
              <option value="" className="text-gray-500">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category} className="text-gray-900">
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900 ${
                errors.date ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900 ${
              errors.paymentMethod ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-300'
            }`}
          >
            <option value="" className="text-gray-500">Select payment method</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method} className="text-gray-900">
                {method}
              </option>
            ))}
          </select>
          {errors.paymentMethod && <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900"
            placeholder="Add any additional notes about this expense..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
          >
            {loading ? 'Saving...' : (expense ? 'Update Expense' : 'Add Expense')}
          </button>
        </div>
      </form>
    </div>
  );
}