"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Budget } from "@/lib/types"
import { formatCurrency, formatMonth, getCategoryById } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

interface BudgetListProps {
  budgets: Budget[]
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}

export function BudgetList({ 
  budgets, 
  onEdit, 
  onDelete 
}: BudgetListProps) {
  const columns: ColumnDef<Budget>[] = [
    {
      accessorKey: "month",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Month
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => formatMonth(row.getValue("month")),
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => {
        const category = getCategoryById(row.getValue("categoryId"));
        if (!category) return "Unknown";
        
        return (
          <Badge 
            variant="outline" 
            style={{ 
              borderColor: category.color,
              color: category.color
            }}
          >
            {category.name}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => formatCurrency(row.getValue("amount")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const budget = row.original
        
        return (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(budget)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(budget.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
  
  return (
    <div>
      <DataTable columns={columns} data={budgets} />
    </div>
  )
}