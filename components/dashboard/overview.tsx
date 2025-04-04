import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardOverview() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Selling Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Smartphone X Pro</div>
              <p className="text-xs text-muted-foreground">142 units sold this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Good</div>
              <p className="text-xs text-muted-foreground">3 products need restocking</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">Based on 124 reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">2 require immediate attention</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="inventory" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Monitor your inventory levels and restock alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Inventory content will appear here</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="performance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Track your business performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Performance metrics will appear here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

