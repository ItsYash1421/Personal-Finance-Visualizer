import { useState, useEffect, useCallback } from 'react';
import { apiService, Transaction, Budget, Category } from '../services/api';

interface UseApiDataReturn {
  // Transactions
  transactions: Transaction[];
  loadingTransactions: boolean;
  errorTransactions: string | null;
  addTransaction: (transaction: Omit<Transaction, '_id' | 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;

  // Budgets
  budgets: Budget[];
  loadingBudgets: boolean;
  errorBudgets: string | null;
  addBudget: (budget: Omit<Budget, '_id' | 'id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  refreshBudgets: () => Promise<void>;

  // Categories
  categories: Category[];
  loadingCategories: boolean;
  errorCategories: string | null;
  refreshCategories: () => Promise<void>;
}

export const useApiData = (): UseApiDataReturn => {
  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);

  // Budgets state
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [errorBudgets, setErrorBudgets] = useState<string | null>(null);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoadingTransactions(true);
      setErrorTransactions(null);
      const data = await apiService.getTransactions();
      setTransactions(data);
    } catch (error) {
      setErrorTransactions(error instanceof Error ? error.message : 'Failed to fetch transactions');
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  // Fetch budgets
  const fetchBudgets = useCallback(async () => {
    try {
      setLoadingBudgets(true);
      setErrorBudgets(null);
      const data = await apiService.getBudgets();
      setBudgets(data);
    } catch (error) {
      setErrorBudgets(error instanceof Error ? error.message : 'Failed to fetch budgets');
    } finally {
      setLoadingBudgets(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      setErrorCategories(null);
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (error) {
      setErrorCategories(error instanceof Error ? error.message : 'Failed to fetch categories');
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // Transaction operations
  const addTransaction = useCallback(async (transaction: Omit<Transaction, '_id' | 'id'>) => {
    try {
      const newTransaction = await apiService.createTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add transaction');
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, transaction: Partial<Transaction>) => {
    try {
      const updatedTransaction = await apiService.updateTransaction(id, transaction);
      setTransactions(prev => 
        prev.map(t => (t._id === id || t.id === id) ? updatedTransaction : t)
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update transaction');
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await apiService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t._id !== id && t.id !== id));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete transaction');
    }
  }, []);

  // Budget operations
  const addBudget = useCallback(async (budget: Omit<Budget, '_id' | 'id'>) => {
    try {
      const newBudget = await apiService.createBudget(budget);
      setBudgets(prev => [newBudget, ...prev]);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add budget');
    }
  }, []);

  const updateBudget = useCallback(async (id: string, budget: Partial<Budget>) => {
    try {
      const updatedBudget = await apiService.updateBudget(id, budget);
      setBudgets(prev => 
        prev.map(b => (b._id === id || b.id === id) ? updatedBudget : b)
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update budget');
    }
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    try {
      await apiService.deleteBudget(id);
      setBudgets(prev => prev.filter(b => b._id !== id && b.id !== id));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete budget');
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
    fetchCategories();
  }, [fetchTransactions, fetchBudgets, fetchCategories]);

  return {
    // Transactions
    transactions,
    loadingTransactions,
    errorTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,

    // Budgets
    budgets,
    loadingBudgets,
    errorBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshBudgets: fetchBudgets,

    // Categories
    categories,
    loadingCategories,
    errorCategories,
    refreshCategories: fetchCategories,
  };
}; 