/**
 * SmartStation - SQL Database Generator & Direct Seeder
 * Converts data/smartstation_db.json into smartstation_schema.sql
 * and populates data/smartstation.sqlite directly using built-in node:sqlite.
 */

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

function run() {
  console.log('\n======================================================');
  console.log('   SmartStation - SQL Generator & Database Seeder     ');
  console.log('======================================================\n');

  const jsonPath = path.join(__dirname, '..', 'data', 'smartstation_db.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Could not find data/smartstation_db.json');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const sqlStatements = [];

  // SQL Header
  sqlStatements.push(`-- ==========================================================`);
  sqlStatements.push(`-- SmartStation E-Commerce Relational Database Schema & Queries`);
  sqlStatements.push(`-- Compatible with MySQL, PostgreSQL, SQLite, and phpMyAdmin`);
  sqlStatements.push(`-- Generated: ${new Date().toISOString()}`);
  sqlStatements.push(`-- ==========================================================\n`);

  // Table DDLs
  sqlStatements.push(`-- 1. USERS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  role VARCHAR(20) DEFAULT 'customer',
  smartpoints INT DEFAULT 100,
  addresses_json TEXT,
  desk_items_json TEXT,
  created_at VARCHAR(40)
);\n`);

  sqlStatements.push(`-- 2. CATEGORIES TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  display_order INT DEFAULT 0
);\n`);

  sqlStatements.push(`-- 3. BRANDS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS brands (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo VARCHAR(255),
  is_featured INT DEFAULT 0,
  country VARCHAR(50)
);\n`);

  sqlStatements.push(`-- 4. PRODUCTS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  sku VARCHAR(80),
  barcode VARCHAR(50),
  brand_id VARCHAR(50),
  brand_name VARCHAR(100),
  category_id VARCHAR(50),
  category_name VARCHAR(100),
  subcategory VARCHAR(100),
  description TEXT,
  short_description VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2),
  discount_percentage INT DEFAULT 0,
  tax_percentage INT DEFAULT 18,
  stock INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  is_new INT DEFAULT 0,
  is_bestseller INT DEFAULT 0,
  is_featured INT DEFAULT 0,
  is_eco_friendly INT DEFAULT 0,
  primary_image VARCHAR(500),
  images_json TEXT,
  specifications_json TEXT,
  purpose_tags_json TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at VARCHAR(40),
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);\n`);

  sqlStatements.push(`-- 5. PRODUCT VARIANTS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS product_variants (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  name VARCHAR(100),
  sku VARCHAR(80),
  size VARCHAR(50),
  color VARCHAR(50),
  pack_size INT DEFAULT 1,
  price DECIMAL(10,2),
  mrp DECIMAL(10,2),
  stock INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);\n`);

  sqlStatements.push(`-- 6. ORDERS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(30),
  shipping_address_json TEXT,
  items_count INT DEFAULT 1,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  discount_total DECIMAL(10,2) DEFAULT 0,
  smartpoints_used INT DEFAULT 0,
  smartpoints_discount DECIMAL(10,2) DEFAULT 0,
  smartpoints_earned INT DEFAULT 0,
  final_total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'paid',
  order_status VARCHAR(50) DEFAULT 'confirmed',
  tracking_carrier VARCHAR(100),
  tracking_number VARCHAR(100),
  tracking_url VARCHAR(255),
  estimated_delivery VARCHAR(40),
  coupon_code VARCHAR(50),
  notes TEXT,
  created_at VARCHAR(40),
  updated_at VARCHAR(40),
  FOREIGN KEY (customer_id) REFERENCES users(id)
);\n`);

  sqlStatements.push(`-- 7. ORDER ITEMS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_slug VARCHAR(200),
  product_image VARCHAR(500),
  variant_id VARCHAR(50),
  variant_name VARCHAR(100),
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);\n`);

  sqlStatements.push(`-- 8. REVIEWS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50),
  user_name VARCHAR(100) NOT NULL,
  rating DECIMAL(3,2) NOT NULL,
  comment TEXT,
  verified_purchase INT DEFAULT 1,
  created_at VARCHAR(40),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);\n`);

  sqlStatements.push(`-- 9. COUPONS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INT DEFAULT 1000,
  times_used INT DEFAULT 0,
  active INT DEFAULT 1,
  expires_at VARCHAR(40),
  created_at VARCHAR(40)
);\n`);

  sqlStatements.push(`-- 10. B2B BULK RFQ TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS rfqs (
  id VARCHAR(50) PRIMARY KEY,
  rfq_number VARCHAR(50) NOT NULL UNIQUE,
  institution_name VARCHAR(150) NOT NULL,
  contact_person VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  category VARCHAR(100),
  estimated_units INT,
  budget DECIMAL(12,2),
  target_delivery_date VARCHAR(40),
  requirements TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at VARCHAR(40)
);\n`);

  sqlStatements.push(`-- 11. AUDIT LOGS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(50) PRIMARY KEY,
  timestamp VARCHAR(40) NOT NULL,
  actor VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50),
  entity_id VARCHAR(50),
  details TEXT,
  ip_address VARCHAR(50)
);\n`);

  sqlStatements.push(`-- 12. STORE SETTINGS TABLE`);
  sqlStatements.push(`CREATE TABLE IF NOT EXISTS store_settings (
  setting_key VARCHAR(80) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  description VARCHAR(255)
);\n`);

  // Data Inserts
  sqlStatements.push(`-- ==========================================================`);
  sqlStatements.push(`-- DATA INSERTS FOR SMARTSTATION STORE`);
  sqlStatements.push(`-- ==========================================================\n`);

  // Users
  if (data.users && data.users.length) {
    sqlStatements.push(`-- INSERT USERS`);
    for (const u of data.users) {
      sqlStatements.push(`INSERT INTO users (id, name, email, password_hash, phone, role, smartpoints, addresses_json, desk_items_json, created_at) VALUES (${escapeSql(u.id)}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.passwordHash || 'password123')}, ${escapeSql(u.phone)}, ${escapeSql(u.role)}, ${u.smartpoints || 0}, ${escapeSql(u.savedAddresses)}, ${escapeSql(u.deskChecklist)}, ${escapeSql(u.createdAt)});`);
    }
    sqlStatements.push('');
  }

  // Categories
  if (data.categories && data.categories.length) {
    sqlStatements.push(`-- INSERT CATEGORIES`);
    for (const c of data.categories) {
      sqlStatements.push(`INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.icon)}, ${escapeSql(c.description)}, ${c.displayOrder || 0});`);
    }
    sqlStatements.push('');
  }

  // Brands
  if (data.brands && data.brands.length) {
    sqlStatements.push(`-- INSERT BRANDS`);
    for (const b of data.brands) {
      sqlStatements.push(`INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES (${escapeSql(b.id)}, ${escapeSql(b.name)}, ${escapeSql(b.slug)}, ${escapeSql(b.logo)}, ${b.isFeatured ? 1 : 0}, ${escapeSql(b.country)});`);
    }
    sqlStatements.push('');
  }

  // Products & Variants
  if (data.products && data.products.length) {
    sqlStatements.push(`-- INSERT PRODUCTS`);
    for (const p of data.products) {
      const primaryImage = (p.images && p.images[0]) || '';
      sqlStatements.push(`INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES (${escapeSql(p.id)}, ${escapeSql(p.name)}, ${escapeSql(p.slug)}, ${escapeSql(p.sku)}, ${escapeSql(p.barcode)}, ${escapeSql(p.brandId)}, ${escapeSql(p.brand)}, ${escapeSql(p.categoryId)}, ${escapeSql(p.category)}, ${escapeSql(p.subcategory)}, ${escapeSql(p.description)}, ${escapeSql(p.shortDescription)}, ${p.price}, ${p.mrp || p.price}, ${p.discountPercentage || 0}, ${p.taxPercentage || 18}, ${p.stock || 0}, ${p.lowStockThreshold || 10}, ${p.rating || 0}, ${p.reviewCount || 0}, ${p.isNew ? 1 : 0}, ${p.isBestseller ? 1 : 0}, ${p.isFeatured ? 1 : 0}, ${p.isEcoFriendly ? 1 : 0}, ${escapeSql(primaryImage)}, ${escapeSql(p.images)}, ${escapeSql(p.specifications)}, ${escapeSql(p.purposeTags)}, ${escapeSql(p.status || 'active')}, ${escapeSql(p.createdAt)});`);

      if (p.variants && Array.isArray(p.variants)) {
        for (const v of p.variants) {
          sqlStatements.push(`INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES (${escapeSql(v.id)}, ${escapeSql(p.id)}, ${escapeSql(v.name)}, ${escapeSql(v.sku)}, ${escapeSql(v.size)}, ${escapeSql(v.color)}, ${v.packSize || 1}, ${v.price || p.price}, ${v.mrp || p.mrp || p.price}, ${v.stock || p.stock});`);
        }
      }
    }
    sqlStatements.push('');
  }

  // Orders & Order Items
  if (data.orders && data.orders.length) {
    sqlStatements.push(`-- INSERT ORDERS & ORDER ITEMS`);
    for (const o of data.orders) {
      const finalTotal = o.totalAmount ?? o.finalTotal ?? 0;
      const discountVal = o.discount ?? o.discountTotal ?? 0;
      const pointsUsed = o.pointsRedeemed ?? o.smartpointsUsed ?? 0;
      const pointsDisc = o.pointsDiscount ?? o.smartpointsDiscount ?? 0;
      const carrier = o.deliveryPartner ?? o.trackingCarrier ?? '';
      const estDate = o.estimatedDeliveryDate ?? o.estimatedDelivery ?? '';

      const userMatch = data.users.find(u => u.id === o.customerId) || data.users.find(u => u.email === o.customerEmail) || data.users[1];
      const custId = userMatch ? userMatch.id : 'user-customer';
      const custName = o.customerName || (userMatch ? userMatch.name : 'Joe Student');
      const custEmail = o.customerEmail || (userMatch ? userMatch.email : 'customer@smartstation.com');
      const custPhone = o.customerPhone || (userMatch ? userMatch.phone : '+91 98111 22334');

      sqlStatements.push(`INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address_json, items_count, subtotal, shipping_fee, discount_total, smartpoints_used, smartpoints_discount, smartpoints_earned, final_total, payment_method, payment_status, order_status, tracking_carrier, tracking_number, tracking_url, estimated_delivery, coupon_code, notes, created_at, updated_at) VALUES (${escapeSql(o.id)}, ${escapeSql(o.orderNumber)}, ${escapeSql(custId)}, ${escapeSql(custName)}, ${escapeSql(custEmail)}, ${escapeSql(custPhone)}, ${escapeSql(o.shippingAddress)}, ${o.items?.length || 1}, ${o.subtotal || 0}, ${o.shippingFee || 0}, ${discountVal}, ${pointsUsed}, ${pointsDisc}, ${o.smartpointsEarned || 0}, ${finalTotal}, ${escapeSql(o.paymentMethod || 'UPI')}, ${escapeSql(o.paymentStatus || 'paid')}, ${escapeSql(o.orderStatus || 'confirmed')}, ${escapeSql(carrier)}, ${escapeSql(o.trackingNumber)}, ${escapeSql(o.trackingUrl)}, ${escapeSql(estDate)}, ${escapeSql(o.couponCode)}, ${escapeSql(o.notes)}, ${escapeSql(o.createdAt)}, ${escapeSql(o.updatedAt || o.createdAt)});`);

      if (o.items && Array.isArray(o.items)) {
        for (let i = 0; i < o.items.length; i++) {
          const it = o.items[i];
          const itemId = `item-${o.id}-${i + 1}`;
          sqlStatements.push(`INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, variant_id, variant_name, unit_price, quantity, subtotal) VALUES (${escapeSql(itemId)}, ${escapeSql(o.id)}, ${escapeSql(it.productId)}, ${escapeSql(it.name)}, ${escapeSql(it.slug || it.sku)}, ${escapeSql(it.image)}, ${escapeSql(it.variantId || '')}, ${escapeSql(it.variantName || it.sku || '')}, ${it.price || 0}, ${it.quantity || 1}, ${(it.price || 0) * (it.quantity || 1)});`);
        }
      }
    }
    sqlStatements.push('');
  }

  // Reviews
  if (data.reviews && data.reviews.length) {
    sqlStatements.push(`-- INSERT REVIEWS`);
    for (const r of data.reviews) {
      sqlStatements.push(`INSERT INTO reviews (id, product_id, user_id, user_name, rating, comment, verified_purchase, created_at) VALUES (${escapeSql(r.id)}, ${escapeSql(r.productId)}, ${escapeSql(r.userId)}, ${escapeSql(r.userName)}, ${r.rating}, ${escapeSql(r.comment)}, ${r.verifiedPurchase ? 1 : 0}, ${escapeSql(r.createdAt)});`);
    }
    sqlStatements.push('');
  }

  // Coupons
  if (data.coupons && data.coupons.length) {
    sqlStatements.push(`-- INSERT COUPONS`);
    for (const cp of data.coupons) {
      const activeVal = cp.status === 'active' || cp.active ? 1 : 0;
      sqlStatements.push(`INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, times_used, active, expires_at, created_at) VALUES (${escapeSql(cp.id)}, ${escapeSql(cp.code)}, ${escapeSql(cp.description)}, ${escapeSql(cp.discountType)}, ${cp.discountValue}, ${cp.minOrderValue || 0}, ${cp.maxDiscount || 'NULL'}, ${cp.usageLimit || 1000}, ${cp.timesUsed || 0}, ${activeVal}, ${escapeSql(cp.validUntil || cp.expiresAt)}, ${escapeSql(cp.validFrom || cp.createdAt)});`);
    }
    sqlStatements.push('');
  }

  // RFQs
  if (data.rfqs && data.rfqs.length) {
    sqlStatements.push(`-- INSERT RFQS`);
    for (const rfq of data.rfqs) {
      const rfqNum = rfq.rfqNumber || `RFQ-${rfq.id}`;
      const orgName = rfq.organization || rfq.institutionName || 'Unknown School';
      const cat = rfq.targetCategory || rfq.category || 'General';
      const qty = rfq.estimatedQuantity || rfq.estimatedUnits || 100;
      const reqs = rfq.requiredProducts || rfq.requirements || rfq.additionalNotes || '';
      sqlStatements.push(`INSERT INTO rfqs (id, rfq_number, institution_name, contact_person, email, phone, category, estimated_units, budget, target_delivery_date, requirements, status, created_at) VALUES (${escapeSql(rfq.id)}, ${escapeSql(rfqNum)}, ${escapeSql(orgName)}, ${escapeSql(rfq.contactPerson)}, ${escapeSql(rfq.email)}, ${escapeSql(rfq.phone)}, ${escapeSql(cat)}, ${qty}, ${rfq.budget || 0}, ${escapeSql(rfq.targetDeliveryDate)}, ${escapeSql(reqs)}, ${escapeSql(rfq.status)}, ${escapeSql(rfq.createdAt)});`);
    }
    sqlStatements.push('');
  }

  // Audit Logs
  if (data.auditLogs && data.auditLogs.length) {
    sqlStatements.push(`-- INSERT AUDIT LOGS`);
    for (const al of data.auditLogs) {
      const actorName = al.adminUser || al.actor || 'System Admin';
      const roleName = al.role || 'admin';
      const ip = al.ip || al.ipAddress || '127.0.0.1';
      sqlStatements.push(`INSERT INTO audit_logs (id, timestamp, actor, role, action, entity, entity_id, details, ip_address) VALUES (${escapeSql(al.id)}, ${escapeSql(al.timestamp)}, ${escapeSql(actorName)}, ${escapeSql(roleName)}, ${escapeSql(al.action)}, ${escapeSql(al.entity)}, ${escapeSql(al.entityId)}, ${escapeSql(al.details)}, ${escapeSql(ip)});`);
    }
    sqlStatements.push('');
  }

  // Store Settings
  if (data.settings) {
    sqlStatements.push(`-- INSERT STORE SETTINGS`);
    for (const [k, v] of Object.entries(data.settings)) {
      sqlStatements.push(`INSERT INTO store_settings (setting_key, setting_value, description) VALUES (${escapeSql(k)}, ${escapeSql(v)}, ${escapeSql(`Global store configuration for ${k}`)});`);
    }
    sqlStatements.push('');
  }

  // 18 Standard Production SQL Queries
  sqlStatements.push(`-- ==========================================================`);
  sqlStatements.push(`-- 18 ESSENTIAL PRODUCTION SQL QUERIES FOR SMARTSTATION`);
  sqlStatements.push(`-- ==========================================================\n`);

  sqlStatements.push(`-- QUERY 1: Catalog Browsing with Category & Price Filter (Sorted by rating)
SELECT id, name, brand_name, price, stock, rating, review_count
FROM products
WHERE status = 'active' AND price BETWEEN 50 AND 500
ORDER BY rating DESC
LIMIT 10;\n`);

  sqlStatements.push(`-- QUERY 2: Full-text Product Keyword Search
SELECT id, name, sku, brand_name, category_name, price, stock
FROM products
WHERE name LIKE '%Pen%' OR description LIKE '%Pen%' OR brand_name LIKE '%Pilot%';\n`);

  sqlStatements.push(`-- QUERY 3: Low-Stock Inventory Restock Alert (stock <= low_stock_threshold)
SELECT id, name, sku, stock, low_stock_threshold, (low_stock_threshold - stock) AS shortage
FROM products
WHERE stock <= low_stock_threshold
ORDER BY stock ASC;\n`);

  sqlStatements.push(`-- QUERY 4: Customer Order History with Itemized JOIN
SELECT o.order_number, o.created_at, o.order_status, o.final_total,
       i.product_name, i.quantity, i.unit_price, i.subtotal
FROM orders o
JOIN order_items i ON o.id = i.order_id
WHERE o.customer_email = 'customer@smartstation.com'
ORDER BY o.created_at DESC;\n`);

  sqlStatements.push(`-- QUERY 5: Top 5 Bestselling Stationery Products by Revenue & Units Sold
SELECT i.product_id, i.product_name,
       SUM(i.quantity) AS total_units_sold,
       SUM(i.subtotal) AS total_revenue
FROM order_items i
JOIN orders o ON o.id = i.order_id
WHERE o.order_status NOT IN ('cancelled', 'refunded')
GROUP BY i.product_id, i.product_name
ORDER BY total_revenue DESC
LIMIT 5;\n`);

  sqlStatements.push(`-- QUERY 6: Total Business Revenue & Average Order Value (AOV)
SELECT COUNT(id) AS total_orders,
       ROUND(SUM(final_total), 2) AS gross_revenue,
       ROUND(AVG(final_total), 2) AS average_order_value,
       ROUND(SUM(discount_total), 2) AS total_promotional_discounts
FROM orders
WHERE order_status NOT IN ('cancelled', 'refunded');\n`);

  sqlStatements.push(`-- QUERY 7: Category-wise Product Distribution & Average Price
SELECT c.name AS category_name,
       COUNT(p.id) AS total_products,
       MIN(p.price) AS min_price,
       MAX(p.price) AS max_price,
       ROUND(AVG(p.price), 2) AS avg_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY total_products DESC;\n`);

  sqlStatements.push(`-- QUERY 8: Check and Validate Promo Coupon Code
SELECT code, discount_type, discount_value, min_order_value, max_discount, times_used, usage_limit
FROM coupons
WHERE code = 'WELCOME10' AND active = 1 AND times_used < usage_limit;\n`);

  sqlStatements.push(`-- QUERY 9: Customer Loyalty Points & Total Lifetime Spend
SELECT u.id, u.name, u.email, u.smartpoints,
       COUNT(o.id) AS lifetime_orders,
       COALESCE(SUM(o.final_total), 0) AS lifetime_spend
FROM users u
LEFT JOIN orders o ON u.id = o.customer_id AND o.order_status != 'cancelled'
GROUP BY u.id, u.name, u.email, u.smartpoints
ORDER BY lifetime_spend DESC;\n`);

  sqlStatements.push(`-- QUERY 10: Atomic Inventory Stock Decrement on Order Placement
UPDATE products
SET stock = stock - 2
WHERE id = 'prod-001' AND stock >= 2;\n`);

  sqlStatements.push(`-- QUERY 11: Cancel Order and Restore Product Stock
UPDATE orders SET order_status = 'cancelled', updated_at = datetime('now') WHERE id = 'ord-1002';
UPDATE products SET stock = stock + 1 WHERE id = 'prod-007';\n`);

  sqlStatements.push(`-- QUERY 12: Product Review Summary with Average Rating & Total Reviews
SELECT p.id, p.name,
       COUNT(r.id) AS review_count,
       ROUND(AVG(r.rating), 1) AS calculated_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
HAVING review_count > 0
ORDER BY calculated_rating DESC;\n`);

  sqlStatements.push(`-- QUERY 13: B2B Institutional RFQ Pending Pipeline
SELECT rfq_number, institution_name, contact_person, email, category, estimated_units, budget, status
FROM rfqs
WHERE status = 'pending'
ORDER BY created_at DESC;\n`);

  sqlStatements.push(`-- QUERY 14: Restock Suggestion Report
SELECT p.id, p.name, p.sku, b.name AS brand, p.stock, p.low_stock_threshold,
       (p.low_stock_threshold * 3 - p.stock) AS suggested_order_qty
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE p.stock <= p.low_stock_threshold;\n`);

  sqlStatements.push(`-- QUERY 15: Security & Admin Audit Trail
SELECT timestamp, actor, role, action, entity, entity_id, details, ip_address
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;\n`);

  sqlStatements.push(`-- QUERY 16: Category Revenue Contribution
SELECT c.name AS category,
       COUNT(DISTINCT o.id) AS orders_count,
       SUM(i.quantity) AS total_units_sold,
       ROUND(SUM(i.subtotal), 2) AS category_revenue
FROM categories c
JOIN products p ON c.id = p.category_id
JOIN order_items i ON p.id = i.product_id
JOIN orders o ON i.order_id = o.id
WHERE o.order_status NOT IN ('cancelled', 'refunded')
GROUP BY c.id, c.name
ORDER BY category_revenue DESC;\n`);

  sqlStatements.push(`-- QUERY 17: Monthly Order Growth & Sales Trend
SELECT SUBSTR(created_at, 1, 7) AS order_month,
       COUNT(id) AS total_orders,
       ROUND(SUM(final_total), 2) AS monthly_revenue
FROM orders
WHERE order_status NOT IN ('cancelled', 'refunded')
GROUP BY SUBSTR(created_at, 1, 7)
ORDER BY order_month ASC;\n`);

  sqlStatements.push(`-- QUERY 18: Customer Repeat Purchase Rate
SELECT customer_email,
       customer_name,
       COUNT(id) AS total_purchases,
       ROUND(SUM(final_total), 2) AS total_spent
FROM orders
WHERE order_status != 'cancelled'
GROUP BY customer_email, customer_name
HAVING total_purchases >= 1
ORDER BY total_purchases DESC, total_spent DESC;\n`);

  const fullSql = sqlStatements.join('\n');
  const sqlFilePath = path.join(__dirname, '..', 'data', 'smartstation_schema.sql');
  const rootSqlPath = path.join(__dirname, '..', 'smartstation_schema.sql');
  const rootDbSqlPath = path.join(__dirname, '..', 'smartstation_database.sql');
  const publicSqlPath = path.join(__dirname, '..', 'public', 'smartstation_database.sql');

  // Extract only the queries section for quick review and execution
  const marker = '-- ==========================================================\n-- 18 ESSENTIAL PRODUCTION SQL QUERIES';
  const queriesStartIdx = fullSql.indexOf(marker);
  const queriesOnlySql = queriesStartIdx !== -1 ? fullSql.slice(queriesStartIdx) : '';
  const rootQueriesPath = path.join(__dirname, '..', 'smartstation_all_queries.sql');
  const publicQueriesPath = path.join(__dirname, '..', 'public', 'smartstation_all_queries.sql');

  fs.writeFileSync(sqlFilePath, fullSql, 'utf-8');
  fs.writeFileSync(rootSqlPath, fullSql, 'utf-8');
  fs.writeFileSync(rootDbSqlPath, fullSql, 'utf-8');
  fs.writeFileSync(publicSqlPath, fullSql, 'utf-8');
  if (queriesOnlySql) {
    fs.writeFileSync(rootQueriesPath, queriesOnlySql, 'utf-8');
    fs.writeFileSync(publicQueriesPath, queriesOnlySql, 'utf-8');
  }

  console.log(`✓ Generated SQL File: data/smartstation_schema.sql (${(fullSql.length / 1024).toFixed(1)} KB)`);
  console.log(`✓ Copied to root: smartstation_database.sql & smartstation_all_queries.sql`);
  console.log(`✓ Copied to public: public/smartstation_database.sql & public/smartstation_all_queries.sql`);

  // Execute directly into SQLite database
  console.log('\n⚡ Executing SQL statements directly into SQLite database (data/smartstation.sqlite)...');
  const sqliteDbPath = path.join(__dirname, '..', 'data', 'smartstation.sqlite');
  if (fs.existsSync(sqliteDbPath)) {
    fs.unlinkSync(sqliteDbPath);
  }

  const db = new DatabaseSync(sqliteDbPath);

  // Strip whole-line comments and execute clean SQL statements
  const cleanSql = fullSql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  const statements = cleanSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  let executedCount = 0;
  for (const stmt of statements) {
    try {
      db.exec(stmt);
      executedCount++;
    } catch (err) {
      console.warn(`Warning on statement: ${stmt.slice(0, 60)}... -> ${err.message}`);
    }
  }

  console.log(`✓ Executed ${executedCount} SQL statements successfully!`);

  // Verify Table Counts in SQLite
  console.log('\n📊 SQLite Database Direct Verification:');
  const tables = ['users', 'categories', 'brands', 'products', 'product_variants', 'orders', 'order_items', 'reviews', 'coupons', 'rfqs', 'audit_logs', 'store_settings'];
  for (const t of tables) {
    try {
      const res = db.prepare(`SELECT COUNT(*) as count FROM ${t}`).get();
      console.log(`  - Table [${t}]: ${res.count} records`);
    } catch (e) {
      console.log(`  - Table [${t}]: ${e.message}`);
    }
  }

  // Execute Sample Relational Query
  console.log('\n🔎 Testing Relational SQL Query (JOIN orders + order_items):');
  const sampleJoin = db.prepare(`
    SELECT o.order_number, o.customer_name, o.final_total, i.product_name, i.quantity, i.unit_price
    FROM orders o
    JOIN order_items i ON o.id = i.order_id
    LIMIT 3;
  `).all();
  console.table(sampleJoin);

  db.close();
  console.log('\n🎉 SQL Database created and all records added directly to data/smartstation.sqlite!\n');
}

run();
