'use client';

import React, { useState, useEffect } from 'react';
import { Budget } from '@/types';
import { budgetsService } from '@/services/budgets';
import toast from 'react-hot-toast';

// BudgetForm Component
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

interface BudgetFormProps {
  budget?: Budget | null;
  onSubmit: (budget: Omit<Budget, '_id' | 'userId' | 'spent' | 'percentage' | 'status'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

function BudgetForm({ budget, onSubmit, onCancel, loading }: BudgetFormProps) {
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">
            {budget ? 'Edit Budget' : 'Create New Budget'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
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
            <label htmlFor="monthlyLimit" className="block mb-2 text-sm font-medium text-gray-900">
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
                className={`pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                  errors.monthlyLimit ? 'border-red-500' : ''
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.monthlyLimit && <p className="mt-1 text-sm text-red-600">{errors.monthlyLimit}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="month" className="block mb-2 text-sm font-medium text-gray-900">
                Month
              </label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
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
              <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900">
                Year
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
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

          <div className="flex items-center justify-end pt-4 border-t border-gray-200 rounded-b space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (budget ? 'Update Budget' : 'Create Budget')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// BudgetItem Component
interface BudgetItemProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

function BudgetItem({ budget, onEdit, onDelete }: BudgetItemProps) {
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
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors duration-200">
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
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200"
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

// BudgetList Component
interface BudgetListProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

function BudgetList({ budgets, onEdit, onDelete, loading }: BudgetListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 bg-white border border-gray-200 rounded-lg shadow animate-pulse">
            <div className="h-5 bg-gray-200 rounded-full w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-6"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-6"></div>
            <div className="h-8 bg-gray-200 rounded-md w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white border border-gray-200 rounded-lg shadow">
        <div className="text-gray-300 text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets yet</h3>
        <p className="text-gray-500">Set up budgets to track your spending against limits.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => (
        <BudgetItem
          key={budget._id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// Main BudgetsPage Component
export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetchBudgets();
    fetchAlerts();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      const data = await budgetsService.getBudgets({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const data = await budgetsService.getBudgetAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const handleCreateBudget = async (budgetData: any) => {
    try {
      await budgetsService.createBudget(budgetData);
      setShowForm(false);
      fetchBudgets();
      fetchAlerts();
      toast.success('Budget created successfully');
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Failed to create budget');
    }
  };

  const handleUpdateBudget = async (budgetData: any) => {
    if (!editingBudget?._id) return;
    
    try {
      await budgetsService.updateBudget(editingBudget._id, budgetData);
      setEditingBudget(null);
      setShowForm(false);
      fetchBudgets();
      fetchAlerts();
      toast.success('Budget updated successfully');
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Failed to update budget');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      await budgetsService.deleteBudget(id);
      fetchBudgets();
      fetchAlerts();
      toast.success('Budget deleted successfully');
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  const handleSubmit = editingBudget ? handleUpdateBudget : handleCreateBudget;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Budget Management</h1>
              <p className="text-white mt-2">Set and track your monthly spending limits</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Budget
            </button>
          </div>

          {/* Budget Alerts */}
          {alerts.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 rounded-lg mb-6 shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Budget Alerts</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {alerts.map((alert, index) => (
                        <li key={index}>{alert.message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <BudgetForm
            budget={editingBudget}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        <BudgetList
          budgets={budgets}
          onEdit={handleEditBudget}
          onDelete={handleDeleteBudget}
          loading={loading}
        />
      </div>
    </div>
  );
}