"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction, Budget } from "@/lib/types"
import { getBudgetVsActualData, formatCurrency, formatMonth } from "@/lib/data"
import { Progress } from "@/components/ui/progress"

interface BudgetProgressProps {
  transactions: Transaction[]
  budgets: Budget[]
  month: string
}

export function BudgetProgress({ 
  transactions, 
  budgets,
  month
}: BudgetProgressProps) {
  const data = getBudgetVsActualData(transactions, budgets, month)
  
  // Filter out categories with no budget
  const filteredData = data.filter(item => item.budget > 0)
  
  // Sort by percentage used (highest first)
  const sortedData = [...filteredData].sort((a, b) => b.percentUsed - a.percentUsed)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>Your spending progress for {formatMonth(month)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedData.length === 0 ? (
            <p className="text-sm text-muted-foreground">No budgets set for this month</p>
          ) : (
            sortedData.map((item) => {
              // Determine color based on percentage
              let progressColor = "hsl(var(--success))";
              if (item.percentUsed >= 100) {
                progressColor = "hsl(var(--destructive))";
              } else if (item.percentUsed >= 80) {
                progressColor = "hsl(var(--warning))";
              }
              
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="text-sm">
                      {formatCurrency(item.actual)} / {formatCurrency(item.budget)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress 
                      value={item.percentUsed} 
                      className="h-2"
                      style={{ 
                        "--progress-background": progressColor 
                      } as React.CSSProperties}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.percentUsed}% used</span>
                      {item.percentUsed >= 100 ? (
                        <span className="text-destructive font-medium">
                          {formatCurrency(item.overspent)} over budget
                        </span>
                      ) : (
                        <span>{formatCurrency(item.remaining)} remaining</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}