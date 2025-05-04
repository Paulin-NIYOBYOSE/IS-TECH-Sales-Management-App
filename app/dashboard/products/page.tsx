import { ProductsHeader } from "@/components/products/products-header"
import { ProductsTable } from "@/components/products/products-table"
import { AddProductForm } from "@/components/products/add-product-form"

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ProductsHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AddProductForm />
        </div>
        <div className="lg:col-span-2">
          <ProductsTable />
        </div>
      </div>
    </div>
  )
}
