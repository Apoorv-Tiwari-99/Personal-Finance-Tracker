'use client';

import React, { useState, useEffect } from 'react';
import { Expense } from '@/types';
import ExpenseList from '@/components/expenses/expense-list';
import ExpenseForm from '@/components/expenses/expense-form';
import { expensesService } from '@/services/expenses';
import { FiPlus, FiFilter, FiSearch, FiX } from 'react-icons/fi';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expensesService.getExpenses();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (expenseData: any) => {
    try {
      await expensesService.createExpense(expenseData);
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleUpdateExpense = async (expenseData: any) => {
    if (!editingExpense?._id) return;
    
    try {
      await expensesService.updateExpense(editingExpense._id, expenseData);
      setEditingExpense(null);
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await expensesService.deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleSubmit = editingExpense ? handleUpdateExpense : handleCreateExpense;

  // Filter expenses based on search term and filters
  const filteredExpenses = (expenses || []).filter(expense => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === '' || expense.category === categoryFilter;
    
    // Payment method filter
    const matchesPaymentMethod = paymentMethodFilter === '' || expense.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesCategory && matchesPaymentMethod;
  });

  const clearFilters = () => {
    setCategoryFilter('');
    setPaymentMethodFilter('');
  };

  const hasActiveFilters = categoryFilter || paymentMethodFilter;

  const categories = ['Food', 'Rent', 'Shopping', 'Transportation', 'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Other'];
  const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other'];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
        <p className="text-blue-100">Manage and track your daily expenses</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-start sm:items-center">
        <div className="flex gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                : 'border-gray-300 hover:bg-black'
            }`}
          >
            <FiFilter className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
            )}
          </button>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
        >
          <FiPlus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {/* Filters Panel */}
{showFilters && (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-gray-900">Filters</h3>
      <button
        onClick={() => setShowFilters(false)}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Close filters"
      >
        <FiX className="w-5 h-5" />
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
        >
          <option value="" className="text-gray-500">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category} className="text-gray-900">
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <select
          value={paymentMethodFilter}
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
        >
          <option value="" className="text-gray-500">All Methods</option>
          {paymentMethods.map(method => (
            <option key={method} value={method} className="text-gray-900">
              {method}
            </option>
          ))}
        </select>
      </div>
    </div>

    {hasActiveFilters && (
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {filteredExpenses.length} of {expenses.length} expenses match filters
        </span>
        <button
          onClick={clearFilters}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Clear All Filters
        </button>
      </div>
    )}
  </div>
)}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Expenses List */}
      <ExpenseList
        expenses={filteredExpenses}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        loading={loading}
      />

      {/* Stats Summary */}
      {!loading && filteredExpenses.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            {hasActiveFilters && (
              <span className="text-sm text-gray-500">
                Filtered results
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                ₹{filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {filteredExpenses.length}
              </p>
              <p className="text-sm text-gray-600">Transactions</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {new Set(filteredExpenses.map(e => e.category)).size}
              </p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                ₹{(
                  filteredExpenses.reduce((sum, e) => sum + e.amount, 0) / 
                  filteredExpenses.length || 0
                ).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Average</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state when filters return no results */}
      {!loading && filteredExpenses.length === 0 && expenses.length > 0 && (
        <div className="bg-white rounded-lg p-8 text-center border">
          <div className="text-gray-400 text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses found</h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters 
              ? "Try adjusting your filters or search term"
              : "No expenses match your search criteria"
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}