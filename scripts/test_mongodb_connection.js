/**
 * MongoDB Atlas Connection Test Script
 * Run with: node scripts/test_mongodb_connection.js
 */

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Helper to load .env.local without requiring external dotenv package
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    return {};
  }
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
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
  return env;
}

async function run() {
  console.log('\n======================================================');
  console.log('   SmartStation - MongoDB Atlas Connection Tester    ');
  console.log('======================================================\n');

  loadEnvLocal();
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'smartstation';

  if (!uri) {
    console.error('❌ Error: MONGODB_URI is not defined.');
    console.log('👉 Please create or update .env.local with your connection string:');
    console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority\n');
    process.exit(1);
  }

  if (uri.includes('<username>') || uri.includes('<password>')) {
    console.error('⚠️  Attention: Your .env.local still contains placeholder tokens ("<username>" or "<password>").');
    console.log('👉 Open .env.local and replace them with your actual MongoDB Atlas database user and password:');
    console.log(`   Current: ${uri}`);
    console.log('\nAtlas Tip:');
    console.log('1. Go to MongoDB Atlas (cloud.mongodb.com) -> Database Access');
    console.log('2. Ensure your user has readWriteAnyDatabase or readWrite privileges.');
    console.log('3. Under Network Access, ensure your current IP or 0.0.0.0/0 (allow from anywhere) is added.');
    console.log('4. Copy the connection string from "Connect" -> "Drivers" (Node.js).\n');
    process.exit(1);
  }

  // Mask sensitive password for display
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:******@');
  console.log(`📡 Connecting to: ${maskedUri}`);
  console.log(`📂 Database: ${dbName}...`);

  const startTime = Date.now();
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  try {
    await client.connect();
    const pingResult = await client.db('admin').command({ ping: 1 });
    const elapsed = Date.now() - startTime;

    console.log(`\n✅ MongoDB Atlas Connection SUCCESSFUL! (${elapsed}ms)`);
    console.log(`   Ping response:`, pingResult);

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log(`\n📊 Existing collections in [${dbName}]:`);
    if (collections.length === 0) {
      console.log('   (No collections found yet. Run `node scripts/seed_mongodb.js` to seed your initial catalog!)');
    } else {
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`   - ${col.name} (${count} documents)`);
      }
    }

    console.log('\n🎉 You are all set to use MongoDB with SmartStation!\n');
  } catch (err) {
    console.error('\n❌ Connection Failed:');
    console.error(err.message || err);

    if (err.message && (err.message.includes('ETIMEDOUT') || err.message.includes('timed out'))) {
      console.log('\n⚠️  Network Firewall Detected:');
      console.log('   Outbound port 27017 is blocked on your current network (e.g. University/Campus Wi-Fi like KU-WL).');
      console.log('   👉 Solution 1: Connect to your mobile hotspot (e.g., JO£ SUHIN) to reach MongoDB Atlas cloud directly.');
      console.log('   👉 Solution 2: The app also automatically falls back to your local MongoDB (127.0.0.1:27017) while on campus!');
      
      // Test local fallback
      try {
        const localClient = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 2000 });
        await localClient.connect();
        const ldb = localClient.db(dbName);
        const lcols = await ldb.listCollections().toArray();
        console.log(`\n✅ Local MongoDB fallback is ACTIVE and READY on 127.0.0.1:27017 (${lcols.length} collections).`);
        await localClient.close();
      } catch {}
    } else {
      console.log('\nAtlas Troubleshooting:');
      console.log('1. Check Atlas IP Whitelist (Network Access -> Add IP Address -> Allow Access from Anywhere 0.0.0.0/0)');
      console.log('2. Verify database username and password in Atlas -> Database Access');
      console.log('3. Ensure your connection string starts with mongodb+srv://\n');
    }
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
