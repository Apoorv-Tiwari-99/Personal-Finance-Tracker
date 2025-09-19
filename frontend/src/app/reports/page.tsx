'use client';

import React, { useState, useEffect } from 'react';
import { expensesService } from '@/services/expenses';
import { budgetsService } from '@/services/budgets';
import ReportsCharts from '@/components/reports/reports-charts';

interface ReportData {
  totalSpent: number;
  topCategory: { _id: string; total: number } | null;
  categorySpending: Array<{ _id: string; total: number }>;
  paymentMethods: Array<{ _id: string; count: number; total: number }>;
  spendingOverTime: Array<{ _id: string; total: number }>;
  budgets: any[];
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const [expenseStats, budgets] = await Promise.all([
        expensesService.getExpenseSummary(),
        budgetsService.getBudgets()
      ]);

      setReportData({
        totalSpent: expenseStats.totalSpent || 0,
        topCategory: expenseStats.topCategory,
        categorySpending: expenseStats.categorySpending || [],
        paymentMethods: expenseStats.paymentMethods || [],
        spendingOverTime: expenseStats.spendingOverTime || [],
        budgets: budgets || []
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Safe calculations with fallbacks
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  const totalSpent = reportData?.totalSpent || 0;
  const avgDailySpending = currentDay > 0 ? totalSpent / currentDay : 0;
  const daysRemaining = daysInMonth - currentDay;
  const projectedMonthlySpending = totalSpent + (avgDailySpending * daysRemaining);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
          
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
            <p className="text-gray-600 mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {['overview', 'budgets', 'trends'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
            <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              ₹{totalSpent.toLocaleString()}
            </p>
            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-indigo-500" 
                  style={{ width: `${(currentDay / daysInMonth) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {Math.round((currentDay / daysInMonth) * 100)}%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600">Avg. Daily Spending</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              ₹{avgDailySpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Based on {currentDay} days
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600">Projected Monthly</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              ₹{projectedMonthlySpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {daysRemaining} days remaining
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-600">Top Category</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1 capitalize">
              {reportData?.topCategory?._id || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              ₹{(reportData?.topCategory?.total || 0).toLocaleString()} spent
            </p>
          </div>
        </div>

        {/* Charts */}
        {reportData && <ReportsCharts reportData={reportData} />}

        {/* Budget Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Budget Summary</h2>
            <span className="text-sm text-gray-500">
              {reportData?.budgets?.filter(b => b.percentage >= 80).length || 0} budgets need attention
            </span>
          </div>
          
          {reportData?.budgets && reportData.budgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportData.budgets.map((budget) => (
                <div key={budget._id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 capitalize">{budget.category}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      budget.percentage >= 100 
                        ? 'bg-red-100 text-red-800' 
                        : budget.percentage >= 80 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {budget.percentage?.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Spent: ₹{(budget.spent || 0).toLocaleString()}</span>
                      <span>Budget: ₹{(budget.monthlyLimit || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          budget.percentage >= 100 
                            ? 'bg-red-500' 
                            : budget.percentage >= 80 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💰</div>
              <p className="text-gray-500">No budgets set for this month.</p>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Create Budget
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}