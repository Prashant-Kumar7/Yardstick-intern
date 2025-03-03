export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
}

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  categoryId?: string;
}

export type TransactionFormData = Omit<Transaction, 'id' | 'date'> & {
  date: string;
};

export type BudgetFormData = Omit<Budget, 'id'>;