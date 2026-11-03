import type { NextApiRequest, NextApiResponse } from "next";
import { readDb, writeDb, getPartTypeInfo } from "@/lib/store";
import { CsvVerifiedRow } from "@/lib/mock-data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { batchId, rows } = req.body as {
    batchId?: string;
    rows: CsvVerifiedRow[];
  };

  if (!Array.isArray(rows)) {
    return res.status(400).json({ error: "Verified rows array is required" });
  }

  const db = readDb();
  const approvedRows = rows.filter((r) => r.isValid && r.selected);

  approvedRows.forEach((item, idx) => {
    const typeMeta = getPartTypeInfo(item.partType);
    const newOffer = {
      id: `off-csv-${Date.now()}-${idx}`,
      traderId: "tr-1",
      traderNameEn: "El-Tawfikia Auto Parts",
      traderNameAr: "التوفيقية لقطع غيار السيارات",
      traderRating: 4.9,
      storeAddressEn: "Downtown Cairo — 14 Orabi St, El-Tawfikia",
      storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
      allowStorePickup: item.allowStorePickup,
      pickupReadyMins: 30,
      isVerifiedTrader: true,
      condition: item.condition,
      brandEn: item.brand,
      brandAr: item.brand,
      originEn: item.origin,
      originAr: item.origin,
      price: item.price,
      stockQty: item.stockQty,
      warrantyDays: item.warrantyDays,
      shipHours: 12,
    };

    const existingPart = db.parts.find(
      (p) => p.oeNumber.toLowerCase() === item.oeNumber.toLowerCase()
    );

    if (existingPart) {
      existingPart.offers.unshift(newOffer);
      existingPart.isFromCsv = true;
    } else {
      db.parts.unshift({
        id: `part-csv-${Date.now()}-${idx}`,
        oeNumber: item.oeNumber,
        crossRef: [],
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        partType: item.partType,
        categoryEn: typeMeta.en,
        categoryAr: typeMeta.ar,
        descriptionEn: `${item.brand} (${item.origin}) — Auto-added via Verified Trader CSV`,
        descriptionAr: `${item.brand} (${item.origin}) — مضاف تلقائياً عبر فحص ملف CSV`,
        compatibleVehicleIds: ["v-corolla-19-24"],
        isFromCsv: true,
        offers: [newOffer],
      });
    }
  });

  if (batchId) {
    const batch = db.csvBatches.find((b) => b.id === batchId);
    if (batch) {
      batch.status = "CONFIRMED_AUTO_ADDED";
      batch.confirmedAt = new Date().toISOString();
    }
  }

  writeDb(db);

  return res.status(200).json({
    addedCount: approvedRows.length,
    parts: db.parts,
    csvBatches: db.csvBatches,
  });
}
