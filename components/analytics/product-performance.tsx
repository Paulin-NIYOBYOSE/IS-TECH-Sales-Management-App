import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function ProductPerformance() {
  const products = [
    {
      name: "Smartphone X Pro",
      category: "Smartphones",
      sales: 142,
      revenue: 184599.58,
      growth: 12.5,
      status: "trending",
    },
    {
      name: "Laptop Pro",
      category: "Laptops",
      sales: 89,
      revenue: 169099.11,
      growth: 8.3,
      status: "stable",
    },
    {
      name: "Wireless Headphones",
      category: "Audio",
      sales: 156,
      revenue: 38999.44,
      growth: 24.7,
      status: "trending",
    },
    {
      name: "Smart Watch",
      category: "Wearables",
      sales: 112,
      revenue: 44799.88,
      growth: 15.2,
      status: "trending",
    },
    {
      name: "Bluetooth Speaker",
      category: "Audio",
      sales: 98,
      revenue: 12739.02,
      growth: -3.8,
      status: "declining",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
        <CardDescription>Top performing products by sales and revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Growth</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.name}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">{product.sales}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(product.revenue)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={product.growth >= 0 ? "text-green-500" : "text-red-500"}>
                    {product.growth >= 0 ? "+" : ""}
                    {product.growth}%
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "trending"
                        ? "success"
                        : product.status === "stable"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

