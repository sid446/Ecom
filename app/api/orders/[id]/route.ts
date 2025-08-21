import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

type RouteContext = {
  params: {
    id: string | string[];
  };
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();
    const id = Array.isArray(context.params.id)
      ? context.params.id[0]
      : context.params.id;

    const order = await Order.findById(id).populate("user", "name email phone");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();
    const id = Array.isArray(context.params.id)
      ? context.params.id[0]
      : context.params.id;

    const body = await request.json();

    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("user", "name email phone");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order", details: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();
    const id = Array.isArray(context.params.id)
      ? context.params.id[0]
      : context.params.id;

    const order = await Order.findByIdAndDelete(id);

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
