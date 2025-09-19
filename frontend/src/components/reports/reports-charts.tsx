'use client';

import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

interface ReportsChartsProps {
  reportData: {
    totalSpent: number;
    topCategory: { _id: string; total: number } | null;
    categorySpending: Array<{ _id: string; total: number }>;
    paymentMethods: Array<{ _id: string; count: number; total: number }>;
    spendingOverTime: Array<{ _id: string; total: number }>;
  } | null;
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#0EA5E9', '#EC4899'];

export default function ReportsCharts({ reportData }: ReportsChartsProps) {
  if (!reportData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  const categoryData = (reportData.categorySpending || []).map(item => ({
    name: item._id,
    value: item.total
  }));

  const paymentMethodData = (reportData.paymentMethods || []).map(item => ({
    name: item._id,
    transactions: item.count,
    amount: item.total
  }));

  const spendingOverTimeData = (reportData.spendingOverTime || [])
    .map(item => ({
      date: item._id,
      amount: item.total
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="label font-medium text-gray-800">{`${label}`}</p>
          <p className="intro text-sm text-indigo-600">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Spending Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
        {categoryData.length > 0 ? (
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent as number) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-2">📊</div>
            <p>No spending data available</p>
          </div>
        )}
      </div>

      {/* Payment Methods Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        {paymentMethodData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="amount" fill="#6366F1" name="Total Amount" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-2">💳</div>
            <p>No payment method data available</p>
          </div>
        )}
      </div>

      {/* Spending Over Time Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Over Time</h3>
        {spendingOverTimeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="amount" fill="#8B5CF6" name="Daily Spending" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-2">📅</div>
            <p>No spending over time data available</p>
          </div>
        )}
      </div>
    </div>
  );
}