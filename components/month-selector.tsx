"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatMonth } from "@/lib/data"

interface MonthSelectorProps {
  month: string
  onMonthChange: (month: string) => void
}

export function MonthSelector({ month, onMonthChange }: MonthSelectorProps) {
  const changeMonth = (direction: 'prev' | 'next') => {
    const [year, monthNum] = month.split('-').map(Number);
    let newMonth: number;
    let newYear: number;
    
    if (direction === 'prev') {
      newMonth = monthNum - 1;
      newYear = year;
      if (newMonth < 1) {
        newMonth = 12;
        newYear = year - 1;
      }
    } else {
      newMonth = monthNum + 1;
      newYear = year;
      if (newMonth > 12) {
        newMonth = 1;
        newYear = year + 1;
      }
    }
    
    const formattedMonth = newMonth.toString().padStart(2, '0');
    onMonthChange(`${newYear}-${formattedMonth}`);
  };
  
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="icon"
        onClick={() => changeMonth('prev')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-lg font-semibold">{formatMonth(month)}</h2>
      <Button
        variant="outline"
        size="icon"
        onClick={() => changeMonth('next')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}