"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getSales() {
  try {
    return await db.getSales()
  } catch (error) {
    console.error("Error fetching sales:", error)
    throw new Error("Failed to fetch sales")
  }
}

export async function createSale(formData: FormData) {
  try {
    const customer = formData.get("customer") as string
    const email = formData.get("email") as string
    const productId = formData.get("product") as string
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const price = Number.parseFloat(formData.get("price") as string)
    const date = new Date(formData.get("date") as string).toISOString()
    const paymentMethod = formData.get("paymentMethod") as string
    const notes = formData.get("notes") as string

    // Get product details
    const product = await db.getProduct(productId)
    if (!product) {
      return { success: false, error: "Product not found" }
    }

    // Calculate total
    const total = price * quantity

    // Generate a sale ID
    const saleId = `SALE-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`

    // Create the sale
    const sale = await db.createSale({
      id: saleId,
      customer,
      email,
      product_id: productId,
      product_name: product.name,
      quantity,
      price,
      total,
      date,
      payment_method: paymentMethod,
      notes,
      status: "completed",
    })

    // Update product stock
    const newStock = Math.max(0, product.stock - quantity)
    let status: "in-stock" | "low-stock" | "out-of-stock"
    if (newStock === 0) {
      status = "out-of-stock"
    } else if (newStock <= 10) {
      status = "low-stock"
    } else {
      status = "in-stock"
    }

    await db.updateProduct(productId, {
      ...product,
      stock: newStock,
      status,
    })

    revalidatePath("/sales")
    revalidatePath("/products")
    return { success: true, sale }
  } catch (error) {
    console.error("Error creating sale:", error)
    return { success: false, error: "Failed to create sale" }
  }
}

