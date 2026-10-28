/**
 * MongoDB Atlas Seeding Script
 * Run with: node scripts/seed_mongodb.js
 */

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      env[key] = val;
      if (!process.env[key]) process.env[key] = val;
    }
  }
  return env;
}

async function seed() {
  console.log('\n======================================================');
  console.log('   SmartStation - Seed Data to MongoDB Atlas          ');
  console.log('======================================================\n');

  loadEnvLocal();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'smartstation';

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.error('❌ Please configure valid MONGODB_URI credentials in .env.local first.');
    console.log('Run `node scripts/test_mongodb_connection.js` for guidance.\n');
    process.exit(1);
  }

  const jsonDbPath = path.join(__dirname, '..', 'data', 'smartstation_db.json');
  if (!fs.existsSync(jsonDbPath)) {
    console.error('❌ Could not find data/smartstation_db.json');
    process.exit(1);
  }

  const seedData = JSON.parse(fs.readFileSync(jsonDbPath, 'utf-8'));
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 30000 });

  try {
    await client.connect();
    console.log(`📡 Connected to MongoDB Atlas! Seeding database [${dbName}]...\n`);
    const db = client.db(dbName);

    const collectionsToSeed = [
      { name: 'products', data: seedData.products },
      { name: 'categories', data: seedData.categories },
      { name: 'brands', data: seedData.brands },
      { name: 'orders', data: seedData.orders },
      { name: 'users', data: seedData.users },
      { name: 'reviews', data: seedData.reviews },
      { name: 'coupons', data: seedData.coupons },
      { name: 'banners', data: seedData.banners },
      { name: 'rfqs', data: seedData.rfqs },
    ];

    for (const item of collectionsToSeed) {
      if (item.data && Array.isArray(item.data) && item.data.length > 0) {
        const col = db.collection(item.name);
        await col.deleteMany({}); // clear previous seed if any
        // Prepare documents (preserve item.id as string id)
        const docs = item.data.map((d) => ({
          ...d,
          _id: d.id || undefined,
        }));
        await col.insertMany(docs);
        console.log(`  ✓ Seeded [${item.name}]: ${docs.length} documents`);
      }
    }

    // Seed settings
    if (seedData.settings) {
      const colSettings = db.collection('settings');
      await colSettings.deleteMany({});
      await colSettings.insertOne({ _id: 'global_settings', ...seedData.settings });
      console.log(`  ✓ Seeded [settings]`);
    }

    // Create helpful indexes
    console.log('\n⚡ Creating database indexes for high performance...');
    await db.collection('products').createIndex({ slug: 1 }, { unique: true });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ brand: 1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('orders').createIndex({ customerId: 1 });
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    console.log('  ✓ Indexes created (slug, categories, text search, emails, orders)');

    console.log('\n🎉 MongoDB Atlas seeding complete! Everything is ready.\n');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();
