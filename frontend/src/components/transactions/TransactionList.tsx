import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Filter, X, Search, Calendar, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Transaction } from '../../types';
import { defaultCategories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

interface FilterState {
  type: string;
  category: string;
  minAmount: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    category: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
  });

  const getCategoryName = (categoryName: string) => {
    const category = defaultCategories.find(c => c.name === categoryName);
    return category ? category.name : categoryName || 'Unknown';
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filter by type
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      // Filter by category
      if (filters.category) {
        const selectedCategory = defaultCategories.find(cat => cat.id === filters.category);
        if (selectedCategory && transaction.category !== selectedCategory.name) {
          return false;
        }
      }

      // Filter by amount range
      if (filters.minAmount && transaction.amount < parseFloat(filters.minAmount)) {
        return false;
      }
      if (filters.maxAmount && transaction.amount > parseFloat(filters.maxAmount)) {
        return false;
      }

      // Filter by date range
      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const sortedTransactions = filteredTransactions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...defaultCategories.map(category => ({
      value: category.id,
      label: category.name,
    })),
  ];

  return (
    <>
      <Card noTransitions={true}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {filteredTransactions.length} of {transactions.length}
                </span>
              )}
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className={hasActiveFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
              >
                <Filter size={16} className="mr-2" />
                Filter
                {hasActiveFilters && <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {sortedTransactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {transactions.length === 0 
                ? 'No transactions found. Add your first transaction to get started!'
                : 'No transactions match your current filters.'
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction._id || transaction.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500 capitalize">{transaction.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCategoryName(transaction.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-semibold ${
                            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onEdit(transaction)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(transaction._id || transaction.id || '')}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Transactions"
      >
        <div className="space-y-6">
          {/* Transaction Type */}
          <div>
            <Select
              label="Transaction Type"
              options={typeOptions}
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <Select
              label="Category"
              options={categoryOptions}
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            />
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Amount"
              placeholder="0.00"
              type="number"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
            />
            <Input
              label="Max Amount"
              placeholder="1000.00"
              type="number"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={clearFilters}
              className="flex-1"
            >
              Clear Filters
            </Button>
            <Button
              onClick={() => setIsFilterOpen(false)}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};