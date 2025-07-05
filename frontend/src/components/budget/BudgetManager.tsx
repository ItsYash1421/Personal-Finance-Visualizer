import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Budget, Transaction } from '../../types';
import { defaultCategories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';
import { getCurrentMonth } from '../../utils/dateUtils';

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  selectedMonthStr: string;
  onAddBudget: (budget: Omit<Budget, 'id' | '_id'>) => void;
  onUpdateBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  transactions,
  selectedMonthStr,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: getCurrentMonth(),
  });

  const currentMonth = getCurrentMonth();
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

  // Compute available categories, always include the current editing category if not present
  const editingCategory = editingBudget?.category;
  let availableCategories = defaultCategories.filter(category => {
    const existingBudget = currentMonthBudgets.find(b => b.category === category.name);
    return !existingBudget || editingCategory === category.name;
  });
  if (editingCategory && !availableCategories.some(cat => cat.name === editingCategory)) {
    availableCategories = [...availableCategories, { id: 'custom', name: editingCategory, color: '#888', icon: 'MoreHorizontal' }];
  }

  // State for custom category
  const [customCategory, setCustomCategory] = useState('');

  // Determine if this is the current month
  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const isCurrentMonth = selectedMonthStr === currentMonthStr;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = formData.category === '__custom__' ? customCategory.trim() : formData.category;
    console.log('Submitting budget:', { ...formData, category: finalCategory }, editingBudget);
    if (!finalCategory || !formData.amount || parseFloat(formData.amount) <= 0) {
      console.log('Validation failed', { ...formData, category: finalCategory });
      return;
    }
    if (editingBudget) {
      onUpdateBudget({
        ...editingBudget,
        category: finalCategory,
        amount: parseFloat(formData.amount),
        month: formData.month,
      });
      setEditingBudget(null);
    } else {
      onAddBudget({
        category: finalCategory,
        amount: parseFloat(formData.amount),
        month: formData.month,
      });
      setIsAdding(false);
    }
    setFormData({
      category: availableCategories.length > 0 ? availableCategories[0].name : '',
      amount: '',
      month: getCurrentMonth(),
    });
    setCustomCategory('');
  };

  const openAddForm = () => {
    setIsAdding(true);
    setEditingBudget(null);
    setCustomCategory('');
    setFormData({
      category: availableCategories.length > 0 ? availableCategories[0].name : '',
      amount: '',
      month: getCurrentMonth(),
    });
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setCustomCategory('');
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingBudget(null);
    setFormData({
      category: availableCategories.length > 0 ? availableCategories[0].name : '',
      amount: '',
      month: getCurrentMonth(),
    });
  };

  const getCategoryName = (categoryName: string) => {
    const category = defaultCategories.find(c => c.name === categoryName);
    return category ? category.name : categoryName || 'Unknown';
  };

  // Compute spent for each budget in the current list
  const spentByCategory = (category: string, month: string) => {
    return transactions
      .filter(t => t.category === category && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Debug logging
  console.log('Current month budgets:', currentMonthBudgets);
  console.log('Default categories:', defaultCategories);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Budget Management</h3>
          {!isAdding && isCurrentMonth && (
            <Button onClick={openAddForm} size="sm">
              <Plus size={16} className="mr-2" />
              Add Budget
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  ...availableCategories.map(cat => ({
                    value: cat.name,
                    label: cat.name,
                  })),
                  { value: '__custom__', label: 'Custom...' }
                ]}
              />
              {formData.category === '__custom__' && (
                <Input
                  type="text"
                  label="Custom Category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-2"
                />
              )}
              <Input
                type="number"
                step="0.01"
                min="0"
                label="Budget Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {editingBudget ? 'Update' : 'Add'} Budget
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {budgets.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No budgets set for this month. Add your first budget to get started!
            </div>
          ) : (
            budgets.map((budget) => {
              const spent = spentByCategory(budget.category, budget.month);
              const overBudget = spent > budget.amount;
              const isCurrentMonth = budget.month === formData.month;
              return (
                <div
                  key={budget._id || budget.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {getCategoryName(budget.category)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Budget: {formatCurrency(budget.amount)}
                      <span className="ml-4">Spent: {formatCurrency(spent)}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isCurrentMonth ? (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(budget)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDeleteBudget(budget._id || budget.id || '')}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${overBudget ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {overBudget ? 'Over Budget' : 'In Budget'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};