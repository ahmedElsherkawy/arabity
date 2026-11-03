import type { NextApiRequest, NextApiResponse } from "next";
import { readDb, writeDb, OrderRecord } from "@/lib/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = readDb();

  if (req.method === "GET") {
    return res.status(200).json({ orders: db.orders });
  }

  if (req.method === "POST") {
    const { action } = req.body;

    // Trader verifies a Customer's In-Store Pickup Code at the shop counter
    if (action === "VERIFY_PICKUP_CODE") {
      const { pickupCode } = req.body;
      const order = db.orders.find(
        (o) =>
          o.pickupCode &&
          o.pickupCode.toUpperCase() === String(pickupCode || "").trim().toUpperCase()
      );
      if (!order) {
        return res
          .status(404)
          .json({ error: "Invalid Pickup Code — No matching Store Pickup order found" });
      }
      order.status = "PICKED_UP_FROM_STORE";
      order.pickupVerifiedAt = new Date().toISOString();
      writeDb(db);
      return res.status(200).json({ order, orders: db.orders });
    }

    // Create a new Order (Store Pickup, Home Delivery, or Ship-to-Workshop)
    const {
      customerName,
      customerPhone,
      fulfillmentType,
      paymentMethod,
      workshopId,
      workshopName,
      installationFee,
      items,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    const subtotal = items.reduce(
      (sum: number, i: any) => sum + Number(i.price) * Number(i.qty || 1),
      0
    );
    const isStorePickup = fulfillmentType === "STORE_PICKUP";
    const shippingFee = isStorePickup ? 0 : 85;
    const instFee =
      fulfillmentType === "SHIP_TO_WORKSHOP" ? Number(installationFee || 350) : 0;
    const totalAmount = subtotal + shippingFee + instFee;

    const pickupCode = isStorePickup
      ? `PK-${Math.floor(1000 + Math.random() * 9000)}`
      : undefined;

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: `ARB-${Math.floor(90000 + Math.random() * 9000)}`,
      customerName: customerName || "Car Owner",
      customerPhone: customerPhone || "01000000000",
      fulfillmentType: fulfillmentType || "STORE_PICKUP",
      paymentMethod:
        paymentMethod || (isStorePickup ? "PAY_AT_STORE" : "ONLINE_CARD"),
      pickupCode,
      workshopId,
      workshopName,
      subtotal,
      shippingFee,
      installationFee: instFee,
      totalAmount,
      status: isStorePickup
        ? "READY_FOR_STORE_PICKUP"
        : fulfillmentType === "SHIP_TO_WORKSHOP"
        ? "SHIPPED_TO_WORKSHOP"
        : "PROCESSING_DELIVERY",
      items,
      createdAt: new Date().toISOString(),
    };

    // Decrement stock on ordered parts
    items.forEach((cartItem: any) => {
      const part = db.parts.find((p) => p.id === cartItem.partId);
      if (part && part.offers.length > 0) {
        part.offers[0].stockQty = Math.max(
          0,
          part.offers[0].stockQty - Number(cartItem.qty || 1)
        );
      }
    });

    db.orders.unshift(newOrder);
    writeDb(db);

    return res.status(201).json({
      order: newOrder,
      orders: db.orders,
      parts: db.parts,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
