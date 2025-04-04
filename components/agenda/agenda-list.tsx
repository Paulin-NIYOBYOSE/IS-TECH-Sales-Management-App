"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Save, Trash } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getNotes, createNote, deleteNote } from "@/app/actions/note-actions"

interface AgendaListProps {
  className?: string
}

interface Note {
  id: string
  content: string
  created_at: string
}

export function AgendaList({ className }: AgendaListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNotes() {
      try {
        const fetchedNotes = await getNotes()
        setNotes(fetchedNotes)
      } catch (error) {
        console.error("Failed to load notes:", error)
        toast({
          title: "Error",
          description: "Failed to load notes",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [])

  const handleAddNote = async () => {
    if (newNote.trim() === "") return

    const result = await createNote(newNote)

    if (result.success) {
      // Refresh notes
      const updatedNotes = await getNotes()
      setNotes(updatedNotes)

      setNewNote("")
      setIsAdding(false)

      toast({
        title: "Note added",
        description: "Your note has been saved.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add note",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (id: string) => {
    const result = await deleteNote(id)

    if (result.success) {
      // Refresh notes
      const updatedNotes = await getNotes()
      setNotes(updatedNotes)

      toast({
        title: "Note deleted",
        description: "Your note has been removed.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading notes...</div>
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Notes & Reminders</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)} disabled={isAdding}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isAdding && (
            <div className="rounded-lg border p-3">
              <Textarea
                placeholder="Write your note here..."
                className="mb-3 min-h-[100px]"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewNote("")
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddNote}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          )}

          {notes.length === 0 && !isAdding ? (
            <div className="text-center py-8 text-muted-foreground">No notes yet. Click "Add Note" to create one.</div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="flex flex-col space-y-2 rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div className="whitespace-pre-wrap break-words">{note.content}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete note</span>
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

