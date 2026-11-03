import type { NextApiRequest, NextApiResponse } from "next";
import { readDb, writeDb, getPartTypeInfo } from "@/lib/store";
import { PartCategoryType, PartCondition } from "@/lib/mock-data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = readDb();

  if (req.method === "GET") {
    const { partType, condition, onlyStorePickup, q } = req.query;
    let parts = [...db.parts];

    if (typeof partType === "string" && partType !== "ALL") {
      parts = parts.filter((p) => p.partType === partType);
    }

    if (typeof condition === "string" && condition !== "ALL") {
      parts = parts.filter((p) =>
        p.offers.some((o) => o.condition === condition)
      );
    }

    if (onlyStorePickup === "true") {
      parts = parts.filter((p) => p.offers.some((o) => o.allowStorePickup));
    }

    if (typeof q === "string" && q.trim() !== "") {
      const query = q.toLowerCase();
      parts = parts.filter(
        (p) =>
          p.nameEn.toLowerCase().includes(query) ||
          p.nameAr.includes(q) ||
          p.oeNumber.toLowerCase().includes(query) ||
          p.offers.some((o) => o.brandEn.toLowerCase().includes(query))
      );
    }

    return res.status(200).json({
      parts,
      vehicles: db.vehicles,
      workshops: db.workshops,
      rfqs: db.rfqs,
      orders: db.orders,
      csvBatches: db.csvBatches,
    });
  }

  if (req.method === "POST") {
    const {
      oeNumber,
      nameEn,
      nameAr,
      partType,
      condition,
      brand,
      origin,
      price,
      stockQty,
      warrantyDays,
      allowStorePickup,
      traderNameEn,
      traderNameAr,
      storeAddressEn,
      storeAddressAr,
    } = req.body;

    if (!oeNumber || !nameEn || Number(price) <= 0) {
      return res
        .status(400)
        .json({ error: "Missing OE Number, Part Name, or valid Price" });
    }

    const typeMeta = getPartTypeInfo(
      (partType as PartCategoryType) || "MECHANICAL_ENGINE"
    );

    const newOffer = {
      id: `off-man-${Date.now()}`,
      traderId: "tr-1",
      traderNameEn: traderNameEn || "El-Tawfikia Auto Parts",
      traderNameAr: traderNameAr || "التوفيقية لقطع غيار السيارات",
      traderRating: 4.9,
      storeAddressEn:
        storeAddressEn || "Downtown Cairo — 14 Orabi St, El-Tawfikia",
      storeAddressAr:
        storeAddressAr || "وسط البلد — 14 شارع عرابي، التوفيقية",
      allowStorePickup: allowStorePickup !== false,
      pickupReadyMins: 30,
      isVerifiedTrader: true,
      condition: (condition as PartCondition) || "OEM_NEW",
      brandEn: brand || "OEM Genuine",
      brandAr: brand || "أصلي",
      originEn: origin || "Japan",
      originAr: origin || "اليابان",
      price: Number(price),
      stockQty: Number(stockQty) || 5,
      warrantyDays: Number(warrantyDays) || 90,
      shipHours: 12,
    };

    const existingPart = db.parts.find(
      (p) => p.oeNumber.toLowerCase() === String(oeNumber).toLowerCase()
    );

    if (existingPart) {
      existingPart.offers.unshift(newOffer);
      existingPart.isFromCsv = true;
    } else {
      db.parts.unshift({
        id: `part-man-${Date.now()}`,
        oeNumber: String(oeNumber).trim(),
        crossRef: [],
        nameEn: String(nameEn).trim(),
        nameAr: String(nameAr || nameEn).trim(),
        partType: (partType as PartCategoryType) || "MECHANICAL_ENGINE",
        categoryEn: typeMeta.en,
        categoryAr: typeMeta.ar,
        descriptionEn: `${brand || "OEM"} (${origin || "Japan"}) — Verified Trader Stock`,
        descriptionAr: `${brand || "أصلي"} (${origin || "اليابان"}) — مخزون تاجر موثق`,
        compatibleVehicleIds: ["v-corolla-19-24"],
        isFromCsv: true,
        offers: [newOffer],
      });
    }

    writeDb(db);
    return res.status(201).json({ parts: db.parts });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
