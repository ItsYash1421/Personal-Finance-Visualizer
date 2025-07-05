import React, { useMemo, useState, useRef } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { MonthlyExpensesChart } from '../charts/MonthlyExpensesChart';
import { CategoryPieChart } from '../charts/CategoryPieChart';
import { Transaction } from '../../types';
import { format, parseISO, getYear, getMonth } from 'date-fns';

interface AnalyticsProps {
  transactions: Transaction[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  // Year/month selection logic (copied from Dashboard)
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
  const years = useMemo(() => getAllYears(transactions), [transactions]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const months = useMemo(() => getMonthsForYear(transactions, selectedYear), [transactions, selectedYear]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setIsMonthDropdownOpen(false);
      }
    }
    if (isMonthDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMonthDropdownOpen]);

  // Filter transactions by selected year and month
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tYear = getYear(parseISO(t.date));
      const tMonth = getMonth(parseISO(t.date));
      if (selectedYear && tYear !== selectedYear) return false;
      if (selectedMonths.length > 0 && !selectedMonths.includes(tMonth)) return false;
      return true;
    });
  }, [transactions, selectedYear, selectedMonths]);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Detailed insights into your spending patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Savings Rate</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {savingsRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Total Transactions</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {filteredTransactions.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Avg. Monthly Expenses</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {filteredTransactions.length > 0 ? `$${(totalExpenses / (selectedMonths.length === 0 ? 12 : selectedMonths.length)).toFixed(0)}` : '$0'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Year/Month Selectors */}
      <div className="flex flex-row items-start space-x-2 mb-2">
        <select
          className="border rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={selectedYear}
          onChange={e => {
            setSelectedYear(Number(e.target.value));
            setSelectedMonths([]);
          }}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <div className="relative" ref={monthDropdownRef}>
          <button
            type="button"
            className="border rounded-xl px-4 py-2 text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-[120px] flex items-center justify-between gap-2"
            onClick={() => setIsMonthDropdownOpen((open) => !open)}
          >
            {selectedMonths.length === 0
              ? 'All Months'
              : selectedMonths.map(m => monthShortNames[m]).join(', ')}
            <span className="ml-2">▾</span>
          </button>
          {isMonthDropdownOpen && (
            <div className="absolute z-20 mt-2 bg-white border rounded-xl shadow-lg p-3 min-w-[180px] flex flex-col gap-1">
              {months.map(m => (
                <label key={m} className="flex items-center space-x-2 text-sm cursor-pointer select-none px-2 py-1 rounded hover:bg-blue-50">
                  <input
                    type="checkbox"
                    checked={selectedMonths.includes(m)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedMonths([...selectedMonths, m]);
                      } else {
                        setSelectedMonths(selectedMonths.filter(month => month !== m));
                      }
                    }}
                  />
                  <span>{monthShortNames[m]}</span>
                </label>
              ))}
              <button
                type="button"
                className="flex items-center space-x-2 text-sm bg-gray-100 px-2 py-1 rounded-lg cursor-pointer select-none hover:bg-blue-50 mt-1"
                onClick={() => setSelectedMonths([])}
              >
                <span>All Months</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
        <Card className="chart-container overflow-hidden relative group" hover={true}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-500/10 opacity-20"></div>
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 relative z-10">
            <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
          </CardHeader>
          <CardContent className="relative z-10">
            <MonthlyExpensesChart transactions={transactions} selectedYear={selectedYear} selectedMonths={selectedMonths} />
          </CardContent>
        </Card>

        <Card className="chart-container overflow-hidden relative group" hover={true}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/10 opacity-20"></div>
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 relative z-10">
            <h3 className="text-lg font-semibold text-gray-900">Spending Distribution</h3>
          </CardHeader>
          <CardContent className="relative z-10">
            <CategoryPieChart transactions={transactions} selectedYear={selectedYear} selectedMonths={selectedMonths} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};