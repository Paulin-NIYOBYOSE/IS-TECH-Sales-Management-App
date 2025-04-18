-- Update the database schema to support sales functionality

-- Add product_id column to sales table if it doesn't exist
ALTER TABLE sales ADD COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products(id);

-- Update the sales table to include due_date for non-paid sales
ALTER TABLE sales ADD COLUMN IF NOT EXISTS due_date DATE;

-- Create a payments table to track payments for sales and debtors
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  sale_id INTEGER REFERENCES sales(id),
  debtor_id INTEGER REFERENCES debtors(id),
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'cash',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_payment_status ON sales(payment_status);
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_debtors_status ON debtors(status);
CREATE INDEX IF NOT EXISTS idx_debtors_due_date ON debtors(due_date);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);