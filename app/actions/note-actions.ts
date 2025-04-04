"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getNotes() {
  try {
    return await db.getNotes()
  } catch (error) {
    console.error("Error fetching notes:", error)
    throw new Error("Failed to fetch notes")
  }
}

export async function createNote(content: string) {
  try {
    const id = Date.now().toString()
    const note = await db.createNote({ id, content })
    revalidatePath("/agenda")
    return { success: true, note }
  } catch (error) {
    console.error("Error creating note:", error)
    return { success: false, error: "Failed to create note" }
  }
}

export async function deleteNote(id: string) {
  try {
    await db.deleteNote(id)
    revalidatePath("/agenda")
    return { success: true }
  } catch (error) {
    console.error("Error deleting note:", error)
    return { success: false, error: "Failed to delete note" }
  }
}

