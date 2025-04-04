import { DashboardOverview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <DashboardCards />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <SalesChart className="md:col-span-2 lg:col-span-4" />
        <RecentSales className="md:col-span-2 lg:col-span-3" />
      </div>
      <DashboardOverview />
    </div>
  )
}

