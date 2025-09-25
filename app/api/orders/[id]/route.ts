// File: /api/orders/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

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

    // Find the existing order to update it
    const order = await Order.findById(context.params.id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update fields from the request body if they exist
    order.status = body.status || order.status;
    order.isPaid = body.isPaid !== undefined ? body.isPaid : order.isPaid;
    order.paidAt = body.paidAt || order.paidAt;
    order.isDelivered = body.isDelivered !== undefined ? body.isDelivered : order.isDelivered;
    order.deliveredAt = body.deliveredAt || order.deliveredAt;
    
    // --- NEW: Update the tracking link ---
    // Allows setting the track link or clearing it by passing null
    if (body.track !== undefined) {
      order.track = body.track;
    }

    const updatedOrder = await order.save();
    
    // Populate user details for the response
    await updatedOrder.populate("user", "name email phone");

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