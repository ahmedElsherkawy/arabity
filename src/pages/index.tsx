import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  VEHICLES,
  INITIAL_PARTS,
  INITIAL_RFQS,
  WORKSHOPS,
  PART_TYPES,
  PART_CONDITIONS,
  SAMPLE_TRADER_CSV,
  Locale,
  PartCategoryType,
  PartCondition,
  MasterPart,
  TraderOffer,
  CsvVerifiedRow,
} from "@/lib/mock-data";
import { OrderRecord } from "@/lib/store";

interface CartItem {
  partId: string;
  oeNumber: string;
  partNameEn: string;
  partNameAr: string;
  traderNameEn: string;
  traderNameAr: string;
  storeAddressEn: string;
  storeAddressAr: string;
  allowStorePickup: boolean;
  pickupReadyMins: number;
  condition: PartCondition;
  brand: string;
  price: number;
  qty: number;
}

export default function ArabetyMarketplace({
  defaultTab = "auth",
}: {
  defaultTab?: "auth" | "garage-onboarding" | "storefront" | "trader-stock" | "rfq" | "workshops" | "admin";
}) {
  const [locale, setLocale] = useState<Locale>("ar");
  const [activeTab, setActiveTab] = useState<
    "auth" | "garage-onboarding" | "storefront" | "trader-stock" | "rfq" | "workshops" | "admin"
  >(defaultTab);

  // Auth & User Session State (Step 1: Login / Sign-Up + OTP + Role Selection)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authStep, setAuthStep] = useState<"credentials" | "otp">("credentials");
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "TRADER" | "WORKSHOP" | "ADMIN">("CUSTOMER");
  const [authPhone, setAuthPhone] = useState<string>("01012345678");
  const [authName, setAuthName] = useState<string>("أحمد الشرقاوي / Ahmed El-Sherkawy");
  const [authShopName, setAuthShopName] = useState<string>("التوفيقية لقطع غيار السيارات / El-Tawfikia Auto Parts");
  const [authShopAddress, setAuthShopAddress] = useState<string>("وسط البلد — 14 شارع عرابي، التوفيقية");
  const [otpCode, setOtpCode] = useState<string>("1234");
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    phone: string;
    role: "CUSTOMER" | "TRADER" | "WORKSHOP" | "ADMIN";
    shopName?: string;
  } | null>(
    defaultTab === "trader-stock"
      ? {
          name: "الحاج محمود التوفيقية / Mahmoud El-Tawfikia",
          phone: "01098765432",
          role: "TRADER",
          shopName: "El-Tawfikia Auto Parts",
        }
      : null
  );
  const [vinInput, setVinInput] = useState<string>("JTDBR32E800129481");

  // Catalog & Fitment State
  const [parts, setParts] = useState<MasterPart[]>(INITIAL_PARTS);
  const [rfqs, setRfqs] = useState(INITIAL_RFQS);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("v-corolla-19-24");
  const [partTypeFilter, setPartTypeFilter] = useState<"ALL" | PartCategoryType>("ALL");
  const [conditionFilter, setConditionFilter] = useState<"ALL" | PartCondition>("ALL");
  const [onlyStorePickup, setOnlyStorePickup] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Cart State
  const [comparePart, setComparePart] = useState<MasterPart | null>(null);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([
    {
      partId: "part-1",
      oeNumber: "04465-02420",
      partNameEn: "Front Ceramic Brake Pads Set",
      partNameAr: "طقم تيل فرامل أمامي سيراميك",
      traderNameEn: "El-Tawfikia Auto Parts",
      traderNameAr: "التوفيقية لقطع غيار السيارات",
      storeAddressEn: "Downtown Cairo — 14 Orabi St, El-Tawfikia",
      storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
      allowStorePickup: true,
      pickupReadyMins: 30,
      condition: "OEM_NEW",
      brand: "Toyota Genuine Parts",
      price: 2650,
      qty: 1,
    },
  ]);
  const [fulfillmentType, setFulfillmentType] = useState<
    "STORE_PICKUP" | "HOME_DELIVERY" | "SHIP_TO_WORKSHOP"
  >("STORE_PICKUP");
  const [paymentMethod, setPaymentMethod] = useState<"PAY_AT_STORE" | "ONLINE_CARD">(
    "PAY_AT_STORE"
  );
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>("ws-1");
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  // Trader Stock & CSV Verification State
  const [csvRawText, setCsvRawText] = useState<string>(SAMPLE_TRADER_CSV);
  const [csvBatchId, setCsvBatchId] = useState<string | undefined>(undefined);
  const [verifiedRows, setVerifiedRows] = useState<CsvVerifiedRow[]>([]);
  const [traderBanner, setTraderBanner] = useState<string | null>(null);
  const [pickupCodeInput, setPickupCodeInput] = useState<string>("PK-4829");
  const [pickupVerifyResult, setPickupVerifyResult] = useState<string | null>(null);

  // Manual Stock Form State
  const [manOe, setManOe] = useState<string>("16100-09460");
  const [manType, setManType] = useState<PartCategoryType>("MECHANICAL_ENGINE");
  const [manNameEn, setManNameEn] = useState<string>("Engine Water Pump Assembly");
  const [manNameAr, setManNameAr] = useState<string>("طرمبة مياه تبريد محرك كاملة");
  const [manCond, setManCond] = useState<PartCondition>("OEM_NEW");
  const [manBrand, setManBrand] = useState<string>("Aisin Japan");
  const [manPrice, setManPrice] = useState<number>(2250);
  const [manQty, setManQty] = useState<number>(9);
  const [manPickup, setManPickup] = useState<boolean>(true);

  // RFQ Form State
  const [rfqVehicle, setRfqVehicle] = useState<string>("2022 Toyota Corolla 1.6L");
  const [rfqPartName, setRfqPartName] = useState<string>("");
  const [rfqPartType, setRfqPartType] = useState<PartCategoryType>("BODY_EXTERIOR");

  const isAr = locale === "ar";
  const t = (en: string, ar: string) => (isAr ? ar : en);

  useEffect(() => {
    fetch("/api/parts")
      .then((r) => r.json())
      .then((data) => {
        if (data.parts) setParts(data.parts);
        if (data.rfqs) setRfqs(data.rfqs);
        if (data.orders) setOrders(data.orders);
      })
      .catch(() => {});
  }, []);

  const getPartTypeLabel = (typeId: PartCategoryType) => {
    const found = PART_TYPES.find((pt) => pt.id === typeId);
    return found ? `${found.icon} ${t(found.en, found.ar)}` : typeId;
  };

  const renderConditionBadge = (cond: PartCondition) => {
    if (cond === "OEM_NEW") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {t("✓ Genuine OEM (Agency)", "✓ أصلي وكالة (جديد)")}
        </span>
      );
    }
    if (cond === "OES_FIRST_LINE") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          {t("★ OES First-Line", "★ أصلي مصنع أول")}
        </span>
      );
    }
    if (cond === "AFTERMARKET_COMMERCIAL") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          {t("◆ Commercial Aftermarket", "◆ بديل تجاري")}
        </span>
      );
    }
    if (cond === "REMANUFACTURED") {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
          {t("🛠️ Remanufactured", "🛠️ مجدد بالضمان")}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        {t("♻ Used Imported (Estirad)", "♻ استيراد مفحوص")}
      </span>
    );
  };

  // CSV Upload & Verification Handlers
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || "");
      setCsvRawText(content);
      runCsvVerification(content, file.name);
    };
    reader.readAsText(file);
  };

  const runCsvVerification = async (rawContent: string, fileName = "trader_stock.csv") => {
    try {
      const res = await fetch("/api/trader/csv-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: rawContent, fileName }),
      });
      const data = await res.json();
      if (data.batch) {
        setCsvBatchId(data.batch.id);
        setVerifiedRows(data.batch.rows);
        setTraderBanner(null);
      }
    } catch {
      // Fallback client-side verification
    }
  };

  const handleConfirmAutoAddCsv = async () => {
    const selectedValid = verifiedRows.filter((r) => r.isValid && r.selected);
    if (selectedValid.length === 0) return;

    try {
      const res = await fetch("/api/trader/csv-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: csvBatchId, rows: verifiedRows }),
      });
      const data = await res.json();
      if (data.parts) {
        setParts(data.parts);
      }
      setVerifiedRows([]);
      setTraderBanner(
        t(
          `✅ Confirmed! ${selectedValid.length} verified spare parts from your CSV were automatically added to your live store inventory!`,
          `✅ تم التأكيد! تمت إضافة ${selectedValid.length} قطع غيار تم التحقق منها من ملف الـ CSV تلقائياً إلى مخزون محلك الحي!`
        )
      );
    } catch {}
  };

  const handleManualAddStock = async () => {
    const res = await fetch("/api/parts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oeNumber: manOe,
        nameEn: manNameEn,
        nameAr: manNameAr,
        partType: manType,
        condition: manCond,
        brand: manBrand,
        origin: "Japan",
        price: manPrice,
        stockQty: manQty,
        allowStorePickup: manPickup,
      }),
    });
    const data = await res.json();
    if (data.parts) {
      setParts(data.parts);
      setTraderBanner(
        t(
          `✅ "${manNameEn}" (OE# ${manOe}) was added to your live store inventory!`,
          `✅ تمت إضافة "${manNameAr}" (OE# ${manOe}) إلى مخزون محلك الحي بنجاح!`
        )
      );
    }
  };

  const handleVerifyStorePickupCode = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "VERIFY_PICKUP_CODE",
        pickupCode: pickupCodeInput,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
      setPickupVerifyResult(
        t(
          `✅ Pickup Code ${pickupCodeInput} Verified! Order #${data.order.orderNumber} marked as Handed Over to Customer at Store Counter.`,
          `✅ تم التحقق من كود الاستلام ${pickupCodeInput}! تم تسليم الطلب #${data.order.orderNumber} للعميل من المحل بنجاح.`
        )
      );
    } else {
      setPickupVerifyResult(
        t(
          `⚠ Invalid Pickup Code "${pickupCodeInput}". Please check the customer's 6-digit code.`,
          `⚠ كود الاستلام "${pickupCodeInput}" غير صحيح. يرجى مراجعة كود العميل.`
        )
      );
    }
  };

  const addToCart = (
    part: MasterPart,
    offer: TraderOffer,
    preferredMode: "STORE_PICKUP" | "HOME_DELIVERY" | "SHIP_TO_WORKSHOP"
  ) => {
    setCart((prev) => [
      ...prev,
      {
        partId: part.id,
        oeNumber: part.oeNumber,
        partNameEn: part.nameEn,
        partNameAr: part.nameAr,
        traderNameEn: offer.traderNameEn,
        traderNameAr: offer.traderNameAr,
        storeAddressEn: offer.storeAddressEn,
        storeAddressAr: offer.storeAddressAr,
        allowStorePickup: offer.allowStorePickup,
        pickupReadyMins: offer.pickupReadyMins,
        condition: offer.condition,
        brand: isAr ? offer.brandAr : offer.brandEn,
        price: offer.price,
        qty: 1,
      },
    ]);
    setFulfillmentType(preferredMode);
    setConfirmedOrder(null);
    setCartOpen(true);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const ws = WORKSHOPS.find((w) => w.id === selectedWorkshopId) || WORKSHOPS[0];
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Car Owner",
        customerPhone: "01012345678",
        fulfillmentType,
        paymentMethod,
        workshopId: ws.id,
        workshopName: isAr ? ws.nameAr : ws.nameEn,
        installationFee: ws.installFee,
        items: cart,
      }),
    });
    const data = await res.json();
    if (data.order) {
      setConfirmedOrder(data.order);
      if (data.orders) setOrders(data.orders);
      if (data.parts) setParts(data.parts);
      setCart([]);
    }
  };

  const handleCreateRfq = async () => {
    if (!rfqPartName.trim()) return;
    const res = await fetch("/api/rfq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleTextEn: rfqVehicle,
        vehicleTextAr: rfqVehicle,
        partType: rfqPartType,
        partNameEn: rfqPartName,
        partNameAr: rfqPartName,
      }),
    });
    const data = await res.json();
    if (data.rfqs) {
      setRfqs(data.rfqs);
      setRfqPartName("");
    }
  };

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      !searchQuery ||
      part.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.nameAr.includes(searchQuery) ||
      part.oeNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = partTypeFilter === "ALL" || part.partType === partTypeFilter;
    const matchesCondition =
      conditionFilter === "ALL" ||
      part.offers.some((o) => o.condition === conditionFilter);
    const matchesPickup =
      !onlyStorePickup || part.offers.some((o) => o.allowStorePickup);
    return matchesSearch && matchesType && matchesCondition && matchesPickup;
  });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingFee = fulfillmentType === "STORE_PICKUP" ? 0 : 85;
  const activeWorkshop =
    WORKSHOPS.find((w) => w.id === selectedWorkshopId) || WORKSHOPS[0];
  const installFee =
    fulfillmentType === "SHIP_TO_WORKSHOP" ? activeWorkshop.installFee : 0;
  const totalAmount = subtotal + shippingFee + installFee;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 text-slate-900">
      <Head>
        <title>Arabety | عربيتي — Car Spare Parts Marketplace</title>
      </Head>

      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-600 text-white font-bold text-lg flex items-center justify-center shadow-sm">
              ع
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-900">Arabety | عربيتي</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                  {t(
                    "Full Flow: Login / Sign-Up → Garage → Shop / CSV Stock → Checkout → Pickup",
                    "مسار متكامل: تسجيل الدخول ← الجراج ← المتجر ومخزون CSV ← الدفع والاستلام"
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t(
                  "Multi-Trader Spare Parts Marketplace • Complete End-to-End Flow",
                  "سوق قطع غيار السيارات متعدد التجار • مسار كامل من تسجيل الدخول حتى الاستلام"
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-700">
                  ● {currentUser.name} ({currentUser.role})
                </span>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setAuthStep("credentials");
                    setActiveTab("auth");
                  }}
                  className="px-2 py-0.5 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100"
                >
                  {t("Logout", "خروج")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("auth")}
                className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold"
              >
                🔐 {t("Step 1: Login / Sign-Up", "الخطوة 1: تسجيل الدخول / حساب جديد")}
              </button>
            )}

            <Link
              href="/trader/stock"
              className="px-3.5 py-2 rounded-xl border border-orange-500/40 bg-orange-50 text-orange-700 text-xs font-bold hover:bg-orange-100 transition"
            >
              📄 {t("Direct Link: /trader/stock", "رابط صفحة مخزون التاجر: /trader/stock")}
            </Link>

            <button
              onClick={() => setLocale(isAr ? "en" : "ar")}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:border-orange-500 transition"
            >
              🌐 {isAr ? "English (LTR)" : "العربية (RTL)"}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              <span>🛒</span>
              <span>{t("Cart & Store Pickup", "السلة والاستلام من المحل")}</span>
              <span className="px-2 py-0.5 rounded-full bg-white text-orange-700 font-extrabold">
                {cart.length}
              </span>
            </button>
          </div>
        </div>

        {/* End-to-End 7-Step Flow Bar */}
        <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap gap-2">
          {[
            {
              id: "auth",
              label: t(
                "1. 🔐 Login / Sign-Up & OTP",
                "1. 🔐 تسجيل الدخول / حساب جديد"
              ),
            },
            {
              id: "garage-onboarding",
              label: t(
                "2. 🚗 My Garage Setup",
                "2. 🚗 إعداد سيارتي بالجراج"
              ),
            },
            {
              id: "storefront",
              label: t(
                "3. 🛒 Storefront & 7 Part Types",
                "3. 🛒 المتجر و7 أنواع قطع الغيار"
              ),
            },
            {
              id: "trader-stock",
              label: t(
                "4. 📄 Trader Stock & CSV Auto-Verify",
                "4. 📄 مخزون التاجر وفحص CSV"
              ),
            },
            {
              id: "rfq",
              label: t("5. 📸 Request a Part (RFQ)", "5. 📸 طلب تسعير قطعة (RFQ)"),
            },
            {
              id: "workshops",
              label: t("6. 🔧 Verified Workshops", "6. 🔧 مراكز الصيانة والتركيب"),
            },
            {
              id: "admin",
              label: t(
                "7. 📦 My Orders & Pickup Pass",
                "7. 📦 طلباتي وكود الاستلام"
              ),
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === "trader-stock" && verifiedRows.length === 0) {
                  runCsvVerification(csvRawText);
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* STEP 1: LOGIN / SIGN-UP + OTP + ROLE SELECTION */}
        {activeTab === "auth" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white border-2 border-orange-500/40 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                    {t(
                      "Step 1 of 7 — Account Authentication & Role Selection",
                      "الخطوة 1 من 7 — تسجيل الدخول أو إنشاء حساب جديد وتحديد نوع الحساب"
                    )}
                  </span>
                  <h2 className="text-lg font-extrabold mt-1.5">
                    {t("Welcome to Arabety (عربيتي)", "مرحباً بك في منصة عربيتي (Arabety)")}
                  </h2>
                </div>
                <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setAuthStep("credentials");
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold ${
                      authMode === "login"
                        ? "bg-orange-600 text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {t("Login", "تسجيل دخول")}
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setAuthStep("credentials");
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold ${
                      authMode === "signup"
                        ? "bg-orange-600 text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {t("Create Account (Sign Up)", "إنشاء حساب جديد")}
                  </button>
                </div>
              </div>

              {/* Account Role Selector */}
              <div>
                <label className="block text-xs font-bold mb-2">
                  {t("1. Select Your Account Role:", "1. اختر نوع الحساب:")}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    {
                      id: "CUSTOMER",
                      icon: "🚗",
                      en: "Car Owner",
                      ar: "مالك سيارة (عميل)",
                    },
                    {
                      id: "TRADER",
                      icon: "🏪",
                      en: "Spare Parts Trader",
                      ar: "تاجر قطع غيار",
                    },
                    {
                      id: "WORKSHOP",
                      icon: "🔧",
                      en: "Partner Workshop",
                      ar: "مركز صيانة وتركيب",
                    },
                    {
                      id: "ADMIN",
                      icon: "🛡️",
                      en: "Platform Admin",
                      ar: "إدارة المنصة",
                    },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRole(r.id as any)}
                      className={`p-3 rounded-xl border text-start transition ${
                        selectedRole === r.id
                          ? "border-orange-600 bg-orange-50 font-bold"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="text-base">{r.icon}</div>
                      <div className="text-xs font-bold mt-1">{t(r.en, r.ar)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {authStep === "credentials" ? (
                <div className="space-y-3 pt-2">
                  {authMode === "signup" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          {t("Full Name", "الاسم بالكامل")}
                        </label>
                        <input
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                      {selectedRole === "TRADER" && (
                        <div>
                          <label className="block text-xs font-semibold mb-1">
                            {t("Store / Shop Name", "اسم محل أو شركة قطع الغيار")}
                          </label>
                          <input
                            type="text"
                            value={authShopName}
                            onChange={(e) => setAuthShopName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {authMode === "signup" && selectedRole === "TRADER" && (
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t(
                          "Store Pickup Address",
                          "عنوان المحل للاستلام المباشر من التاجر"
                        )}
                      </label>
                      <input
                        type="text"
                        value={authShopAddress}
                        onChange={(e) => setAuthShopAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t("Egyptian Mobile Number (+20)", "رقم الموبايل المصري (+20)")}
                    </label>
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>

                  <button
                    onClick={() => setAuthStep("otp")}
                    className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    📲{" "}
                    {authMode === "signup"
                      ? t(
                          "Send Verification Code (OTP) & Create Account →",
                          "إرسال كود التحقق (OTP) وإنشاء الحساب ←"
                        )
                      : t(
                          "Send Login OTP Code via SMS / WhatsApp →",
                          "إرسال كود الدخول السريع عبر رسالة / واتساب ←"
                        )}
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">
                      📲{" "}
                      {t(
                        `OTP Verification Code Sent to ${authPhone}`,
                        `تم إرسال كود التفعيل المكون من 4 أرقام إلى ${authPhone}`
                      )}
                    </span>
                    <button
                      onClick={() => setAuthStep("credentials")}
                      className="text-xs underline text-slate-500"
                    >
                      {t("Edit Phone", "تعديل الرقم")}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-40 px-4 py-2.5 rounded-xl border-2 border-emerald-500 text-center font-mono text-lg font-extrabold tracking-widest bg-white"
                    />
                    <span className="text-xs text-slate-600">
                      {t("(Demo OTP pre-filled: 1234)", "(كود التجربة جاهز: 1234)")}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentUser({
                        name: authName,
                        phone: authPhone,
                        role: selectedRole,
                        shopName:
                          selectedRole === "TRADER" ? authShopName : undefined,
                      });
                      setAuthStep("credentials");
                      if (selectedRole === "TRADER") {
                        setActiveTab("trader-stock");
                        if (verifiedRows.length === 0) {
                          runCsvVerification(csvRawText);
                        }
                      } else {
                        setActiveTab("garage-onboarding");
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    ✓{" "}
                    {t(
                      "Verify OTP & Continue to Step 2 →",
                      "تأكيد الكود والانتقال للخطوة التالية ←"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: 1-Click Quick Demo Login Cards */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold">
                ⚡{" "}
                {t(
                  "Quick 1-Click Demo Login (Jump into Any Role)",
                  "دخول تجريبي سريع بضغطة واحدة (اختر الشخصية)"
                )}
              </h3>
              <button
                onClick={() => {
                  setCurrentUser({
                    name: "أحمد الشرقاوي / Ahmed El-Sherkawy",
                    phone: "01012345678",
                    role: "CUSTOMER",
                  });
                  setActiveTab("garage-onboarding");
                }}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-orange-500 text-start transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold">
                    🚗{" "}
                    {t(
                      "Login as Car Owner (Ahmed El-Sherkawy)",
                      "دخول كعميل مالك سيارة (أحمد الشرقاوي)"
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {t(
                      "Next: Step 2 Setup Garage → Browse Parts → Checkout & Pickup Pass",
                      "التالي: إعداد السيارة بالجراج ← تصفح القطع ← الشراء وكود الاستلام"
                    )}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-orange-600 text-white text-xs font-bold">
                  →
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentUser({
                    name: "الحاج محمود التوفيقية / Mahmoud El-Tawfikia",
                    phone: "01098765432",
                    role: "TRADER",
                    shopName: "El-Tawfikia Auto Parts",
                  });
                  setActiveTab("trader-stock");
                  if (verifiedRows.length === 0) {
                    runCsvVerification(csvRawText);
                  }
                }}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-emerald-500 text-start transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold">
                    🏪{" "}
                    {t(
                      "Login as Spare Parts Trader (El-Tawfikia Auto Parts)",
                      "دخول كتاجر قطع غيار (التوفيقية لقطع غيار السيارات)"
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {t(
                      "Next: Upload & Auto-Verify CSV Stock → Confirm → Hand Over Store Pickup",
                      "التالي: رفع وفحص ملف مخزون CSV ← إضافة للمتجر ← تسليم العملاء بالمحل"
                    )}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MY GARAGE VEHICLE SETUP */}
        {activeTab === "garage-onboarding" && (
          <div className="bg-white border-2 border-orange-500/40 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                  {t(
                    "Step 2 of 7 — My Garage Vehicle Onboarding & VIN Fitment Setup",
                    "الخطوة 2 من 7 — تسجيل سيارتك في الجراج لضمان تطابق قطع الغيار 100%"
                  )}
                </span>
                <h2 className="text-lg font-extrabold mt-1.5">
                  🚗{" "}
                  {t(
                    "Select Your Car to Unlock 100% Fitment Guarantee",
                    "اختر سيارتك لتفعيل ضمان التوافق 100% على كل القطع"
                  )}
                </h2>
              </div>
              <button
                onClick={() => setActiveTab("storefront")}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition"
              >
                {t(
                  "Save Vehicle & Browse Spare Parts (Step 3) →",
                  "حفظ السيارة وتصفح قطع الغيار المطابقة (الخطوة 3) ←"
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {VEHICLES.map((v) => {
                const active = selectedVehicleId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`p-4 rounded-2xl border-2 text-start transition ${
                      active
                        ? "border-orange-600 bg-orange-50 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-orange-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">🚘</span>
                      {active && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-600 text-white">
                          ✓ {t("Active", "مختارة")}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-sm mt-2">
                      {isAr ? `${v.makeAr} ${v.modelAr}` : `${v.make} ${v.model}`}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {v.yearStart}–{v.yearEnd} • {v.engine}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-[240px]">
                <label className="block text-xs font-bold">
                  🔎{" "}
                  {t(
                    "Optional: Enter 17-Digit Chassis / VIN Number for Exact OE Matching",
                    "اختياري: أدخل رقم الشاسيه (VIN المكون من 17 رمزاً) لمطابقة الرقم الأصلي OE"
                  )}
                </label>
                <input
                  type="text"
                  value={vinInput}
                  onChange={(e) => setVinInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold uppercase bg-white"
                />
              </div>
              <button
                onClick={() => setActiveTab("storefront")}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
              >
                ✓{" "}
                {t(
                  "Confirm Car & Go to Storefront (Step 3) →",
                  "تأكيد السيارة والانتقال للمتجر (الخطوة 3) ←"
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMER STOREFRONT */}
        {activeTab === "storefront" && (
          <>
            {/* My Garage + Direct Store Pickup Filter Bar */}
            <div className="bg-white border-2 border-orange-500/30 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-orange-600 uppercase">
                    🚗 {t("My Garage Active Vehicle", "سيارتي المختارة في الجراج")}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t(
                      "Filter by your car, browse 7 Spare Part System Types, and pick up directly from the trader's shop or order delivery.",
                      "حدد سيارتك، تصفح 7 أقسام لقطع الغيار، واستلم قطعتك مباشرة من محل التاجر أو اطلب توصيل."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="ALL">
                      {t("All Vehicles (No Fitment Filter)", "كل السيارات")}
                    </option>
                    {VEHICLES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {isAr ? `${v.makeAr} ${v.modelAr}` : `${v.make} ${v.model}`} (
                        {v.yearStart}–{v.yearEnd})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setOnlyStorePickup(!onlyStorePickup)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                      onlyStorePickup
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-700 border-slate-300 hover:border-emerald-500"
                    }`}
                  >
                    🏪{" "}
                    {t(
                      "In-Store Pickup Available Only",
                      "متاح للاستلام المباشر من المحل فقط"
                    )}
                  </button>
                </div>
              </div>

              {/* 7 Spare Part System Types Filter */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-500 mb-2">
                  {t(
                    "Spare Part System Types (7 Categories):",
                    "أنواع وأقسام قطع الغيار (7 تصنيفات رئيسية):"
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PART_TYPES.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setPartTypeFilter(pt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        partTypeFilter === pt.id
                          ? "bg-orange-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span>{pt.icon}</span>
                      <span>{t(pt.en, pt.ar)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search + 5 Condition Tier Filters */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t(
                    "Search by part name, OEM Number (04465-02420), or brand...",
                    "ابحث باسم القطعة أو الرقم الأصلي OE أو الماركة..."
                  )}
                  className="flex-1 min-w-[240px] px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <div className="flex flex-wrap gap-1.5">
                  {PART_CONDITIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setConditionFilter(c.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                        conditionFilter === c.id
                          ? "bg-orange-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {t(c.en, c.ar)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredParts.map((part) => {
                const fits =
                  selectedVehicleId === "ALL" ||
                  part.compatibleVehicleIds.includes(selectedVehicleId);
                const matchingOffers =
                  conditionFilter === "ALL"
                    ? part.offers
                    : part.offers.filter((o) => o.condition === conditionFilter);
                const bestOffer = matchingOffers[0] || part.offers[0];

                return (
                  <div
                    key={part.id}
                    className={`bg-white border ${
                      part.isFromCsv ? "border-emerald-400" : "border-slate-200"
                    } rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-orange-400 transition`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                            OE: {part.oeNumber}
                          </span>
                          {part.isFromCsv && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                              {t("NEW CSV", "مضاف من CSV")}
                            </span>
                          )}
                        </div>
                        {selectedVehicleId !== "ALL" && (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              fits
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {fits
                              ? t("✓ Fits Your Car", "✓ يركب لسيارتك")
                              : t("✕ Does Not Fit", "✕ غير متوافق")}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-orange-600">
                        {getPartTypeLabel(part.partType)}
                      </div>
                      <h3 className="font-bold text-base mt-0.5">
                        {t(part.nameEn, part.nameAr)}
                      </h3>

                      {/* Buy Box Winner + Store Pickup Address */}
                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-500">
                            {t("Best Offer:", "أفضل عرض:")}
                          </span>
                          {renderConditionBadge(bestOffer.condition)}
                        </div>

                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-800">
                              {t(bestOffer.brandEn, bestOffer.brandAr)} (
                              {t(bestOffer.originEn, bestOffer.originAr)})
                            </div>
                            <div className="text-xs text-slate-600">
                              {t("Trader:", "التاجر:")}{" "}
                              <strong>
                                {t(bestOffer.traderNameEn, bestOffer.traderNameAr)}
                              </strong>{" "}
                              ⭐ {bestOffer.traderRating}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="text-lg font-extrabold text-orange-600">
                              {bestOffer.price.toLocaleString()}{" "}
                              <span className="text-xs font-normal">EGP</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {t("Stock:", "المخزون:")} {bestOffer.stockQty}
                            </div>
                          </div>
                        </div>

                        {bestOffer.allowStorePickup && (
                          <div className="pt-2 border-t border-slate-200 text-xs">
                            <div className="font-bold text-emerald-700">
                              🏪{" "}
                              {t(
                                `Direct Store Pickup Ready in ${bestOffer.pickupReadyMins}m (0 EGP Shipping)`,
                                `متاح استلام مباشر من المحل خلال ${bestOffer.pickupReadyMins} د (بدون شحن)`
                              )}
                            </div>
                            <div className="text-slate-600 truncate">
                              📍 {t(bestOffer.storeAddressEn, bestOffer.storeAddressAr)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addToCart(part, bestOffer, "STORE_PICKUP")}
                          className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                        >
                          🏪 {t("Pick Up at Store", "استلام من المحل")}
                        </button>
                        <button
                          onClick={() => addToCart(part, bestOffer, "HOME_DELIVERY")}
                          className="py-2 px-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition"
                        >
                          🚚 {t("Ship / Deliver", "شحن وتوصيل")}
                        </button>
                      </div>
                      <button
                        onClick={() => setComparePart(part)}
                        className="w-full py-1.5 px-3 rounded-xl border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold transition"
                      >
                        {t(
                          `Compare ${part.offers.length} Trader Offers (OEM / Aftermarket / Used)`,
                          `قارن عروض ${part.offers.length} تجار (أصلي / بديل / استيراد)`
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* TAB 2: DEDICATED TRADER ADD STOCK & CSV UPLOAD / VERIFY / AUTO-ADD PAGE */}
        {activeTab === "trader-stock" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                  {t(
                    "Trader Inventory & CSV Stock Center — El-Tawfikia Auto Parts",
                    "بوابة مخزون التاجر ورفع ملفات CSV — التوفيقية لقطع غيار السيارات"
                  )}
                </span>
                <h2 className="text-base font-bold mt-1">
                  {t(
                    "Upload a CSV File to Automatically Read, Verify, and Add New Stock on Confirmation",
                    "ارفع ملف CSV ليقوم النظام بقراءته وفحصه والتحقق منه ثم إضافته تلقائياً بمجرد موافقتك"
                  )}
                </h2>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold">
                {t("Active Catalog SKUs:", "إجمالي القطع المعروضة:")}{" "}
                <span className="text-orange-600 text-sm">{parts.length}</span>
              </div>
            </div>

            {traderBanner && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold">{traderBanner}</span>
                <button
                  onClick={() => setActiveTab("storefront")}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  {t("→ View Added Stock in Storefront", "← شاهد المخزون المضاف في المتجر")}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 7 Cols: CSV Upload -> Read & Verify -> Confirm Auto-Add */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold">
                    📄{" "}
                    {t(
                      "Option 1: Smart CSV Bulk Upload (Read → Verify → Say Yes → Auto-Added)",
                      "الخيار 1: رفع ملف مخزون CSV (قراءة ← فحص وتحقق ← موافقة وإضافة تلقائية)"
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t(
                      "Upload any .csv file or click 'Read & Verify CSV Stock' to test with the pre-loaded 7-row sample.",
                      "اختر ملف CSV من جهازك أو اضغط على 'قراءة وفحص ملف CSV' لتجربة الملف الجاهز بالأسفل."
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="px-3.5 py-2 rounded-xl border border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold cursor-pointer transition">
                    📂 {t("Upload .CSV File from Computer", "اختر ملف CSV من جهازك")}
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleCsvFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => runCsvVerification(csvRawText)}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    ⚡ {t("Read & Verify CSV Stock Now", "قراءة وفحص ملف الـ CSV الآن")}
                  </button>

                  <a
                    href="/sample-trader-stock.csv"
                    download
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                  >
                    ⬇ {t("Download Sample CSV Template", "تحميل نموذج CSV جاهز")}
                  </a>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    {t(
                      "Raw CSV Data (Editable — 6 Valid Rows across Different Spare Part Types + 1 Faulty Row Demo):",
                      "بيانات ملف الـ CSV (قابلة للتعديل — 6 قطع سليمة بمختلف الأنواع + سطر بدون سعر لاختبار الفحص):"
                    )}
                  </label>
                  <textarea
                    rows={5}
                    value={csvRawText}
                    onChange={(e) => setCsvRawText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs bg-slate-50"
                  />
                </div>

                {/* Verification Table */}
                {verifiedRows.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 border-2 border-orange-400 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold uppercase text-orange-600">
                          {t(
                            "Step 2: Automated Verification Report",
                            "الخطوة 2: تقرير الفحص والتحقق التلقائي"
                          )}
                        </span>
                        <h4 className="text-sm font-bold">
                          {t(
                            `Verified ${
                              verifiedRows.filter((r) => r.isValid && r.selected).length
                            } valid spare parts ready to import (${
                              verifiedRows.filter((r) => !r.isValid).length
                            } invalid row auto-skipped)`,
                            `تم التحقق من ${
                              verifiedRows.filter((r) => r.isValid && r.selected).length
                            } قطع سليمة وجاهزة للإضافة (${
                              verifiedRows.filter((r) => !r.isValid).length
                            } سطر غير صالح تم استبعاده)`
                          )}
                        </h4>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-start border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500">
                            <th className="py-2 px-2 text-start">✓</th>
                            <th className="py-2 px-2 text-start">OE#</th>
                            <th className="py-2 px-2 text-start">
                              {t("Part Name & Type", "الاسم والنوع")}
                            </th>
                            <th className="py-2 px-2 text-start">
                              {t("Condition & Brand", "الحالة والماركة")}
                            </th>
                            <th className="py-2 px-2 text-start">
                              {t("Price / Qty", "السعر / الكمية")}
                            </th>
                            <th className="py-2 px-2 text-start">
                              {t("Verification Status", "نتيجة الفحص")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {verifiedRows.map((r, idx) => (
                            <tr
                              key={idx}
                              className={`border-b border-slate-200 ${
                                r.isValid ? "" : "opacity-60"
                              }`}
                            >
                              <td className="py-2 px-2">
                                <input
                                  type="checkbox"
                                  checked={r.selected}
                                  disabled={!r.isValid}
                                  onChange={(e) => {
                                    const copy = [...verifiedRows];
                                    copy[idx].selected = e.target.checked;
                                    setVerifiedRows(copy);
                                  }}
                                />
                              </td>
                              <td className="py-2 px-2 font-mono font-bold">
                                {r.oeNumber}
                              </td>
                              <td className="py-2 px-2">
                                <div className="font-bold">
                                  {t(r.nameEn, r.nameAr)}
                                </div>
                                <div className="text-orange-600 font-semibold">
                                  {getPartTypeLabel(r.partType)}
                                </div>
                              </td>
                              <td className="py-2 px-2">
                                <div>
                                  {r.brand} ({r.origin})
                                </div>
                                <div className="mt-0.5">
                                  {renderConditionBadge(r.condition)}
                                </div>
                              </td>
                              <td className="py-2 px-2 font-bold">
                                {r.price > 0 ? (
                                  `${r.price.toLocaleString()} EGP`
                                ) : (
                                  <span className="text-red-600">0 EGP</span>
                                )}
                                <div className="text-slate-500 font-normal">
                                  Qty: {r.stockQty}
                                </div>
                              </td>
                              <td className="py-2 px-2">
                                {r.isValid ? (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                    ✓ {t(r.statusEn, r.statusAr)}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                    ⚠ {t(r.statusEn, r.statusAr)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-bold text-slate-800">
                        {t(
                          "Everything verified! Do you want to auto-add these parts to your live store stock?",
                          "تم فحص الملف بنجاح! هل توافق على إضافة هذه القطع تلقائياً إلى مخزون محلك؟"
                        )}
                      </span>
                      <button
                        onClick={handleConfirmAutoAddCsv}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                      >
                        ✓{" "}
                        {t(
                          `Yes, Confirm & Auto-Add ${
                            verifiedRows.filter((r) => r.isValid && r.selected).length
                          } Verified Parts`,
                          `نعم، موافق وأضف الـ ${
                            verifiedRows.filter((r) => r.isValid && r.selected).length
                          } قطع للمخزون تلقائياً`
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right 5 Cols: Manual Add Single Part + Store Pickup Counter Verification */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold">
                      ➕{" "}
                      {t(
                        "Option 2: Add Single Spare Part Manually",
                        "الخيار 2: إضافة قطعة غيار منفردة يدوياً"
                      )}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t("OE Part Number", "رقم القطعة الأصلي OE")}
                      </label>
                      <input
                        type="text"
                        value={manOe}
                        onChange={(e) => setManOe(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t("Spare Part Type", "نوع وتصنيف القطعة")}
                      </label>
                      <select
                        value={manType}
                        onChange={(e) => setManType(e.target.value as PartCategoryType)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        {PART_TYPES.filter((x) => x.id !== "ALL").map((pt) => (
                          <option key={pt.id} value={pt.id}>
                            {pt.icon} {t(pt.en, pt.ar)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t("Part Name (EN)", "اسم القطعة (إنجليزي)")}
                      </label>
                      <input
                        type="text"
                        value={manNameEn}
                        onChange={(e) => setManNameEn(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t("Part Name (AR)", "اسم القطعة (عربي)")}
                      </label>
                      <input
                        type="text"
                        value={manNameAr}
                        onChange={(e) => setManNameAr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t("Condition Tier", "حالة ودرجة القطعة")}
                      </label>
                      <select
                        value={manCond}
                        onChange={(e) => setManCond(e.target.value as PartCondition)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        {PART_CONDITIONS.filter((x) => x.id !== "ALL").map((c) => (
                          <option key={c.id} value={c.id}>
                            {t(c.en, c.ar)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t("Brand", "الماركة")}
                      </label>
                      <input
                        type="text"
                        value={manBrand}
                        onChange={(e) => setManBrand(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t("Price (EGP)", "السعر")}
                      </label>
                      <input
                        type="number"
                        value={manPrice}
                        onChange={(e) => setManPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t("Stock Qty", "الكمية")}
                      </label>
                      <input
                        type="number"
                        value={manQty}
                        onChange={(e) => setManQty(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        {t("Store Pickup?", "استلام محل؟")}
                      </label>
                      <select
                        value={manPickup ? "YES" : "NO"}
                        onChange={(e) => setManPickup(e.target.value === "YES")}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        <option value="YES">🏪 {t("Yes (30m)", "نعم (30 د)")}</option>
                        <option value="NO">🚚 {t("Delivery Only", "شحن فقط")}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleManualAddStock}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    ➕ {t("Add Part to Live Store Inventory", "إضافة القطعة لمخزون المحل")}
                  </button>
                </div>

                {/* Store Counter Pickup Code Verification */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold">
                    🏪{" "}
                    {t(
                      "In-Store Pickup Counter Verification",
                      "تسليم العميل في المحل (التحقق من كود الاستلام)"
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t(
                      "When a client arrives at your shop to pick up their reserved part, enter their 6-digit Pickup Code (e.g. PK-4829):",
                      "عند حضور العميل لمحلك لاستلام القطعة المحجوزة، أدخل كود الاستلام الخاص به (مثال PK-4829):"
                    )}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pickupCodeInput}
                      onChange={(e) => setPickupCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase"
                    />
                    <button
                      onClick={handleVerifyStorePickupCode}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                    >
                      ✓ {t("Verify & Hand Over", "تأكيد التسليم بالمحل")}
                    </button>
                  </div>
                  {pickupVerifyResult && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold">
                      {pickupVerifyResult}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REQUEST A PART (RFQ) */}
        {activeTab === "rfq" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
              <h2 className="text-base font-bold">
                📸{" "}
                {t(
                  "Request a Part (RFQ) — Get Trader Quotes",
                  "اطلب تسعير قطعة خاصة من التجار المتخصصين"
                )}
              </h2>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {t("Vehicle", "السيارة")}
                </label>
                <input
                  type="text"
                  value={rfqVehicle}
                  onChange={(e) => setRfqVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {t("Spare Part Type", "نوع القطعة")}
                </label>
                <select
                  value={rfqPartType}
                  onChange={(e) => setRfqPartType(e.target.value as PartCategoryType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  {PART_TYPES.filter((x) => x.id !== "ALL").map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.icon} {t(pt.en, pt.ar)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {t("Part Name / Description", "اسم القطعة المطلوبة")}
                </label>
                <input
                  type="text"
                  value={rfqPartName}
                  onChange={(e) => setRfqPartName(e.target.value)}
                  placeholder={t(
                    "e.g. Right Side Mirror with Blind Spot",
                    "مثال: مراية جنب يمين ضم بالغمزات"
                  )}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <button
                onClick={handleCreateRfq}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
              >
                🚀 {t("Submit RFQ to Traders", "إرسال طلب التسعير للتجار")}
              </button>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {rfqs.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-orange-600">
                        {r.id}
                      </span>
                      <h3 className="font-bold text-base">
                        {t(r.partNameEn, r.partNameAr)}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {t(r.vehicleTextEn, r.vehicleTextAr)}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {r.quotes.length} {t("Quotes", "عروض أسعار")}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {r.quotes.map((q) => (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">
                              {t(q.traderNameEn, q.traderNameAr)}
                            </span>
                            {renderConditionBadge(q.condition)}
                          </div>
                          <div className="text-xs text-slate-600">{q.brand}</div>
                          <div className="text-xs text-emerald-700 font-semibold">
                            🏪 {t(q.storeAddressEn, q.storeAddressAr)}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="text-base font-extrabold text-orange-600">
                            {q.price.toLocaleString()} EGP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VERIFIED WORKSHOPS */}
        {activeTab === "workshops" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORKSHOPS.map((w) => (
              <div
                key={w.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{t(w.nameEn, w.nameAr)}</h3>
                    <p className="text-xs text-slate-500">
                      📍 {t(w.cityEn, w.cityAr)} — {t(w.districtEn, w.districtAr)}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
                    ⭐ {w.rating} ({w.reviewCount})
                  </span>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {w.laborRates.map((lr, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span>{t(lr.serviceEn, lr.serviceAr)}</span>
                      <strong className="text-orange-600">{lr.price} EGP</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: ADMIN & ORDERS LEDGER */}
        {activeTab === "admin" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold">
              {t(
                "Orders, Direct Store Pickup Codes & Split Fulfillment Ledger",
                "سجل الطلبات وأكواد الاستلام المباشر من المحلات"
              )}
            </h2>
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm">
                      #{ord.orderNumber} • {ord.fulfillmentType}
                    </div>
                    {ord.pickupCode && (
                      <div className="text-emerald-700 font-mono font-bold">
                        🏪 Store Pickup Code: {ord.pickupCode} ({ord.status})
                      </div>
                    )}
                  </div>
                  <div className="font-extrabold text-base text-orange-600">
                    {ord.totalAmount.toLocaleString()} EGP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Multi-Trader Comparison Modal */}
      {comparePart && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-xs font-mono text-orange-600 font-bold">
                  OE# {comparePart.oeNumber} • {getPartTypeLabel(comparePart.partType)}
                </span>
                <h3 className="font-bold text-base">
                  {t(comparePart.nameEn, comparePart.nameAr)}
                </h3>
              </div>
              <button
                onClick={() => setComparePart(null)}
                className="px-2.5 py-1 rounded-lg border text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {comparePart.offers.map((o) => (
                <div
                  key={o.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap justify-between items-center gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">
                        {t(o.traderNameEn, o.traderNameAr)} ⭐ {o.traderRating}
                      </span>
                      {renderConditionBadge(o.condition)}
                    </div>
                    <div className="text-xs text-slate-700 font-semibold">
                      {t(o.brandEn, o.brandAr)} ({t(o.originEn, o.originAr)})
                    </div>
                    {o.allowStorePickup && (
                      <div className="text-xs text-emerald-700 font-semibold">
                        🏪{" "}
                        {t(
                          `Store Pickup Ready in ${o.pickupReadyMins}m:`,
                          `استلام مباشر من المحل خلال ${o.pickupReadyMins} د:`
                        )}{" "}
                        {t(o.storeAddressEn, o.storeAddressAr)}
                      </div>
                    )}
                  </div>
                  <div className="text-end space-y-1.5">
                    <div className="text-lg font-extrabold text-orange-600">
                      {o.price.toLocaleString()} EGP
                    </div>
                    <div className="flex gap-1.5">
                      {o.allowStorePickup && (
                        <button
                          onClick={() => {
                            addToCart(comparePart, o, "STORE_PICKUP");
                            setComparePart(null);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                        >
                          🏪 {t("Pick Up at Store", "استلام من المحل")}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          addToCart(comparePart, o, "HOME_DELIVERY");
                          setComparePart(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
                      >
                        🚚 {t("Deliver", "شحن")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cart & 3-Way Checkout Modal (Direct Store Pickup / Home Delivery / Ship-to-Workshop) */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base">
                {t(
                  "Checkout: Direct Store Pickup, Home Delivery, or Workshop Install",
                  "إتمام الطلب: استلام مباشر من المحل أو توصيل للمنزل أو لمركز الصيانة"
                )}
              </h3>
              <button
                onClick={() => setCartOpen(false)}
                className="px-2.5 py-1 rounded-lg border text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {confirmedOrder ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 space-y-2 text-xs">
                <div className="text-sm font-extrabold text-emerald-700">
                  🎉{" "}
                  {t(
                    `Order #${confirmedOrder.orderNumber} Confirmed!`,
                    `تم تأكيد الطلب #${confirmedOrder.orderNumber} بنجاح!`
                  )}
                </div>
                {confirmedOrder.pickupCode && (
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                    <div className="font-bold">
                      🏪{" "}
                      {t(
                        "Direct Store Pickup Pass (Ready in 30 mins):",
                        "كود الاستلام المباشر من محل التاجر (جاهز خلال 30 دقيقة):"
                      )}
                    </div>
                    <div className="text-xl font-mono font-extrabold text-orange-600">
                      {confirmedOrder.pickupCode}
                    </div>
                    <div className="text-slate-600">
                      📍{" "}
                      {t(
                        confirmedOrder.items[0]?.storeAddressEn || "",
                        confirmedOrder.items[0]?.storeAddressAr || ""
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : cart.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                {t("Your cart is empty.", "سلة المشتريات فارغة.")}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-bold">
                          {t(item.partNameEn, item.partNameAr)}
                        </div>
                        <div className="text-slate-600">
                          {t(item.traderNameEn, item.traderNameAr)} • {item.brand}
                        </div>
                        <div className="text-emerald-700 font-semibold">
                          📍 {t(item.storeAddressEn, item.storeAddressAr)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-orange-600">
                          {item.price.toLocaleString()} EGP
                        </span>
                        <button
                          onClick={() =>
                            setCart(cart.filter((_, i) => i !== idx))
                          }
                          className="text-red-600 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3 Fulfillment Options */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                  <div className="font-bold">
                    {t(
                      "Choose Receiving Method (3 Options):",
                      "اختر طريقة استلام القطعة (3 خيارات):"
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button
                      onClick={() => setFulfillmentType("STORE_PICKUP")}
                      className={`p-2.5 rounded-xl border text-start ${
                        fulfillmentType === "STORE_PICKUP"
                          ? "border-emerald-600 bg-emerald-50 font-bold"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div>
                        🏪{" "}
                        {t(
                          "Pick Up from Trader Store",
                          "استلام مباشر من محل التاجر"
                        )}
                      </div>
                      <div className="text-emerald-700 mt-0.5">
                        {t("0 EGP Shipping • 30m", "0 ج.م شحن • خلال 30 د")}
                      </div>
                    </button>

                    <button
                      onClick={() => setFulfillmentType("HOME_DELIVERY")}
                      className={`p-2.5 rounded-xl border text-start ${
                        fulfillmentType === "HOME_DELIVERY"
                          ? "border-orange-600 bg-orange-50 font-bold"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div>
                        🏠 {t("Deliver to Home", "توصيل للمنزل")}
                      </div>
                      <div className="text-slate-500 mt-0.5">+85 EGP</div>
                    </button>

                    <button
                      onClick={() => setFulfillmentType("SHIP_TO_WORKSHOP")}
                      className={`p-2.5 rounded-xl border text-start ${
                        fulfillmentType === "SHIP_TO_WORKSHOP"
                          ? "border-orange-600 bg-orange-50 font-bold"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div>
                        🔧{" "}
                        {t(
                          "Ship to Workshop + Install",
                          "شحن لمركز صيانة + تركيب"
                        )}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        +{activeWorkshop.installFee} EGP
                      </div>
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>{t("Subtotal:", "إجمالي القطع:")}</span>
                    <strong>{subtotal.toLocaleString()} EGP</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Shipping / Store Pickup:", "الشحن / الاستلام من المحل:")}</span>
                    <strong className={shippingFee === 0 ? "text-emerald-700" : ""}>
                      {shippingFee === 0
                        ? t("0 EGP (Free Store Pickup)", "0 ج.م (استلام مباشر من المحل)")
                        : `${shippingFee} EGP`}
                    </strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t text-sm font-extrabold text-orange-600">
                    <span>{t("Total:", "الإجمالي النهائي:")}</span>
                    <span>{totalAmount.toLocaleString()} EGP</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
                >
                  {fulfillmentType === "STORE_PICKUP"
                    ? t(
                        "✓ Confirm Reservation & Issue Store Pickup Code",
                        "✓ تأكيد الحجز وإصدار كود الاستلام المباشر من المحل"
                      )
                    : t("✓ Confirm Order", "✓ تأكيد الطلب")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
