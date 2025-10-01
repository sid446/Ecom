// File: /api/orders/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User"; // IMPORTANT: Import User model to register the schema

// GET /api/orders/:id
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    await connectToDatabase();
    const order = await Order.findById(context.params.id).populate(
      "user",
      "name email phone"
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PUT /api/orders/:id
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Use findByIdAndUpdate with populate in one operation
    const updatedOrder = await Order.findByIdAndUpdate(
      context.params.id,
      {
        ...(body.status && { status: body.status }),
        ...(body.isPaid !== undefined && { isPaid: body.isPaid }),
        ...(body.paidAt && { paidAt: body.paidAt }),
        ...(body.isDelivered !== undefined && { isDelivered: body.isDelivered }),
        ...(body.deliveredAt && { deliveredAt: body.deliveredAt }),
        ...(body.track !== undefined && { track: body.track })
      },
      { new: true, runValidators: true }
    ).populate("user", "name email phone");

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order", details: error.message },
      { status: 400 }
    );
  }
}

// DELETE /api/orders/:id
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    await connectToDatabase();
    const order = await Order.findByIdAndDelete(context.params.id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order", details: error.message },
      { status: 500 }
    );
  }
}