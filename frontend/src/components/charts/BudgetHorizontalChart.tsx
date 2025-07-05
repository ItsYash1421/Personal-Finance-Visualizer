import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Budget } from '../../types';
import { defaultCategories } from '../../data/categories';
import { getCurrentMonth, getMonthYear } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatters';

interface BudgetHorizontalChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const BudgetHorizontalChart: React.FC<BudgetHorizontalChartProps> = ({ transactions, budgets }) => {
  const currentMonth = getCurrentMonth();
  const currentMonthExpenses = transactions.filter(t => 
    t.type === 'expense' && getMonthYear(t.date) === currentMonth
  );

  console.log('BudgetHorizontalChart budgets:', budgets);
  console.log('BudgetHorizontalChart transactions:', transactions);

  const budgetData = budgets.map(budget => {
    const category = defaultCategories.find(c => c.name === budget.category);
    const spent = transactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      category: category?.name || budget.category || 'Unknown',
      budget: budget.amount,
      spent,
      remaining: Math.max(0, budget.amount - spent),
    };
  });

  console.log('BudgetHorizontalChart budgetData:', budgetData);

  return (
    <div className="h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={budgetData}
          layout="vertical"
          barCategoryGap={80}
          barGap={5}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" strokeWidth={0.7} opacity={0.5} />
          <XAxis 
            type="number"
            tick={{ fontSize: 14, fontWeight: 600, fill: '#374151' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <YAxis 
            type="category"
            dataKey="category"
            tick={{ fontSize: 14, fontWeight: 600, fill: '#374151' }}
            axisLine={false}
            tickLine={false}
            width={120}
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
          <Bar dataKey="budget" fill="#c7dafe" radius={[0, 4, 4, 0]} barSize={18} />
          <Bar dataKey="spent" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}; 