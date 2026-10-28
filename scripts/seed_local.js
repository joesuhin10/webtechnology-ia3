const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function seedLocal() {
  const uri = 'mongodb://127.0.0.1:27017';
  const dbName = 'smartstation';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to local MongoDB');
    await client.db(dbName).dropDatabase();
    console.log('Dropped old local smartstation database');

    const seedData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'data', 'smartstation_db.json'), 'utf-8')
    );
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
        const docs = item.data.map((d) => ({ ...d, _id: d.id || undefined }));
        await col.insertMany(docs);
        console.log(`Seeded [${item.name}]: ${docs.length} docs`);
      }
    }
    if (seedData.settings) {
      await db.collection('settings').insertOne({ _id: 'global_settings', ...seedData.settings });
      console.log('Seeded [settings]');
    }
    console.log('✅ Local MongoDB clean seeded successfully!');
  } finally {
    await client.close();
  }
}

seedLocal().catch(console.error);
