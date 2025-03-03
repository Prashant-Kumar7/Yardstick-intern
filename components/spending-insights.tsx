"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction, Budget } from "@/lib/types"
import { getSpendingInsights, formatMonth } from "@/lib/data"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

interface SpendingInsightsProps {
  transactions: Transaction[]
  budgets: Budget[]
  month: string
}

export function SpendingInsights({ 
  transactions, 
  budgets,
  month
}: SpendingInsightsProps) {
  const insights = getSpendingInsights(transactions, budgets, month)
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>Analysis of your spending for {formatMonth(month)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <p className="text-sm text-muted-foreground">No insights available. Try setting some budgets first.</p>
          ) : (
            insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                {getIcon(insight.type)}
                <p className="text-sm">{insight.message}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}