import type { NextApiRequest, NextApiResponse } from "next";
import { readDb, writeDb, parseAndVerifyTraderCsv } from "@/lib/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { csvContent, fileName, traderName } = req.body;
  if (!csvContent || typeof csvContent !== "string") {
    return res.status(400).json({ error: "csvContent is required" });
  }

  const db = readDb();
  const rows = parseAndVerifyTraderCsv(csvContent, db.parts);
  const verifiedCount = rows.filter((r) => r.isValid).length;
  const invalidCount = rows.filter((r) => !r.isValid).length;

  const batch = {
    id: `CSV-BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
    traderName: traderName || "El-Tawfikia Auto Parts",
    fileName: fileName || "trader_stock_upload.csv",
    totalRows: rows.length,
    verifiedCount,
    invalidCount,
    status: "PENDING_CONFIRMATION" as const,
    rows,
    createdAt: new Date().toISOString(),
  };

  db.csvBatches.unshift(batch);
  writeDb(db);

  return res.status(200).json({
    batch,
    summary: {
      totalRows: rows.length,
      verifiedCount,
      invalidCount,
    },
  });
}
