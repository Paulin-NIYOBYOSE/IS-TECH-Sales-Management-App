"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import type { Sale } from "@/lib/actions"

interface SalesSummaryProps {
  sales: Sale[]
  isLoading: boolean
}

export function SalesSummary({ sales, isLoading }: SalesSummaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-24" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate summary statistics
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.amount), 0)
  const paidSales = sales
    .filter((sale) => sale.payment_status === "paid")
    .reduce((sum, sale) => sum + Number(sale.amount), 0)
  const pendingSales = sales
    .filter(
      (sale) =>
        sale.payment_status === "pending" || sale.payment_status === "partial" || sale.payment_status === "overdue",
    )
    .reduce((sum, sale) => sum + Number(sale.amount), 0)
  const totalItems = sales.reduce((sum, sale) => sum + Number(sale.quantity), 0)

  // Calculate percentages
  const paidPercentage = totalSales > 0 ? (paidSales / totalSales) * 100 : 0
  const pendingPercentage = totalSales > 0 ? (pendingSales / totalSales) * 100 : 0

  return (
    <Card className="card-hover card-success">
      <CardHeader className="bg-muted/20">
        <CardTitle>Sales Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Sales</span>
            <span className="font-bold">{formatCurrency(totalSales)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Paid Sales</span>
            <div className="flex flex-col items-end">
              <span className="font-bold text-[var(--success)]">{formatCurrency(paidSales)}</span>
              <span className="text-xs text-muted-foreground">{paidPercentage.toFixed(1)}% of total</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Pending Payments</span>
            <div className="flex flex-col items-end">
              <span className="font-bold text-[var(--warning)]">{formatCurrency(pendingSales)}</span>
              <span className="text-xs text-muted-foreground">{pendingPercentage.toFixed(1)}% of total</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm font-medium">Total Items Sold</span>
            <span className="font-bold">{totalItems} items</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm font-medium">Transactions</span>
            <span className="font-bold">{sales.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
