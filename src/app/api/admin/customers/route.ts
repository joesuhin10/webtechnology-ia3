import { NextResponse } from 'next/server';
import { getAllUsers, getOrders } from '@/lib/db';

export async function GET() {
  try {
    const users = getAllUsers();
    const orders = getOrders();

    const customerData = users.map((u) => {
      const userOrders = orders.filter((o) => o.customerId === u.id);
      const totalSpent = userOrders
        .filter((o) => o.orderStatus !== 'cancelled' && o.orderStatus !== 'refunded')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        rewardPoints: u.rewardPoints,
        createdAt: u.createdAt,
        orderCount: userOrders.length,
        totalSpent,
        addresses: u.addresses || [],
        recentOrders: userOrders.slice(0, 5),
      };
    });

    return NextResponse.json(customerData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
