'use client';

import React, { useState, useEffect } from 'react';
import { Budget } from '@/types';

interface BudgetFormProps {
  budget?: Budget | null;
  onSubmit: (budget: Omit<Budget, '_id' | 'userId' | 'spent' | 'percentage' | 'status'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const categories = [
  'Food', 'Rent', 'Shopping', 'Transportation', 
  'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Other'
];

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function BudgetForm({ budget, onSubmit, onCancel, loading }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: '',
    monthlyLimit: '',
    month: new Date().getMonth() + 1,
    year: currentYear
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        monthlyLimit: budget.monthlyLimit.toString(),
        month: budget.month,
        year: budget.year
      });
    }
  }, [budget]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.monthlyLimit || parseFloat(formData.monthlyLimit) <= 0) {
      newErrors.monthlyLimit = 'Monthly limit must be greater than 0';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
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
      category: formData.category,
      monthlyLimit: parseFloat(formData.monthlyLimit),
      month: formData.month,
      year: formData.year
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            {budget ? 'Edit Budget' : 'Create New Budget'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 bg-blue-400 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border ${
                errors.category ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="monthlyLimit" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Limit (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                id="monthlyLimit"
                name="monthlyLimit"
                step="0.01"
                min="0"
                value={formData.monthlyLimit}
                onChange={handleChange}
                className={`pl-10 text-black mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border ${
                  errors.monthlyLimit ? 'border-red-500' : ''
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.monthlyLimit && <p className="mt-1 text-sm text-red-600">{errors.monthlyLimit}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className={`mt-1 bg-blue-400 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border ${
                  errors.month ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select month</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              {errors.month && <p className="mt-1 text-sm text-red-600">{errors.month}</p>}
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`mt-1  bg-blue-400 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border ${
                  errors.year ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Saving...' : (budget ? 'Update Budget' : 'Create Budget')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}