"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { SalesHeader } from "@/components/sales/sales-header"
import { SalesDateRange } from "@/components/sales/sales-date-range"
import { SalesTable } from "@/components/sales/sales-table"
import { AddSaleForm } from "@/components/sales/add-sale-form"
import { SalesSummary } from "@/components/sales/sales-summary"
import { getSales } from "@/lib/actions"
import type { Sale } from "@/lib/actions"

export default function SalesPage() {
  // Default to current month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  })

  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSales()
  }, [dateRange])

  async function fetchSales() {
    setIsLoading(true)
    const data = await getSales(dateRange?.from, dateRange?.to)
    setSales(data)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <SalesHeader />
      <SalesDateRange dateRange={dateRange} onDateRangeChange={setDateRange} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AddSaleForm onSaleAdded={fetchSales} />
          <div className="mt-6">
            <SalesSummary sales={sales} isLoading={isLoading} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <SalesTable sales={sales} isLoading={isLoading} onSaleUpdated={fetchSales} />
        </div>
      </div>
    </div>
  )
}
