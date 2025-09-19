'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MonthlyReport } from '@/types';
import api from '@/services/api';
import Link from 'next/link';

export default function MonthlyReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reportId) {
      fetchReportDetail();
    }
  }, [reportId]);

  const fetchReportDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/${reportId}`);
      if (response.data.success) {
        setReport(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching report detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMonthYear = (month: number, year: number) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Link href="/reports/monthly" className="text-indigo-600 hover:text-indigo-900 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Reports
            </Link>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href="/reports/monthly" className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Reports
          </Link>
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Report not found</h3>
            <p className="text-gray-600">The requested monthly report could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/reports/monthly" className="text-indigo-600 hover:text-indigo-900 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Reports
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mx-25">
            {formatMonthYear(report.month, report.year)} Report
          </h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-semibold text-indigo-700 text-lg">₹{report.totalSpent.toLocaleString()}</span>
                </div>
                {report.topCategory && (
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600">Top Category:</span>
                    <span className="font-semibold text-gray-800 capitalize">{report.topCategory.category}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-600">Report Date:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(report.createdAt!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {report.overbudgetCategories && report.overbudgetCategories.length > 0 && (
              <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Over Budget Categories
                </h3>
                <div className="space-y-3">
                  {report.overbudgetCategories.map((category, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <span className="text-red-700 capitalize">{category.category}</span>
                      <span className="font-semibold text-red-700">
                        ₹{category.spent.toLocaleString()} / ₹{category.budgeted.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {report.topCategory && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Top Spending Category
              </h3>
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-yellow-800 text-xl capitalize">{report.topCategory.category}</h4>
                    <p className="text-yellow-700 mt-2">₹{report.topCategory.amount.toLocaleString()}</p>
                    <p className="text-yellow-600 text-sm mt-3">
                      This was your highest spending category for the month, accounting for a significant portion of your total expenses.
                    </p>
                  </div>
                  <div className="text-5xl">🏆</div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Report Insights
            </h3>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 leading-relaxed">
                This monthly report was automatically generated based on your spending patterns 
                for {formatMonthYear(report.month, report.year)}. It provides valuable insights into 
                your financial habits, highlighting your top spending categories and areas where you 
                exceeded your budgets. Use this information to make informed decisions about your 
                future spending and budgeting strategies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}