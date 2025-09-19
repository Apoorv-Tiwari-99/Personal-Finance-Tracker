'use client';

import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Features carousel data
  const features = [
    {
      title: "Track Expenses",
      description: "Easily record and categorize your daily spending",
      icon: "💰"
    },
    {
      title: "Set Budgets",
      description: "Create monthly budgets and get alerts when you're close to limits",
      icon: "📊"
    },
    {
      title: "Smart Insights",
      description: "Get AI-powered suggestions to improve your financial health",
      icon: "🤖"
    },
    {
      title: "Visual Reports",
      description: "Understand your spending patterns with beautiful charts",
      icon: "📈"
    }
  ];

  // Rotate through features
  useEffect(() => {
    if (user || loading) return;
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [user, loading, features.length]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading your financial dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-indigo-600 opacity-5"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full opacity-5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">₹</span>
            </div>
            <span className="text-2xl font-bold text-indigo-800">FinanceTracker+</span>
          </div>
          
          <div className="flex space-x-4">
            <Link href="/login">
              <button className="text-indigo-700 hover:text-indigo-900 font-medium px-4 py-2 transition-colors duration-200 cursor-pointer">
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-20">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Take Control of Your <span className="text-indigo-600">Financial Future</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Track expenses, set budgets, and get intelligent insights to improve your financial health. All in one beautiful application.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                  Start Tracking Now - It's Free
                </button>
              </Link>
              <Link href="/login">
                <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200 cursor-pointer">
                  Demo The App
                </button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center">
              <div className="flex -space-x-3 mr-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">U{i}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600">
                <span className="font-semibold text-indigo-700">5,000+</span> users tracking their finances
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-full h-full bg-indigo-100 rounded-2xl"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-indigo-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900">Monthly Spending</h3>
                  <span className="text-sm text-indigo-600">June 2023</span>
                </div>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="w-40 h-40 rounded-full border-8 border-indigo-100 relative">
                    <div className="absolute inset-0 rounded-full border-8 border-indigo-600 clip-path-[polygon(50% 50%, 50% 0, 0 0, 0 100%, 50% 100%)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-indigo-800 bg-white/80 px-2 py-1 rounded-lg">₹12,456</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { category: 'Food', amount: '₹4,230', color: 'bg-rose-500', width: 'w-3/4' },
                    { category: 'Shopping', amount: '₹3,120', color: 'bg-blue-500', width: 'w-2/3' },
                    { category: 'Transport', amount: '₹1,870', color: 'bg-amber-500', width: 'w-2/5' },
                    { category: 'Entertainment', amount: '₹2,150', color: 'bg-emerald-500', width: 'w-1/2' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>
                      <span className="text-sm text-gray-600 w-20">{item.category}</span>
                      <div className="flex-1 bg-gray-100 rounded h-2 mx-2">
                        <div className={`h-2 rounded ${item.color} ${item.width}`}></div>
                      </div>
                      <span className="text-sm font-medium">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything You Need to Manage Your Money</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Our powerful features help you understand and optimize your spending habits</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center bg-indigo-600 rounded-2xl mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Financial Life?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">Join thousands of users who are saving more and spending smarter with our platform</p>
          <Link href="/register">
            <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200 shadow-md cursor-pointer">
              Create Your Free Account
            </button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600 border-t border-gray-200">
          <p>© {new Date().getFullYear()} FinanceTracker+. All rights reserved.</p>
        </footer>
      </div>

      <style jsx>{`
        .clip-path-\[polygon\(50\%_50\%\,50\%_0\,0_0\,0_100\%\,50\%_100\%\)\] {
          clip-path: polygon(50% 50%, 50% 0, 0 0, 0 100%, 50% 100%);
        }
      `}</style>
    </div>
  );
}