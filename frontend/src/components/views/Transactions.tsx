import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { TransactionList } from '../transactions/TransactionList';
import { Transaction } from '../../types';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between   items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Manage all your income and expenses</p>
        </div>
        <Button onClick={onAddTransaction}>
          <Plus size={16} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      <TransactionList
        transactions={transactions}
        onEdit={onEditTransaction}
        onDelete={onDeleteTransaction}
      />
    </div>
  );
};