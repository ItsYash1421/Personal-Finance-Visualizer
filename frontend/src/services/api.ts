const API_BASE_URL = import.meta.env.VITE_API_URL;
export interface Transaction {
  _id?: string;
  id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
}

export interface Budget {
  _id?: string;
  id?: string;
  categoryId: string;
  amount: number;
  month: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface MonthlyStats {
  _id: string;
  total: number;
  count: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Transaction APIs
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transactions');
  }

  async getTransactionsByMonth(month: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions/month/${month}`);
  }

  async createTransaction(transaction: Omit<Transaction, '_id' | 'id'>): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getTransactionStats(month: string): Promise<MonthlyStats[]> {
    return this.request<MonthlyStats[]>(`/transactions/stats/monthly?month=${month}`);
  }

  // Budget APIs
  async getBudgets(): Promise<Budget[]> {
    return this.request<Budget[]>('/budgets');
  }

  async getBudgetsByMonth(month: string): Promise<Budget[]> {
    return this.request<Budget[]>(`/budgets/month/${month}`);
  }

  async createBudget(budget: Omit<Budget, '_id' | 'id'>): Promise<Budget> {
    return this.request<Budget>('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  }

  async updateBudget(id: string, budget: Partial<Budget>): Promise<Budget> {
    return this.request<Budget>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budget),
    });
  }

  async deleteBudget(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Category APIs
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }
}

export const apiService = new ApiService(); 
