import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

const PART_TYPES = [
  { id: "ALL", labelAr: "كل الأنواع", labelEn: "All Types" },
  { id: "MECHANICAL_ENGINE", labelAr: "المحرك والميكانيكا", labelEn: "Engine & Mechanical" },
  { id: "BRAKES_SUSPENSION", labelAr: "الفرامل والعفشة", labelEn: "Brakes & Suspension" },
  { id: "BODY_EXTERIOR", labelAr: "الصاج والفوانيس", labelEn: "Body & Lights" },
  { id: "ELECTRICAL_SENSORS", labelAr: "الكهرباء والحساسات", labelEn: "Electrical & Sensors" },
  { id: "COOLING_AC", labelAr: "التبريد والتكييف", labelEn: "Cooling & A/C" },
  { id: "TRANSMISSION_DRIVETRAIN", labelAr: "الفتيس والكبالن", labelEn: "Transmission & CV" },
  { id: "OILS_CONSUMABLES", labelAr: "الزيوت والسوائل", labelEn: "Oils & Fluids" },
];

export default function ArabetyMobileApp() {
  const [locale, setLocale] = useState<"ar" | "en">("ar");
  const [screen, setScreen] = useState<"shop" | "trader-csv" | "pickup-pass">("shop");
  const [selectedType, setSelectedType] = useState("ALL");
  const [pickupCode, setPickupCode] = useState<string | null>(null);
  const [parts, setParts] = useState([
    {
      id: "p-1",
      oeNumber: "04465-02420",
      nameEn: "Front Ceramic Brake Pads Set",
      nameAr: "طقم تيل فرامل أمامي سيراميك",
      partType: "BRAKES_SUSPENSION",
      condition: "OEM_NEW",
      traderEn: "El-Tawfikia Auto Parts",
      traderAr: "التوفيقية لقطع غيار السيارات",
      storeAddressEn: "Downtown Cairo — 14 Orabi St",
      storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
      price: 2650,
    },
    {
      id: "p-2",
      oeNumber: "90919-01275",
      nameEn: "Denso Iridium Spark Plugs (4 pcs)",
      nameAr: "طقم بوجيهات دينسو إيريديوم (4 شمعة)",
      partType: "MECHANICAL_ENGINE",
      condition: "OEM_NEW",
      traderEn: "Al-Alamiya Japan Parts",
      traderAr: "العالمية لقطع الغيار الياباني",
      storeAddressEn: "Giza — 28 Gameat El-Dowal",
      storeAddressAr: "الجيزة — 28 جامعة الدول، المهندسين",
      price: 1950,
    },
  ]);

  const isAr = locale === "ar";
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const handleConfirmCsvAutoAdd = () => {
    setParts([
      {
        id: "csv-1",
        oeNumber: "17801-21060",
        nameEn: "Engine Air Filter Element (CSV Auto-Added)",
        nameAr: "فلتر هواء محرك أصلي (مضاف تلقائياً من CSV)",
        partType: "MECHANICAL_ENGINE",
        condition: "OEM_NEW",
        traderEn: "El-Tawfikia Auto Parts",
        traderAr: "التوفيقية لقطع غيار السيارات",
        storeAddressEn: "Downtown Cairo — 14 Orabi St",
        storeAddressAr: "وسط البلد — 14 شارع عرابي، التوفيقية",
        price: 680,
      },
      ...parts,
    ]);
    setScreen("shop");
  };

  const reserveStorePickup = () => {
    setPickupCode(`PK-${Math.floor(1000 + Math.random() * 9000)}`);
    setScreen("pickup-pass");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Arabety | عربيتي</Text>
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setLocale(isAr ? "en" : "ar")}
        >
          <Text style={styles.langBtnText}>{isAr ? "EN" : "عربي"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {screen === "shop" && (
          <>
            <View style={styles.garageCard}>
              <Text style={styles.garageLabel}>
                🚗 {t("My Garage: 2022 Toyota Corolla 1.6L", "سيارتي: تويوتا كورولا 2022")}
              </Text>
              <Text style={styles.garageSub}>
                {t(
                  "✓ Guaranteed Fit • Direct Store Pickup Ready in 30m",
                  "✓ ضمان التوافق 100% • استلام مباشر من المحل خلال 30 دقيقة"
                )}
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeBar}>
              {PART_TYPES.map((pt) => (
                <TouchableOpacity
                  key={pt.id}
                  onPress={() => setSelectedType(pt.id)}
                  style={[
                    styles.typePill,
                    selectedType === pt.id && styles.typePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typePillText,
                      selectedType === pt.id && styles.typePillTextActive,
                    ]}
                  >
                    {isAr ? pt.labelAr : pt.labelEn}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {parts
              .filter((p) => selectedType === "ALL" || p.partType === selectedType)
              .map((part) => (
                <View key={part.id} style={styles.partCard}>
                  <Text style={styles.oeText}>OE: {part.oeNumber}</Text>
                  <Text style={styles.partTitle}>
                    {t(part.nameEn, part.nameAr)}
                  </Text>
                  <Text style={styles.traderText}>
                    {t(part.traderEn, part.traderAr)} • {part.condition}
                  </Text>
                  <Text style={styles.pickupText}>
                    🏪 {t(part.storeAddressEn, part.storeAddressAr)}
                  </Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.priceText}>{part.price} EGP</Text>
                    <TouchableOpacity
                      style={styles.pickupBtn}
                      onPress={reserveStorePickup}
                    >
                      <Text style={styles.pickupBtnText}>
                        🏪 {t("Pick Up at Store (0 EGP)", "استلام من المحل")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </>
        )}

        {screen === "trader-csv" && (
          <View style={styles.partCard}>
            <Text style={styles.partTitle}>
              📄 {t("Trader CSV Upload & Auto-Verify", "رفع وفحص مخزون التاجر CSV")}
            </Text>
            <Text style={styles.traderText}>
              {t(
                "6 valid spare parts verified across Engine, Transmission, Electrical & Body.",
                "تم التحقق من 6 قطع غيار سليمة (محرك، فتيس، كهرباء، هيكل)."
              )}
            </Text>
            <TouchableOpacity
              style={[styles.pickupBtn, { marginTop: 12 }]}
              onPress={handleConfirmCsvAutoAdd}
            >
              <Text style={styles.pickupBtnText}>
                ✓ {t("Yes, Confirm & Auto-Add Stock", "نعم، موافق وأضف للمخزون تلقائياً")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === "pickup-pass" && (
          <View style={styles.partCard}>
            <Text style={styles.partTitle}>
              🎉 {t("Direct Store Pickup Pass", "بطاقة الاستلام المباشر من المحل")}
            </Text>
            <Text style={styles.priceText}>{pickupCode}</Text>
            <Text style={styles.pickupText}>
              📍{" "}
              {t(
                "Downtown Cairo — 14 Orabi St, El-Tawfikia (0 EGP Shipping)",
                "وسط البلد — 14 شارع عرابي، التوفيقية (0 ج.م شحن)"
              )}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setScreen("shop")}>
          <Text style={styles.navItem}>🏠 {t("Shop", "المتجر")}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen("trader-csv")}>
          <Text style={styles.navItem}>📄 {t("Trader CSV", "مخزون CSV")}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen("pickup-pass")}>
          <Text style={styles.navItem}>🏪 {t("Pickup Pass", "كود الاستلام")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  brandTitle: { fontSize: 18, fontWeight: "800", color: "#ea580c" },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  langBtnText: { fontSize: 12, fontWeight: "700" },
  content: { padding: 16 },
  garageCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fdba74",
    marginBottom: 12,
  },
  garageLabel: { fontSize: 14, fontWeight: "700", color: "#9a3412" },
  garageSub: { fontSize: 12, color: "#c2410c", marginTop: 4 },
  typeBar: { marginBottom: 14 },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
    marginRight: 8,
  },
  typePillActive: { backgroundColor: "#ea580c" },
  typePillText: { fontSize: 12, fontWeight: "600", color: "#334155" },
  typePillTextActive: { color: "#ffffff" },
  partCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  oeText: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  partTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a", marginTop: 4 },
  traderText: { fontSize: 12, color: "#475569", marginTop: 4 },
  pickupText: { fontSize: 12, color: "#059669", fontWeight: "700", marginTop: 6 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  priceText: { fontSize: 18, fontWeight: "800", color: "#ea580c" },
  pickupBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#059669",
  },
  pickupBtnText: { fontSize: 12, fontWeight: "700", color: "#ffffff" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  navItem: { fontSize: 12, fontWeight: "700", color: "#0f172a" },
});
