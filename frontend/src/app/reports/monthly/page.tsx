'use client';

import React, { useState, useEffect } from 'react';
import { MonthlyReport } from '@/types';
import api from '@/services/api';
import Link from 'next/link';

export default function MonthlyReportsPage() {
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchMonthlyReports();
  }, []);

  const fetchMonthlyReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports');
      if (response.data.success) {
        setReports(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyReport = async () => {
    try {
      setGenerating(true);
      const currentDate = new Date();
      const response = await api.post('/reports/generate', {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
      
      if (response.data.success) {
        fetchMonthlyReports();
        alert('Monthly report generated successfully!');
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      alert(error.response?.data?.message || 'Error generating report');
    } finally {
      setGenerating(false);
    }
  };

  const formatMonthYear = (month: number, year: number) => {
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Monthly Reports</h1>
              <p className="text-gray-600 mt-1">Track your monthly spending patterns</p>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Monthly Reports</h1>
            <p className="text-white mt-1">Track your monthly spending patterns</p>
          </div>
          <button
            onClick={generateMonthlyReport}
            disabled={generating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200 hover:shadow-md"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Generate Current Month Report</span>
              </>
            )}
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No monthly reports yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Generate your first monthly report to see a comprehensive summary of your spending patterns and financial insights.
            </p>
            <button
              onClick={generateMonthlyReport}
              disabled={generating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Generate First Report
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {formatMonthYear(report.month, report.year)}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Report
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-xs text-indigo-600 uppercase font-medium">Total Spent</p>
                    <p className="text-2xl font-bold text-indigo-700">
                      ₹{report.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  
                  {report.topCategory && (
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Top Category</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                        <p className="font-medium text-gray-800 capitalize">
                          {report.topCategory.category}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 ml-4">
                        ₹{report.topCategory.amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  {report.overbudgetCategories && report.overbudgetCategories.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Over Budget</p>
                      <div className="mt-2 space-y-2">
                        {report.overbudgetCategories.slice(0, 2).map((category, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-red-50 p-2 rounded-md">
                            <span className="capitalize text-red-800">{category.category}</span>
                            <span className="text-red-600 font-medium">
                              +₹{(category.spent - category.budgeted).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {report.overbudgetCategories.length > 2 && (
                          <p className="text-xs text-gray-500 mt-1">
                            +{report.overbudgetCategories.length - 2} more...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Generated on {new Date(report.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-5">
                  <Link
                    href={`/reports/monthly/${report._id}`}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                  >
                    View Detailed Report
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}