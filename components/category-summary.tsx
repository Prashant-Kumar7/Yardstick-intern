"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction } from "@/lib/types"
import { getCategoryExpenses, formatCurrency } from "@/lib/data"
import { Progress } from "@/components/ui/progress"

interface CategorySummaryProps {
  transactions: Transaction[]
}

export function CategorySummary({ transactions }: CategorySummaryProps) {
  const categoryData = getCategoryExpenses(transactions)
  const totalExpenses = categoryData.reduce((sum, category) => sum + category.value, 0)
  
  // Sort categories by value (highest first)
  const sortedCategories = [...categoryData].sort((a, b) => b.value - a.value)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Your spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCategories.map((category) => {
            const percentage = totalExpenses > 0 
              ? Math.round((category.value / totalExpenses) * 100) 
              : 0
              
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatCurrency(category.value)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                  style={{ 
                    "--progress-background": category.color 
                  } as React.CSSProperties}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}