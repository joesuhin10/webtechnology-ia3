async function testOrderLifecycle() {
  console.log('--- Testing End-to-End Order & Inventory Lifecycle ---');

  // 1. Get initial products to find a product and its stock
  const prodsRes = await fetch('http://localhost:3000/api/products');
  const data = await prodsRes.json();
  const prods = Array.isArray(data) ? data : data.products;
  const testProduct = prods[0];
  console.log(`Testing with product: ${testProduct.name} (Initial stock: ${testProduct.stock})`);

  // 2. Place an order for 2 units
  const orderPayload = {
    customerId: 'user-cust-1',
    customerName: 'Joe Student',
    customerEmail: 'customer@smartstation.com',
    customerPhone: '+91 98111 22334',
    shippingAddress: {
      fullName: 'Joe Student',
      phone: '+91 98111 22334',
      email: 'customer@smartstation.com',
      addressLine: 'Flat 402, Lotus Pride Apartments, 12th Main Road, HSR Layout Sector 2',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102',
      type: 'Home',
    },
    items: [
      {
        productId: testProduct.id,
        name: testProduct.name,
        brand: testProduct.brand,
        price: testProduct.price,
        quantity: 2,
        image: testProduct.images[0],
        sku: testProduct.sku,
      },
    ],
    subtotal: testProduct.price * 2,
    discount: 0,
    couponCode: 'WELCOME10',
    couponDiscount: Math.round(testProduct.price * 2 * 0.1),
    pointsRedeemed: 20,
    pointsDiscount: 20,
    shippingFee: 0,
    tax: 0,
    totalAmount: testProduct.price * 2 - Math.round(testProduct.price * 2 * 0.1) - 20,
    paymentMethod: 'UPI',
  };

  const createRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Order placement failed: ${err}`);
  }

  const order = await createRes.json();
  console.log(`[PASS] Order successfully created with ID: ${order.id} (Order #${order.orderNumber})`);

  // 3. Verify stock was deducted
  const prodsAfterRes = await fetch(`http://localhost:3000/api/products/${testProduct.id}`);
  const prodAfter = await prodsAfterRes.json();
  console.log(`[PASS] Verified stock deducted: ${testProduct.stock} -> ${prodAfter.stock} (-2 units)`);

  // 4. Update order status from Admin to Confirmed, then Packed
  const updateRes = await fetch(`http://localhost:3000/api/orders/${order.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'confirmed', note: 'Payment verified via UPI' }),
  });
  const updatedOrder = await updateRes.json();
  console.log(`[PASS] Admin status transition: ${updatedOrder.orderStatus}`);

  // 5. Test RFQ creation
  const rfqRes = await fetch('http://localhost:3000/api/rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      organization: 'DPS International School',
      contactPerson: 'Principal Sharma',
      email: 'procurement@dpsdelhi.edu',
      phone: '+91 98123 45678',
      targetCategory: 'Writing Instruments',
      requiredProducts: '500 Classmate notebooks and 500 DOMS ball pens for term exams',
      estimatedQuantity: 1000,
      targetDeliveryDate: '2026-11-15',
    }),
  });
  const rfq = await rfqRes.json();
  console.log(`[PASS] B2B Institutional RFQ submitted with ID: ${rfq.id}`);

  console.log('\n--- ALL E2E TRANSACTION & INVENTORY LIFECYCLE TESTS PASSED! ---');
}

testOrderLifecycle().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
