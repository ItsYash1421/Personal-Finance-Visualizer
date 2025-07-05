import React, { useMemo, useState, useRef } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { SummaryCards } from '../dashboard/SummaryCards';
import { RecentTransactions } from '../dashboard/RecentTransactions';
import { MonthlyExpensesChart } from '../charts/MonthlyExpensesChart';
import { CategoryPieChart } from '../charts/CategoryPieChart';
import { Transaction, Budget } from '../../types';
import { format, parseISO, getYear, getMonth } from 'date-fns';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  budgets,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  // Global year/month state
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

  // Filter transactions and budgets by selected year and months
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tYear = getYear(parseISO(t.date));
      const tMonth = getMonth(parseISO(t.date));
      if (selectedYear && tYear !== selectedYear) return false;
      if (selectedMonths.length > 0 && !selectedMonths.includes(tMonth)) return false;
      return true;
    });
  }, [transactions, selectedYear, selectedMonths]);

  const filteredBudgets = useMemo(() => {
    return budgets.filter(b => {
      const [year, month] = b.month.split('-').map(Number);
      if (selectedYear && year !== selectedYear) return false;
      if (selectedMonths.length > 0 && !selectedMonths.includes(month - 1)) return false;
      return true;
    });
  }, [budgets, selectedYear, selectedMonths]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
           
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-0">Track your finances and manage your budget with style</p>
        </div>
        <Button onClick={onAddTransaction} variant="gradient" className="shadow-xl">
          <Plus size={16} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <SummaryCards transactions={filteredTransactions} budgets={filteredBudgets} />
      </div>

      {/* Global Filters Row */}
      <div className="flex flex-row items-start justify-between mt-4 mb-2 px-2 w-full">
        {/* Left: Year and Month Selectors */}
        <div className="flex flex-row items-start space-x-2">
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
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '50ms' }}>
        <Card className="chart-container overflow-hidden relative" hover={true}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-500/10 opacity-20"></div>
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 relative z-10">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Monthly Overview
            </h3>
          </CardHeader>
          <CardContent className="relative z-10">
            <MonthlyExpensesChart transactions={transactions} selectedYear={selectedYear} selectedMonths={selectedMonths} />
          </CardContent>
        </Card>

        <Card className="chart-container overflow-hidden relative" hover={true}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/10 opacity-20"></div>
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 relative z-10">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
              Spending by Category
            </h3>
          </CardHeader>
          <CardContent className="relative z-10">
            <CategoryPieChart transactions={transactions} selectedYear={selectedYear} selectedMonths={selectedMonths} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
        <RecentTransactions
          transactions={transactions}
          onEdit={onEditTransaction}
          onDelete={onDeleteTransaction}
        />
      </div>
    </div>
  );
};