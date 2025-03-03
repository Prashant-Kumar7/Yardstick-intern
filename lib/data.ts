
import prisma from '@/db';
import { Transaction, Category, Budget } from './types';
import { format, parse, startOfMonth, endOfMonth } from 'date-fns';

// Predefined categories
export const categories: Category[] = [
  { id: 'food', name: 'Food & Dining', color: 'hsl(var(--chart-1))' },
  { id: 'transportation', name: 'Transportation', color: 'hsl(var(--chart-2))' },
  { id: 'utilities', name: 'Utilities', color: 'hsl(var(--chart-3))' },
  { id: 'entertainment', name: 'Entertainment', color: 'hsl(var(--chart-4))' },
  { id: 'shopping', name: 'Shopping', color: 'hsl(var(--chart-5))' },
  { id: 'other', name: 'Other', color: 'hsl(var(--muted-foreground))' },
];



// Mock data for initial development
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 42.50,
    date: new Date('2025-04-01'),
    description: 'Groceries',
    categoryId: 'food',
  },
  {
    id: '2',
    amount: 15.00,
    date: new Date('2025-04-02'),
    description: 'Coffee shop',
    categoryId: 'food',
  },
  {
    id: '3',
    amount: 125.00,
    date: new Date('2025-04-05'),
    description: 'Electricity bill',
    categoryId: 'utilities',
  },
  {
    id: '4',
    amount: 35.99,
    date: new Date('2025-04-10'),
    description: 'Books',
    categoryId: 'entertainment',
  },
  {
    id: '5',
    amount: 80.00,
    date: new Date('2025-04-15'),
    description: 'Dinner',
    categoryId: 'food',
  },
  {
    id: '6',
    amount: 60.00,
    date: new Date('2025-04-18'),
    description: 'Gas',
    categoryId: 'transportation',
  },
  {
    id: '7',
    amount: 120.00,
    date: new Date('2025-04-20'),
    description: 'New clothes',
    categoryId: 'shopping',
  },
];

// Mock budgets
export const mockBudgets: Budget[] = [
  {
    id: '1',
    categoryId: 'food',
    amount: 200,
    month: '2025-04',
  },
  {
    id: '2',
    categoryId: 'transportation',
    amount: 100,
    month: '2025-04',
  },
  {
    id: '3',
    categoryId: 'utilities',
    amount: 150,
    month: '2025-04',
  },
  {
    id: '4',
    categoryId: 'entertainment',
    amount: 50,
    month: '2025-04',
  },
  {
    id: '5',
    categoryId: 'shopping',
    amount: 100,
    month: '2025-04',
  },
];

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Helper function to format month
export const formatMonth = (monthStr: string): string => {
  const date = parse(monthStr, 'yyyy-MM', new Date());
  return format(date, 'MMMM yyyy');
};

// Helper function to get current month in YYYY-MM format
export const getCurrentMonth = (): string => {
  return format(new Date(), 'yyyy-MM');
};

// Helper function to group transactions by month for chart data
export const getMonthlyExpenses = (transactions: Transaction[]) => {
  const monthlyData: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const month = transaction.date.toLocaleString('default', { month: 'short' });
    if (monthlyData[month]) {
      monthlyData[month] += transaction.amount;
    } else {
      monthlyData[month] = transaction.amount;
    }
  });
  
  return Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }));
};

// Helper function to group transactions by category for chart data
export const getCategoryExpenses = (transactions: Transaction[]) => {
  const categoryData: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const categoryId = transaction.categoryId || 'other';
    if (categoryData[categoryId]) {
      categoryData[categoryId] += transaction.amount;
    } else {
      categoryData[categoryId] = transaction.amount;
    }
  });
  
  return Object.entries(categoryData).map(([categoryId, amount]) => {
    const category = categories.find(c => c.id === categoryId) || { 
      id: categoryId, 
      name: 'Other', 
      color: 'hsl(var(--muted-foreground))' 
    };
    
    return {
      id: category.id,
      name: category.name,
      value: amount,
      color: category.color,
    };
  });
};

// Helper function to get category by ID
export const getCategoryById = (categoryId?: string): Category | undefined => {
  if (!categoryId) return undefined;
  return categories.find(category => category.id === categoryId);
};

// Helper function to get recent transactions
export const getRecentTransactions = (transactions: Transaction[], limit: number = 5) => {
  return [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
};

// Helper function to filter transactions by month
export const getTransactionsByMonth = (transactions: Transaction[], month: string): Transaction[] => {
  const startDate = startOfMonth(parse(month, 'yyyy-MM', new Date()));
  const endDate = endOfMonth(parse(month, 'yyyy-MM', new Date()));
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// Helper function to get budget vs actual data for a specific month
export const getBudgetVsActualData = (transactions: Transaction[], budgets: Budget[], month: string) => {
  const monthlyTransactions = getTransactionsByMonth(transactions, month);
  const categoryExpenses = getCategoryExpenses(monthlyTransactions);
  
  return categories.map(category => {
    const budget = budgets.find(b => b.categoryId === category.id && b.month === month);
    const actual = categoryExpenses.find(e => e.id === category.id)?.value || 0;
    const budgetAmount = budget?.amount || 0;
    
    return {
      category: category.name,
      budget: budgetAmount,
      actual,
      color: category.color,
      id: category.id,
      remaining: Math.max(0, budgetAmount - actual),
      overspent: Math.max(0, actual - budgetAmount),
      percentUsed: budgetAmount > 0 ? Math.min(100, Math.round((actual / budgetAmount) * 100)) : 0,
    };
  });
};

// Helper function to get spending insights
export const getSpendingInsights = (transactions: Transaction[], budgets: Budget[], month: string) => {
  const budgetVsActual = getBudgetVsActualData(transactions, budgets, month);
  const insights = [];
  
  // Categories over budget
  const overBudgetCategories = budgetVsActual.filter(item => item.actual > item.budget && item.budget > 0);
  if (overBudgetCategories.length > 0) {
    insights.push({
      type: 'warning',
      message: `You've exceeded your budget in ${overBudgetCategories.length} ${overBudgetCategories.length === 1 ? 'category' : 'categories'}: ${overBudgetCategories.map(c => c.category).join(', ')}.`,
    });
  }
  
  // Categories close to budget (80%+)
  const closeToLimitCategories = budgetVsActual.filter(
    item => item.percentUsed >= 80 && item.percentUsed < 100 && item.budget > 0
  );
  if (closeToLimitCategories.length > 0) {
    insights.push({
      type: 'info',
      message: `You're close to your budget limit in: ${closeToLimitCategories.map(c => c.category).join(', ')}.`,
    });
  }
  
  // Categories with no spending
  const noSpendingCategories = budgetVsActual.filter(item => item.actual === 0 && item.budget > 0);
  if (noSpendingCategories.length > 0) {
    insights.push({
      type: 'success',
      message: `You haven't spent anything in: ${noSpendingCategories.map(c => c.category).join(', ')}.`,
    });
  }
  
  // Categories with low spending (<20%)
  const lowSpendingCategories = budgetVsActual.filter(
    item => item.percentUsed < 20 && item.percentUsed > 0 && item.budget > 0
  );
  if (lowSpendingCategories.length > 0) {
    insights.push({
      type: 'success',
      message: `You're well under budget in: ${lowSpendingCategories.map(c => c.category).join(', ')}.`,
    });
  }
  
  // Total budget status
  const totalBudget = budgetVsActual.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = budgetVsActual.reduce((sum, item) => sum + item.actual, 0);
  const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  
  if (totalBudget > 0) {
    if (totalSpent > totalBudget) {
      insights.push({
        type: 'warning',
        message: `Overall, you've spent ${formatCurrency(totalSpent - totalBudget)} more than your total budget.`,
      });
    } else {
      insights.push({
        type: 'success',
        message: `Overall, you've used ${percentUsed}% of your total budget (${formatCurrency(totalSpent)} of ${formatCurrency(totalBudget)}).`,
      });
    }
  }
  
  return insights;
};

// Helper function to get budget by ID
export const getBudgetById = async( id: string): Promise<Budget | undefined> => {

  const result = await prisma.budget.findUnique({
    where : {
      id : id
    }
  })

  if(!result){
    return undefined
  }

  const response: Budget = {
    id: result.id,
    categoryId: result.categoryId,
    amount: result.amount,
    month: result.month
  }

  return response
};

// Helper function to get budget by category and month
export const getBudgetByCategoryAndMonth = async(
  categoryId: string,
  month: string
): Promise<Budget | undefined> => {

  const result = await prisma.budget.findMany({
    where : {
      categoryId : categoryId,
      month : month
    }
  })

  if(!result){
    return undefined
  }

  return result[0]
};