import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getProducts, getAllUsers, getCoupons } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'sales';

    if (type === 'sales') {
      const orders = getOrders();
      let csv = 'Order ID,Date,Customer,Email,Total Amount (INR),Payment Method,Order Status\n';
      orders.forEach((o) => {
        csv += `"${o.orderNumber}","${o.createdAt.split('T')[0]}","${o.customerName}","${o.customerEmail}",${o.totalAmount},"${o.paymentMethod}","${o.orderStatus}"\n`;
      });
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="smartstation-sales-report.csv"',
        },
      });
    } else if (type === 'inventory') {
      const { products } = getProducts({ limit: 500 });
      let csv = 'Product Name,SKU,Brand,Category,Price (INR),MRP (INR),Stock Units,Threshold,Status\n';
      products.forEach((p) => {
        const status = p.stock <= 0 ? 'Out of Stock' : p.stock <= p.lowStockThreshold ? 'Low Stock' : 'In Stock';
        csv += `"${p.name}","${p.sku}","${p.brand}","${p.category}",${p.price},${p.mrp},${p.stock},${p.lowStockThreshold},"${status}"\n`;
      });
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="smartstation-inventory-report.csv"',
        },
      });
    } else if (type === 'customers') {
      const users = getAllUsers();
      let csv = 'Customer Name,Email,Phone,Role,Reward Points,Joined Date\n';
      users.forEach((u) => {
        csv += `"${u.name}","${u.email}","${u.phone || 'N/A'}","${u.role}",${u.rewardPoints || 0},"${u.createdAt.split('T')[0]}"\n`;
      });
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="smartstation-customers-report.csv"',
        },
      });
    } else if (type === 'coupons') {
      const coupons = getCoupons();
      let csv = 'Coupon Code,Discount Type,Discount Value,Min Order,Times Used,Valid Until,Status\n';
      coupons.forEach((c) => {
        csv += `"${c.code}","${c.discountType}",${c.discountValue},${c.minOrderValue},${c.timesUsed || 0},"${c.validUntil.split('T')[0]}","${c.status}"\n`;
      });
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="smartstation-coupons-report.csv"',
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported report type' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
