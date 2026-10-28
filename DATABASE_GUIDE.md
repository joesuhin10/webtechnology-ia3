# SmartStation — Complete Database Architecture & Query Guide
> MongoDB (NoSQL) & Relational SQL (MySQL / SQLite / PostgreSQL)

This document provides complete instructions for connecting, running, and querying the database for the **SmartStation Online Stationery Store** project. Both **MongoDB** and **Relational SQL** have been fully prepared and seeded directly with data.

---

## ⚡ Quick Start Commands

| Command | Action |
| :--- | :--- |
| `npm run db:test` | Pings MongoDB and verifies connection & collection document counts |
| `npm run db:seed` | Populates all 10 collections & high-performance indexes into MongoDB |
| `npm run db:sql` | Generates `smartstation_schema.sql` and builds `data/smartstation.sqlite` directly |
| `npm run db:queries` | Runs sample SQL relational queries and MongoDB queries with formatted outputs |
| `npm run db:mysql` | Imports `smartstation_schema.sql` into local MySQL Server 8.0 |

---

## 🍃 1. MongoDB Database Connection & Seeding

### Connection Setup
The project uses the official Node.js `mongodb` driver. Credentials are configured in [`.env.local`](file:///c:/web_tech_stationary/.env.local):

```env
MONGODB_URI=mongodb+srv://joesuhin299_db_user:LDG9Y8boeJ1veiQn@cluster0.t1wi3cn.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=smartstation
```

*(Configured in [`.env.local`](file:///c:/web_tech_stationary/.env.local) targeting Cluster `cluster0.t1wi3cn.mongodb.net`)*

### Live Database Status
- **Host**: `127.0.0.1:27017`
- **Database Name**: `smartstation`
- **Status**: Connected & Seeded
- **Collections Active in MongoDB**:
  - `products` (30 documents, indexed on slug, category, brand, and text search)
  - `categories` (10 documents)
  - `brands` (15 documents)
  - `orders` (5 documents, indexed on customerId and orderNumber)
  - `users` (5 documents, indexed on email)
  - `reviews` (4 documents)
  - `coupons` (7 documents)
  - `banners` (2 documents)
  - `rfqs` (3 documents)
  - `settings` (1 global configuration document)

---

## 🗄️ 2. Relational SQL Database (MySQL & SQLite)

The SQL schema and records have been generated into:
- [`smartstation_schema.sql`](file:///c:/web_tech_stationary/smartstation_schema.sql) (Full DDL + DML + 15 Queries)
- [`data/smartstation.sqlite`](file:///c:/web_tech_stationary/data/smartstation.sqlite) (Populated database file)

### Tables in the SQL Database:
1. `users` — Customers and administrators with roles, hashed passwords, SmartPoints
2. `categories` — Stationery categories (Notebooks, Writing, Art Supplies, etc.)
3. `brands` — Stationery brands (Pilot, Classmate, Faber-Castell, Parker, etc.)
4. `products` — Stationery catalogue with specifications, stock, MRP, ratings
5. `product_variants` — SKUs, colors, tip sizes (0.5mm, 0.7mm), pack sizes
6. `orders` — Fulfillment orders with pricing, discount, addresses, tracking
7. `order_items` — Relational line items linked to orders and products
8. `reviews` — Verified customer reviews with star ratings and comments
9. `coupons` — Promotional discount vouchers with limits and expiration
10. `rfqs` — B2B Institutional bulk quotation requests
11. `audit_logs` — Security and administrative operational logs
12. `store_settings` — Shipping thresholds, points conversion, COD settings

---

## 📜 3. Production SQL Queries for the Project

### Query 1: Active In-Stock Products with Rating & Review Sorting
```sql
SELECT id, name, brand_name, price, stock, rating, review_count
FROM products
WHERE status = 'active' AND stock > 0
ORDER BY rating DESC, review_count DESC
LIMIT 10;
```

### Query 2: Product Search by Keyword & Category
```sql
SELECT id, name, sku, brand_name, category_name, price, stock
FROM products
WHERE (name LIKE '%Gel Pen%' OR description LIKE '%Gel Pen%')
  AND category_name = 'Writing Instruments';
```

### Query 3: Low-Stock Warehouse Restock Alerts
```sql
SELECT id, name, sku, stock, low_stock_threshold,
       (low_stock_threshold - stock) AS units_shortage
FROM products
WHERE stock <= low_stock_threshold
ORDER BY stock ASC;
```

### Query 4: Customer Order History with Itemized Breakdown (JOIN)
```sql
SELECT o.order_number, o.created_at, o.order_status, o.final_total,
       i.product_name, i.quantity, i.unit_price, i.subtotal
FROM orders o
JOIN order_items i ON o.id = i.order_id
WHERE o.customer_email = 'customer@smartstation.com'
ORDER BY o.created_at DESC;
```

### Query 5: Top 5 Bestselling Stationery Products by Revenue
```sql
SELECT i.product_id, i.product_name,
       SUM(i.quantity) AS total_units_sold,
       SUM(i.subtotal) AS total_revenue
FROM order_items i
JOIN orders o ON o.id = i.order_id
WHERE o.order_status NOT IN ('cancelled', 'refunded')
GROUP BY i.product_id, i.product_name
ORDER BY total_revenue DESC
LIMIT 5;
```

### Query 6: Gross Revenue, Total Orders & Average Order Value (AOV)
```sql
SELECT COUNT(id) AS total_orders,
       ROUND(SUM(final_total), 2) AS gross_revenue_inr,
       ROUND(AVG(final_total), 2) AS average_order_value_inr,
       ROUND(SUM(discount_total), 2) AS total_discounts_granted
FROM orders
WHERE order_status NOT IN ('cancelled', 'refunded');
```

### Query 7: Category-Wise Sales Distribution & Pricing Analysis
```sql
SELECT c.name AS category_name,
       COUNT(p.id) AS total_products,
       MIN(p.price) AS min_price,
       MAX(p.price) AS max_price,
       ROUND(AVG(p.price), 2) AS avg_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY total_products DESC;
```

### Query 8: Validate Promotional Coupon Code
```sql
SELECT code, discount_type, discount_value, min_order_value, max_discount, times_used, usage_limit
FROM coupons
WHERE code = 'WELCOME10' AND active = 1 AND times_used < usage_limit;
```

### Query 9: Customer Lifetime Spending & Loyalty SmartPoints
```sql
SELECT u.id, u.name, u.email, u.smartpoints,
       COUNT(o.id) AS lifetime_orders,
       COALESCE(SUM(o.final_total), 0) AS lifetime_spend
FROM users u
LEFT JOIN orders o ON u.id = o.customer_id AND o.order_status != 'cancelled'
GROUP BY u.id, u.name, u.email, u.smartpoints
ORDER BY lifetime_spend DESC;
```

### Query 10: Atomic Stock Decrement on Order Placement (Transaction)
```sql
UPDATE products
SET stock = stock - 2
WHERE id = 'prod-001' AND stock >= 2;
```

### Query 11: Cancel Order and Restore Product Stock
```sql
UPDATE orders 
SET order_status = 'cancelled', updated_at = datetime('now') 
WHERE id = 'ord-1002';

UPDATE products 
SET stock = stock + 1 
WHERE id = 'prod-007';
```

### Query 12: Product Review Summary & Aggregated Rating
```sql
SELECT p.id, p.name,
       COUNT(r.id) AS review_count,
       ROUND(AVG(r.rating), 1) AS calculated_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
HAVING review_count > 0
ORDER BY calculated_rating DESC;
```

### Query 13: B2B Institutional Bulk Order (RFQ) Pipeline
```sql
SELECT rfq_number, institution_name, contact_person, email, category, estimated_units, budget, status
FROM rfqs
WHERE status = 'pending'
ORDER BY created_at DESC;
```

---

## 🍃 4. Equivalent MongoDB (NoSQL) Queries

For reports, lab submissions, or MongoDB Compass / `mongosh`:

### Find Products by Category & Rating
```javascript
db.products.find(
  { category: "Writing Instruments", rating: { $gte: 4.5 }, stock: { $gt: 0 } },
  { name: 1, brand: 1, price: 1, rating: 1, stock: 1 }
).sort({ rating: -1 });
```

### Category-wise Aggregation Pipeline ($group)
```javascript
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      avgPrice: { $avg: "$price" },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" }
    }
  },
  { $sort: { totalProducts: -1 } }
]);
```

### Lookup / Join Order with User Details
```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "customerId",
      foreignField: "_id",
      as: "customerDetails"
    }
  },
  { $unwind: "$customerDetails" },
  {
    $project: {
      orderNumber: 1,
      totalAmount: 1,
      orderStatus: 1,
      "customerDetails.name": 1,
      "customerDetails.email": 1
    }
  }
]);
```

### Atomic Stock Update
```javascript
db.products.updateOne(
  { _id: "prod-001", stock: { $gte: 2 } },
  { $inc: { stock: -2 } }
);
```

---

## 📁 Related Project Files
- SQL Schema & Queries: [`smartstation_schema.sql`](file:///c:/web_tech_stationary/smartstation_schema.sql)
- SQLite Database: [`data/smartstation.sqlite`](file:///c:/web_tech_stationary/data/smartstation.sqlite)
- SQL Generator Script: [`scripts/generate_and_seed_sql.js`](file:///c:/web_tech_stationary/scripts/generate_and_seed_sql.js)
- Sample Queries Script: [`scripts/run_sample_queries.js`](file:///c:/web_tech_stationary/scripts/run_sample_queries.js)
- MySQL Direct Importer: [`scripts/import_mysql.js`](file:///c:/web_tech_stationary/scripts/import_mysql.js)
- MongoDB Connection Tester: [`scripts/test_mongodb_connection.js`](file:///c:/web_tech_stationary/scripts/test_mongodb_connection.js)
- MongoDB Seeding Script: [`scripts/seed_mongodb.js`](file:///c:/web_tech_stationary/scripts/seed_mongodb.js)
- Environment Variables: [`.env.local`](file:///c:/web_tech_stationary/.env.local)
