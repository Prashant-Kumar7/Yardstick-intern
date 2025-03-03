// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  await prisma.category.createMany({
    data: [
      { id: 'food', name: 'Food & Dining', color: 'hsl(var(--chart-1))' },
      { id: 'transportation', name: 'Transportation', color: 'hsl(var(--chart-2))' },
      { id: 'utilities', name: 'Utilities', color: 'hsl(var(--chart-3))' },
      { id: 'entertainment', name: 'Entertainment', color: 'hsl(var(--chart-4))' },
      { id: 'shopping', name: 'Shopping', color: 'hsl(var(--chart-5))' },
      { id: 'other', name: 'Other', color: 'hsl(var(--muted-foreground))' },
    ],
  });

  // Seed transactions
  await prisma.transaction.createMany({
    data: [
      { id: '1', amount: 42.50, date: new Date('2025-04-01'), description: 'Groceries', categoryId: 'food' },
      { id: '2', amount: 15.00, date: new Date('2025-04-02'), description: 'Coffee shop', categoryId: 'food' },
      { id: '3', amount: 125.00, date: new Date('2025-04-05'), description: 'Electricity bill', categoryId: 'utilities' },
      { id: '4', amount: 35.99, date: new Date('2025-04-10'), description: 'Books', categoryId: 'entertainment' },
      { id: '5', amount: 80.00, date: new Date('2025-04-15'), description: 'Dinner', categoryId: 'food' },
      { id: '6', amount: 60.00, date: new Date('2025-04-18'), description: 'Gas', categoryId: 'transportation' },
      { id: '7', amount: 120.00, date: new Date('2025-04-20'), description: 'New clothes', categoryId: 'shopping' },
    ],
  });

  // Seed budgets
  await prisma.budget.createMany({
    data: [
      { id: '1', categoryId: 'food', amount: 200, month: '2025-04' },
      { id: '2', categoryId: 'transportation', amount: 100, month: '2025-04' },
      { id: '3', categoryId: 'utilities', amount: 150, month: '2025-04' },
      { id: '4', categoryId: 'entertainment', amount: 50, month: '2025-04' },
      { id: '5', categoryId: 'shopping', amount: 100, month: '2025-04' },
    ],
  });

  console.log('Database has been seeded!');
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
