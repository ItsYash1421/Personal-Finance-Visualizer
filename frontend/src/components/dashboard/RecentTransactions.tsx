import React from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Transaction } from '../../types';
import { defaultCategories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 5);

  const getCategoryName = (category: string) => {
    const found = defaultCategories.find(c => c.name === category || c.id === category);
    return found ? found.name : category || 'Unknown';
  };

  const getCategoryColor = (category: string) => {
    const found = defaultCategories.find(c => c.name === category || c.id === category);
    return found ? found.color : '#6B7280';
  };

  return (
          <Card className="overflow-hidden relative transform-gpu" hover={false}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-500/10 opacity-20"></div>
        <CardHeader className="bg-gradient-to-r from-gray-50/50 to-blue-50/50 relative z-10">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
          Recent Transactions
        </h3>
      </CardHeader>
      <CardContent className="p-0 relative z-10">
        <div className="space-y-0">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-gray-500 text-lg">No transactions yet</p>
              <p className="text-gray-400 text-sm mt-1">Add your first transaction to get started!</p>
            </div>
          ) : (
            recentTransactions.map((transaction, index) => (
              <div
                key={transaction._id || transaction.id}
                className="group flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 border-b last:border-b-0 border-gray-100/50 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full shadow-lg"
                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                        {transaction.description}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-bold ${
                            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {getCategoryName(transaction.category)} • {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                    className="shadow-md hover:shadow-lg"
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(transaction._id || transaction.id || '')}
                    className="shadow-md hover:shadow-lg"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};