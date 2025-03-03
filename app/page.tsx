"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PlusCircle, DollarSign, CreditCard, BarChart3, PieChart, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { MonthlyExpensesChart } from "@/components/monthly-expenses-chart"
import { CategoryExpensesChart } from "@/components/category-expenses-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { CategorySummary } from "@/components/category-summary"
import { BudgetForm } from "@/components/budget-form"
import { BudgetList } from "@/components/budget-list"
import { BudgetVsActualChart } from "@/components/budget-vs-actual-chart"
import { BudgetProgress } from "@/components/budget-progress"
import { SpendingInsights } from "@/components/spending-insights"
import { MonthSelector } from "@/components/month-selector"
import { Transaction, Budget } from "@/lib/types"
import { 
  mockTransactions, 
  mockBudgets, 
  getRecentTransactions, 
  getCurrentMonth,
  getTransactionsByMonth,
  getBudgetVsActualData
} from "@/lib/data"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets)
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth())
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined)
  const [isAddingBudget, setIsAddingBudget] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined)
  
  // Transaction handlers
  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction])
    setIsAddingTransaction(false)
    toast.success("Transaction added successfully")
  }
  
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((t) => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    )
    setEditingTransaction(undefined)
    toast.success("Transaction updated successfully")
  }
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
    toast.success("Transaction deleted successfully")
  }
  
  // Budget handlers
  const handleAddBudget = (budget: Budget) => {
    // Check if a budget for this category and month already exists
    const existingBudget = budgets.find(
      b => b.categoryId === budget.categoryId && b.month === budget.month
    )
    
    if (existingBudget) {
      // Update existing budget instead of creating a new one
      setBudgets(
        budgets.map((b) => 
          b.id === existingBudget.id ? { ...budget, id: existingBudget.id } : b
        )
      )
      toast.success("Budget updated successfully")
    } else {
      // Create new budget
      setBudgets([...budgets, budget])
      toast.success("Budget added successfully")
    }
    
    setIsAddingBudget(false)
  }
  
  const handleUpdateBudget = (updatedBudget: Budget) => {
    setBudgets(
      budgets.map((b) => 
        b.id === updatedBudget.id ? updatedBudget : b
      )
    )
    setEditingBudget(undefined)
    toast.success("Budget updated successfully")
  }
  
  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter((b) => b.id !== id))
    toast.success("Budget deleted successfully")
  }
  
  // Filtered data
  const monthlyTransactions = getTransactionsByMonth(transactions, selectedMonth)
  const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const monthlyExpenses = monthlyTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const recentTransactions = getRecentTransactions(transactions, 5)
  
  // Budget data
  const budgetData = getBudgetVsActualData(transactions, budgets, selectedMonth)
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0)
  const budgetUsedPercentage = totalBudget > 0 
    ? Math.min(100, Math.round((monthlyExpenses / totalBudget) * 100))
    : 0
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Finance Tracker</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddingBudget(true)}
              disabled={isAddingBudget || !!editingBudget}
              variant="outline"
            >
              <Target className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
            <Button 
              onClick={() => setIsAddingTransaction(true)}
              disabled={isAddingTransaction || !!editingTransaction}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {transactions.length} transactions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Transaction
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${transactions.length > 0 
                  ? (totalExpenses / transactions.length).toFixed(2) 
                  : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Budget
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalBudget.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {budgetUsedPercentage}% used this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Categories
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(transactions.map(t => t.categoryId).filter(Boolean)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Used in transactions
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <RecentTransactions transactions={recentTransactions} />
          <CategorySummary transactions={transactions} />
        </div>
        
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            {isAddingTransaction && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Transaction</CardTitle>
                  <CardDescription>
                    Enter the details of your transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionForm 
                    onSubmit={handleAddTransaction}
                    onCancel={() => setIsAddingTransaction(false)}
                  />
                </CardContent>
              </Card>
            )}
            
            {editingTransaction && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Transaction</CardTitle>
                  <CardDescription>
                    Update the details of your transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionForm 
                    transaction={editingTransaction}
                    onSubmit={handleUpdateTransaction}
                    onCancel={() => setEditingTransaction(undefined)}
                  />
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Manage your transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionList 
                  transactions={transactions}
                  onEdit={setEditingTransaction}
                  onDelete={handleDeleteTransaction}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="budgets" className="space-y-4">
            {isAddingBudget && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Budget</CardTitle>
                  <CardDescription>
                    Set a budget for a category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetForm 
                    existingBudgets={budgets}
                    onSubmit={handleAddBudget}
                    onCancel={() => setIsAddingBudget(false)}
                  />
                </CardContent>
              </Card>
            )}
            
            {editingBudget && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Budget</CardTitle>
                  <CardDescription>
                    Update your budget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetForm 
                    budget={editingBudget}
                    existingBudgets={budgets}
                    onSubmit={handleUpdateBudget}
                    onCancel={() => setEditingBudget(undefined)}
                  />
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Budgets</CardTitle>
                <CardDescription>
                  Manage your budgets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetList 
                  budgets={budgets}
                  onEdit={setEditingBudget}
                  onDelete={handleDeleteBudget}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-4 grid gap-4 md:grid-cols-2">
            <MonthlyExpensesChart transactions={transactions} />
            <CategoryExpensesChart transactions={transactions} />
            <div className="md:col-span-2">
              <BudgetVsActualChart 
                transactions={transactions} 
                budgets={budgets}
                month={selectedMonth}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="flex justify-center mb-4">
              <MonthSelector 
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <BudgetProgress 
                transactions={transactions}
                budgets={budgets}
                month={selectedMonth}
              />
              <SpendingInsights 
                transactions={transactions}
                budgets={budgets}
                month={selectedMonth}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}