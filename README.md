# Arabety (عربيتي) — Multi-Trader Car Spare Parts Marketplace

**Arabety** is a full-stack bilingual (Arabic RTL & English LTR) automotive spare parts marketplace across **Web (Next.js + TypeScript + Prisma)** and **Mobile (React Native / Expo)**.

## Key Features Implemented

1. **Direct In-Store Pickup (`استلام مباشر من محل التاجر`) + Home Delivery + Ship-to-Workshop**:
   - Customers can reserve any spare part online with **0 EGP shipping** and receive a **6-digit Store Pickup Code (e.g., `PK-4829`)** along with the trader's exact shop address (`El-Tawfikia`, `El-Harfyeen`, `Mohandessin`).
   - Traders can verify the customer's Pickup Code at the shop counter via `/trader/stock` (`POST /api/orders` with `action: "VERIFY_PICKUP_CODE"`).
2. **Dedicated Trader Stock & Smart CSV Bulk Upload Page (`/trader/stock`)**:
   - **CSV Upload & Verification (`POST /api/trader/csv-verify`)**: Reads `.csv` files, validates `OE_NUMBER`, `PART_NAME`, `PART_TYPE`, `CONDITION`, `PRICE_EGP`, and `STOCK_QTY`, flags invalid rows automatically, and shows a verification table.
   - **1-Click Confirm & Auto-Add (`POST /api/trader/csv-confirm`)**: When the trader clicks **"✓ Yes, Confirm & Auto-Add Verified Stock"**, all verified rows are automatically published into the live catalog and persisted in `data/arabety-db.json`.
   - **Manual Single Part Entry (`POST /api/parts`)**: Add individual spare parts with full category and condition metadata.
3. **7 Spare Part System Types & 5 Condition Tiers**:
   - **7 System Types**: `MECHANICAL_ENGINE`, `BRAKES_SUSPENSION`, `BODY_EXTERIOR`, `ELECTRICAL_SENSORS`, `COOLING_AC`, `TRANSMISSION_DRIVETRAIN`, `OILS_CONSUMABLES`.
   - **5 Condition Tiers**: `OEM_NEW` (Genuine Agency), `OES_FIRST_LINE` (Bosch/Denso/KYB), `AFTERMARKET_COMMERCIAL`, `USED_IMPORTED` (Estirad with testing warranty), `REMANUFACTURED`.
4. **My Garage Fitment Filter & Request-a-Part (RFQ) Live Bidding**:
   - Save vehicles by Make/Model/Year/VIN, compare multi-trader offers ("Buy Box"), submit custom part RFQs (`/api/rfq`), and book partner workshops.

## Project Structure

- `prisma/schema.prisma` — Complete PostgreSQL Prisma schema
- `src/lib/store.ts` — Persistent database engine (`data/arabety-db.json`) & CSV verification parser
- `src/lib/mock-data.ts` — Bilingual automotive catalog, 7 Part Types, 5 Condition Grades & sample CSV
- `src/pages/index.tsx` — Main Storefront, My Garage, Multi-Trader Comparison, RFQ, Workshops & 3-Way Checkout
- `src/pages/trader/stock.tsx` — Dedicated Trader Stock & CSV Upload/Verification/Auto-Add Portal
- `src/pages/api/parts.ts` — Catalog filtering & manual stock creation API
- `src/pages/api/trader/csv-verify.ts` — CSV parser & automated row verification API
- `src/pages/api/trader/csv-confirm.ts` — 1-click confirmed CSV auto-import API
- `src/pages/api/orders.ts` — Order creation & In-Store Pickup Code verification API
- `src/pages/api/rfq.ts` — Request-a-Part & Trader Quote bidding API
- `public/sample-trader-stock.csv` — Sample CSV file for trader bulk stock upload
- `mobile/App.tsx` — React Native (Expo) iOS & Android mobile app

## Running Locally

```bash
npm install
npm run dev
```
