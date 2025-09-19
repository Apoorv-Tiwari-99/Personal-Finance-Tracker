"use client";

import React, { useState, useEffect } from "react";
import { expensesService } from "@/services/expenses";
import { budgetsService } from "@/services/budgets";
import Link from "next/link";
import SmartSuggestions from "@/components/dashboard/smart-suggestions";
import { Expense } from "@/types";
interface DashboardStats {
  totalSpent: number;
  topCategory: { category: string; amount: number } | null;
  categorySpending: Array<{ _id: string; total: number }>;
  budgets: any[];
  alerts: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [expenseStats, budgetsData, alertsData, expensesData] =
        await Promise.all([
          expensesService.getExpenseSummary(),
          budgetsService.getBudgets(),
          budgetsService.getBudgetAlerts(),
          expensesService.getExpenses({ limit: 5 }),
        ]);

      setStats({
        totalSpent: expenseStats.totalSpent,
        topCategory: expenseStats.topCategory,
        categorySpending: expenseStats.categorySpending,
        budgets: budgetsData,
        alerts: alertsData,
      });

      setRecentExpenses(expensesData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      {/* Smart Suggestions */}
      <SmartSuggestions />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">
            Total Spent This Month
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            ₹{stats?.totalSpent.toLocaleString() || "0"}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {stats?.topCategory
              ? `Most spent on ${stats.topCategory.category}`
              : "No spending yet"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Budgets
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.budgets.length || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {stats?.budgets.filter((b) => b.status === "over").length || 0} over
            budget
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Expenses
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {recentExpenses?.length}
          </p>
          <p className="text-sm text-gray-600 mt-2">last 5 transactions</p>
        </div>
      </div>

      {/* Budget Alerts */}
      {stats && stats.alerts && stats.alerts.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Budget Alerts ({stats.alerts.length})
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                {stats.alerts.slice(0, 2).map((alert, index) => (
                  <p key={index} className="mt-1">
                    {alert.message}
                  </p>
                ))}
                {stats.alerts.length > 2 && (
                  <p className="mt-1">
                    ...and {stats.alerts.length - 2} more alerts
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Expenses
            </h2>
            <Link
              href="/expenses"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          {recentExpenses?.length > 0 ? (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      ₹{expense.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{expense.category}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">💰</div>
              <p className="text-gray-500">No expenses yet</p>
              <Link
                href="/expenses"
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                Add your first expense
              </Link>
            </div>
          )}
        </div>

        {/* Budget Overview */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Budget Overview
            </h2>
            <Link
              href="/budgets"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              Manage Budgets
            </Link>
          </div>
          {stats && stats.budgets && stats.budgets.length > 0 ? ( // Changed this line
            <div className="space-y-4">
              {stats.budgets.slice(0, 3).map((budget) => (
                <div key={budget._id}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span className="capitalize">{budget.category}</span>
                    <span>
                      ₹{budget.spent?.toLocaleString() || "0"} / ₹
                      {budget.monthlyLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        budget.percentage >= 100
                          ? "bg-red-500"
                          : budget.percentage >= 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-500">No budgets set up</p>
              <Link
                href="/budgets"
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                Create your first budget
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/expenses"
            className="bg-indigo-50 p-4 rounded-lg text-center hover:bg-indigo-100 transition-colors"
          >
            <div className="text-2xl mb-2">➕</div>
            <h3 className="font-medium text-indigo-900">Add Expense</h3>
            <p className="text-sm text-indigo-700">Record a new expense</p>
          </Link>
          <Link
            href="/budgets"
            className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors"
          >
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-medium text-green-900">Set Budget</h3>
            <p className="text-sm text-green-700">Create spending limits</p>
          </Link>
          <Link
            href="/reports"
            className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-medium text-blue-900">View Reports</h3>
            <p className="text-sm text-blue-700">Analyze spending patterns</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
