// backend/src/db/client.ts

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Connection pool — ek saath multiple DB requests handle karne ke liye
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum 20 connections ek saath
})

pool.on('error', (err) => {
  console.error('❌ DB Pool error:', err)
})

// Yahi ek instance poori app mein use karenge
export const db = drizzle(pool, { schema })

// Server start hone pe connection test karo
export async function testDbConnection() {
  try {
    await pool.query('SELECT 1')
    console.log('✅ Database connected!')
  } catch (err) {
    console.error('❌ Database connection failed:', err)
    process.exit(1) // DB nahi toh app band karo
  }
}