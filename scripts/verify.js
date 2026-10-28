const endpoints = [
  '/',
  '/shop',
  '/cart',
  '/checkout',
  '/account',
  '/help',
  '/bulk-orders',
  '/compare',
  '/wishlist',
  '/login',
  '/register',
  '/admin',
  '/admin/inventory',
  '/admin/orders',
  '/admin/products',
  '/admin/customers',
  '/admin/coupons',
  '/admin/rfq',
  '/admin/reports',
  '/admin/audit',
  '/api/products',
  '/api/categories',
  '/api/brands',
  '/api/coupons',
  '/api/admin/dashboard',
  '/api/admin/customers',
  '/api/admin/audit',
  '/api/rfq',
];

async function runTests() {
  console.log('--- Verifying SmartStation Endpoints ---');
  let passCount = 0;
  for (const ep of endpoints) {
    try {
      const res = await fetch('http://localhost:3000' + ep);
      if (res.status === 200) {
        console.log(`[PASS] ${ep.padEnd(25)} -> ${res.status} ${res.statusText}`);
        passCount++;
      } else {
        console.error(`[FAIL] ${ep.padEnd(25)} -> ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error(`[ERR]  ${ep.padEnd(25)} -> ${err.message}`);
    }
  }
  console.log(`\nResults: ${passCount}/${endpoints.length} routes responded with HTTP 200 OK.`);
}

runTests();
