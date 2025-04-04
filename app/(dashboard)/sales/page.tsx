import { SalesDataTable } from "@/components/sales/sales-data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
        <Button asChild>
          <Link href="/sales/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sale
          </Link>
        </Button>
      </div>
      <SalesDataTable />
    </div>
  )
}

