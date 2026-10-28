/**
 * SmartStation - Sample Database Queries Runner
 * Demonstrates both SQL Relational Queries and MongoDB NoSQL Queries
 * Run with: node scripts/run_sample_queries.js
 */

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { MongoClient } = require('mongodb');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim();
      env[k] = v;
      if (!process.env[k]) process.env[k] = v;
    }
  }
  return env;
}

async function run() {
  console.log('\n================================================================');
  console.log('   SmartStation - Relational SQL & MongoDB Query Demonstrator   ');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // PART 1: RELATIONAL SQL QUERIES (SQLite / MySQL)
  // -------------------------------------------------------------
  console.log('🔹 [PART 1: SQL DATABASE QUERIES (data/smartstation.sqlite)]');
  const sqliteDbPath = path.join(__dirname, '..', 'data', 'smartstation.sqlite');
  if (!fs.existsSync(sqliteDbPath)) {
    console.error('❌ Could not find data/smartstation.sqlite. Run `node scripts/generate_and_seed_sql.js` first.');
    return;
  }

  const sqlDb = new DatabaseSync(sqliteDbPath);

  console.log('\n📌 SQL Query 1: Top 5 Highest-Rated Products (Rating >= 4.5)');
  const q1 = sqlDb.prepare(`
    SELECT id, name, brand_name, price, stock, rating, review_count
    FROM products
    WHERE rating >= 4.5
    ORDER BY rating DESC, review_count DESC
    LIMIT 5;
  `).all();
  console.table(q1);

  console.log('\n📌 SQL Query 2: Low-Stock Inventory Restock Alerts (stock <= low_stock_threshold)');
  const q2 = sqlDb.prepare(`
    SELECT id, name, sku, stock, low_stock_threshold,
           (low_stock_threshold - stock) AS units_shortage
    FROM products
    WHERE stock <= low_stock_threshold
    ORDER BY stock ASC;
  `).all();
  console.table(q2);

  console.log('\n📌 SQL Query 3: Multi-Table JOIN (Orders + Order Items + Users)');
  const q3 = sqlDb.prepare(`
    SELECT o.order_number, o.customer_name, o.final_total, o.order_status,
           i.product_name, i.quantity, i.unit_price, i.subtotal
    FROM orders o
    JOIN order_items i ON o.id = i.order_id
    WHERE o.order_status != 'cancelled'
    ORDER BY o.created_at DESC
    LIMIT 4;
  `).all();
  console.table(q3);

  console.log('\n📌 SQL Query 4: Business Revenue & Average Order Value (AOV)');
  const q4 = sqlDb.prepare(`
    SELECT COUNT(id) AS total_orders,
           ROUND(SUM(final_total), 2) AS gross_revenue_inr,
           ROUND(AVG(final_total), 2) AS average_order_value_inr,
           ROUND(SUM(discount_total), 2) AS total_discounts_granted
    FROM orders
    WHERE order_status != 'cancelled';
  `).all();
  console.table(q4);

  console.log('\n📌 SQL Query 5: Active Promotional Coupons Validation');
  const q5 = sqlDb.prepare(`
    SELECT code, discount_type, discount_value, min_order_value, max_discount, times_used, usage_limit
    FROM coupons
    WHERE active = 1 AND times_used < usage_limit
    ORDER BY discount_value DESC;
  `).all();
  console.table(q5);

  sqlDb.close();

  // -------------------------------------------------------------
  // PART 2: MONGODB NOSQL QUERIES
  // -------------------------------------------------------------
  console.log('\n----------------------------------------------------------------');
  console.log('🔹 [PART 2: MONGODB QUERIES (Database: smartstation)]');
  console.log('----------------------------------------------------------------\n');

  loadEnv();
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartstation';
  const dbName = process.env.MONGODB_DB || 'smartstation';

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    console.log(`📡 Connected to MongoDB: ${uri}`);

    console.log('\n🍃 MongoDB Query 1: db.products.find({ rating: { $gte: 4.8 } })');
    const mongoQ1 = await db
      .collection('products')
      .find({ rating: { $gte: 4.8 } }, { projection: { name: 1, brand: 1, price: 1, rating: 1, stock: 1 } })
      .limit(4)
      .toArray();
    console.table(mongoQ1.map((p) => ({ id: p._id, name: p.name, brand: p.brand, price: p.price, rating: p.rating, stock: p.stock })));

    console.log('\n🍃 MongoDB Query 2: Aggregation Pipeline ($group by Category with $avg price)');
    const mongoQ2 = await db
      .collection('products')
      .aggregate([
        {
          $group: {
            _id: '$category',
            productCount: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
        { $sort: { productCount: -1 } },
        { $limit: 5 },
      ])
      .toArray();
    console.table(
      mongoQ2.map((g) => ({
        Category: g._id,
        Count: g.productCount,
        AvgPrice: Math.round(g.avgPrice),
        MinPrice: g.minPrice,
        MaxPrice: g.maxPrice,
      }))
    );

    console.log('\n🍃 MongoDB Query 3: db.orders.find({ orderStatus: "delivered" })');
    const mongoQ3 = await db
      .collection('orders')
      .find({ orderStatus: 'delivered' }, { projection: { orderNumber: 1, customerName: 1, totalAmount: 1, orderStatus: 1, createdAt: 1 } })
      .toArray();
    console.table(mongoQ3.map((o) => ({ Order: o.orderNumber, Customer: o.customerName, Total: o.totalAmount, Status: o.orderStatus })));

    console.log('\n🎉 All SQL and MongoDB database queries executed successfully!\n');
  } catch (err) {
    console.error('❌ MongoDB query error:', err.message || err);
  } finally {
    await client.close();
  }
}

run();
