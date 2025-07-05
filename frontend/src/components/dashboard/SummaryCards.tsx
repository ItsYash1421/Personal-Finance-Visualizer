import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Transaction, Budget } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { getCurrentMonth, getMonthYear } from '../../utils/dateUtils';

interface SummaryCardsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions, budgets }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

  const balance = totalIncome - totalExpenses;

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      trendIcon: ArrowUpRight,
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderGradient: 'from-emerald-500/20 to-emerald-500/10',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      trendIcon: ArrowDownRight,
      color: 'text-red-600',
      bgGradient: 'from-red-500/10 via-red-500/5 to-transparent',
      borderGradient: 'from-red-500/20 to-red-500/10',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
    },
    {
      title: 'Net Balance',
      value: formatCurrency(balance),
      icon: Wallet,
      trendIcon: balance >= 0 ? ArrowUpRight : ArrowDownRight,
      color: balance >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgGradient: balance >= 0 ? 'from-emerald-500/10 via-emerald-500/5 to-transparent' : 'from-red-500/10 via-red-500/5 to-transparent',
      borderGradient: balance >= 0 ? 'from-emerald-500/20 to-emerald-500/10' : 'from-red-500/20 to-red-500/10',
      iconBg: balance >= 0 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-600',
    },
    {
      title: 'Total Budget',
      value: formatCurrency(totalBudget),
      icon: Target,
      trendIcon: ArrowUpRight,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      borderGradient: 'from-blue-500/20 to-blue-500/10',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="group overflow-hidden relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`}></div>
          <div className={`absolute inset-0 bg-gradient-to-r ${card.borderGradient} opacity-20`}></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-all duration-500 ease-in-out">
                  {card.title}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-all duration-500 ease-in-out">
                    {card.value}
                  </p>
                  <card.trendIcon className={`w-4 h-4 ${card.color} opacity-70 group-hover:opacity-100 transition-all duration-500 ease-in-out`} />
                </div>
              </div>
              <div className="relative">
                <div className={`absolute inset-0 ${card.iconBg} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500 ease-in-out`}></div>
                <div className={`relative p-4 ${card.iconBg} rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-500 ease-in-out`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};