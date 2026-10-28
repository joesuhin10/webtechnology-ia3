const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Load .env.local
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
      process.env[key] = val;
    }
  }
  return env;
}

async function resetAndSeed() {
  console.log('\n======================================================');
  console.log('   SmartStation - Full Database Reset & Seed to Atlas ');
  console.log('======================================================\n');

  loadEnvLocal();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'smartstation';

  console.log(`Connecting to MongoDB Atlas Cluster...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    const adminDb = client.db().admin();
    const dbList = await adminDb.listDatabases();
    console.log('Current cluster databases:', dbList.databases.map((d) => d.name).join(', '));

    // Remove any existing database completely
    const dbsToDrop = ['smartstation', 'online-stationary'];
    for (const d of dbsToDrop) {
      if (dbList.databases.some((x) => x.name === d)) {
        console.log(`🗑️  Dropping existing database completely: [${d}]...`);
        await client.db(d).dropDatabase();
        console.log(`   ✓ [${d}] dropped.`);
      }
    }

    // Ensure target db is completely dropped if it wasn't in dbList yet
    console.log(`🗑️  Ensuring clean slate for target database [${dbName}]...`);
    await client.db(dbName).dropDatabase();
    console.log(`   ✓ [${dbName}] dropped clean.\n`);

    // Load seed catalog
    const jsonDbPath = path.join(__dirname, '..', 'data', 'smartstation_db.json');
    if (!fs.existsSync(jsonDbPath)) {
      throw new Error(`Catalog seed file not found: ${jsonDbPath}`);
    }

    const seedData = JSON.parse(fs.readFileSync(jsonDbPath, 'utf-8'));
    const db = client.db(dbName);

    console.log(`🌱 Seeding fresh collections into [${dbName}]...`);
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
        const docs = item.data.map((d) => ({
          ...d,
          _id: d.id || undefined,
        }));
        await col.insertMany(docs);
        console.log(`  ✓ Seeded [${item.name}]: ${docs.length} documents`);
      }
    }

    if (seedData.settings) {
      await db.collection('settings').insertOne({ _id: 'global_settings', ...seedData.settings });
      console.log(`  ✓ Seeded [settings]`);
    }

    console.log('\n⚡ Creating high-performance indexes...');
    await db.collection('products').createIndex({ slug: 1 }, { unique: true });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ brand: 1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('orders').createIndex({ customerId: 1 });
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    console.log('  ✓ Indexes created (slug, categories, text search, emails, orders)');

    // Verify collections and counts
    const collections = await db.listCollections().toArray();
    console.log(`\n🎉 Verified database [${dbName}] status:`);
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(`  - ${c.name}: ${count} documents`);
    }

    console.log('\n🚀 ALL DONE! Database completely replaced and connected perfectly.\n');
  } catch (err) {
    console.error('❌ Error during reset and seed:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

resetAndSeed();
