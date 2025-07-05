import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../../types';
import { defaultCategories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';
import { getYear, getMonth, parseISO } from 'date-fns';

// Helper to render percentage label outside pie slices with a shorter leader line and box
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  // Shorter leader line and label distance
  const sx = cx + outerRadius * Math.cos(-midAngle * RADIAN);
  const sy = cy + outerRadius * Math.sin(-midAngle * RADIAN);
  const ex = cx + (outerRadius + 14) * Math.cos(-midAngle * RADIAN);
  const ey = cy + (outerRadius + 14) * Math.sin(-midAngle * RADIAN);
  const tx = cx + (outerRadius + 24) * Math.cos(-midAngle * RADIAN);
  const ty = cy + (outerRadius + 24) * Math.sin(-midAngle * RADIAN);

  if (percent < 0.03) return null;

  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#888" strokeWidth={1.5} />
      <rect
        x={tx - 16}
        y={ty - 12}
        width={32}
        height={24}
        rx={6}
        fill="#fff"
        stroke="#bbb"
        strokeWidth={1}
      />
      <text
        x={tx}
        y={ty}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight={700}
        fill="#222"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

interface CategoryPieChartProps {
  transactions: Transaction[];
  selectedYear: number;
  selectedMonths: number[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ transactions, selectedYear, selectedMonths }) => {
  // Filter transactions by year and month
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(t => {
      const tYear = getYear(parseISO(t.date));
      const tMonth = getMonth(parseISO(t.date));
      if (tYear !== selectedYear) return false;
      if (selectedMonths.length > 0 && !selectedMonths.includes(tMonth)) return false;
      // Only show up to current month if this year
      if (tYear === new Date().getFullYear() && tMonth > new Date().getMonth()) return false;
      return true;
    });
  }, [transactions, selectedYear, selectedMonths]);

  const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');

  // Only show categories present in the data
  const categoryData = defaultCategories.map(category => {
    const categoryTransactions = expenseTransactions.filter(t => t.category === category.id);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      name: category.name,
      value: total,
      color: category.color,
    };
  }).filter(item => item.value > 0);

  // If no data matches default categories, create data from actual transaction categories
  if (categoryData.length === 0 && expenseTransactions.length > 0) {
    const transactionCategories = [...new Set(expenseTransactions.map(t => t.category))];
    const fallbackData = transactionCategories.map((categoryId, index) => {
      const categoryTransactions = expenseTransactions.filter(t => t.category === categoryId);
      const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name: `Category ${categoryId}`,
        value: total,
        color: `hsl(${index * 60}, 70%, 50%)`,
      };
    }).filter(item => item.value > 0);
    return (
      <div className="h-80 flex flex-col md:flex-row items-center justify-center p-6">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <ResponsiveContainer width="90%" height={220}>
            <PieChart>
              <Pie
                data={fallbackData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={45}
                dataKey="value"
                isAnimationActive={true}
                stroke="#fff"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 2px 12px rgba(80,80,180,0.08))' }}
                label={renderCustomizedLabel}
              >
                {fallbackData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  let displayName = name;
                  if (displayName && displayName.startsWith('Category ')) {
                    displayName = displayName.replace('Category ', '');
                  }
                  // Show percentage in tooltip if available
                  let percent = props && props.payload && typeof props.payload.percent === 'number'
                    ? ` (${(props.payload.percent * 100).toFixed(1)}%)`
                    : '';
                  return [`${formatCurrency(value)}${percent}`, displayName];
                }}
                contentStyle={{ borderRadius: 14, boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)', fontSize: 15, background: 'rgba(255,255,255,0.97)', border: 'none' }}
                itemStyle={{ color: '#333', fontWeight: 500 }}
                labelStyle={{ color: '#6366F1', fontWeight: 700 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
            {fallbackData.map((entry, index) => {
              let displayName = entry.name;
              if (displayName && displayName.startsWith('Category ')) {
                displayName = displayName.replace('Category ', '');
              }
              return (
                <li key={`legend-${index}`} className="flex items-center space-x-1.5">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-xs font-semibold text-gray-800 whitespace-normal break-words max-w-[6rem]" title={displayName}>
                    {displayName}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  // If no expense transactions at all, show empty state
  if (expenseTransactions.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-sm">No expense data available</p>
          <p className="text-xs text-gray-400 mt-1">Add some expenses to see spending by category</p>
        </div>
      </div>
    );
  }

  // Custom legend renderer (vertical, right side, two columns)
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {payload.map((entry: any, index: number) => {
          let displayName = entry.payload.name;
          if (displayName && displayName.startsWith('Category ')) {
            displayName = displayName.replace('Category ', '');
          }
          return (
            <li key={`legend-${index}`} className="flex items-center space-x-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload.color }}></span>
              <span className="text-xs font-semibold text-gray-800 whitespace-normal break-words max-w-[6rem]" title={displayName}>
                {displayName}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="h-80 flex flex-col md:flex-row items-center justify-center p-6">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <ResponsiveContainer width="90%" height={220}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              innerRadius={45}
              dataKey="value"
              isAnimationActive={true}
              stroke="#fff"
              strokeWidth={2}
              style={{ filter: 'drop-shadow(0 2px 12px rgba(80,80,180,0.08))' }}
              label={renderCustomizedLabel}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props: any) => {
                let displayName = name;
                if (displayName && displayName.startsWith('Category ')) {
                  displayName = displayName.replace('Category ', '');
                }
                // Show percentage in tooltip if available
                let percent = props && props.payload && typeof props.payload.percent === 'number'
                  ? ` (${(props.payload.percent * 100).toFixed(1)}%)`
                  : '';
                return [`${formatCurrency(value)}${percent}`, displayName];
              }}
              contentStyle={{ borderRadius: 14, boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)', fontSize: 15, background: 'rgba(255,255,255,0.97)', border: 'none' }}
              itemStyle={{ color: '#333', fontWeight: 500 }}
              labelStyle={{ color: '#6366F1', fontWeight: 700 }}
            />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
        {/* The legend will be rendered here by recharts */}
      </div>
    </div>
  );
};
