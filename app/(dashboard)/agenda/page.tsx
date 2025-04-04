import { AgendaList } from "@/components/agenda/agenda-list"

export default function AgendaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Notes & Reminders</h1>
      </div>
      <AgendaList />
    </div>
  )
}

