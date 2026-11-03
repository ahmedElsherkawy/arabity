import type { NextApiRequest, NextApiResponse } from "next";
import { readDb, writeDb } from "@/lib/store";
import { PartCategoryType, PartCondition } from "@/lib/mock-data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = readDb();

  if (req.method === "GET") {
    return res.status(200).json({ rfqs: db.rfqs });
  }

  if (req.method === "POST") {
    const { action } = req.body;

    if (action === "ADD_QUOTE") {
      const { rfqId, traderNameEn, traderNameAr, condition, brand, price, warrantyDays } =
        req.body;
      const rfq = db.rfqs.find((r) => r.id === rfqId);
      if (!rfq) {
        return res.status(404).json({ error: "RFQ not found" });
      }
      rfq.quotes.unshift({
        id: `q-${Date.now()}`,
        traderNameEn: traderNameEn || "El-Tawfikia Auto Parts",
        traderNameAr: traderNameAr || "التوفيقية لقطع غيار السيارات",
        storeAddressEn: "Downtown Cairo — 14 Orabi St, El-Tawfikia",
        storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
        condition: (condition as PartCondition) || "OES_FIRST_LINE",
        brand: brand || "Certified OEM Supplier",
        price: Number(price) || 3500,
        warrantyDays: Number(warrantyDays) || 60,
        allowStorePickup: true,
      });
      writeDb(db);
      return res.status(200).json({ rfqs: db.rfqs });
    }

    const { customerName, vehicleTextEn, vehicleTextAr, vin, partType, partNameEn, partNameAr } =
      req.body;

    const newRfq = {
      id: `RFQ-${Math.floor(8900 + Math.random() * 900)}`,
      customerName: customerName || "Customer",
      vehicleTextEn: vehicleTextEn || "2022 Toyota Corolla 1.6L",
      vehicleTextAr: vehicleTextAr || "تويوتا كورولا 2022",
      vin: vin || "JTDBR32E800192831",
      partType: (partType as PartCategoryType) || "MECHANICAL_ENGINE",
      partNameEn: partNameEn || "Requested Spare Part",
      partNameAr: partNameAr || partNameEn || "قطعة غيار مطلوبة",
      quotes: [
        {
          id: `q-auto-${Date.now()}`,
          traderNameEn: "El-Tawfikia Auto Parts",
          traderNameAr: "التوفيقية لقطع غيار السيارات",
          storeAddressEn: "Downtown Cairo — 14 Orabi St, El-Tawfikia",
          storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
          condition: "AFTERMARKET_COMMERCIAL" as PartCondition,
          brand: "Certified Grade-1 Replacement",
          price: 2450,
          warrantyDays: 60,
          allowStorePickup: true,
        },
      ],
    };

    db.rfqs.unshift(newRfq);
    writeDb(db);
    return res.status(201).json({ rfqs: db.rfqs, created: newRfq });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
