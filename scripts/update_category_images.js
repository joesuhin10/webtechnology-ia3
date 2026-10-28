const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const dbPath = path.join(__dirname, '..', 'data', 'smartstation_db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const map = {
  'cat-writing': '/images/categories/writing-instruments.svg',
  'cat-notebooks': '/images/categories/notebooks-paper.svg',
  'cat-school': '/images/categories/school-essentials.svg',
  'cat-office': '/images/categories/office-supplies.svg',
  'cat-art': '/images/categories/art-supplies.svg',
  'cat-craft': '/images/categories/craft-diy.svg',
  'cat-planning': '/images/categories/planners-journals.svg',
  'cat-desk': '/images/categories/desk-organizers.svg',
  'cat-exam': '/images/categories/exam-essentials.svg',
  'cat-gifts': '/images/categories/gift-sets-combos.svg'
};

dbData.categories = dbData.categories.map(c => ({
  ...c,
  image: map[c.id] || `/images/categories/${c.slug}.svg`
}));

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
console.log('✓ Successfully updated data/smartstation_db.json with local category SVGs');

// Also update MongoDB
async function updateMongo() {
  try {
    const client = new MongoClient('mongodb://127.0.0.1:27017/smartstation');
    await client.connect();
    const db = client.db('smartstation');
    for (const cat of dbData.categories) {
      await db.collection('categories').updateOne(
        { _id: cat.id },
        { $set: { image: cat.image } }
      );
    }
    console.log('✓ Successfully updated MongoDB collection `categories` with local SVGs');
    await client.close();
  } catch (err) {
    console.warn('MongoDB update skipped:', err.message);
  }
}

updateMongo();
