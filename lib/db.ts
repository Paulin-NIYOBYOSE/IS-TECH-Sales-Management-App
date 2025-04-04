import { Pool } from "pg"

// Create a new pool instance with your local PostgreSQL connection details
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sales_dashboard",
  password: "your_password", // Replace with your actual password
  port: 5432,
})

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err)
  } else {
    console.log("Connected to PostgreSQL at:", res.rows[0].now)
  }
})

// Helper functions for database operations
export const db = {
  // Products
  async getProducts() {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC")
    return result.rows
  },

  async getProduct(id: string) {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id])
    return result.rows[0]
  },

  async createProduct(product: any) {
    const { id, name, category, price, stock, status, description, sku, barcode } = product
    const result = await pool.query(
      "INSERT INTO products (id, name, category, price, stock, status, description, sku, barcode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [id, name, category, price, stock, status, description, sku, barcode],
    )
    return result.rows[0]
  },

  async updateProduct(id: string, updates: any) {
    const { name, category, price, stock, status, description, sku, barcode } = updates
    const result = await pool.query(
      "UPDATE products SET name = $1, category = $2, price = $3, stock = $4, status = $5, description = $6, sku = $7, barcode = $8 WHERE id = $9 RETURNING *",
      [name, category, price, stock, status, description, sku, barcode, id],
    )
    return result.rows[0]
  },

  async deleteProduct(id: string) {
    await pool.query("DELETE FROM products WHERE id = $1", [id])
    return { success: true }
  },

  // Sales
  async getSales() {
    const result = await pool.query("SELECT * FROM sales ORDER BY date DESC")
    return result.rows
  },

  async createSale(sale: any) {
    const {
      id,
      customer,
      email,
      product_id,
      product_name,
      quantity,
      price,
      total,
      date,
      payment_method,
      notes,
      status,
    } = sale
    const result = await pool.query(
      "INSERT INTO sales (id, customer, email, product_id, product_name, quantity, price, total, date, payment_method, notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [id, customer, email, product_id, product_name, quantity, price, total, date, payment_method, notes, status],
    )
    return result.rows[0]
  },

  // Notes
  async getNotes() {
    const result = await pool.query("SELECT * FROM notes ORDER BY created_at DESC")
    return result.rows
  },

  async createNote(note: any) {
    const { id, content } = note
    const result = await pool.query("INSERT INTO notes (id, content) VALUES ($1, $2) RETURNING *", [id, content])
    return result.rows[0]
  },

  async deleteNote(id: string) {
    await pool.query("DELETE FROM notes WHERE id = $1", [id])
    return { success: true }
  },
}

