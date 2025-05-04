"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { getNotes, deleteNote } from "@/lib/actions"
import { formatDate } from "@/lib/utils"
import type { Note } from "@/lib/actions"

export function NotesGrid() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    setIsLoading(true)
    const data = await getNotes()
    setNotes(data)
    setIsLoading(false)
  }

  async function handleDeleteNote(id: number) {
    setDeletingId(id)
    const result = await deleteNote(id)

    if (result.success) {
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully",
      })
      fetchNotes()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete note",
        variant: "destructive",
      })
    }

    setDeletingId(null)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {notes.length > 0 ? (
        notes.map((note) => (
          <Card key={note.id} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{note.title}</CardTitle>
                <Badge
                  variant="outline"
                  className={
                    note.priority === "high"
                      ? "text-rose-500 border-rose-500"
                      : note.priority === "medium"
                        ? "text-amber-500 border-amber-500"
                        : "text-emerald-500 border-emerald-500"
                  }
                >
                  {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)}
                </Badge>
              </div>
              <CardDescription>Created on {formatDate(note.created_at)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{note.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteNote(note.id)}
                disabled={deletingId === note.id}
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete note</span>
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card className="col-span-full p-6 text-center">
          <p className="text-muted-foreground">No notes found. Add some notes to get started.</p>
        </Card>
      )}
    </div>
  )
}
