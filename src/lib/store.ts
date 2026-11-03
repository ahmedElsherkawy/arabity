import fs from "fs";
import path from "path";
import {
  INITIAL_PARTS,
  INITIAL_RFQS,
  WORKSHOPS,
  VEHICLES,
  MasterPart,
  PartCategoryType,
  PartCondition,
  CsvVerifiedRow,
  PART_TYPES,
} from "./mock-data";

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  fulfillmentType: "STORE_PICKUP" | "HOME_DELIVERY" | "SHIP_TO_WORKSHOP";
  paymentMethod: "PAY_AT_STORE" | "ONLINE_CARD" | "COD";
  pickupCode?: string;
  pickupVerifiedAt?: string;
  workshopId?: string;
  workshopName?: string;
  subtotal: number;
  shippingFee: number;
  installationFee: number;
  totalAmount: number;
  status:
    | "READY_FOR_STORE_PICKUP"
    | "PICKED_UP_FROM_STORE"
    | "PROCESSING_DELIVERY"
    | "SHIPPED_TO_WORKSHOP";
  items: {
    partId: string;
    oeNumber: string;
    partNameEn: string;
    partNameAr: string;
    traderNameEn: string;
    traderNameAr: string;
    storeAddressEn: string;
    storeAddressAr: string;
    condition: PartCondition;
    brand: string;
    price: number;
    qty: number;
  }[];
  createdAt: string;
}

export interface CsvBatchRecord {
  id: string;
  traderName: string;
  fileName: string;
  totalRows: number;
  verifiedCount: number;
  invalidCount: number;
  status: "PENDING_CONFIRMATION" | "CONFIRMED_AUTO_ADDED";
  rows: CsvVerifiedRow[];
  createdAt: string;
  confirmedAt?: string;
}

export interface DatabaseState {
  parts: MasterPart[];
  rfqs: typeof INITIAL_RFQS;
  workshops: typeof WORKSHOPS;
  vehicles: typeof VEHICLES;
  orders: OrderRecord[];
  csvBatches: CsvBatchRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "arabety-db.json");

function getDefaultState(): DatabaseState {
  return {
    parts: INITIAL_PARTS,
    rfqs: INITIAL_RFQS,
    workshops: WORKSHOPS,
    vehicles: VEHICLES,
    orders: [
      {
        id: "ord-1001",
        orderNumber: "ARB-90142",
        customerName: "Mohamed Adel",
        customerPhone: "01012345678",
        fulfillmentType: "STORE_PICKUP",
        paymentMethod: "PAY_AT_STORE",
        pickupCode: "PK-4829",
        subtotal: 2650,
        shippingFee: 0,
        installationFee: 0,
        totalAmount: 2650,
        status: "READY_FOR_STORE_PICKUP",
        items: [
          {
            partId: "part-1",
            oeNumber: "04465-02420",
            partNameEn: "Front Ceramic Brake Pads Set",
            partNameAr: "طقم تيل فرامل أمامي سيراميك",
            traderNameEn: "El-Tawfikia Auto Parts",
            traderNameAr: "التوفيقية لقطع غيار السيارات",
            storeAddressEn: "Downtown Cairo — 14 Orabi St, El-Tawfikia",
            storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
            condition: "OEM_NEW",
            brand: "Toyota Genuine Parts",
            price: 2650,
            qty: 1,
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ],
    csvBatches: [],
  };
}

export function readDb(): DatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getDefaultState();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw) as DatabaseState;
  } catch {
    return getDefaultState();
  }
}

export function writeDb(state: DatabaseState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write DB:", err);
  }
}

const VALID_PART_TYPES: PartCategoryType[] = [
  "MECHANICAL_ENGINE",
  "BRAKES_SUSPENSION",
  "BODY_EXTERIOR",
  "ELECTRICAL_SENSORS",
  "COOLING_AC",
  "TRANSMISSION_DRIVETRAIN",
  "OILS_CONSUMABLES",
];

const VALID_CONDITIONS: PartCondition[] = [
  "OEM_NEW",
  "OES_FIRST_LINE",
  "AFTERMARKET_COMMERCIAL",
  "USED_IMPORTED",
  "REMANUFACTURED",
];

export function parseAndVerifyTraderCsv(
  csvContent: string,
  existingParts: MasterPart[]
): CsvVerifiedRow[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const oeNumber = cols[0] || "";
    const nameEn = cols[1] || "";
    const nameAr = cols[2] || nameEn;
    const rawType = (cols[3] || "MECHANICAL_ENGINE").toUpperCase() as PartCategoryType;
    const partType = VALID_PART_TYPES.includes(rawType)
      ? rawType
      : "MECHANICAL_ENGINE";
    const rawCond = (cols[4] || "OEM_NEW").toUpperCase() as PartCondition;
    const condition = VALID_CONDITIONS.includes(rawCond) ? rawCond : "OEM_NEW";
    const brand = cols[5] || "OEM";
    const origin = cols[6] || "Japan";
    const price = Number(cols[7]) || 0;
    const stockQty = Number(cols[8]) || 0;
    const warrantyDays = Number(cols[9]) || 30;
    const allowStorePickup = (cols[10] || "YES").toUpperCase() === "YES";

    const missingFields: string[] = [];
    if (!oeNumber) missingFields.push("OE_NUMBER");
    if (!nameEn) missingFields.push("PART_NAME");
    if (price <= 0) missingFields.push("PRICE_EGP > 0");
    if (stockQty <= 0) missingFields.push("STOCK_QTY > 0");

    const isValid = missingFields.length === 0;
    const exists = existingParts.some(
      (p) => p.oeNumber.toLowerCase() === oeNumber.toLowerCase()
    );

    const statusEn = !isValid
      ? `Invalid (${missingFields.join(", ")}) — Auto-Skipped`
      : exists
      ? "Verified — Matches Existing OE# (Updates Offer/Stock)"
      : "Verified — New Catalog Part Ready to Auto-Add";

    const statusAr = !isValid
      ? `بيانات غير صالحة (${missingFields.join(", ")}) — مستبعد تلقائياً`
      : exists
      ? "تم التحقق — مطابق لرقم OE موجود (تحديث السعر والرصيد)"
      : "تم التحقق — قطعة جديدة جاهزة للإضافة التلقائية";

    return {
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
      isValid,
      selected: isValid,
      statusEn,
      statusAr,
    };
  });
}

export function getPartTypeInfo(partType: PartCategoryType) {
  return (
    PART_TYPES.find((pt) => pt.id === partType) || {
      id: partType,
      icon: "⚙️",
      en: "Engine & Mechanical",
      ar: "المحرك والميكانيكا",
    }
  );
}
