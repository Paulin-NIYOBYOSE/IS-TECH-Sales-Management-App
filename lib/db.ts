import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configure DNS resolution (critical for Neon)
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000, // Increased timeout
  idleTimeoutMillis: 30000,
  max: 2, // Very conservative for Neon's free tier
  application_name: 'sales-dashboard' // Helps with debugging
});

// Enhanced error handling
pool.on('connect', (client) => {
  console.log('New client connected to pool');
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

// Modified query function with better error handling
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  let client;
  
  try {
    client = await pool.connect();
    console.log(`Executing query (${text.substring(0, 50)}...)`);
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    console.log(`Query completed in ${duration}ms`);
    return result;
  } catch (err) {
    console.error('Query error:', {
      query: text.substring(0, 100),
      params: params ? params.map(p => typeof p) : [],
      error: err
    });
    throw err;
  } finally {
    if (client) {
      try {
        client.release();
      } catch (releaseErr) {
        console.error('Error releasing client:', releaseErr);
      }
    }
  }
}

// Immediate connection test with retry logic
async function testConnectionWithRetry(retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('✅ Neon connection successful:', res.rows[0].now);
      return true;
    } catch (err) {
      console.error(`❌ Connection attempt ${i + 1} failed:`, err);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  return false;
}

// Run the connection test when the module loads
testConnectionWithRetry().then(success => {
  if (!success) {
    console.error('Failed to establish database connection after retries');
  }
});