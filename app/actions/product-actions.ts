"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getProducts() {
  try {
    return await db.getProducts()
  } catch (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const stock = Number.parseInt(formData.get("stock") as string)
    const description = formData.get("description") as string
    const sku = formData.get("sku") as string
    const barcode = formData.get("barcode") as string

    // Determine status based on stock
    let status: "in-stock" | "low-stock" | "out-of-stock"
    if (stock === 0) {
      status = "out-of-stock"
    } else if (stock <= 10) {
      status = "low-stock"
    } else {
      status = "in-stock"
    }

    // Generate a product ID
    const productId = `PROD-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`

    const product = await db.createProduct({
      id: productId,
      name,
      category,
      price,
      stock,
      status,
      description,
      sku,
      barcode,
    })

    revalidatePath("/products")
    return { success: true, product }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, error: "Failed to create product" }
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.deleteProduct(id)
    revalidatePath("/products")
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}

