import { NotesHeader } from "@/components/notes/notes-header"
import { NotesGrid } from "@/components/notes/notes-grid"
import { AddNoteForm } from "@/components/notes/add-note-form"

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-6">
      <NotesHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AddNoteForm />
        </div>
        <div className="lg:col-span-2">
          <NotesGrid />
        </div>
      </div>
    </div>
  )
}
