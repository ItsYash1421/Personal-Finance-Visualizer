import React from 'react';
import { BarChart3, CreditCard, Target, PieChart, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'budget', label: 'Budget', icon: Target },
  ];

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                FinanceTracker
              </span>
            </div>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`group relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl ${
                  activeView === item.id
                    ? 'text-blue-600 bg-blue-50/80 shadow-lg shadow-blue-500/20'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <div className="relative">
                  <item.icon className={`w-5 h-5 mr-2 transition-transform duration-300 ${
                    activeView === item.id ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  {activeView === item.id && (
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-30 animate-pulse"></div>
                  )}
                </div>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};