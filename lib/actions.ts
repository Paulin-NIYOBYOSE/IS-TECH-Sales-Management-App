"use server"

import { revalidatePath } from "next/cache"
import { query } from "@/lib/db"
import { getPreviousPeriod } from "@/lib/utils"

// Types
export type Product = {
  id: number
  name: string
  unit_price: number
  quantity: number
  total_price: number
  purchase_date: Date
  category: string
}

export type Sale = {
  id: number
  customer_name: string
  product_name: string
  product_id: number
  quantity: number
  amount: number
  cost_price: number
  profit: number
  sale_date: Date
  payment_status: string
  due_date?: Date
}

export type Debtor = {
  id: number
  customer_name: string
  product: string
  amount: number
  due_date: Date
  status: string
}

export type Expense = {
  id: number
  description: string
  amount: number
  expense_date: Date
  category: string
}

export type Note = {
  id: number
  title: string
  content: string
  priority: string
  created_at: Date
}

export type DashboardStats = {
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  productsSold: number
  activeDebtors: number
  revenueChange: number
  expensesChange: number
  profitChange: number
  productsSoldChange: number
  debtorsChange: number
}

export type ChartData = {
  name: string
  sales: number
  expenses: number
  profit: number
}

// Product actions
export async function getProducts() {
  try {
    const result = await query("SELECT * FROM products ORDER BY purchase_date DESC")
    return result.rows as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const unitPrice = Number.parseFloat(formData.get("unitPrice") as string)
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const purchaseDate = new Date(formData.get("date") as string)
    const category = formData.get("category") as string
    const totalPrice = unitPrice * quantity

    await query(
      "INSERT INTO products (name, unit_price, quantity, total_price, purchase_date, category) VALUES ($1, $2, $3, $4, $5, $6)",
      [name, unitPrice, quantity, totalPrice, purchaseDate.toISOString().split("T")[0], category],
    )

    revalidatePath("/dashboard/products")
    return { success: true }
  } catch (error) {
    console.error("Error adding product:", error)
    return { success: false, error: "Failed to add product" }
  }
}

// Sales actions
export async function getSales(from?: Date, to?: Date) {
  try {
    let queryText = "SELECT * FROM sales"
    let params: any[] = []

    if (from && to) {
      queryText += " WHERE sale_date BETWEEN $1 AND $2"
      params = [from.toISOString().split("T")[0], to.toISOString().split("T")[0]]
    } else if (from) {
      queryText += " WHERE sale_date >= $1"
      params = [from.toISOString().split("T")[0]]
    } else if (to) {
      queryText += " WHERE sale_date <= $1"
      params = [to.toISOString().split("T")[0]]
    }

    queryText += " ORDER BY sale_date DESC"

    const result = await query(queryText, params)
    return result.rows as Sale[]
  } catch (error) {
    console.error("Error fetching sales:", error)
    return []
  }
}

export async function getRecentSales() {
  try {
    const result = await query("SELECT * FROM sales ORDER BY sale_date DESC LIMIT 5")
    return result.rows as Sale[]
  } catch (error) {
    console.error("Error fetching recent sales:", error)
    return []
  }
}

export async function addSale(formData: FormData) {
  try {
    const customerName = formData.get("customerName") as string;
    const productId = Number.parseInt(formData.get("productId") as string);
    const quantity = Number.parseInt(formData.get("quantity") as string);
    const amount = Number.parseFloat(formData.get("amount") as string);
    const saleDate = new Date(formData.get("saleDate") as string);
    const paymentStatus = formData.get("paymentStatus") as string;

    // Get product details to calculate cost price and profit
    const productResult = await query("SELECT name, unit_price FROM products WHERE id = $1", [productId]);
    if (productResult.rows.length === 0) {
      throw new Error("Product not found");
    }
    
    const product = productResult.rows[0];
    const costPrice = product.unit_price * quantity;
    const profit = amount - costPrice;

    // Update product quantity (reduce stock)
    await query("UPDATE products SET quantity = quantity - $1 WHERE id = $2", [quantity, productId]);

    // Insert sale record with all required fields
    await query(
      `INSERT INTO sales (
        customer_name, 
        product_id, 
        product_name,
        quantity, 
        amount, 
        cost_price,
        profit,
        sale_date, 
        payment_status,
        due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        customerName,
        productId,
        product.name,
        quantity,
        amount,
        costPrice,
        profit,
        saleDate.toISOString().split("T")[0],
        paymentStatus,
        paymentStatus !== "paid" 
          ? formData.get("dueDate") 
            ? new Date(formData.get("dueDate") as string).toISOString().split("T")[0]
            : new Date(saleDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : null
      ]
    );

    // If payment status is not paid, add to debtors
    if (paymentStatus !== "paid") {
      await query(
        "INSERT INTO debtors (customer_name, product, amount, due_date, status) VALUES ($1, $2, $3, $4, $5)",
        [
          customerName, 
          `${product.name} (${quantity})`, 
          amount, 
          formData.get("dueDate") 
            ? new Date(formData.get("dueDate") as string).toISOString().split("T")[0]
            : new Date(saleDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          paymentStatus
        ]
      );
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/sales");
    return { success: true };
  } catch (error) {
    console.error("Error adding sale:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add sale" 
    };
  }
}

export async function updateSaleStatus(id: number, status: string) {
  try {
    // Update sale status
    await query("UPDATE sales SET payment_status = $1 WHERE id = $2", [status, id])

    // If marking as paid, also update any related debtor records
    if (status === "paid") {
      const saleResult = await query("SELECT customer_name, product_name, quantity FROM sales WHERE id = $1", [id])
      const sale = saleResult.rows[0]

      if (sale) {
        await query("UPDATE debtors SET status = 'paid' WHERE customer_name = $1 AND product LIKE $2", [
          sale.customer_name,
          `${sale.product_name} (${sale.quantity})`,
        ])
      }
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/sales")
    revalidatePath("/dashboard/debtors")
    return { success: true }
  } catch (error) {
    console.error("Error updating sale status:", error)
    return { success: false, error: "Failed to update sale status" }
  }
}

// Debtors actions
export async function getRecentDebtors() {
  try {
    const result = await query("SELECT * FROM debtors WHERE status != 'paid' ORDER BY due_date ASC LIMIT 5")
    return result.rows as Debtor[]
  } catch (error) {
    console.error("Error fetching recent debtors:", error)
    return []
  }
}

export async function getAllDebtors() {
  try {
    const result = await query("SELECT * FROM debtors ORDER BY due_date ASC")
    return result.rows as Debtor[]
  } catch (error) {
    console.error("Error fetching all debtors:", error)
    return []
  }
}

export async function addDebtor(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const product = formData.get("product") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const dueDate = new Date(formData.get("dueDate") as string)

    await query("INSERT INTO debtors (customer_name, product, amount, due_date, status) VALUES ($1, $2, $3, $4, $5)", [
      name,
      product,
      amount,
      dueDate.toISOString().split("T")[0],
      "pending",
    ])

    revalidatePath("/dashboard/debtors")
    return { success: true }
  } catch (error) {
    console.error("Error adding debtor:", error)
    return { success: false, error: "Failed to add debtor" }
  }
}

export async function markDebtorAsPaid(id: number) {
  try {
    await query("UPDATE debtors SET status = $1 WHERE id = $2", ["paid", id])

    // Get the debtor details
    const debtorResult = await query("SELECT * FROM debtors WHERE id = $1", [id])
    const debtor = debtorResult.rows[0]

    // Add payment record
    await query("INSERT INTO payments (debtor_id, amount, payment_date) VALUES ($1, $2, $3)", [
      id,
      debtor.amount,
      new Date().toISOString().split("T")[0],
    ])

    revalidatePath("/dashboard/debtors")
    return { success: true }
  } catch (error) {
    console.error("Error marking debtor as paid:", error)
    return { success: false, error: "Failed to update debtor status" }
  }
}

// Expenses actions
export async function addExpense(formData: FormData) {
  try {
    const description = formData.get("description") as string
    const amount = Number.parseFloat(formData.get("amount") as string)
    const expenseDate = new Date(formData.get("expenseDate") as string)
    const category = formData.get("category") as string

    await query("INSERT INTO expenses (description, amount, expense_date, category) VALUES ($1, $2, $3, $4)", [
      description,
      amount,
      expenseDate.toISOString().split("T")[0],
      category,
    ])

    revalidatePath("/dashboard/analysis")
    return { success: true }
  } catch (error) {
    console.error("Error adding expense:", error)
    return { success: false, error: "Failed to add expense" }
  }
}

export async function getExpenses(from?: Date, to?: Date) {
  try {
    let queryText = "SELECT * FROM expenses"
    let params: any[] = []

    if (from && to) {
      queryText += " WHERE expense_date BETWEEN $1 AND $2"
      params = [from.toISOString().split("T")[0], to.toISOString().split("T")[0]]
    } else if (from) {
      queryText += " WHERE expense_date >= $1"
      params = [from.toISOString().split("T")[0]]
    } else if (to) {
      queryText += " WHERE expense_date <= $1"
      params = [to.toISOString().split("T")[0]]
    }

    queryText += " ORDER BY expense_date DESC"

    const result = await query(queryText, params)
    return result.rows as Expense[]
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return []
  }
}

// Notes actions
export async function getNotes() {
  try {
    const result = await query("SELECT * FROM notes ORDER BY created_at DESC")
    return result.rows as Note[]
  } catch (error) {
    console.error("Error fetching notes:", error)
    return []
  }
}

export async function addNote(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const priority = formData.get("priority") as string

    await query("INSERT INTO notes (title, content, priority) VALUES ($1, $2, $3)", [title, content, priority])

    revalidatePath("/dashboard/notes")
    return { success: true }
  } catch (error) {
    console.error("Error adding note:", error)
    return { success: false, error: "Failed to add note" }
  }
}

export async function deleteNote(id: number) {
  try {
    await query("DELETE FROM notes WHERE id = $1", [id])
    revalidatePath("/dashboard/notes")
    return { success: true }
  } catch (error) {
    console.error("Error deleting note:", error)
    return { success: false, error: "Failed to delete note" }
  }
}

// Dashboard statistics
export async function getDashboardStats(from?: Date, to?: Date) {
  try {
    // Default to current month if no dates provided
    if (!from && !to) {
      const now = new Date()
      from = new Date(now.getFullYear(), now.getMonth(), 1)
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }

    // Get previous period for comparison
    const { from: prevFrom, to: prevTo } = getPreviousPeriod(from!, to!)

    // Current period stats
    const totalRevenue = await getTotalSales(from, to)
    const totalExpenses = await getTotalExpenses(from, to)
    const totalProfit = await getTotalProfit(from, to)
    const productsSold = await getProductsSold(from, to)
    const activeDebtors = await getActiveDebtorsCount()

    // Previous period stats for comparison
    const prevTotalRevenue = await getTotalSales(prevFrom, prevTo)
    const prevTotalExpenses = await getTotalExpenses(prevFrom, prevTo)
    const prevTotalProfit = await getTotalProfit(prevFrom, prevTo)
    const prevProductsSold = await getProductsSold(prevFrom, prevTo)
    const prevActiveDebtors = await getActiveDebtorsCount(prevTo)

    // Calculate percentage changes
    const revenueChange = calculatePercentageChange(totalRevenue, prevTotalRevenue)
    const expensesChange = calculatePercentageChange(totalExpenses, prevTotalExpenses)
    const profitChange = calculatePercentageChange(totalProfit, prevTotalProfit)
    const productsSoldChange = calculatePercentageChange(productsSold, prevProductsSold)
    const debtorsChange = calculatePercentageChange(activeDebtors, prevActiveDebtors)

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      productsSold,
      activeDebtors,
      revenueChange,
      expensesChange,
      profitChange,
      productsSoldChange,
      debtorsChange,
    } as DashboardStats
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      totalProfit: 0,
      productsSold: 0,
      activeDebtors: 0,
      revenueChange: 0,
      expensesChange: 0,
      profitChange: 0,
      productsSoldChange: 0,
      debtorsChange: 0,
    } as DashboardStats
  }
}

// Helper function to calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return ((current - previous) / Math.abs(previous)) * 100
}

// Get total sales amount (revenue)
async function getTotalSales(from?: Date, to?: Date) {
  try {
    let queryText = "SELECT COALESCE(SUM(amount), 0) as total FROM sales WHERE payment_status = 'paid'"
    let params: any[] = []

    if (from && to) {
      queryText += " AND sale_date BETWEEN $1 AND $2"
      params = [from.toISOString().split("T")[0], to.toISOString().split("T")[0]]
    } else if (from) {
      queryText += " AND sale_date >= $1"
      params = [from.toISOString().split("T")[0]]
    } else if (to) {
      queryText += " AND sale_date <= $1"
      params = [to.toISOString().split("T")[0]]
    }

    const result = await query(queryText, params)
    return Number.parseFloat(result.rows[0].total) || 0
  } catch (error) {
    console.error("Error getting total sales:", error)
    return 0
  }
}

// Get total profit (revenue - cost)
async function getTotalProfit(from?: Date, to?: Date) {
  try {
    let queryText = "SELECT COALESCE(SUM(profit), 0) as total FROM sales WHERE payment_status = 'paid'"
    let params: any[] = []

    if (from && to) {
      queryText += " AND sale_date BETWEEN $1 AND $2"
      params = [from.toISOString().split("T")[0], to.toISOString().split("T")[0]]
    } else if (from) {
      queryText += " AND sale_date >= $1"
      params = [from.toISOString().split("T")[0]]
    } else if (to) {
      queryText += " AND sale_date <= $1"
      params = [to.toISOString().split("T")[0]]
    }

    const result = await query(queryText, params)
    return Number.parseFloat(result.rows[0].total) || 0
  } catch (error) {
    console.error("Error getting total profit:", error)
    return 0
  }
}

async function getTotalExpenses(from?: Date, to?: Date) {
  try {
    // Get expenses from expenses table
    let expensesQuery = "SELECT COALESCE(SUM(amount), 0) as total FROM expenses";
    let expensesParams: any[] = [];

    // Get product costs from products table (inventory purchases)
    let productsQuery = "SELECT COALESCE(SUM(total_price), 0) as total FROM products";
    let productsParams: any[] = [];

    // Add date filters if provided
    if (from && to) {
      expensesQuery += " WHERE expense_date BETWEEN $1 AND $2";
      expensesParams = [from.toISOString().split("T")[0], to.toISOString().split("T")[0]];
      
      productsQuery += " WHERE purchase_date BETWEEN $1 AND $2";
      productsParams = [from.toISOString().split("T")[0], to.toISOString().split("T")[0]];
    } else if (from) {
      expensesQuery += " WHERE expense_date >= $1";
      expensesParams = [from.toISOString().split("T")[0]];
      
      productsQuery += " WHERE purchase_date >= $1";
      productsParams = [from.toISOString().split("T")[0]];
    } else if (to) {
      expensesQuery += " WHERE expense_date <= $1";
      expensesParams = [to.toISOString().split("T")[0]];
      
      productsQuery += " WHERE purchase_date <= $1";
      productsParams = [to.toISOString().split("T")[0]];
    }

    // Execute both queries
    const expensesResult = await query(expensesQuery, expensesParams);
    const productsResult = await query(productsQuery, productsParams);

    // Sum both totals
    const expensesTotal = Number.parseFloat(expensesResult.rows[0].total) || 0;
    const productsTotal = Number.parseFloat(productsResult.rows[0].total) || 0;

    return expensesTotal + productsTotal;
  } catch (error) {
    console.error("Error getting total expenses:", error);
    return 0;
  }
}

async function getProductsSold(from?: Date, to?: Date) {
  try {
    let queryText = "SELECT COALESCE(SUM(quantity), 0) as total FROM sales"
    let params: any[] = []

    if (from && to) {
      queryText += " WHERE sale_date BETWEEN $1 AND $2"
      params = [from.toISOString().split("T")[0], to.toISOString().split("T")[0]]
    } else if (from) {
      queryText += " WHERE sale_date >= $1"
      params = [from.toISOString().split("T")[0]]
    } else if (to) {
      queryText += " WHERE sale_date <= $1"
      params = [to.toISOString().split("T")[0]]
    }

    const result = await query(queryText, params)
    return Number.parseInt(result.rows[0].total) || 0
  } catch (error) {
    console.error("Error getting products sold:", error)
    return 0
  }
}

async function getActiveDebtorsCount(asOfDate?: Date) {
  try {
    let queryText = "SELECT COUNT(*) as count FROM debtors WHERE status != 'paid'"
    let params: any[] = []

    if (asOfDate) {
      queryText += " AND due_date <= $1"
      params = [asOfDate.toISOString().split("T")[0]]
    }

    const result = await query(queryText, params)
    return Number.parseInt(result.rows[0].count) || 0
  } catch (error) {
    console.error("Error getting active debtors count:", error)
    return 0
  }
}

// Chart data
export async function getChartData(from?: Date, to?: Date, groupBy: "day" | "week" | "month" = "day") {
  try {
    // Default to last 7 days if no dates provided
    if (!from && !to) {
      to = new Date();
      from = new Date();
      from.setDate(from.getDate() - 7);
    }

    let timeFormat: string;
    let groupByClause: string;

    switch (groupBy) {
      case "week":
        timeFormat = "YYYY-WW";
        groupByClause = "TO_CHAR(date, 'YYYY-WW')";
        break;
      case "month":
        timeFormat = "YYYY-MM";
        groupByClause = "TO_CHAR(date, 'YYYY-MM')";
        break;
      default:
        timeFormat = "YYYY-MM-DD";
        groupByClause = "TO_CHAR(date, 'YYYY-MM-DD')";
    }

    // Combined query for sales and expenses
    const combinedQuery = `
      WITH sales_data AS (
        SELECT 
          sale_date as date,
          SUM(amount) as sales,
          SUM(profit) as profit,
          0 as expenses
        FROM sales
        WHERE sale_date BETWEEN $1 AND $2 AND payment_status = 'paid'
        GROUP BY date
      ),
      expenses_data AS (
        SELECT 
          expense_date as date,
          0 as sales,
          0 as profit,
          SUM(amount) as expenses
        FROM expenses
        WHERE expense_date BETWEEN $1 AND $2
        GROUP BY date
        
        UNION ALL
        
        SELECT 
          purchase_date as date,
          0 as sales,
          0 as profit,
          SUM(total_price) as expenses
        FROM products
        WHERE purchase_date BETWEEN $1 AND $2
        GROUP BY date
      ),
      combined AS (
        SELECT * FROM sales_data
        UNION ALL
        SELECT * FROM expenses_data
      )
      SELECT 
        ${groupByClause} as time_period,
        SUM(sales) as sales,
        SUM(expenses) as expenses,
        SUM(profit) as profit
      FROM combined
      GROUP BY time_period
      ORDER BY time_period
    `;

    const result = await query(combinedQuery, [
      (from ?? new Date()).toISOString().split("T")[0],
      (to ?? new Date()).toISOString().split("T")[0],
    ]);

    // Format the data
    const chartData = result.rows.map((row) => ({
      name: formatPeriodName(row.time_period, groupBy),
      sales: Number.parseFloat(row.sales) || 0,
      expenses: Number.parseFloat(row.expenses) || 0,
      profit: Number.parseFloat(row.profit) || 0,
    }));

    return chartData as ChartData[];
  } catch (error) {
    console.error("Error getting chart data:", error);
    return [];
  }
}

function formatPeriodName(period: string, groupBy: "day" | "week" | "month"): string {
  switch (groupBy) {
    case "week":
      const [year, week] = period.split("-")
      return `Week ${week}`
    case "month":
      const [yearMonth, monthNum] = period.split("-")
      const monthDate = new Date(Number.parseInt(yearMonth), Number.parseInt(monthNum) - 1, 1)
      return new Intl.DateTimeFormat("en-US", { month: "short" }).format(monthDate)
    default:
      const date = new Date(period)
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
  }
}
