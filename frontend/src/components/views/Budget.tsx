import React, { useMemo, useState, useRef } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { BudgetManager } from '../budget/BudgetManager';
import { BudgetHorizontalChart } from '../charts/BudgetHorizontalChart';
import { Transaction, Budget as BudgetType } from '../../types';
import { format, parseISO, getYear, getMonth } from 'date-fns';

interface BudgetProps {
  transactions: Transaction[];
  budgets: BudgetType[];
  onAddBudget: (budget: Omit<BudgetType, 'id' | '_id'>) => void;
  onUpdateBudget: (budget: BudgetType) => void;
  onDeleteBudget: (id: string) => void;
}

export const Budget: React.FC<BudgetProps> = ({
  transactions,
  budgets,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
}) => {
  // Year/month selection logic
  const getAllYears = (budgets: BudgetType[]) => {
    const years = Array.from(new Set(budgets.map(b => getYear(parseISO(b.month + '-01')))));
    years.sort((a, b) => a - b);
    return years;
  };
  const getMonthsForYear = (budgets: BudgetType[], year: number) => {
    const months = Array.from(new Set(
      budgets.filter(b => getYear(parseISO(b.month + '-01')) === year).map(b => getMonth(parseISO(b.month + '-01')))
    ));
    months.sort((a, b) => a - b);
    return months;
  };
  const monthShortNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const years = useMemo(() => getAllYears(budgets), [budgets]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const months = useMemo(() => getMonthsForYear(budgets, selectedYear), [budgets, selectedYear]);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([new Date().getMonth()]);
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

  // Filter budgets and transactions for selected year/month
  const selectedMonthStrs = selectedMonths.length > 0
    ? selectedMonths.map(m => `${selectedYear}-${String(m + 1).padStart(2, '0')}`)
    : months.map(m => `${selectedYear}-${String(m + 1).padStart(2, '0')}`);
  const filteredBudgets = budgets.filter(b => selectedMonthStrs.includes(b.month));
  const filteredTransactions = transactions.filter(t => selectedMonthStrs.some(str => t.date.startsWith(str)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <p className="text-gray-600">Set and track your monthly spending goals</p>
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
            <div className="absolute z-30 mt-2 bg-white border rounded-xl shadow-lg p-3 min-w-[180px] flex flex-col gap-1 max-h-64 overflow-y-auto" style={{top: '100%'}}>
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
                className="text-xs text-blue-600 underline mt-2 text-left"
                onClick={() => setSelectedMonths([])}
              >
                All Months
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <BudgetManager
          budgets={filteredBudgets}
          transactions={filteredTransactions}
          selectedMonthStr={selectedMonthStrs[0]}
          onAddBudget={budget => onAddBudget({ ...budget, month: selectedMonthStrs[0] })}
          onUpdateBudget={onUpdateBudget}
          onDeleteBudget={onDeleteBudget}
        />

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Budget vs Actual for {selectedMonths.length === 0 ? 'All Months' : selectedMonths.map(m => monthShortNames[m]).join(', ')} {selectedYear}
            </h3>
          </CardHeader>
          <CardContent>
            {filteredBudgets.length === 0 ? (
              <div className="text-center text-gray-500 py-12 text-lg">No data for these months.</div>
            ) : (
              <BudgetHorizontalChart transactions={filteredTransactions} budgets={filteredBudgets} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};