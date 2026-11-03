export type Locale = "ar" | "en";

export type PartCategoryType =
  | "MECHANICAL_ENGINE"
  | "BRAKES_SUSPENSION"
  | "BODY_EXTERIOR"
  | "ELECTRICAL_SENSORS"
  | "COOLING_AC"
  | "TRANSMISSION_DRIVETRAIN"
  | "OILS_CONSUMABLES";

export type PartCondition =
  | "OEM_NEW"
  | "OES_FIRST_LINE"
  | "AFTERMARKET_COMMERCIAL"
  | "USED_IMPORTED"
  | "REMANUFACTURED";

export interface PartTypeMeta {
  id: "ALL" | PartCategoryType;
  icon: string;
  en: string;
  ar: string;
}

export const PART_TYPES: PartTypeMeta[] = [
  { id: "ALL", icon: "🔍", en: "All Part Types", ar: "كل أنواع قطع الغيار" },
  { id: "MECHANICAL_ENGINE", icon: "⚙️", en: "Engine & Mechanical", ar: "المحرك والميكانيكا" },
  { id: "BRAKES_SUSPENSION", icon: "🛞", en: "Brakes, Suspension & Steering", ar: "الفرامل والعفشة والدركسيون" },
  { id: "BODY_EXTERIOR", icon: "🚘", en: "Body Panels, Bumpers & Lights", ar: "الصاج والإكصدامات والفوانيس" },
  { id: "ELECTRICAL_SENSORS", icon: "⚡", en: "Electrical, Sensors & ECUs", ar: "الكهرباء والحساسات والكنترول" },
  { id: "COOLING_AC", icon: "❄️", en: "Cooling & Air Conditioning", ar: "التبريد والتكييف" },
  { id: "TRANSMISSION_DRIVETRAIN", icon: "🔩", en: "Transmission, Clutch & CV Joints", ar: "الفتيس والدبرياج والكبالن" },
  { id: "OILS_CONSUMABLES", icon: "🛢️", en: "Oils, Fluids & Maintenance Kits", ar: "الزيوت والسوائل والصيانات" },
];

export const PART_CONDITIONS: { id: "ALL" | PartCondition; en: string; ar: string }[] = [
  { id: "ALL", en: "All Conditions", ar: "كل الحالات والدرجات" },
  { id: "OEM_NEW", en: "✓ Genuine OEM (Agency)", ar: "✓ أصلي وكالة (جديد)" },
  { id: "OES_FIRST_LINE", en: "★ First-Line OES (Bosch/Denso/KYB)", ar: "★ أصلي مصنع (بوش / دينسو / KYB)" },
  { id: "AFTERMARKET_COMMERCIAL", en: "◆ Commercial Aftermarket", ar: "◆ بديل تجاري (تايواني / كوري)" },
  { id: "USED_IMPORTED", en: "♻ Used Imported (Estirad)", ar: "♻ استيراد الخارج مفحوص" },
  { id: "REMANUFACTURED", en: "🛠️ Remanufactured / Rebuilt", ar: "🛠️ مجدد بالضمان" },
];

export interface VehicleTrim {
  id: string;
  make: string;
  makeAr: string;
  model: string;
  modelAr: string;
  yearStart: number;
  yearEnd: number;
  engine: string;
  sampleVin: string;
}

export interface TraderOffer {
  id: string;
  traderId: string;
  traderNameEn: string;
  traderNameAr: string;
  traderRating: number;
  storeAddressEn: string;
  storeAddressAr: string;
  allowStorePickup: boolean;
  pickupReadyMins: number;
  isVerifiedTrader: boolean;
  condition: PartCondition;
  conditionGrade?: string;
  brandEn: string;
  brandAr: string;
  originEn: string;
  originAr: string;
  price: number;
  compareAtPrice?: number;
  stockQty: number;
  warrantyDays: number;
  shipHours: number;
}

export interface MasterPart {
  id: string;
  oeNumber: string;
  crossRef: string[];
  nameEn: string;
  nameAr: string;
  partType: PartCategoryType;
  categoryEn: string;
  categoryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  compatibleVehicleIds: string[];
  isFromCsv?: boolean;
  offers: TraderOffer[];
}

export interface CsvVerifiedRow {
  oeNumber: string;
  nameEn: string;
  nameAr: string;
  partType: PartCategoryType;
  condition: PartCondition;
  brand: string;
  origin: string;
  price: number;
  stockQty: number;
  warrantyDays: number;
  allowStorePickup: boolean;
  isValid: boolean;
  selected: boolean;
  statusEn: string;
  statusAr: string;
}

export const SAMPLE_TRADER_CSV = `OE_NUMBER,PART_NAME_EN,PART_NAME_AR,PART_TYPE,CONDITION,BRAND,ORIGIN,PRICE_EGP,STOCK_QTY,WARRANTY_DAYS,STORE_PICKUP
17801-21060,Engine Air Filter Element,فلتر هواء محرك أصلي,MECHANICAL_ENGINE,OEM_NEW,Toyota Genuine,Japan,680,25,30,YES
43420-02E80,Front Left CV Axle Drive Shaft,كوبلن أمامي شمال كامل,TRANSMISSION_DRIVETRAIN,OES_FIRST_LINE,GKN Spidan,Germany,3450,6,180,YES
27060-0T260,Alternator 12V 120A Assembly,دينامو شحن كهرباء 120 أمبير,ELECTRICAL_SENSORS,USED_IMPORTED,Denso OEM Imported Grade A,Japan Import,4200,4,21,YES
52119-0X942,Front Bumper Cover Unpainted,إكصدام أمامي فيبر,BODY_EXTERIOR,AFTERMARKET_COMMERCIAL,Tong Yang Certified,Taiwan,2150,10,30,YES
08880-83889,Synthetic Engine Oil 5W-30 (4L),زيت محرك تخليقي 5W-30 (4 لتر),OILS_CONSUMABLES,OEM_NEW,Toyota Genuine Oil,UAE,1390,40,365,YES
88310-02K40,A/C Compressor with Clutch,كباس تكييف كامل بالكلتش,COOLING_AC,REMANUFACTURED,Denso Rebuilt,Japan,6900,3,90,YES
ERR-00000,Invalid Row Missing Price Demo,قطعة تجريبية بدون سعر لاختبار الفحص,MECHANICAL_ENGINE,OEM_NEW,TestBrand,Japan,0,5,30,YES`;

export const VEHICLES: VehicleTrim[] = [
  {
    id: "v-corolla-19-24",
    make: "Toyota",
    makeAr: "تويوتا",
    model: "Corolla (E210)",
    modelAr: "كورولا (الشكل الجديد)",
    yearStart: 2019,
    yearEnd: 2025,
    engine: "1.6L 1ZR-FE Dual VVT-i",
    sampleVin: "JTDBR32E800192831",
  },
  {
    id: "v-elantra-21-25",
    make: "Hyundai",
    makeAr: "هيونداي",
    model: "Elantra CN7",
    modelAr: "إلنترا CN7",
    yearStart: 2021,
    yearEnd: 2025,
    engine: "1.6L MPI Smartstream",
    sampleVin: "KMHLN4AJ5MU109482",
  },
  {
    id: "v-sportage-22-25",
    make: "Kia",
    makeAr: "كيا",
    model: "Sportage NQ5",
    modelAr: "سبورتاج NQ5",
    yearStart: 2022,
    yearEnd: 2025,
    engine: "1.6L T-GDI Turbo",
    sampleVin: "KNDPM3AC9N7004821",
  },
  {
    id: "v-bmw-320i-g20",
    make: "BMW",
    makeAr: "بي إم دبليو",
    model: "320i (G20)",
    modelAr: "320i الفئة الثالثة (G20)",
    yearStart: 2019,
    yearEnd: 2024,
    engine: "2.0L B48 TwinPower Turbo",
    sampleVin: "WBA5R1C50KAK92810",
  },
];

export const INITIAL_PARTS: MasterPart[] = [
  {
    id: "part-1",
    oeNumber: "04465-02420",
    crossRef: ["04465-02220", "DB2241"],
    nameEn: "Front Ceramic Brake Pads Set",
    nameAr: "طقم تيل فرامل أمامي سيراميك",
    partType: "BRAKES_SUSPENSION",
    categoryEn: "Brakes, Suspension & Steering",
    categoryAr: "الفرامل والعفشة والدركسيون",
    descriptionEn: "Dust-free low-noise front disc brake pad set with wear sensor clip.",
    descriptionAr: "طقم تيل فرامل أمامي أصلي مانع للصفير والتآكل مع حساس التآكل.",
    compatibleVehicleIds: ["v-corolla-19-24"],
    offers: [
      {
        id: "off-101",
        traderId: "tr-1",
        traderNameEn: "El-Tawfikia Auto Parts",
        traderNameAr: "التوفيقية لقطع غيار السيارات",
        traderRating: 4.9,
        storeAddressEn: "Downtown Cairo — 14 Orabi St, El-Tawfikia",
        storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
        allowStorePickup: true,
        pickupReadyMins: 30,
        isVerifiedTrader: true,
        condition: "OEM_NEW",
        brandEn: "Toyota Genuine Parts",
        brandAr: "تويوتا أصلي وكالة",
        originEn: "Japan",
        originAr: "اليابان",
        price: 2650,
        stockQty: 14,
        warrantyDays: 90,
        shipHours: 12,
      },
      {
        id: "off-102",
        traderId: "tr-2",
        traderNameEn: "Al-Alamiya Japan Spare Parts",
        traderNameAr: "العالمية لقطع الغيار الياباني",
        traderRating: 4.8,
        storeAddressEn: "Giza — 28 Gameat El-Dowal, Mohandessin",
        storeAddressAr: "الجيزة — 28 جامعة الدول، المهندسين",
        allowStorePickup: true,
        pickupReadyMins: 45,
        isVerifiedTrader: true,
        condition: "OES_FIRST_LINE",
        brandEn: "Brembo Ceramic",
        brandAr: "بريمبو سيراميك أصلي مصنع",
        originEn: "Italy",
        originAr: "إيطاليا",
        price: 1850,
        stockQty: 22,
        warrantyDays: 60,
        shipHours: 24,
      },
      {
        id: "off-103",
        traderId: "tr-3",
        traderNameEn: "El-Harfyeen Import Hub",
        traderNameAr: "مركز الحرفيين للاستيراد",
        traderRating: 4.6,
        storeAddressEn: "Cairo — El-Harfyeen City, Block 8, Shop 12",
        storeAddressAr: "القاهرة — مدينة الحرفيين، بلوك 8، محل 12",
        allowStorePickup: true,
        pickupReadyMins: 20,
        isVerifiedTrader: true,
        condition: "USED_IMPORTED",
        brandEn: "Toyota OEM (Imported Grade A)",
        brandAr: "استيراد أصلي بحالة الزيرو",
        originEn: "Japan Import",
        originAr: "استيراد اليابان",
        price: 1150,
        stockQty: 4,
        warrantyDays: 14,
        shipHours: 24,
      },
    ],
  },
  {
    id: "part-2",
    oeNumber: "48510-8Z295",
    crossRef: ["339700", "339701"],
    nameEn: "Front Gas Shock Absorbers Pair (R+L)",
    nameAr: "طقم مساعدين أمامي غاز (يمين + يسار)",
    partType: "BRAKES_SUSPENSION",
    categoryEn: "Brakes, Suspension & Steering",
    categoryAr: "الفرامل والعفشة والدركسيون",
    descriptionEn: "Twin-tube gas-charged front suspension struts for smooth ride and cornering.",
    descriptionAr: "طقم مساعدين أمامي غاز ثنائي الصمام لثبات فائق وامتصاص الصدمات.",
    compatibleVehicleIds: ["v-corolla-19-24", "v-elantra-21-25"],
    offers: [
      {
        id: "off-201",
        traderId: "tr-2",
        traderNameEn: "Al-Alamiya Japan Spare Parts",
        traderNameAr: "العالمية لقطع الغيار الياباني",
        traderRating: 4.8,
        storeAddressEn: "Giza — 28 Gameat El-Dowal, Mohandessin",
        storeAddressAr: "الجيزة — 28 جامعة الدول، المهندسين",
        allowStorePickup: true,
        pickupReadyMins: 30,
        isVerifiedTrader: true,
        condition: "OES_FIRST_LINE",
        brandEn: "KYB Excel-G Japan",
        brandAr: "كايايبا KYB الياباني",
        originEn: "Japan",
        originAr: "اليابان",
        price: 5400,
        stockQty: 8,
        warrantyDays: 180,
        shipHours: 24,
      },
      {
        id: "off-202",
        traderId: "tr-3",
        traderNameEn: "El-Harfyeen Import Hub",
        traderNameAr: "مركز الحرفيين للاستيراد",
        traderRating: 4.6,
        storeAddressEn: "Cairo — El-Harfyeen City, Block 8, Shop 12",
        storeAddressAr: "القاهرة — مدينة الحرفيين، بلوك 8، محل 12",
        allowStorePickup: true,
        pickupReadyMins: 25,
        isVerifiedTrader: true,
        condition: "USED_IMPORTED",
        brandEn: "OEM Imported Strut + Spring Assembly",
        brandAr: "مساعد كامل بالياي والبطاحة استيراد",
        originEn: "Japan Import",
        originAr: "استيراد اليابان",
        price: 3600,
        stockQty: 6,
        warrantyDays: 21,
        shipHours: 24,
      },
    ],
  },
  {
    id: "part-3",
    oeNumber: "90919-01275",
    crossRef: ["SC16HR11"],
    nameEn: "Iridium Laser Spark Plugs (Set of 4)",
    nameAr: "طقم بوجيهات إيريديوم ليزر (4 شمعة)",
    partType: "MECHANICAL_ENGINE",
    categoryEn: "Engine & Mechanical",
    categoryAr: "المحرك والميكانيكا",
    descriptionEn: "100,000 KM long-life iridium spark plugs for optimal fuel economy.",
    descriptionAr: "طقم بوجيهات إيريديوم أصلية عمر طويل حتى 100 ألف كم لتوفير البنزين.",
    compatibleVehicleIds: ["v-corolla-19-24", "v-elantra-21-25", "v-sportage-22-25"],
    offers: [
      {
        id: "off-301",
        traderId: "tr-1",
        traderNameEn: "El-Tawfikia Auto Parts",
        traderNameAr: "التوفيقية لقطع غيار السيارات",
        traderRating: 4.9,
        storeAddressEn: "Downtown Cairo — 14 Orabi St, El-Tawfikia",
        storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
        allowStorePickup: true,
        pickupReadyMins: 15,
        isVerifiedTrader: true,
        condition: "OEM_NEW",
        brandEn: "Denso Iridium TT",
        brandAr: "دينسو إيريديوم ياباني أصلي",
        originEn: "Japan",
        originAr: "اليابان",
        price: 1950,
        stockQty: 35,
        warrantyDays: 90,
        shipHours: 12,
      },
    ],
  },
  {
    id: "part-4",
    oeNumber: "63117466107",
    crossRef: ["63117466108"],
    nameEn: "Adaptive Full LED Headlight Assembly (Right)",
    nameAr: "فانوس أمامي يمين ليد كامل (Full LED)",
    partType: "BODY_EXTERIOR",
    categoryEn: "Body Panels, Bumpers & Lights",
    categoryAr: "الصاج والإكصدامات والفوانيس",
    descriptionEn: "Complete right-side projector LED headlight assembly with DRL module.",
    descriptionAr: "فانوس أمامي يمين كامل بالعدسات والليد النهاري مطابق للمواصفات الأصلية.",
    compatibleVehicleIds: ["v-bmw-320i-g20", "v-corolla-19-24"],
    offers: [
      {
        id: "off-401",
        traderId: "tr-3",
        traderNameEn: "El-Harfyeen Import Hub",
        traderNameAr: "مركز الحرفيين للاستيراد",
        traderRating: 4.7,
        storeAddressEn: "Cairo — El-Harfyeen City, Block 8, Shop 12",
        storeAddressAr: "القاهرة — مدينة الحرفيين، بلوك 8، محل 12",
        allowStorePickup: true,
        pickupReadyMins: 30,
        isVerifiedTrader: true,
        condition: "USED_IMPORTED",
        brandEn: "Original OEM Imported (Grade A+ Intact Tabs)",
        brandAr: "أصلي استيراد فرز أول بقواعد المصنع",
        originEn: "Germany Import",
        originAr: "استيراد ألمانيا",
        price: 11500,
        stockQty: 3,
        warrantyDays: 30,
        shipHours: 24,
      },
      {
        id: "off-402",
        traderId: "tr-1",
        traderNameEn: "El-Tawfikia Auto Parts",
        traderNameAr: "التوفيقية لقطع غيار السيارات",
        traderRating: 4.9,
        storeAddressEn: "Downtown Cairo — 14 Orabi St, El-Tawfikia",
        storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
        allowStorePickup: true,
        pickupReadyMins: 30,
        isVerifiedTrader: true,
        condition: "AFTERMARKET_COMMERCIAL",
        brandEn: "TYC / Depo Certified",
        brandAr: "ديبو / TYC تايواني تجاري درجة أولى",
        originEn: "Taiwan",
        originAr: "تايوان",
        price: 6800,
        stockQty: 7,
        warrantyDays: 90,
        shipHours: 24,
      },
    ],
  },
  {
    id: "part-5",
    oeNumber: "16400-0T230",
    crossRef: ["DN-RAD-902"],
    nameEn: "Aluminum Engine Cooling Radiator Assembly",
    nameAr: "ردياتير مياه تبريد المحرك ألومنيوم",
    partType: "COOLING_AC",
    categoryEn: "Cooling & Air Conditioning",
    categoryAr: "التبريد والتكييف",
    descriptionEn: "High-efficiency brazed aluminum core radiator for automatic transmission cars.",
    descriptionAr: "ردياتير تبريد ألومنيوم عالي الكفاءة للسيارات الأوتوماتيك يتحمل الأجواء الحارة.",
    compatibleVehicleIds: ["v-corolla-19-24", "v-elantra-21-25"],
    offers: [
      {
        id: "off-501",
        traderId: "tr-2",
        traderNameEn: "Al-Alamiya Japan Spare Parts",
        traderNameAr: "العالمية لقطع الغيار الياباني",
        traderRating: 4.8,
        storeAddressEn: "Giza — 28 Gameat El-Dowal, Mohandessin",
        storeAddressAr: "الجيزة — 28 جامعة الدول، المهندسين",
        allowStorePickup: true,
        pickupReadyMins: 30,
        isVerifiedTrader: true,
        condition: "OES_FIRST_LINE",
        brandEn: "Denso Cooling Systems",
        brandAr: "دينسو الأصلي للتبريد",
        originEn: "Japan",
        originAr: "اليابان",
        price: 4350,
        stockQty: 9,
        warrantyDays: 180,
        shipHours: 24,
      },
    ],
  },
];

export const INITIAL_RFQS = [
  {
    id: "RFQ-8841",
    customerName: "Ahmed Hassan",
    vehicleTextEn: "2022 Toyota Corolla 1.6L",
    vehicleTextAr: "تويوتا كورولا 2022 - 1600 سي سي",
    vin: "JTDBR32E800192831",
    partType: "BRAKES_SUSPENSION" as PartCategoryType,
    partNameEn: "Electric Power Steering Rack Assembly (علبة دركسيون كهرباء)",
    partNameAr: "علبة دركسيون كهرباء كاملة (اسكترا)",
    quotes: [
      {
        id: "q-1",
        traderNameEn: "El-Harfyeen Import Hub",
        traderNameAr: "مركز الحرفيين للاستيراد",
        storeAddressEn: "Cairo — El-Harfyeen City, Block 8, Shop 12",
        storeAddressAr: "القاهرة — مدينة الحرفيين، بلوك 8، محل 12",
        condition: "USED_IMPORTED" as PartCondition,
        brand: "Toyota Original Import (Grade A)",
        price: 6800,
        warrantyDays: 30,
        allowStorePickup: true,
      },
      {
        id: "q-2",
        traderNameEn: "El-Tawfikia Auto Parts",
        traderNameAr: "التوفيقية لقطع غيار السيارات",
        storeAddressEn: "Downtown Cairo — 14 Orabi St, El-Tawfikia",
        storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
        condition: "OEM_NEW" as PartCondition,
        brand: "Toyota Genuine Boxed",
        price: 14900,
        warrantyDays: 180,
        allowStorePickup: true,
      },
    ],
  },
];

export const WORKSHOPS = [
  {
    id: "ws-1",
    nameEn: "ProTech Auto Service & Bosch Center",
    nameAr: "برو تيك لصيانة السيارات المعتمدة",
    cityEn: "New Cairo",
    cityAr: "القاهرة الجديدة",
    districtEn: "5th Settlement",
    districtAr: "التجمع الخامس",
    rating: 4.9,
    reviewCount: 342,
    installFee: 350,
    specialtiesEn: ["Brakes & ABS", "Suspension Alignment", "Computer Diagnostics"],
    specialtiesAr: ["الفرامل و ABS", "ترصيص وعفشة", "كشف أعطال بالكمبيوتر"],
    laborRates: [
      { serviceEn: "Front Brake Pads Replacement", serviceAr: "تركيب تيل فرامل أمامي", price: 350 },
      { serviceEn: "Front Shock Absorbers Pair Install", serviceAr: "تركيب طقم مساعدين أمامي", price: 650 },
    ],
  },
  {
    id: "ws-2",
    nameEn: "Al-Mohandes Japan & Korea Specialist",
    nameAr: "المهندس جروب للياباني والكوري",
    cityEn: "Giza",
    cityAr: "الجيزة",
    districtEn: "6th of October",
    districtAr: "6 أكتوبر",
    rating: 4.8,
    reviewCount: 218,
    installFee: 300,
    specialtiesEn: ["Engine Overhaul", "Cooling & A/C", "Transmission & CV"],
    specialtiesAr: ["ميكانيكا المحرك", "التبريد والتكييف", "فتيس وكبالن"],
    laborRates: [
      { serviceEn: "Radiator Replacement + Coolant Flush", serviceAr: "تغيير ردياتير ودورة تبريد", price: 450 },
      { serviceEn: "Spark Plugs & Throttle Cleaning", serviceAr: "تغيير بوجيهات وتنظيف بوابة", price: 300 },
    ],
  },
];
