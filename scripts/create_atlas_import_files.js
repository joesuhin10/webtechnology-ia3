const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'data', 'mongodb_atlas_import');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'smartstation_db.json'), 'utf-8'));

// Format documents with _id for MongoDB Atlas import
function prepareDocs(items, type) {
  return items.map((item) => ({
    ...item,
    _id: item.id || undefined,
    ...(type ? { documentType: type } : {})
  }));
}

// 1. All-in-one file for their open collection 'joesuhin'
const allInOne = [
  ...prepareDocs(db.products, 'product'),
  ...prepareDocs(db.categories, 'category'),
  ...prepareDocs(db.brands, 'brand'),
  ...prepareDocs(db.orders, 'order'),
  ...prepareDocs(db.users, 'user'),
  ...prepareDocs(db.coupons, 'coupon'),
  ...prepareDocs(db.reviews, 'review'),
  ...prepareDocs(db.rfqs, 'rfq')
];

fs.writeFileSync(path.join(outDir, 'joesuhin.json'), JSON.stringify(allInOne, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'products.json'), JSON.stringify(prepareDocs(db.products), null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'categories.json'), JSON.stringify(prepareDocs(db.categories), null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'brands.json'), JSON.stringify(prepareDocs(db.brands), null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'orders.json'), JSON.stringify(prepareDocs(db.orders), null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'users.json'), JSON.stringify(prepareDocs(db.users), null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'coupons.json'), JSON.stringify(prepareDocs(db.coupons), null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'reviews.json'), JSON.stringify(prepareDocs(db.reviews), null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'rfqs.json'), JSON.stringify(prepareDocs(db.rfqs), null, 2), 'utf-8');

console.log('✓ Successfully created MongoDB Atlas import files in data/mongodb_atlas_import/:');
const files = fs.readdirSync(outDir);
files.forEach((f) => {
  const stat = fs.statSync(path.join(outDir, f));
  console.log(`  - ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
});
