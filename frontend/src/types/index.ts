export interface Transaction {
  _id?: string;
  id?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Budget {
  _id?: string;
  id?: string;
  category: string;
  amount: number;
  month: string;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}