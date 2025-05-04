import { DebtorsHeader } from "@/components/debtors/debtors-header"
import { DebtorsTable } from "@/components/debtors/debtors-table"
import { AddDebtorForm } from "@/components/debtors/add-debtor-form"

export default function DebtorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DebtorsHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AddDebtorForm />
        </div>
        <div className="lg:col-span-2">
          <DebtorsTable />
        </div>
      </div>
    </div>
  )
}
