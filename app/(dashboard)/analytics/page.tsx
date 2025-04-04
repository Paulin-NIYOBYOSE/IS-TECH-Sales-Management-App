import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { AnalyticsFilters } from "@/components/analytics/analytics-filters"
import { YearlySalesChart } from "@/components/analytics/yearly-sales-chart"
import { MonthlySalesChart } from "@/components/analytics/monthly-sales-chart"
import { ProductPerformance } from "@/components/analytics/product-performance"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      <AnalyticsFilters />
      <AnalyticsOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlySalesChart />
        <YearlySalesChart />
      </div>
      <ProductPerformance />
    </div>
  )
}

