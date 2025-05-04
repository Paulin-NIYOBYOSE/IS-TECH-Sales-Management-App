import { Pool } from "pg"
import dotenv from "dotenv"
dotenv.config()

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Function to initialize the database (create tables, etc.)
export async function initializeDatabase() {
  try {
    // Example query to initialize a table (you can add more as needed)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      )
    `)
    console.log("Database initialized successfully.")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}
