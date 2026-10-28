-- ==========================================================
-- SmartStation E-Commerce Relational Database Schema & Queries
-- Compatible with MySQL, PostgreSQL, SQLite, and phpMyAdmin
-- Generated: 2026-10-28T16:38:15.697Z
-- ==========================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
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
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  display_order INT DEFAULT 0
);

-- 3. BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo VARCHAR(255),
  is_featured INT DEFAULT 0,
  country VARCHAR(50)
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
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
);

-- 5. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS product_variants (
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
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
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
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
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
);

-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50),
  user_name VARCHAR(100) NOT NULL,
  rating DECIMAL(3,2) NOT NULL,
  comment TEXT,
  verified_purchase INT DEFAULT 1,
  created_at VARCHAR(40),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 9. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
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
);

-- 10. B2B BULK RFQ TABLE
CREATE TABLE IF NOT EXISTS rfqs (
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
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(50) PRIMARY KEY,
  timestamp VARCHAR(40) NOT NULL,
  actor VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50),
  entity_id VARCHAR(50),
  details TEXT,
  ip_address VARCHAR(50)
);

-- 12. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS store_settings (
  setting_key VARCHAR(80) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  description VARCHAR(255)
);

-- ==========================================================
-- DATA INSERTS FOR SMARTSTATION STORE
-- ==========================================================

-- INSERT USERS
INSERT INTO users (id, name, email, password_hash, phone, role, smartpoints, addresses_json, desk_items_json, created_at) VALUES ('user-admin', 'Admin Joe', 'admin@smartstation.com', 'password123', '+91 98765 43210', 'admin', 0, NULL, NULL, '2026-01-01T00:00:00Z');
INSERT INTO users (id, name, email, password_hash, phone, role, smartpoints, addresses_json, desk_items_json, created_at) VALUES ('user-customer', 'Joe Student', 'customer@smartstation.com', 'password123', '+91 98111 22334', 'customer', 0, NULL, NULL, '2026-02-14T10:00:00Z');
INSERT INTO users (id, name, email, password_hash, phone, role, smartpoints, addresses_json, desk_items_json, created_at) VALUES ('user-3', 'Priya Sharma', 'priya.sharma@example.com', 'password123', '+91 98450 12345', 'customer', 0, NULL, NULL, '2026-03-01T12:00:00Z');
INSERT INTO users (id, name, email, password_hash, phone, role, smartpoints, addresses_json, desk_items_json, created_at) VALUES ('user-4', 'Rahul Verma', 'rahul.verma@example.com', 'password123', '+91 97110 56789', 'customer', 0, NULL, NULL, '2026-03-10T14:00:00Z');
INSERT INTO users (id, name, email, password_hash, phone, role, smartpoints, addresses_json, desk_items_json, created_at) VALUES ('user-5', 'Ananya Deshmukh', 'ananya.art@example.com', 'password123', '+91 99220 88776', 'customer', 0, NULL, NULL, '2026-03-15T09:00:00Z');

-- INSERT CATEGORIES
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-writing', 'Writing Instruments', 'writing-instruments', NULL, 'Ball pens, gel pens, fountain pens, mechanical pencils, and fine liners.', 1);
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-notebooks', 'Notebooks & Paper', 'notebooks-paper', NULL, 'Spiral notebooks, hardcover journals, A4 registers, and sketchbooks.', 2);
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-school', 'School Essentials', 'school-essentials', NULL, 'Geometry boxes, sharpeners, erasers, pencil cases, and water bottles.', 3);
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-office', 'Office Supplies', 'office-supplies', NULL, 'Files, folders, staplers, calculators, sticky notes, and paper clips.', 4);
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-art', 'Art Supplies', 'art-supplies', NULL, 'Watercolours, acrylic paints, sketchbooks, canvas, and drawing pencils.', 5);
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-craft', 'Craft & DIY', 'craft-diy', NULL, 'Scissors, craft glue, origami papers, glitter pens, and tapes.', 6);
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-planning', 'Planners & Journals', 'planners-journals', NULL, 'Academic planners, undated daily trackers, habit diaries, and bullet dot grids.', 7);
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-desk', 'Desk Organizers', 'desk-organizers', NULL, 'Pen stands, multi-compartment mesh trays, bookends, and study lamps.', 8);
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-exam', 'Exam Essentials', 'exam-essentials', NULL, 'Transparent exam pouches, blue/black ball pens, exam pads, and clipboards.', 9);
INSERT INTO categories (id, name, slug, icon, description, display_order) VALUES ('cat-gifts', 'Gift Sets & Combos', 'gift-sets-combos', NULL, 'Curated stationery hampers, calligraphy starter kits, and gift boxes.', 10);

-- INSERT BRANDS
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-classmate', 'Classmate', 'classmate', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-doms', 'DOMS', 'doms', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-camlin', 'Camlin Kokuyo', 'camlin', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-flair', 'Flair', 'flair', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-parker', 'Parker', 'parker', 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-cello', 'Cello', 'cello', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-faber', 'Faber-Castell', 'faber-castell', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-staedtler', 'Staedtler', 'staedtler', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-maped', 'Maped', 'maped', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-pentel', 'Pentel', 'pentel', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-pilot', 'Pilot', 'pilot', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-reynolds', 'Reynolds', 'reynolds', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-luxor', 'Luxor', 'luxor', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-uniball', 'Uni-ball', 'uni-ball', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=120&auto=format&fit=crop&q=80', 0, NULL);
INSERT INTO brands (id, name, slug, logo, is_featured, country) VALUES ('brand-kangaroo', 'Kangaro', 'kangaro', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=120&auto=format&fit=crop&q=80', 0, NULL);

-- INSERT PRODUCTS
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-001', 'Classmate Pulse 6-Subject Spiral Notebook A4', 'classmate-pulse-6-subject-spiral-notebook-a4', 'NOTE-CLS-PUL-A4-01', '8901030784912', 'brand-classmate', 'Classmate', 'cat-notebooks', 'Notebooks & Paper', 'Spiral Notebooks', 'Premium A4 single-subject spiral notebook with high-opacity 70 GSM elemental chlorine-free paper. Smooth micro-perforated pages with movable tab dividers to separate your coursework neatly.', '300 Pages A4 Spiral Bound with colour-coded subject dividers.', 185, 220, 16, 12, 75, 15, 4.8, 142, 0, 1, 1, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1517842645767-c639042777db?w=700&auto=format&fit=crop&q=80"]', '{"paperSize":"A4 (21 x 29.7 cm)","pages":300,"paperGsm":70,"ruling":"Ruled","binding":"Spiral","coverType":"Polypropylene Water-resistant","countryOfOrigin":"India"}', '["College","School","Exam","Study Desk"]', 'active', '2026-08-10T10:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v1-1', 'prod-001', '300 Pages - Single', 'NOTE-CLS-PUL-A4-01', 'A4', NULL, 1, 185, 220, 45);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v1-2', 'prod-001', '300 Pages - Pack of 2', 'NOTE-CLS-PUL-A4-02', 'A4', NULL, 2, 349, 440, 30);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-002', 'DOMS Zoom Ultimate Triangle Mechanical Pencil 0.7mm', 'doms-zoom-ultimate-mechanical-pencil-07mm', 'PEN-DOM-ZOO-07', '8906073771023', 'brand-doms', 'DOMS', 'cat-writing', 'Writing Instruments', 'Mechanical Pencils', 'Ergonomic triangular comfort grip mechanical pencil with shock-absorbing lead cushion. Includes 2B hi-polymer lead tube with integrated twist eraser at the back for smooth fatigue-free writing.', '0.7mm Hi-Polymer Mechanical Pencil with twist eraser & lead tube.', 49, 60, 18, 18, 120, 25, 4.7, 98, 0, 1, 1, 0, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Mechanical Pencil","tipSize":"0.7mm","refillable":true,"material":"Impact-resistant ABS plastic","countryOfOrigin":"India"}', '["School","College","Exam","Drawing"]', 'active', '2026-08-12T11:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v2-1', 'prod-002', 'Pastel Blue (0.7mm)', 'PEN-DOM-ZOO-07-BLU', NULL, 'Blue', 1, 49, 60, 60);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v2-2', 'prod-002', 'Pastel Coral (0.7mm)', 'PEN-DOM-ZOO-07-COR', NULL, 'Coral', 1, 49, 60, 60);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-003', 'Camlin Kokuyo Scholar Geometry Box', 'camlin-kokuyo-scholar-geometry-box', 'SCH-CAM-SCH-GEO', '8901425010023', 'brand-camlin', 'Camlin Kokuyo', 'cat-school', 'School Essentials', 'Geometry Boxes', 'Specially engineered high-accuracy self-centering compass and divider made of rust-proof virgin alloy. Features transparent calibrated scales with bevelled edges and scratch-resistant markings.', 'All-metal precision compass set with plastic scale, protractor & set squares.', 135, 160, 15, 12, 64, 10, 4.8, 110, 0, 1, 1, 0, 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&auto=format&fit=crop&q=80"]', '{"material":"Rust-resistant Alloy & Acrylic","suitableFor":"School Mathematics, Technical Drafting","countryOfOrigin":"India"}', '["School","College","Exam"]', 'active', '2026-08-15T09:30:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v3-1', 'prod-003', 'Standard Scholar Tin Box', 'SCH-CAM-SCH-GEO', NULL, NULL, 1, 135, 160, 64);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-004', 'Pentel EnerGel Retractable Liquid Gel Pen 0.5mm (Pack of 3)', 'pentel-energel-retractable-liquid-gel-pen-05mm-pack-3', 'PEN-PEN-ENE-05-3', '088485100342', 'brand-pentel', 'Pentel', 'cat-writing', 'Writing Instruments', 'Gel Pens', 'High-performance quick-dry liquid gel ink combines the best qualities of liquid and gel. Dries fast even on left-handed writing without smears or smudges. Sleek barrel with latex-free comfort grip.', 'Ultra-fast drying EnerGel quick-dry ink. 0.5mm needle tip (Pack of 3).', 175, 210, 17, 18, 83, 20, 4.9, 215, 0, 1, 1, 0, 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Gel","tipSize":"0.5mm","inkColor":"Blue & Black","refillable":true,"packSize":3,"countryOfOrigin":"Japan"}', '["College","Office","Exam","Journaling"]', 'active', '2026-08-18T14:15:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v4-1', 'prod-004', 'Blue Ink (Pack of 3)', 'PEN-PEN-ENE-05-BLU', NULL, 'Blue', 3, 175, 210, 50);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v4-2', 'prod-004', 'Black Ink (Pack of 3)', 'PEN-PEN-ENE-05-BLK', NULL, 'Black', 3, 175, 210, 35);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-005', 'Faber-Castell Tri-Colour Pencils Tin (Set of 24)', 'faber-castell-tri-colour-pencils-tin-set-24', 'ART-FAB-TRI-24', '8901180632018', 'brand-faber', 'Faber-Castell', 'cat-art', 'Art Supplies', 'Paints & Colours', 'Vibrant triangular coloured pencils with SV-bonding process that prevents core breakage. Made from 100% certified reforested wood. Smooth blending pigments suitable for illustration and colouring.', 'Break-resistant triangular colour pencils in durable metal storage tin.', 249, 300, 17, 12, 52, 10, 4.8, 89, 0, 1, 1, 1, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80"]', '{"colorCount":24,"material":"100% Reforested Sustainable Pine","suitableFor":"Sketching, Colouring, Art Projects","ageGroup":"6+ Years & Adults","countryOfOrigin":"India"}', '["Art","Drawing","School","Gift"]', 'active', '2026-08-20T10:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v5-1', 'prod-005', '24 Shades Metal Tin', 'ART-FAB-TRI-24', NULL, NULL, 1, 249, 300, 52);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-006', 'Flair Pastel Highlighter Set (Pack of 5 Soft Pastel Shades)', 'flair-pastel-highlighter-set-pack-of-5', 'PEN-FLA-PAS-05', '8901765103421', 'brand-flair', 'Flair', 'cat-writing', 'Writing Instruments', 'Highlighters', 'Subtle aesthetic pastel shades that do not bleed through notebook paper or cause eye strain. Chisel tip allows 1mm fine underlining and 4mm broad highlighting. Non-toxic water-based ink.', 'Chic pastel aesthetic highlighters: Mint, Lavender, Peach, Powder Blue & Coral.', 99, 125, 20, 18, 140, 30, 4.7, 165, 1, 1, 1, 0, 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Highlighter","tipSize":"1mm - 4mm Chisel","packSize":5,"inkColor":"Pastel Multi-pack","countryOfOrigin":"India"}', '["College","School","Exam","Journaling","Study Desk"]', 'active', '2026-08-22T16:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v6-1', 'prod-006', 'Pack of 5 Pastel Shades', 'PEN-FLA-PAS-05', NULL, NULL, 5, 99, 125, 140);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-007', 'SmartStation Minimalist Academic Habit & Daily Planner A5', 'smartstation-minimalist-academic-habit-daily-planner-a5', 'PLAN-SS-ACAD-A5', '8908012345012', 'brand-classmate', 'Classmate', 'cat-planning', 'Planners & Journals', 'Daily & Weekly Planners', 'Undated 12-month productivity planner crafted with premium 100 GSM fountain-pen friendly ivory paper. Features priority goal matrices, weekly habit trackers, exam revision schedules, and ribbon bookmark.', '100 GSM Ivory Paper, undated layout, habit trackers & exam study matrices.', 349, 499, 30, 12, 45, 10, 4.9, 78, 1, 1, 1, 1, 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80"]', '{"paperSize":"A5 (14.8 x 21 cm)","pages":192,"paperGsm":100,"ruling":"Grid","binding":"Hardcover","coverType":"Vegan Leather with Foil Emboss","dimensions":"21.5 x 15 x 2 cm","countryOfOrigin":"India"}', '["College","Office","Journaling","Study Desk","Gift"]', 'active', '2026-08-25T11:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v7-1', 'prod-007', 'Sage Green Hardcover', 'PLAN-SS-ACAD-A5-SGE', 'A5', 'Sage Green', 1, 349, 499, 25);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v7-2', 'prod-007', 'Charcoal Navy Hardcover', 'PLAN-SS-ACAD-A5-NAV', 'A5', 'Navy Blue', 1, 349, 499, 20);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-008', 'Parker Vector Matte Black Fountain Pen with Chrome Trim', 'parker-vector-matte-black-fountain-pen-chrome-trim', 'PEN-PAR-VEC-FP', '3501170726021', 'brand-parker', 'Parker', 'cat-writing', 'Writing Instruments', 'Fountain Pens', 'Iconic Parker Vector fountain pen featuring an ultra-durable resin barrel with matte black finish and stainless steel fine nib. Ergonomic tapered section provides steady ink flow with converter or Parker cartridges.', 'Matte black resin barrel with stainless steel fine nib & ink cartridge.', 499, 650, 23, 18, 35, 8, 4.8, 130, 0, 0, 1, 0, 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Fountain","tipSize":"Fine Nib (0.5mm)","inkColor":"Blue","refillable":true,"material":"Engineered Resin & Chrome Trim","countryOfOrigin":"France / UK"}', '["Office","College","Gift","Journaling"]', 'active', '2026-08-28T12:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v8-1', 'prod-008', 'Matte Black - Fine Nib', 'PEN-PAR-VEC-FP-BLK', NULL, 'Matte Black', 1, 499, 650, 35);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-009', 'Multi-Compartment Metal Mesh Desk Organizer with Drawer', 'multi-compartment-metal-mesh-desk-organizer-with-drawer', 'DSK-SS-MSH-01', '8907812001923', 'brand-kangaroo', 'Kangaro', 'cat-desk', 'Desk Organizers', 'Desk Trays & Pen Stands', 'Keep your study desk immaculate with this 6-compartment electroplated steel mesh desktop caddy. Includes a smooth sliding drawer for paperclips and sticky notes, dual upright pen slots, and notebook shelf.', 'Electroplated steel mesh organizer with 6 compartments & sliding drawer.', 320, 450, 28, 18, 42, 10, 4.7, 64, 1, 1, 1, 0, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80"]', '{"material":"Rust-resistant Powder-Coated Metal Mesh","dimensions":"22 x 14 x 13 cm","countryOfOrigin":"India"}', '["Study Desk","Office","College","Gift"]', 'active', '2026-09-01T15:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v9-1', 'prod-009', 'Matte Black', 'DSK-SS-MSH-01-BLK', NULL, 'Black', 1, 320, 450, 24);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v9-2', 'prod-009', 'Rose Gold', 'DSK-SS-MSH-01-RSG', NULL, 'Rose Gold', 1, 350, 490, 18);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-010', 'Staedtler Mars Lumograph Graphite Sketching Pencils (Tin of 6)', 'staedtler-mars-lumograph-sketching-pencils-set-of-6', 'ART-STE-MAR-06', '4007817100010', 'brand-staedtler', 'Staedtler', 'cat-art', 'Art Supplies', 'Graphite & Charcoal Pencils', 'Finest German drafting and sketching pencils with super-bonded lead formulation for extreme break resistance. Includes 6 distinct artist grading leads: 2H, HB, B, 2B, 4B, and 6B in tin case.', 'Professional German artist sketching pencils (2H, HB, B, 2B, 4B, 6B).', 360, 420, 14, 12, 40, 10, 4.9, 92, 0, 1, 1, 1, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80"]', '{"colorCount":6,"material":"Certified Cedar Wood with Bonded Graphite","suitableFor":"Technical Drawing, Portraiture, Shading","countryOfOrigin":"Germany"}', '["Art","Drawing","College","School"]', 'active', '2026-09-03T10:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v10-1', 'prod-010', 'Tin of 6 Grades (2H - 6B)', 'ART-STE-MAR-06', NULL, NULL, 1, 360, 420, 40);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-011', 'SmartStation Exam Master Clear Zipper Pouch Stationery Combo', 'smartstation-exam-master-clear-zipper-pouch-stationery-combo', 'EXM-SS-MST-CMB', '8908012345099', 'brand-doms', 'DOMS', 'cat-exam', 'Exam Essentials', 'Pencil Pouches', 'Exam hall compliant transparent mesh-reinforced PVC zipper pouch pre-packed with 2 blue gel pens, 2 black ball pens, 1 mechanical pencil 0.7mm, 1 dust-free eraser, 1 steel ruler 15cm, and 1 mini sharpener.', 'Official exam hall transparent pouch + 8 essential exam tools combo.', 199, 275, 27, 18, 90, 20, 4.9, 220, 1, 1, 1, 0, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&auto=format&fit=crop&q=80"]', '{"material":"Waterproof Transparent Polyvinyl","dimensions":"23 x 12 cm","countryOfOrigin":"India"}', '["Exam","School","College"]', 'active', '2026-09-05T12:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v11-1', 'prod-011', 'Transparent Blue Zipper', 'EXM-SS-MST-BLU', NULL, 'Blue', 1, 199, 275, 50);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v11-2', 'prod-011', 'Transparent Clear Zipper', 'EXM-SS-MST-CLR', NULL, 'Clear', 1, 199, 275, 40);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-012', 'Cello Butterflow Classic Ball Pen Blue (Pack of 10)', 'cello-butterflow-classic-ball-pen-blue-pack-of-10', 'PEN-CEL-BUT-BLU-10', '8901234005612', 'brand-cello', 'Cello', 'cat-writing', 'Writing Instruments', 'Ballpoint Pens', 'The beloved butter-smooth daily ball pen engineered with Lubriflow low-viscosity ink system. Textured comfortable rubber grip enables speed handwriting during exams and lengthy lectures.', 'Lubriflow ink system ballpoint pen with soft rubber grip. Pack of 10.', 90, 100, 10, 18, 180, 40, 4.6, 310, 0, 1, 1, 0, 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Ball","tipSize":"0.7mm","inkColor":"Blue","refillable":true,"packSize":10,"countryOfOrigin":"India"}', '["School","College","Exam","Office"]', 'active', '2026-09-08T09:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v12-1', 'prod-012', 'Blue Ink (Pack of 10)', 'PEN-CEL-BUT-BLU-10', NULL, 'Blue', 10, 90, 100, 120);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v12-2', 'prod-012', 'Black Ink (Pack of 10)', 'PEN-CEL-BUT-BLK-10', NULL, 'Black', 10, 90, 100, 60);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-013', 'Post-it Super Sticky Notes Cube 3x3 inches (400 Sheets Pastel)', 'post-it-super-sticky-notes-cube-3x3-pastel', 'OFC-POST-STK-400', '051131976214', 'brand-classmate', 'Classmate', 'cat-office', 'Office Supplies', 'Sticky Notes & Flags', 'Vibrant pastel 3x3 inch note cube with 2x the sticking power of standard notes. Sticks reliably to notebooks, monitors, doors and textbooks without leaving glue residue.', '400 sheets multi-pastel self-adhesive notes cube.', 199, 249, 20, 18, 70, 15, 4.8, 95, 0, 1, 1, 1, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80"]', '{"paperSize":"76 x 76 mm (3x3 in)","pages":400,"paperGsm":75,"countryOfOrigin":"India"}', '["Study Desk","Office","College","Exam"]', 'active', '2026-09-10T11:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v13-1', 'prod-013', 'Pastel Rainbow Cube (400 Sheets)', 'OFC-POST-STK-400', NULL, NULL, 1, 199, 249, 70);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-014', 'Kangaro Heavy Duty Desk Stapler with 2000 Pins Set', 'kangaro-heavy-duty-desk-stapler-with-pins', 'OFC-KAN-STP-10D', '8901235610012', 'brand-kangaroo', 'Kangaro', 'cat-office', 'Office Supplies', 'Staplers & Punching Machines', 'Rugged all-metal construction desktop stapler with quick-load magazine and anti-skid rubber base. Easily binds up to 30 sheets of 75 GSM paper without jam. Comes bundled with 2000 No. 10 staples.', 'All-metal desk stapler with reload indicator + 2000 staple pins.', 145, 175, 17, 18, 55, 10, 4.7, 82, 0, 0, 1, 0, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&auto=format&fit=crop&q=80"]', '{"material":"Zinc Alloy & Chrome Plating","countryOfOrigin":"India"}', '["Office","College","Study Desk"]', 'active', '2026-09-12T13:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v14-1', 'prod-014', 'Standard Grey + 2000 Pins', 'OFC-KAN-STP-10D', NULL, NULL, 1, 145, 175, 55);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-015', 'Pilot V5 Hi-Tecpoint Liquid Ink Rollerball 0.5mm (Pack of 3)', 'pilot-v5-hi-tecpoint-liquid-ink-rollerball-pack-of-3', 'PEN-PIL-V05-BLU-3', '4902505085421', 'brand-pilot', 'Pilot', 'cat-writing', 'Writing Instruments', 'Gel Pens', 'Classic Japanese V-System liquid ink rollerball featuring an ink controller mechanism that guarantees consistent line density to the very last drop. Multi-dimple 0.5mm tip produces crisp lines.', 'Pure liquid ink with visible ink reservoir window. 0.5mm (Pack of 3).', 180, 210, 14, 18, 95, 20, 4.8, 175, 0, 1, 1, 0, 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Rollerball","tipSize":"0.5mm","inkColor":"Blue","refillable":false,"packSize":3,"countryOfOrigin":"Japan"}', '["College","Exam","Office","Journaling"]', 'active', '2026-09-15T15:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v15-1', 'prod-015', 'Blue (Pack of 3)', 'PEN-PIL-V05-BLU-3', NULL, 'Blue', 3, 180, 210, 60);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v15-2', 'prod-015', 'Black (Pack of 3)', 'PEN-PIL-V05-BLK-3', NULL, 'Black', 3, 180, 210, 35);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-016', 'Classmate Hardcover Ruled Executive Journal A5 (192 Pages)', 'classmate-hardcover-ruled-executive-journal-a5', 'NOTE-CLS-EXE-A5', '8901030998812', 'brand-classmate', 'Classmate', 'cat-notebooks', 'Notebooks & Paper', 'Hardcover Journals', 'Luxurious cloth-textured hardcover diary journal with 80 GSM natural shade paper. Lay-flat 180-degree thread-bound spine, integrated ribbon bookmark, and expandable back pocket for paper souvenirs.', '80 GSM natural shade paper with expandable back inner pocket.', 199, 260, 23, 12, 58, 12, 4.8, 88, 0, 1, 1, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&auto=format&fit=crop&q=80"]', '{"paperSize":"A5 (14.8 x 21 cm)","pages":192,"paperGsm":80,"ruling":"Ruled","binding":"Hardcover","countryOfOrigin":"India"}', '["Journaling","College","Office","Gift"]', 'active', '2026-09-18T10:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v16-1', 'prod-016', 'Midnight Navy', 'NOTE-CLS-EXE-NAV', 'A5', 'Navy Blue', 1, 199, 260, 30);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v16-2', 'prod-016', 'Terracotta Brown', 'NOTE-CLS-EXE-TER', 'A5', 'Brown', 1, 199, 260, 28);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-017', 'Maped Precision Stainless Steel Scissors 17cm (Ergonomic Grip)', 'maped-precision-stainless-steel-scissors-17cm', 'CRF-MAP-SCI-17', '3154144680104', 'brand-maped', 'Maped', 'cat-craft', 'Craft & DIY', 'Scissors & Knives', 'High grade brushed stainless steel blades with 3D ergonomic soft ring handles. Precise cutting action through cardstock, fabrics, ribbons and paper without hand fatigue.', '17cm brushed stainless steel blades with soft finger grip rings.', 85, 110, 23, 18, 65, 15, 4.6, 52, 0, 0, 0, 0, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&auto=format&fit=crop&q=80"]', '{"material":"Stainless Steel & Soft-touch TPE","countryOfOrigin":"France / India"}', '["School","Craft","Office","Study Desk"]', 'active', '2026-09-20T11:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v17-1', 'prod-017', 'Standard 17cm', 'CRF-MAP-SCI-17', NULL, NULL, 1, 85, 110, 65);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-018', 'Camlin Artist Watercolour Cakes Set of 24 with Free Brush', 'camlin-artist-watercolour-cakes-set-of-24', 'ART-CAM-WTR-24', '8901425032018', 'brand-camlin', 'Camlin Kokuyo', 'cat-art', 'Art Supplies', 'Paints & Colours', 'Classic water colour palette cakes crafted from finest pigments and gum arabic. Provides luminous washes, excellent lightfastness, and instant dissolution in water. Features built-in mixing palette lid.', '24 vibrant watercolour cake tablets in compact plastic palette box.', 180, 220, 18, 12, 48, 10, 4.7, 112, 0, 1, 1, 0, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80"]', '{"colorCount":24,"suitableFor":"Watercolour painting, illustration, school art","countryOfOrigin":"India"}', '["Art","Drawing","School","Gift"]', 'active', '2026-09-22T14:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v18-1', 'prod-018', '24 Cakes Box + Brush', 'ART-CAM-WTR-24', NULL, NULL, 1, 180, 220, 48);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-019', 'DOMS Non-Toxic Neon Eraser & Sharpener Duo Tub (Pack of 20)', 'doms-neon-eraser-sharpener-duo-tub-pack-of-20', 'SCH-DOM-ERS-TUB', '8906073775412', 'brand-doms', 'DOMS', 'cat-school', 'School Essentials', 'Erasers & Sharpeners', 'Dust-free polymer erasers with integrated contour sharpeners in neon colours. Cleans lead graphite cleanly without tearing paper or leaving black smudges.', 'Dust-free soft erasers with anti-rust blade sharpeners in storage tub.', 140, 180, 22, 12, 75, 15, 4.6, 67, 0, 0, 0, 0, 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&auto=format&fit=crop&q=80"]', '{"material":"Phthalate-free synthetic rubber","packSize":20,"countryOfOrigin":"India"}', '["School","Exam","College"]', 'active', '2026-09-25T16:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v19-1', 'prod-019', 'Tub of 20 Neon Duos', 'SCH-DOM-ERS-TUB', NULL, NULL, 20, 140, 180, 75);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-020', 'Uni-ball Eye UB-150 Waterproof Rollerball Pen (Pack of 3)', 'uni-ball-eye-ub-150-waterproof-rollerball-pack-of-3', 'PEN-UNI-EYE-150-3', '4902778912415', 'brand-uniball', 'Uni-ball', 'cat-writing', 'Writing Instruments', 'Ballpoint Pens', 'World-famous Uni-ball Eye featuring Super Ink: water-resistant, fade-resistant, and tamper-proof pigment ink that preserves documents for decades. Stainless steel 0.5mm micro tip.', 'Super Ink archival pigment ink. 0.5mm micro tip (Pack of 3).', 210, 240, 13, 18, 80, 15, 4.9, 190, 0, 1, 1, 0, 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Rollerball","tipSize":"0.5mm","inkColor":"Blue","refillable":false,"packSize":3,"countryOfOrigin":"Japan"}', '["Office","Exam","College","Journaling"]', 'active', '2026-09-28T09:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v20-1', 'prod-020', 'Blue (Pack of 3)', 'PEN-UNI-EYE-BLU-3', NULL, 'Blue', 3, 210, 240, 50);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v20-2', 'prod-020', 'Black (Pack of 3)', 'PEN-UNI-EYE-BLK-3', NULL, 'Black', 3, 210, 240, 30);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-021', 'SmartStation Artist Complete Calligraphy & Brush Lettering Kit', 'smartstation-artist-calligraphy-brush-lettering-kit', 'GFT-SS-CAL-KIT', '8908012345155', 'brand-camlin', 'Camlin Kokuyo', 'cat-gifts', 'Gift Sets & Combos', 'Brush Pens', 'Deluxe gift box including 12 flexible tip watercolour brush pens, 1 dual-tip calligraphy marker, 1 metallic gold fineliner, 1 A5 smooth lettering practice pad (120 GSM), and step-by-step guidebook.', '12 brush pens + calligraphy markers + 120 GSM practice pad in gift box.', 499, 699, 29, 12, 35, 8, 4.9, 74, 1, 1, 1, 0, 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80"]', '{"colorCount":14,"suitableFor":"Modern Calligraphy, Hand Lettering, Journaling","countryOfOrigin":"India"}', '["Art","Gift","Journaling","Drawing"]', 'active', '2026-10-01T10:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v21-1', 'prod-021', 'Complete Kit in Gift Box', 'GFT-SS-CAL-KIT', NULL, NULL, 1, 499, 699, 35);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-022', 'Reynolds 045 Fine Carbide Ballpoint Pen Blue (Pack of 20)', 'reynolds-045-fine-carbide-ballpoint-pen-blue-pack-20', 'PEN-REY-045-BLU-20', '8901765004523', 'brand-reynolds', 'Reynolds', 'cat-writing', 'Writing Instruments', 'Ballpoint Pens', 'The legendary hexagonal white barrel ball pen that has powered Indian students for generations. Laser tip fine point guarantees smooth uninterrupted writing with zero blotches.', 'The classic non-slip hexagonal ball pen. Laser tip. Pack of 20.', 130, 160, 19, 18, 150, 30, 4.7, 280, 0, 1, 0, 0, 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Ball","tipSize":"0.7mm","inkColor":"Blue","packSize":20,"countryOfOrigin":"India"}', '["School","College","Exam","Office"]', 'active', '2026-10-03T11:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v22-1', 'prod-022', 'Blue (Pack of 20)', 'PEN-REY-045-BLU-20', NULL, 'Blue', 20, 130, 160, 150);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-023', 'Classmate Drawing Book Spiral Bound A3 Size (40 Pages 100 GSM)', 'classmate-drawing-book-spiral-bound-a3-size', 'NOTE-CLS-DRW-A3', '8901030456123', 'brand-classmate', 'Classmate', 'cat-notebooks', 'Notebooks & Paper', 'Drawing Books', 'Heavyweight 100 GSM cartridge drawing paper suited for dry and wet media including graphite, oil pastels, poster colours, and colour pencils. Heavy duty protective cardboard backboard.', '100 GSM premium acid-free cartridge paper. A3 landscape spiral.', 120, 145, 17, 12, 60, 15, 4.8, 92, 0, 1, 1, 1, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80"]', '{"paperSize":"A3 (29.7 x 42 cm)","pages":40,"paperGsm":100,"ruling":"Plain","binding":"Spiral","countryOfOrigin":"India"}', '["Art","Drawing","School","College"]', 'active', '2026-10-05T14:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v23-1', 'prod-023', 'A3 Landscape Spiral (40 Pages)', 'NOTE-CLS-DRW-A3', 'A3', NULL, 1, 120, 145, 60);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-024', 'Casio FX-991CW Scientific Calculator (ClassWiz Edition)', 'casio-fx-991cw-scientific-calculator-classwiz', 'OFC-CAS-991CW', '4549526614125', 'brand-kangaroo', 'Kangaro', 'cat-office', 'Office Supplies', 'Calculators', 'Standard approved scientific calculator for engineering, commerce and CBSE/ICSE college examinations. Features 540+ functions, natural textbook display, QR code result graphing, and twin solar/battery power.', '540+ functions natural textbook display scientific calculator.', 1399, 1595, 12, 18, 28, 6, 4.9, 240, 0, 1, 1, 0, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80"]', '{"material":"Hard Protective Slide-on Case with High-contrast LCD","warranty":"3 Years Casio Warranty","countryOfOrigin":"Thailand"}', '["College","Exam","Office"]', 'active', '2026-10-08T09:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v24-1', 'prod-024', 'ClassWiz Edition Black', 'OFC-CAS-991CW-BLK', NULL, 'Black', 1, 1399, 1595, 28);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-025', 'Luxor Fine Permanent Marker Assorted Colours (Pack of 4)', 'luxor-fine-permanent-marker-assorted-pack-of-4', 'PEN-LUX-PERM-04', '8901765032014', 'brand-luxor', 'Luxor', 'cat-writing', 'Writing Instruments', 'Markers', 'Quick-drying waterproof permanent ink marker that writes on almost any surface including plastic, metal, cardboard, CDs, glass, and wood. Bullet tip creates clean bold 1.0mm lines.', 'Waterproof smudge-free permanent markers: Black, Blue, Red, Green.', 95, 120, 21, 18, 88, 20, 4.6, 71, 0, 0, 0, 0, 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Marker","tipSize":"1.0mm Bullet","packSize":4,"inkColor":"Assorted 4 Colours","countryOfOrigin":"India"}', '["Office","School","College","Craft"]', 'active', '2026-10-10T12:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v25-1', 'prod-025', 'Pack of 4 Assorted', 'PEN-LUX-PERM-04', NULL, NULL, 4, 95, 120, 88);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-026', 'DOMS Champions Acrylic Colour Set (12 Shades x 10ml Tubes)', 'doms-champions-acrylic-colour-set-12-shades', 'ART-DOM-ACR-12', '8906073778012', 'brand-doms', 'DOMS', 'cat-art', 'Art Supplies', 'Paints & Colours', 'Heavy body artist acrylic paints with brilliant satin finish and high pigment concentration. Rapid drying waterproof emulsion suitable for painting on canvas, paper, wood, terracotta, and fabric.', '12 rich pigment acrylic colour tubes with mixing palette.', 195, 240, 19, 12, 50, 10, 4.8, 84, 0, 1, 1, 0, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80"]', '{"colorCount":12,"suitableFor":"Canvas, Paper, Terracotta, Wood","countryOfOrigin":"India"}', '["Art","Drawing","Gift","Craft"]', 'active', '2026-10-12T14:30:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v26-1', 'prod-026', '12 Shades x 10ml Tubes', 'ART-DOM-ACR-12', NULL, NULL, 1, 195, 240, 50);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-027', 'Classmate Octane Neon Gel Pen (Pack of 5 Assorted)', 'classmate-octane-neon-gel-pen-pack-of-5', 'PEN-CLS-OCT-05', '8901030554129', 'brand-classmate', 'Classmate', 'cat-writing', 'Writing Instruments', 'Gel Pens', 'Super fast Japanese waterproof gel ink with ergonomic rubber contour grip. Glides effortlessly over ruled notebook pages without smearing or scratchiness.', '0.5mm Japanese gel ink for high speed exam writing.', 50, 60, 17, 18, 160, 35, 4.7, 145, 0, 1, 0, 0, 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&auto=format&fit=crop&q=80"]', '{"writingType":"Gel","tipSize":"0.5mm","inkColor":"Blue & Black","packSize":5,"countryOfOrigin":"India"}', '["School","College","Exam"]', 'active', '2026-10-14T10:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v27-1', 'prod-027', 'Blue Gel (Pack of 5)', 'PEN-CLS-OCT-BLU-05', NULL, 'Blue', 5, 50, 60, 100);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v27-2', 'prod-027', 'Black Gel (Pack of 5)', 'PEN-CLS-OCT-BLK-05', NULL, 'Black', 5, 50, 60, 60);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-028', 'SmartStation Back-to-College All-in-One Desk Bundle', 'smartstation-back-to-college-all-in-one-desk-bundle', 'GFT-SS-COL-BND', '8908012345201', 'brand-classmate', 'Classmate', 'cat-gifts', 'Gift Sets & Combos', 'Gift Sets', 'Complete academic starter kit curated for college students. Includes 2 Classmate Pulse spiral notebooks, 1 pack of 5 pastel highlighters, 3 Pentel EnerGel gel pens, 1 Post-it notes cube, and 1 stainless steel metal mesh desk organizer.', '2 Notebooks + 5 Highlighters + 3 EnerGel Pens + Sticky Notes + Desk Caddy.', 649, 899, 28, 12, 25, 5, 4.9, 89, 1, 1, 1, 0, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80"]', '{"packSize":12,"countryOfOrigin":"India"}', '["College","Study Desk","Gift","Exam"]', 'active', '2026-10-16T11:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v28-1', 'prod-028', 'Curated College Kit', 'GFT-SS-COL-BND', NULL, NULL, 1, 649, 899, 25);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-029', 'JK Copier A4 Paper 75 GSM (Ream of 500 Sheets)', 'jk-copier-a4-paper-75-gsm-500-sheets', 'OFC-JK-A4-500', '8901234567890', 'brand-kangaroo', 'Kangaro', 'cat-office', 'Office Supplies', 'Files & Folders', 'India’s most trusted copier paper with ColorLok technology. Exceptional brightness and surface smoothness prevents printer jams and produces crisp black text and rich colour prints.', '75 GSM high brightness copier paper for laser and inkjet printers.', 330, 390, 15, 12, 110, 25, 4.8, 310, 0, 1, 1, 1, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80"]', '{"paperSize":"A4 (21 x 29.7 cm)","pages":500,"paperGsm":75,"countryOfOrigin":"India"}', '["Office","College","School"]', 'active', '2026-10-18T10:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v29-1', 'prod-029', '1 Ream (500 Sheets)', 'OFC-JK-A4-500', NULL, NULL, 1, 330, 390, 80);
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v29-2', 'prod-029', 'Case of 5 Reams (2500 Sheets)', 'OFC-JK-A4-2500', NULL, NULL, 5, 1599, 1950, 30);
INSERT INTO products (id, name, slug, sku, barcode, brand_id, brand_name, category_id, category_name, subcategory, description, short_description, price, mrp, discount_percentage, tax_percentage, stock, low_stock_threshold, rating, review_count, is_new, is_bestseller, is_featured, is_eco_friendly, primary_image, images_json, specifications_json, purpose_tags_json, status, created_at) VALUES ('prod-030', 'Maped Connect Dual Sharpener & Dust-Free Eraser Combo', 'maped-connect-dual-sharpener-eraser-combo', 'SCH-MAP-CON-DUO', '3154140023412', 'brand-maped', 'Maped', 'cat-school', 'School Essentials', 'Erasers & Sharpeners', 'Innovative interlocking 2-in-1 tool featuring a high precision twin-hole pencil sharpener on one end and a capped rotating eraser on the other. Fits neatly inside student pencil boxes.', 'Dual hole sharpener with shavings canister + protective capped eraser.', 65, 85, 24, 12, 95, 20, 4.7, 48, 0, 0, 0, 0, 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&auto=format&fit=crop&q=80', '["https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&auto=format&fit=crop&q=80"]', '{"material":"Impact Resistant Polycarbonate","countryOfOrigin":"France / India"}', '["School","Exam","College"]', 'active', '2026-10-20T12:00:00Z');
INSERT INTO product_variants (id, product_id, name, sku, size, color, pack_size, price, mrp, stock) VALUES ('v30-1', 'prod-030', 'Vibrant Cyan / Lime', 'SCH-MAP-CON-DUO', NULL, NULL, 1, 65, 85, 95);

-- INSERT ORDERS & ORDER ITEMS
INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address_json, items_count, subtotal, shipping_fee, discount_total, smartpoints_used, smartpoints_discount, smartpoints_earned, final_total, payment_method, payment_status, order_status, tracking_carrier, tracking_number, tracking_url, estimated_delivery, coupon_code, notes, created_at, updated_at) VALUES ('ord-mvpn71ld', 'SS-2026-86332', 'user-customer', 'Joe Student', 'customer@smartstation.com', '+91 98111 22334', '{"fullName":"Joe Student","phone":"+91 98111 22334","email":"customer@smartstation.com","addressLine":"Flat 402, Lotus Pride Apartments, 12th Main Road, HSR Layout Sector 2","city":"Bengaluru","state":"Karnataka","pincode":"560102","type":"Home"}', 1, 350, 0, 0, 20, 20, 0, 295, 'UPI', 'paid', 'confirmed', 'BlueDart Express', 'SS-310730-IN', NULL, '', 'WELCOME10', NULL, '2026-10-26T19:21:16.753Z', '2026-10-26T19:21:16.753Z');
INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, variant_id, variant_name, unit_price, quantity, subtotal) VALUES ('item-ord-mvpn71ld-1', 'ord-mvpn71ld', 'prod-004', 'Pentel EnerGel Retractable Liquid Gel Pen 0.5mm (Pack of 3)', 'PEN-PEN-ENE-05-3', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '', 'PEN-PEN-ENE-05-3', 175, 2, 350);
INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address_json, items_count, subtotal, shipping_fee, discount_total, smartpoints_used, smartpoints_discount, smartpoints_earned, final_total, payment_method, payment_status, order_status, tracking_carrier, tracking_number, tracking_url, estimated_delivery, coupon_code, notes, created_at, updated_at) VALUES ('ord-1001', 'SS-2026-88412', 'user-customer', 'Joe Student', 'customer@smartstation.com', '+91 98111 22334', '{"id":"addr-cust-1","fullName":"Joe Student","phone":"+91 98111 22334","email":"customer@smartstation.com","addressLine":"Flat 402, Lotus Pride Apartments, 12th Main Road, HSR Layout Sector 2","city":"Bengaluru","state":"Karnataka","pincode":"560102","landmark":"Opposite BDA Complex","type":"Home","isDefault":true}', 2, 545, 0, 50, 0, 0, 0, 543, 'UPI', 'paid', 'delivered', 'BlueDart Express', 'BD-884120921-IN', NULL, '2026-10-20', 'SAVE50', NULL, '2026-10-18T10:15:00Z', '2026-10-18T10:15:00Z');
INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, variant_id, variant_name, unit_price, quantity, subtotal) VALUES ('item-ord-1001-1', 'ord-1001', 'prod-001', 'Classmate Pulse 6-Subject Spiral Notebook A4', 'NOTE-CLS-PUL-A4-01', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80', '', '300 Pages - Single', 185, 2, 370);
INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, variant_id, variant_name, unit_price, quantity, subtotal) VALUES ('item-ord-1001-2', 'ord-1001', 'prod-004', 'Pentel EnerGel Retractable Liquid Gel Pen 0.5mm (Pack of 3)', 'PEN-PEN-ENE-05-BLU', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '', 'Blue Ink (Pack of 3)', 175, 1, 175);
INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address_json, items_count, subtotal, shipping_fee, discount_total, smartpoints_used, smartpoints_discount, smartpoints_earned, final_total, payment_method, payment_status, order_status, tracking_carrier, tracking_number, tracking_url, estimated_delivery, coupon_code, notes, created_at, updated_at) VALUES ('ord-1002', 'SS-2026-88540', 'user-customer', 'Joe Student', 'customer@smartstation.com', '+91 98111 22334', '{"id":"addr-cust-1","fullName":"Joe Student","phone":"+91 98111 22334","email":"customer@smartstation.com","addressLine":"Flat 402, Lotus Pride Apartments, 12th Main Road, HSR Layout Sector 2","city":"Bengaluru","state":"Karnataka","pincode":"560102","landmark":"Opposite BDA Complex","type":"Home","isDefault":true}', 2, 448, 40, 44, 0, 0, 0, 482, 'Card', 'paid', 'shipped', 'DTDC Courier', 'DTDC-442109-IN', NULL, '2026-10-27', 'WELCOME10', NULL, '2026-10-24T14:00:00Z', '2026-10-24T14:00:00Z');
INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, variant_id, variant_name, unit_price, quantity, subtotal) VALUES ('item-ord-1002-1', 'ord-1002', 'prod-007', 'SmartStation Minimalist Academic Habit & Daily Planner A5', 'PLAN-SS-ACAD-A5-SGE', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=700&auto=format&fit=crop&q=80', '', 'Sage Green Hardcover', 349, 1, 349);
INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, variant_id, variant_name, unit_price, quantity, subtotal) VALUES ('item-ord-1002-2', 'ord-1002', 'prod-006', 'Flair Pastel Highlighter Set (Pack of 5 Soft Pastel Shades)', 'PEN-FLA-PAS-05', 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700&auto=format&fit=crop&q=80', '', 'Pack of 5 Pastel Shades', 99, 1, 99);
INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address_json, items_count, subtotal, shipping_fee, discount_total, smartpoints_used, smartpoints_discount, smartpoints_earned, final_total, payment_method, payment_status, order_status, tracking_carrier, tracking_number, tracking_url, estimated_delivery, coupon_code, notes, created_at, updated_at) VALUES ('ord-1003', 'SS-2026-88719', 'user-3', 'Priya Sharma', 'priya.sharma@example.com', '+91 98450 12345', '{"id":"addr-3","fullName":"Priya Sharma","phone":"+91 98450 12345","email":"priya.sharma@example.com","addressLine":"Apt 12B, Skyline Towers, MG Road","city":"Pune","state":"Maharashtra","pincode":"411001","type":"Home","isDefault":true}', 1, 499, 0, 50, 0, 0, 0, 491, 'UPI', 'paid', 'packed', 'Delhivery', 'DEL-991204-IN', NULL, '2026-10-28', 'SAVE50', NULL, '2026-10-25T11:00:00Z', '2026-10-25T11:00:00Z');
INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, variant_id, variant_name, unit_price, quantity, subtotal) VALUES ('item-ord-1003-1', 'ord-1003', 'prod-008', 'Parker Vector Matte Black Fountain Pen with Chrome Trim', 'PEN-PAR-VEC-FP-BLK', 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=700&auto=format&fit=crop&q=80', '', 'PEN-PAR-VEC-FP-BLK', 499, 1, 499);
INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address_json, items_count, subtotal, shipping_fee, discount_total, smartpoints_used, smartpoints_discount, smartpoints_earned, final_total, payment_method, payment_status, order_status, tracking_carrier, tracking_number, tracking_url, estimated_delivery, coupon_code, notes, created_at, updated_at) VALUES ('ord-1004', 'SS-2026-88890', 'user-4', 'Rahul Verma', 'rahul.verma@example.com', '+91 97110 56789', '{"id":"addr-4","fullName":"Rahul Verma","phone":"+91 97110 56789","email":"rahul.verma@example.com","addressLine":"Sector 62, Block C, Innovation Hub","city":"Noida","state":"Uttar Pradesh","pincode":"201301","type":"Work","isDefault":true}', 1, 1399, 0, 150, 0, 0, 0, 1369, 'COD', 'pending', 'pending', 'Shadowfax', 'SHP-109283-IN', NULL, '2026-10-30', 'STUDENT15', NULL, '2026-10-26T16:30:00Z', '2026-10-26T16:30:00Z');
INSERT INTO order_items (id, order_id, product_id, product_name, product_slug, product_image, variant_id, variant_name, unit_price, quantity, subtotal) VALUES ('item-ord-1004-1', 'ord-1004', 'prod-024', 'Casio FX-991CW Scientific Calculator (ClassWiz Edition)', 'OFC-CAS-991CW-BLK', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=700&auto=format&fit=crop&q=80', '', 'OFC-CAS-991CW-BLK', 1399, 1, 1399);

-- INSERT REVIEWS
INSERT INTO reviews (id, product_id, user_id, user_name, rating, comment, verified_purchase, created_at) VALUES ('rev-01', 'prod-001', 'user-customer', 'Joe Student', 5, 'The paper quality is truly top-tier. Even with 0.7mm fountain and gel pens, there is zero ghosting or bleeding to the back page. The dividers make keeping semester notes organized a breeze.', 1, '2026-10-21T16:00:00Z');
INSERT INTO reviews (id, product_id, user_id, user_name, rating, comment, verified_purchase, created_at) VALUES ('rev-02', 'prod-004', 'user-customer', 'Joe Student', 5, 'I write fast and normally my palm gets covered in ink. EnerGel dries within half a second! Absolutely smooth line without scratching the paper.', 1, '2026-10-22T09:30:00Z');
INSERT INTO reviews (id, product_id, user_id, user_name, rating, comment, verified_purchase, created_at) VALUES ('rev-03', 'prod-006', 'user-3', 'Priya Sharma', 5, 'Much better than blinding neon highlighters. The soft lavender and mint shades make studying medical textbooks pleasing to the eye.', 1, '2026-10-23T11:00:00Z');
INSERT INTO reviews (id, product_id, user_id, user_name, rating, comment, verified_purchase, created_at) VALUES ('rev-04', 'prod-008', 'user-4', 'Rahul Verma', 4, 'Very sleek pen for office note-taking and signatures. Gives a sophisticated weight in hand.', 1, '2026-10-24T15:20:00Z');

-- INSERT COUPONS
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, times_used, active, expires_at, created_at) VALUES ('coup-welcome10', 'WELCOME10', NULL, 'percentage', 10, 299, 100, 1000, 143, 1, '2026-12-31T23:59:59Z', '2026-01-01T00:00:00Z');
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, times_used, active, expires_at, created_at) VALUES ('coup-save50', 'SAVE50', NULL, 'fixed', 50, 399, NULL, 2000, 289, 1, '2026-12-31T23:59:59Z', '2026-01-01T00:00:00Z');
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, times_used, active, expires_at, created_at) VALUES ('coup-student15', 'STUDENT15', NULL, 'percentage', 15, 499, 150, 5000, 420, 1, '2026-12-31T23:59:59Z', '2026-01-01T00:00:00Z');
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, times_used, active, expires_at, created_at) VALUES ('coup-firstorder', 'FIRSTORDER', NULL, 'percentage', 20, 350, 150, 500, 98, 1, '2026-12-31T23:59:59Z', '2026-01-01T00:00:00Z');
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, times_used, active, expires_at, created_at) VALUES ('coup-freeship', 'FREESHIP', NULL, 'free_shipping', 40, 250, NULL, 1000, 164, 1, '2026-12-31T23:59:59Z', '2026-01-01T00:00:00Z');
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, times_used, active, expires_at, created_at) VALUES ('coup-exam25', 'EXAM25', NULL, 'percentage', 25, 599, 200, 800, 185, 1, '2026-11-30T23:59:59Z', '2026-09-01T00:00:00Z');
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, times_used, active, expires_at, created_at) VALUES ('coup-festive20', 'FESTIVE20', NULL, 'percentage', 20, 799, 300, 1000, 230, 1, '2026-11-15T23:59:59Z', '2026-10-01T00:00:00Z');

-- INSERT RFQS
INSERT INTO rfqs (id, rfq_number, institution_name, contact_person, email, phone, category, estimated_units, budget, target_delivery_date, requirements, status, created_at) VALUES ('rfq-mvpn71mx', 'RFQ-rfq-mvpn71mx', 'DPS International School', 'Principal Sharma', 'procurement@dpsdelhi.edu', '+91 98123 45678', 'Writing Instruments', 1000, 0, '2026-11-15', '500 Classmate notebooks and 500 DOMS ball pens for term exams', 'pending', '2026-10-26T19:21:16.809Z');
INSERT INTO rfqs (id, rfq_number, institution_name, contact_person, email, phone, category, estimated_units, budget, target_delivery_date, requirements, status, created_at) VALUES ('rfq-02', 'RFQ-rfq-02', 'FinTech Dynamics Pvt Ltd', 'Arun Iyer (Admin Manager)', 'admin@fintechdynamics.com', '+91 97110 33445', 'Office Supplies', 450, 0, '2026-11-20', '200 A5 Executive Notebooks, 200 Parker Vector Pens with company engraving, 50 Desk Organizers', 'pending', '2026-10-25T14:30:00Z');
INSERT INTO rfqs (id, rfq_number, institution_name, contact_person, email, phone, category, estimated_units, budget, target_delivery_date, requirements, status, created_at) VALUES ('rfq-01', 'RFQ-rfq-01', 'Greenwood International School', 'Sunita Menon (Procurement Dept)', 'procurement@greenwood.edu.in', '+91 98450 99881', 'School Essentials', 2000, 0, '2026-11-15', '500 Classmate A4 Notebooks, 500 Camlin Geometry Boxes, 1000 DOMS Mechanical Pencils', 'quoted', '2026-10-22T10:00:00Z');

-- INSERT AUDIT LOGS
INSERT INTO audit_logs (id, timestamp, actor, role, action, entity, entity_id, details, ip_address) VALUES ('log-1793042476793', '2026-10-26T19:21:16.793Z', 'Admin Joe', 'admin', 'ORDER_STATUS_UPDATE', 'Order', 'ord-mvpn71ld', 'Order SS-2026-86332 updated to CONFIRMED: Payment verified via UPI', '127.0.0.1');
INSERT INTO audit_logs (id, timestamp, actor, role, action, entity, entity_id, details, ip_address) VALUES ('log-1793042476753', '2026-10-26T19:21:16.753Z', 'System', 'admin', 'ORDER_PLACED', 'Order', 'ord-mvpn71ld', 'Order SS-2026-86332 placed for ₹295 by Joe Student', '127.0.0.1');
INSERT INTO audit_logs (id, timestamp, actor, role, action, entity, entity_id, details, ip_address) VALUES ('log-01', '2026-10-24T09:15:00Z', 'Admin Joe', 'admin', 'PRICE_UPDATE', 'Product', 'prod-001', 'Updated price for Classmate Pulse Spiral Notebook from ₹195 to ₹185 (Promotion)', '192.168.1.102');
INSERT INTO audit_logs (id, timestamp, actor, role, action, entity, entity_id, details, ip_address) VALUES ('log-02', '2026-10-25T07:35:00Z', 'Admin Joe', 'admin', 'ORDER_STATUS_UPDATE', 'Order', 'ord-1002', 'Updated order SS-2026-88540 status from PACKED to SHIPPED via DTDC', '192.168.1.102');
INSERT INTO audit_logs (id, timestamp, actor, role, action, entity, entity_id, details, ip_address) VALUES ('log-03', '2026-10-26T10:00:00Z', 'Admin Joe', 'admin', 'COUPON_CREATED', 'Coupon', 'coup-festive20', 'Created new coupon FESTIVE20 (20% off above ₹799)', '192.168.1.102');

-- INSERT STORE SETTINGS
INSERT INTO store_settings (setting_key, setting_value, description) VALUES ('freeShippingThreshold', 499, 'Global store configuration for freeShippingThreshold');
INSERT INTO store_settings (setting_key, setting_value, description) VALUES ('standardShippingFee', 40, 'Global store configuration for standardShippingFee');
INSERT INTO store_settings (setting_key, setting_value, description) VALUES ('expressShippingFee', 99, 'Global store configuration for expressShippingFee');
INSERT INTO store_settings (setting_key, setting_value, description) VALUES ('pointsPerRupee', 0.05, 'Global store configuration for pointsPerRupee');
INSERT INTO store_settings (setting_key, setting_value, description) VALUES ('rupeePerPoint', 1, 'Global store configuration for rupeePerPoint');
INSERT INTO store_settings (setting_key, setting_value, description) VALUES ('codEnabled', 1, 'Global store configuration for codEnabled');

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
