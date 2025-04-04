import { DebtorsDataTable } from "@/components/debtors/debtors-data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { NewDebtorDialog } from "@/components/debtors/new-debtor-dialog"

export default function DebtorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Debtors Management</h1>
        <NewDebtorDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Debtor
          </Button>
        </NewDebtorDialog>
      </div>
      <DebtorsDataTable />
    </div>
  )
}

