import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AnalyticsOverview() {
  return (
    <Tabs defaultValue="revenue" className="space-y-4">
      <TabsList>
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="customers">Customers</TabsTrigger>
      </TabsList>
      <TabsContent value="revenue" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$275.92</div>
              <p className="text-xs text-muted-foreground">+12.3% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32.5%</div>
              <p className="text-xs text-muted-foreground">+4.2% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+20.1%</div>
              <p className="text-xs text-muted-foreground">Year-over-year growth</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="products" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Product Analytics</CardTitle>
            <CardDescription>View detailed product performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Product analytics content will appear here</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="customers" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Analytics</CardTitle>
            <CardDescription>View detailed customer behavior metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Customer analytics content will appear here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

