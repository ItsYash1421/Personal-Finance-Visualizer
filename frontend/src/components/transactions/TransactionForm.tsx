import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Transaction } from '../../types';
import { defaultCategories } from '../../data/categories';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Omit<Transaction, 'id' | '_id'>) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    description: '',
    category: defaultCategories[0]?.name || '',
    type: 'expense' as 'income' | 'expense',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
      });
    } else {
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: defaultCategories[0]?.name || '',
        type: 'expense',
      });
    }
  }, [transaction]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        amount: parseFloat(formData.amount),
        date: formData.date,
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
      });
    }
  };

  const categoryOptions = defaultCategories.map(cat => ({
    value: cat.name,
    label: cat.name,
  }));

  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          step="0.01"
          min="0"
          label="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
        />
        <Input
          type="date"
          label="Date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
        />
      </div>

      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        error={errors.description}
        placeholder="Enter transaction description"
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={categoryOptions}
          error={errors.category}
        />
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
          options={typeOptions}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {transaction ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
};