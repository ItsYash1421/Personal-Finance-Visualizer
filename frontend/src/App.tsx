import React, { useState } from 'react';
import { Navigation } from './components/layout/Navigation';
import { Dashboard } from './components/views/Dashboard';
import { Transactions } from './components/views/Transactions';
import { Analytics } from './components/views/Analytics';
import { Budget } from './components/views/Budget';
import { TransactionForm } from './components/transactions/TransactionForm';
import { Modal } from './components/ui/Modal';
import { useApiData } from './hooks/useApiData';
import { Transaction, Budget as BudgetType } from './types';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    transactions,
    loadingTransactions,
    errorTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    budgets,
    loadingBudgets,
    errorBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    categories,
    loadingCategories,
    errorCategories,
  } = useApiData();

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id' | '_id'>) => {
    try {
      setError(null);
      await addTransaction(transactionData);
    setIsTransactionModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add transaction');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleUpdateTransaction = async (transactionData: Omit<Transaction, 'id' | '_id'>) => {
    if (editingTransaction) {
      try {
        setError(null);
        const id = editingTransaction._id || editingTransaction.id;
        if (id) {
          await updateTransaction(id, transactionData);
      setIsTransactionModalOpen(false);
      setEditingTransaction(null);
    }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update transaction');
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      setError(null);
      await deleteTransaction(id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete transaction');
    }
  };

  const handleAddBudget = async (budgetData: Omit<BudgetType, 'id' | '_id'>) => {
    try {
      setError(null);
      await addBudget(budgetData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add budget');
    }
  };

  const handleUpdateBudget = async (updatedBudget: BudgetType) => {
    try {
      setError(null);
      const id = updatedBudget._id || updatedBudget.id;
      if (id) {
        await updateBudget(id, updatedBudget);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update budget');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      setError(null);
      await deleteBudget(id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete budget');
    }
  };

  const openTransactionModal = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            transactions={transactions}
            budgets={budgets}
            onAddTransaction={openTransactionModal}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'transactions':
        return (
          <Transactions
            transactions={transactions}
            onAddTransaction={openTransactionModal}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'analytics':
        return <Analytics transactions={transactions} />;
      case 'budget':
        return (
          <Budget
            transactions={transactions}
            budgets={budgets}
            onAddBudget={handleAddBudget}
            onUpdateBudget={handleUpdateBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        );
      default:
        return null;
    }
  };

  // Show loading state
  if (loadingTransactions || loadingBudgets || loadingCategories) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (errorTransactions || errorBudgets || errorCategories || error) {
    const errorMessage = error || errorTransactions || errorBudgets || errorCategories;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <p className="text-sm text-gray-500">
            Please make sure the backend server is running on http://localhost:3001
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderActiveView()}
      </main>

      <Modal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
          onCancel={closeTransactionModal}
        />
      </Modal>
    </div>
  );
}

export default App;