'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Expenses', href: '/expenses', icon: '💰' },
  { name: 'Budgets', href: '/budgets', icon: '📈' },
  { name: 'Reports', href: '/reports', icon: '📋' },
  { name: 'Monthly Reports', href: '/reports/monthly', icon: '📅' }, // Add this line
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 pt-16">
      <nav className="mt-8 px-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
              pathname === item.href
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}