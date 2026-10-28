-- ==========================================================
-- 18 ESSENTIAL PRODUCTION SQL QUERIES FOR SMARTSTATION
-- ==========================================================

-- QUERY 1: Catalog Browsing with Category & Price Filter (Sorted by rating)
SELECT id, name, brand_name, price, stock, rating, review_count
FROM products
WHERE status = 'active' AND price BETWEEN 50 AND 500
ORDER BY rating DESC
LIMIT 10;

-- QUERY 2: Full-text Product Keyword Search
SELECT id, name, sku, brand_name, category_name, price, stock
FROM products
WHERE name LIKE '%Pen%' OR description LIKE '%Pen%' OR brand_name LIKE '%Pilot%';

-- QUERY 3: Low-Stock Inventory Restock Alert (stock <= low_stock_threshold)
SELECT id, name, sku, stock, low_stock_threshold, (low_stock_threshold - stock) AS shortage
FROM products
WHERE stock <= low_stock_threshold
ORDER BY stock ASC;

-- QUERY 4: Customer Order History with Itemized JOIN
SELECT o.order_number, o.created_at, o.order_status, o.final_total,
       i.product_name, i.quantity, i.unit_price, i.subtotal
FROM orders o
JOIN order_items i ON o.id = i.order_id
WHERE o.customer_email = 'customer@smartstation.com'
ORDER BY o.created_at DESC;

-- QUERY 5: Top 5 Bestselling Stationery Products by Revenue & Units Sold
SELECT i.product_id, i.product_name,
       SUM(i.quantity) AS total_units_sold,
       SUM(i.subtotal) AS total_revenue
FROM order_items i
JOIN orders o ON o.id = i.order_id
WHERE o.order_status NOT IN ('cancelled', 'refunded')
GROUP BY i.product_id, i.product_name
ORDER BY total_revenue DESC
LIMIT 5;

-- QUERY 6: Total Business Revenue & Average Order Value (AOV)
SELECT COUNT(id) AS total_orders,
       ROUND(SUM(final_total), 2) AS gross_revenue,
       ROUND(AVG(final_total), 2) AS average_order_value,
       ROUND(SUM(discount_total), 2) AS total_promotional_discounts
FROM orders
WHERE order_status NOT IN ('cancelled', 'refunded');

-- QUERY 7: Category-wise Product Distribution & Average Price
SELECT c.name AS category_name,
       COUNT(p.id) AS total_products,
       MIN(p.price) AS min_price,
       MAX(p.price) AS max_price,
       ROUND(AVG(p.price), 2) AS avg_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY total_products DESC;

-- QUERY 8: Check and Validate Promo Coupon Code
SELECT code, discount_type, discount_value, min_order_value, max_discount, times_used, usage_limit
FROM coupons
WHERE code = 'WELCOME10' AND active = 1 AND times_used < usage_limit;

-- QUERY 9: Customer Loyalty Points & Total Lifetime Spend
SELECT u.id, u.name, u.email, u.smartpoints,
       COUNT(o.id) AS lifetime_orders,
       COALESCE(SUM(o.final_total), 0) AS lifetime_spend
FROM users u
LEFT JOIN orders o ON u.id = o.customer_id AND o.order_status != 'cancelled'
GROUP BY u.id, u.name, u.email, u.smartpoints
ORDER BY lifetime_spend DESC;

-- QUERY 10: Atomic Inventory Stock Decrement on Order Placement
UPDATE products
SET stock = stock - 2
WHERE id = 'prod-001' AND stock >= 2;

-- QUERY 11: Cancel Order and Restore Product Stock
UPDATE orders SET order_status = 'cancelled', updated_at = datetime('now') WHERE id = 'ord-1002';
UPDATE products SET stock = stock + 1 WHERE id = 'prod-007';

-- QUERY 12: Product Review Summary with Average Rating & Total Reviews
SELECT p.id, p.name,
       COUNT(r.id) AS review_count,
       ROUND(AVG(r.rating), 1) AS calculated_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
HAVING review_count > 0
ORDER BY calculated_rating DESC;

-- QUERY 13: B2B Institutional RFQ Pending Pipeline
SELECT rfq_number, institution_name, contact_person, email, category, estimated_units, budget, status
FROM rfqs
WHERE status = 'pending'
ORDER BY created_at DESC;

-- QUERY 14: Restock Suggestion Report
SELECT p.id, p.name, p.sku, b.name AS brand, p.stock, p.low_stock_threshold,
       (p.low_stock_threshold * 3 - p.stock) AS suggested_order_qty
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE p.stock <= p.low_stock_threshold;

-- QUERY 15: Security & Admin Audit Trail
SELECT timestamp, actor, role, action, entity, entity_id, details, ip_address
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;

-- QUERY 16: Category Revenue Contribution
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
ORDER BY category_revenue DESC;

-- QUERY 17: Monthly Order Growth & Sales Trend
SELECT SUBSTR(created_at, 1, 7) AS order_month,
       COUNT(id) AS total_orders,
       ROUND(SUM(final_total), 2) AS monthly_revenue
FROM orders
WHERE order_status NOT IN ('cancelled', 'refunded')
GROUP BY SUBSTR(created_at, 1, 7)
ORDER BY order_month ASC;

-- QUERY 18: Customer Repeat Purchase Rate
SELECT customer_email,
       customer_name,
       COUNT(id) AS total_purchases,
       ROUND(SUM(final_total), 2) AS total_spent
FROM orders
WHERE order_status != 'cancelled'
GROUP BY customer_email, customer_name
HAVING total_purchases >= 1
ORDER BY total_purchases DESC, total_spent DESC;
