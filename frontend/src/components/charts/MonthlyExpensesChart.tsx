import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '../../types';
import { defaultCategories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';
import { format, parseISO, getYear, getMonth } from 'date-fns';

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
  selectedYear: number;
  selectedMonths: number[];
}

const getAllYears = (transactions: Transaction[]) => {
  const years = Array.from(new Set(transactions.map(t => getYear(parseISO(t.date)))));
  years.sort((a, b) => a - b);
  return years;
};

const getMonthsForYear = (transactions: Transaction[], year: number) => {
  const months = Array.from(new Set(
    transactions.filter(t => getYear(parseISO(t.date)) === year).map(t => getMonth(parseISO(t.date)))
  ));
  months.sort((a, b) => a - b);
  return months;
};

const monthShortNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const CustomLegend = () => (
  <ul className="flex flex-row items-center space-x-4 w-auto min-w-[120px]">
    <li className="flex items-center space-x-1.5">
      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }}></span>
      <span className="text-xs font-semibold text-gray-800">Income</span>
    </li>
    <li className="flex items-center space-x-1.5">
      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }}></span>
      <span className="text-xs font-semibold text-gray-800">Expenses</span>
    </li>
  </ul>
);

export const MonthlyExpensesChart: React.FC<MonthlyExpensesChartProps> = ({ transactions, selectedYear, selectedMonths }) => {
  const currentYear = new Date().getFullYear();
  // Filter transactions by year and selected months
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tYear = getYear(parseISO(t.date));
      const tMonth = getMonth(parseISO(t.date));
      if (tYear !== selectedYear) return false;
      if (selectedMonths.length > 0 && !selectedMonths.includes(tMonth)) return false;
      // Only show up to current month if this year
      if (tYear === currentYear && tMonth > new Date().getMonth()) return false;
      return true;
    });
  }, [transactions, selectedYear, selectedMonths]);

  // Build chart data
  const months = useMemo(() => {
    if (selectedMonths.length > 0) {
      return selectedMonths.slice().sort((a, b) => a - b);
    }
    return Array.from(new Set(filteredTransactions.map(t => getMonth(parseISO(t.date))))).sort((a, b) => a - b);
  }, [filteredTransactions, selectedMonths]);

  const chartData = useMemo(() => {
    // Group by each selected month (or all months if none selected)
    const data: { month: string; expenses: number; income: number; monthIdx: number }[] = [];
    for (let m of months) {
      const monthTransactions = filteredTransactions.filter(t => getMonth(parseISO(t.date)) === m);
      const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      data.push({
        month: monthShortNames[m],
        expenses,
        income,
        monthIdx: m,
      });
    }
    return data;
  }, [filteredTransactions, months, selectedYear]);

  return (
    <div className="h-80 relative pt-2">
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData} margin={{ top: 8, right: 32, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 15, fontWeight: 700, fill: '#222' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 14, fontWeight: 700, fill: '#222' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Bar 
            dataKey="expenses" 
            fill="#EF4444" 
            radius={[4, 4, 0, 0]}
            name="Expenses"
          />
          <Bar 
            dataKey="income" 
            fill="#10B981" 
            radius={[4, 4, 0, 0]}
            name="Income"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};