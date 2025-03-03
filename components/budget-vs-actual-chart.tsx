"use client"

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction, Budget } from "@/lib/types"
import { getBudgetVsActualData, formatCurrency, formatMonth } from "@/lib/data"

interface BudgetVsActualChartProps {
  transactions: Transaction[]
  budgets: Budget[]
  month: string
}

export function BudgetVsActualChart({ 
  transactions, 
  budgets,
  month
}: BudgetVsActualChartProps) {
  const data = getBudgetVsActualData(transactions, budgets, month)
  
  // Filter out categories with no budget and no spending
  const filteredData = data.filter(item => item.budget > 0 || item.actual > 0)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual</CardTitle>
        <CardDescription>Comparing your spending to your budget for {formatMonth(month)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value, name) => [formatCurrency(value as number), name]}
              />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="hsl(var(--muted))" />
              <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-1))" />
              <ReferenceLine y={0} stroke="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}