// Default mock data based on real Hifeed operation Excel

export type UserRole = "OWNER" | "FARM_MANAGER" | "LOGISTICS" | "FINANCE" | "OPERATOR";
export type AccessKey = "dashboard" | "procurement" | "farm" | "inventory" | "production" | "logistics" | "traceability";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export const mockUsers: User[] = [
  { id: "u1", name: "Ahmad Fauzi", email: "ahmad.fauzi@hifeed.co", role: "OWNER" },
  { id: "u2", name: "Pak Darmo", email: "darmo@hifeed.co", role: "FARM_MANAGER" },
  { id: "u3", name: "Budi Setiawan", email: "budi@hifeed.co", role: "LOGISTICS" },
  { id: "u4", name: "Siti Rahma", email: "siti.finance@hifeed.co", role: "FINANCE" },
  { id: "u5", name: "Arif Operator", email: "arif@hifeed.co", role: "OPERATOR" },
  { id: "u6", name: "David Mnt", email: "david@hifeed.co", role: "FARM_MANAGER" },
];

export const roleAccessMatrix: Record<UserRole, AccessKey[]> = {
  OWNER: ["dashboard", "procurement", "farm", "inventory", "production", "logistics", "traceability"],
  FARM_MANAGER: ["dashboard", "farm", "inventory"],
  LOGISTICS: ["dashboard", "inventory", "logistics"],
  FINANCE: ["dashboard", "procurement", "inventory", "traceability"],
  OPERATOR: ["production", "inventory"],
};

export const roleLabels: Record<UserRole, string> = {
  OWNER: "Owner / Director",
  FARM_MANAGER: "Farm Manager",
  LOGISTICS: "Logistics",
  FINANCE: "Finance Admin",
  OPERATOR: "Production Operator",
};

export const roleBadgeColors: Record<UserRole, string> = {
  OWNER: "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/50",
  FARM_MANAGER: "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/50",
  LOGISTICS: "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border-blue-500/50",
  FINANCE: "bg-purple-500/15 text-purple-500 hover:bg-purple-500/25 border-purple-500/50",
  OPERATOR: "bg-slate-500/15 text-slate-500 hover:bg-slate-500/25 border-slate-500/50",
};

export type ModuleAccess = {
  label: string;
  icon: any;
  basePath: string;
  accessKey: AccessKey;
  items: { label: string; href: string }[];
};

export type MockUser = User;

// --- Product Catalog (From Excel) ---
export interface Product {
  id: string;
  name: string;
  category: "Seed" | "Raw Material" | "Medicine" | "Finished Goods" | "Packaging";
  defaultUom: string;
}

export const products: Product[] = [
  // Raw Materials / Farm Output
  { id: "p1", name: "Indigofera", category: "Raw Material", defaultUom: "KG" },
  { id: "p2", name: "Pakchong", category: "Raw Material", defaultUom: "KG" },
  { id: "p3", name: "Tebon", category: "Raw Material", defaultUom: "KG" },
  { id: "p4", name: "Molase", category: "Raw Material", defaultUom: "KG" },
  { id: "p5", name: "Bungkil Kopra", category: "Raw Material", defaultUom: "KG" },
  { id: "p6", name: "Bungkil Sawit", category: "Raw Material", defaultUom: "KG" },
  { id: "p7", name: "Onggok", category: "Raw Material", defaultUom: "KG" },

  // Medicine / Additives
  { id: "p8", name: "EM4", category: "Medicine", defaultUom: "LITER" },

  // Finished Goods (Silase, Concentrate, Pellet)
  { id: "p9", name: "Green Concentrate", category: "Finished Goods", defaultUom: "KG" },
  { id: "p10", name: "Pellet Complete", category: "Finished Goods", defaultUom: "KG" },
  { id: "p11", name: "Pellet GC", category: "Finished Goods", defaultUom: "KG" },
  { id: "p12", name: "Silase Pakchong x Indigofera", category: "Finished Goods", defaultUom: "KG" },
  { id: "p13", name: "Silase Indigofera Murni", category: "Finished Goods", defaultUom: "KG" },

  // Packaging
  { id: "p14", name: "Karung 65x105", category: "Packaging", defaultUom: "PCS" },
  { id: "p15", name: "Karung Sablon 59x90", category: "Packaging", defaultUom: "PCS" },
  { id: "p16", name: "Plastik 60 Micron", category: "Packaging", defaultUom: "PCS" },
  { id: "p17", name: "Plastik 110 Micron", category: "Packaging", defaultUom: "PCS" },
];

export const traceableProducts = products.filter(p => p.category === "Finished Goods" || p.category === "Raw Material");

// --- Partners (Vendors/Customers) ---
export interface Partner {
  id: string;
  name: string;
  type: "VENDOR" | "CUSTOMER";
  address: string;
  contactPerson: string;
  phone: string;
}

export const partners: Partner[] = [
  { id: "v1", name: "PT. Sumber Sawit", type: "VENDOR", address: "Jl. Industri 1", contactPerson: "Budi", phone: "08112233" },
  { id: "v2", name: "CV. Makmur Kopra", type: "VENDOR", address: "Jl. Industri 2", contactPerson: "Andi", phone: "08223344" },
  { id: "v3", name: "Toko Pertanian Subur", type: "VENDOR", address: "Jl. Tani 1", contactPerson: "Cipto", phone: "08334455" },
  { id: "v4", name: "Pabrik Kemasan Plastik", type: "VENDOR", address: "Jl. Pabrik 1", contactPerson: "Deni", phone: "08445566" },
  { id: "c1", name: "Karya Langit Bumi Permaculture", type: "CUSTOMER", address: "Karya Langit", contactPerson: "Agus", phone: "08381796" },
  { id: "c2", name: "Metro Customer", type: "CUSTOMER", address: "Metro", contactPerson: "Supriyanto", phone: "08527909" },
  { id: "c3", name: "Bandung Customer", type: "CUSTOMER", address: "Bandung", contactPerson: "Rendi", phone: "08123456" },
];

// --- Procurement ---
export type POStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "PARTIAL_RECEIVED" | "COMPLETED" | "CANCELLED";

export interface POItem {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  uom: string;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  createdAt: string;
  expectedDeliveryDate: string;
  status: POStatus;
  items: POItem[];
  totalAmount: number;
}

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po1", poNumber: "PO-2026-0001", vendorName: "PT. Sumber Sawit", createdAt: "2025-12-15", expectedDeliveryDate: "2025-12-20",
    status: "COMPLETED", totalAmount: 13986300,
    items: [{ id: "poi1", productId: "p6", productName: "Bungkil Sawit", qty: 6081, uom: "KG", unitPrice: 2300, totalPrice: 13986300 }],
  },
  {
    id: "po2", poNumber: "PO-2026-0002", vendorName: "CV. Makmur Kopra", createdAt: "2026-01-05", expectedDeliveryDate: "2026-01-10",
    status: "COMPLETED", totalAmount: 22515300,
    items: [{ id: "poi2", productId: "p5", productName: "Bungkil Kopra", qty: 8339, uom: "KG", unitPrice: 2700, totalPrice: 22515300 }],
  },
  {
    id: "po3", poNumber: "PO-2026-0003", vendorName: "Toko Pertanian Subur", createdAt: "2026-02-10", expectedDeliveryDate: "2026-02-15",
    status: "COMPLETED", totalAmount: 2100000,
    items: [{ id: "poi3", productId: "p4", productName: "Molase", qty: 300, uom: "KG", unitPrice: 7000, totalPrice: 2100000 }],
  },
  {
    id: "po4", poNumber: "PO-2026-0004", vendorName: "Pabrik Kemasan Plastik", createdAt: "2026-02-18", expectedDeliveryDate: "2026-02-22",
    status: "PARTIAL_RECEIVED", totalAmount: 1462000,
    items: [
      { id: "poi4_1", productId: "p16", productName: "Plastik 60 Micron", qty: 500, uom: "PCS", unitPrice: 1833, totalPrice: 916500 },
      { id: "poi4_2", productId: "p17", productName: "Plastik 110 Micron", qty: 500, uom: "PCS", unitPrice: 7310, totalPrice: 3655000 },
    ],
  },
];

export interface GoodsReceipt {
  id: string;
  poId: string;
  grnNumber: string;
  receivedDate: string;
  receivedBy: string;
  items: { productId: string; productName: string; qtyOrdered: number; qtyReceived: number; qtyRejected: number; uom: string; weight: number }[];
  weighingProofUrl?: string;
}

export const goodsReceipts: GoodsReceipt[] = [
  {
    id: "grn1", poId: "po1", grnNumber: "GRN-2026-0001", receivedDate: "2025-12-18", receivedBy: "Dian",
    items: [{ productId: "p6", productName: "Bungkil Sawit", qtyOrdered: 6081, qtyReceived: 6081, qtyRejected: 0, uom: "KG", weight: 6081 }],
  },
  {
    id: "grn2", poId: "po2", grnNumber: "GRN-2026-0002", receivedDate: "2026-01-08", receivedBy: "Pak Ihsan",
    items: [{ productId: "p5", productName: "Bungkil Kopra", qtyOrdered: 8339, qtyReceived: 8200, qtyRejected: 139, uom: "KG", weight: 8200 }],
  },
  {
    id: "grn3", poId: "po3", grnNumber: "GRN-2026-0003", receivedDate: "2026-02-12", receivedBy: "Dian",
    items: [{ productId: "p4", productName: "Molase", qtyOrdered: 300, qtyReceived: 300, qtyRejected: 0, uom: "KG", weight: 300 }],
  },
];

// --- Farm Management (Lahan / Penanaman) ---
export type BatchStatus = "SEEDING" | "NURSERY" | "GROWING" | "READY_HARVEST" | "HARVESTED" | "WRITE_OFF";

export interface FarmBatch {
  id: string;
  batchCode: string;
  locationId: string;
  locationName: string;
  productName: string;
  status: BatchStatus;
  startDate: string;
  initialQty: number; // populasi/m2 atau pohon
  currentQty: number;
  mortalityRate: number;
  hst: number; // Hari Setelah Tanam
  lastLogDate: string;
  sourcePOId?: string;
  sourcePONumber?: string;
  sourceGRNId?: string;
  sourceGRNNumber?: string;
  inputProductId?: string;
  inputProductName?: string;
}

export const farmBatches: FarmBatch[] = [
  { id: "fb1", batchCode: "BATCH-IND-001", locationId: "l1", locationName: "Canggu", productName: "Indigofera", status: "READY_HARVEST", startDate: "2025-10-01", initialQty: 25090, currentQty: 25090, mortalityRate: 0.58, hst: 140, lastLogDate: "2026-02-19", inputProductId: "p1", inputProductName: "Indigofera" },
  { id: "fb2", batchCode: "BATCH-PAK-001", locationId: "l1", locationName: "Canggu", productName: "Pakchong", status: "GROWING", startDate: "2026-01-15", initialQty: 4000, currentQty: 4000, mortalityRate: 0, hst: 35, lastLogDate: "2026-02-19", inputProductId: "p2", inputProductName: "Pakchong" },
  { id: "fb3", batchCode: "BATCH-PAK-002", locationId: "l2", locationName: "Gunung Terang", productName: "Pakchong", status: "GROWING", startDate: "2025-11-20", initialQty: 30000, currentQty: 29800, mortalityRate: 0.6, hst: 90, lastLogDate: "2026-02-18", inputProductId: "p2", inputProductName: "Pakchong" },
  { id: "fb4", batchCode: "BATCH-IND-002", locationId: "l3", locationName: "Tanjung Sari", productName: "Indigofera", status: "GROWING", startDate: "2026-02-01", initialQty: 4000, currentQty: 3950, mortalityRate: 1.25, hst: 19, lastLogDate: "2026-02-18", inputProductId: "p1", inputProductName: "Indigofera" },
];

export interface DailyLog {
  id: string;
  batchId: string;
  batchCode: string;
  logDate: string;
  mortalityCount: number;
  manPowerCount: number;
  totalLaborHours: number;
  feedUsedKg: number;
  notes: string;
  loggedBy: string;
}

export const dailyLogs: DailyLog[] = [
  { id: "dl1", batchId: "fb1", batchCode: "BATCH-IND-001", logDate: "2026-02-19", mortalityCount: 0, manPowerCount: 4, totalLaborHours: 32, feedUsedKg: 0, notes: "Pemupukan dan pembersihan gulma", loggedBy: "Pak Darmo" },
  { id: "dl2", batchId: "fb1", batchCode: "BATCH-IND-001", logDate: "2026-02-18", mortalityCount: 5, manPowerCount: 3, totalLaborHours: 24, feedUsedKg: 0, notes: "Pengecekan rutin Canggu", loggedBy: "Pak Darmo" },
];

export interface HarvestResult {
  id: string;
  batchId: string;
  batchCode: string;
  harvestDate: string;
  totalWeightKg: number;
  sampleAvgWeight: number; // kg/pohon
  estimatedPopulation: number;
  mortalityRate: number;
  hppPerKg: number;
  harvestedBy: string;
  proofUrl: string;
  outputProductId?: string;
  outputProductName?: string;
  outputStockItemId?: string;
}

export const harvestResults: HarvestResult[] = [
  { id: "hr1", batchId: "fb1", batchCode: "BATCH-IND-001", harvestDate: "2026-01-14", totalWeightKg: 1074, sampleAvgWeight: 0.1, estimatedPopulation: 10000, mortalityRate: 0, hppPerKg: 300, harvestedBy: "Tim Harian (4 org)", proofUrl: "/proof/panen_ind.jpg", outputProductId: "p1", outputProductName: "Indigofera", outputStockItemId: "s1" },
  { id: "hr2", batchId: "fb1", batchCode: "BATCH-IND-001", harvestDate: "2026-01-15", totalWeightKg: 1425, sampleAvgWeight: 0.1, estimatedPopulation: 14000, mortalityRate: 0, hppPerKg: 300, harvestedBy: "Tim Borongan (5 org)", proofUrl: "/proof/panen_ind2.jpg", outputProductId: "p1", outputProductName: "Indigofera", outputStockItemId: "s1" },
];

// --- Inventory ---
export interface StockItem {
  id: string;
  productId: string;
  productName: string;
  skuCode: string;
  currentQty: number;
  baseUom: string;
  purchaseUom: string;
  purchaseConversionRate: number;
  avgCost: number;
  totalValue: number;
  lastMovement: string;
  location: string;
}

export const stockItems: StockItem[] = [
  { id: "s1", productId: "p1", productName: "Indigofera", skuCode: "RW-IND", currentQty: 3599, baseUom: "KG", purchaseUom: "KG", purchaseConversionRate: 1, avgCost: 350, totalValue: 1259650, lastMovement: "2026-02-15", location: "Warehouse Lampung" },
  { id: "s2", productId: "p2", productName: "Pakchong", skuCode: "RW-PAK", currentQty: 2500, baseUom: "KG", purchaseUom: "KG", purchaseConversionRate: 1, avgCost: 300, totalValue: 750000, lastMovement: "2026-02-10", location: "Warehouse Lampung" },
  { id: "s3", productId: "p5", productName: "Bungkil Kopra", skuCode: "RW-KOP", currentQty: 1952, baseUom: "KG", purchaseUom: "KG", purchaseConversionRate: 1, avgCost: 2700, totalValue: 5270400, lastMovement: "2026-02-12", location: "Warehouse Lampung" },
  { id: "s4", productId: "p6", productName: "Bungkil Sawit", skuCode: "RW-SAW", currentQty: 921, baseUom: "KG", purchaseUom: "KG", purchaseConversionRate: 1, avgCost: 2300, totalValue: 2118300, lastMovement: "2026-02-14", location: "Warehouse Lampung" },
  { id: "s5", productId: "p4", productName: "Molase", skuCode: "RW-MOL", currentQty: 73, baseUom: "KG", purchaseUom: "JERRYCAN", purchaseConversionRate: 30, avgCost: 7000, totalValue: 511000, lastMovement: "2026-02-18", location: "Warehouse Lampung" },
  { id: "s6", productId: "p9", productName: "Green Concentrate", skuCode: "FG-GC", currentQty: 4160, baseUom: "KG", purchaseUom: "KARUNG", purchaseConversionRate: 30, avgCost: 4500, totalValue: 18720000, lastMovement: "2026-02-20", location: "Gudang Jadi" },
  { id: "s7", productId: "p10", productName: "Pellet Complete", skuCode: "FG-PEL-C", currentQty: 815, baseUom: "KG", purchaseUom: "KARUNG", purchaseConversionRate: 25, avgCost: 5500, totalValue: 4482500, lastMovement: "2026-02-19", location: "Gudang Jadi" },
];

export interface StockLedgerEntry {
  id: string;
  date: string;
  transactionType: "IN_GRN" | "IN_PROD" | "OUT_PROD" | "IN_HARVEST" | "OUT_SALES" | "ADJUSTMENT";
  refDoc: string;
  qtyChange: number;
  balanceAfter: number;
  uom: string;
  note: string;
}

export const stockLedgerEntries: StockLedgerEntry[] = [
  { id: "sl1", date: "2026-02-20", transactionType: "OUT_SALES", refDoc: "DO-2026-004", qtyChange: -120, balanceAfter: 4160, uom: "KG", note: "Terjual 4 sak oleh mas arif" },
  { id: "sl2", date: "2026-02-19", transactionType: "IN_PROD", refDoc: "PR-2026-003", qtyChange: 500, balanceAfter: 4280, uom: "KG", note: "Hasil PR-2026-003 (Green Concentrate)" },
  { id: "sl3", date: "2026-02-18", transactionType: "OUT_PROD", refDoc: "PR-2026-003", qtyChange: -227, balanceAfter: 73, uom: "KG", note: "Digunakan molase untuk silase" },
];

// --- Production (Chopper / Mixer) ---
export interface BOMItem {
  name: string;
  qty: number;
  uom: string;
  productId?: string;
  stockItemId?: string;
}

export interface ProductionRun {
  id: string;
  runNumber: string;
  machineId: string;
  machineName: string;
  outputProductId: string;
  outputProductName: string;
  outputQty: number;
  outputUom: string;
  startTime: string;
  endTime: string;
  operatorCount: number;
  shiftCode: string;
  status: "PLANNED" | "IN_PROGRESS" | "FINISHED";
  bomItems: BOMItem[];
  outputStockItemId?: string;
  sourceBatchId?: string;
  sourceBatchCode?: string;
}

export const productionRuns: ProductionRun[] = [
  {
    id: "pr1", runNumber: "PR-2026-001", machineId: "MCHD1", machineName: "Chopper Silase Bensin",
    outputProductId: "p13", outputProductName: "Silase Indigofera Murni", outputQty: 1000, outputUom: "KG",
    startTime: "2026-01-20 08:00", endTime: "2026-01-20 16:00", operatorCount: 3, shiftCode: "PAGI",
    status: "FINISHED",
    bomItems: [
      { name: "Indigofera", qty: 1050, uom: "KG", productId: "p1", stockItemId: "s1" },
      { name: "Molase", qty: 20, uom: "KG", productId: "p4", stockItemId: "s5" },
    ],
    sourceBatchId: "fb1", sourceBatchCode: "BATCH-IND-001"
  },
  {
    id: "pr2", runNumber: "PR-2026-002", machineId: "MIX-01", machineName: "Mixer Besar",
    outputProductId: "p9", outputProductName: "Green Concentrate", outputQty: 1500, outputUom: "KG",
    startTime: "2026-02-10 07:00", endTime: "2026-02-10 14:00", operatorCount: 4, shiftCode: "PAGI",
    status: "FINISHED", outputStockItemId: "s6",
    bomItems: [
      { name: "Indigofera", qty: 300, uom: "KG", productId: "p1", stockItemId: "s1" },
      { name: "Bungkil Kopra", qty: 140, uom: "KG", productId: "p5", stockItemId: "s3" },
      { name: "Bungkil Sawit", qty: 180, uom: "KG", productId: "p6", stockItemId: "s4" },
    ]
  },
  {
    id: "pr3", runNumber: "PR-2026-003", machineId: "PEL-01", machineName: "Mesin Pellet",
    outputProductId: "p10", outputProductName: "Pellet Complete", outputQty: 500, outputUom: "KG",
    startTime: "2026-02-19 09:00", endTime: "2026-02-19 16:00", operatorCount: 2, shiftCode: "PAGI",
    status: "FINISHED", outputStockItemId: "s7",
    bomItems: [
      { name: "Pellet GC", qty: 340, uom: "KG", productId: "p11" },
      { name: "Indigofera", qty: 150, uom: "KG", productId: "p1", stockItemId: "s1" },
    ]
  },
];

// --- Logistics (Delivery) ---
export type TripStatus = "LOADING" | "ON_THE_WAY" | "DELIVERED";

export interface DeliveryTripItem {
  productName: string;
  qty: number;
  uom: string;
  productId?: string;
  sourceProductionRunId?: string;
  sourceProductionRunNumber?: string;
  stockItemId?: string;
}

export interface DeliveryTrip {
  id: string;
  doNumber: string;
  customerName: string;
  customerId?: string;
  driverName: string;
  vehiclePlate: string;
  tripCost: number;
  status: TripStatus;
  items: DeliveryTripItem[];
  createdAt: string;
  deliveredAt?: string;
  podUrl?: string;
}

export const deliveryTrips: DeliveryTrip[] = [
  {
    id: "dt1", doNumber: "DO-2026-001", customerName: "Karya Langit Bumi Permaculture", customerId: "c1",
    driverName: "Agus", vehiclePlate: "L 1234 AB (Truk HDL)", tripCost: 3000000,
    status: "DELIVERED",
    items: [{ productName: "Pakchong X Indigofera", qty: 4000, uom: "KG", productId: "p12" }],
    createdAt: "2026-02-10", deliveredAt: "2026-02-11"
  },
  {
    id: "dt2", doNumber: "DO-2026-002", customerName: "Metro Customer", customerId: "c2",
    driverName: "Supriyanto", vehiclePlate: "BE 5678 CD (L300)", tripCost: 850000,
    status: "DELIVERED",
    items: [{ productName: "Green Concentrate", qty: 1500, uom: "KG", productId: "p9", sourceProductionRunId: "pr2", sourceProductionRunNumber: "PR-2026-002", stockItemId: "s6" }],
    createdAt: "2026-02-15", deliveredAt: "2026-02-15"
  },
  {
    id: "dt3", doNumber: "DO-2026-003", customerName: "Bandung Customer", customerId: "c3",
    driverName: "Rendi", vehiclePlate: "D 9012 EF", tripCost: 1500000,
    status: "ON_THE_WAY",
    items: [{ productName: "Pellet Complete", qty: 25, uom: "KARUNG", productId: "p10", sourceProductionRunId: "pr3", sourceProductionRunNumber: "PR-2026-003", stockItemId: "s7" }],
    createdAt: "2026-02-21",
  }
];

// --- Dashboard Stats ---
export const dashboardStats = {
  totalInventoryValue: 33157200,
  activeBatches: 3,
  pendingPO: 1,
  activeTrips: 1,
  mortalityAvg: 0.81,
  productionThisMonth: 12500,
  laborEfficiency: 82,
  costPerTrip: 1783333,
};

export const dashboardAlerts = [
  { id: "a1", type: "warning" as const, message: "Batch BATCH-IND-001 sudah memasuki masa panen (HST: 140 hari)", time: "2 jam lalu" },
  { id: "a2", type: "info" as const, message: "PO-2026-0004 (Kemasan) masih partial, 500 plastik 110 micron belum diterima", time: "5 jam lalu" },
  { id: "a3", type: "danger" as const, message: "Stok Molase tinggal 73 KG (< safety stock)", time: "1 hari lalu" },
  { id: "a4", type: "success" as const, message: "Produksi PR-2026-003 selesai: 500 Kg Pellet Complete", time: "2 hari lalu" },
  { id: "a5", type: "info" as const, message: "Jadwal perawatan rutin Chopper Silase Bensin besok pagi", time: "2 hari lalu" },
  { id: "a6", type: "success" as const, message: "Pengiriman DO-2026-002 (Metro Customer) telah tiba di tujuan", time: "3 hari lalu" },
  { id: "a7", type: "warning" as const, message: "Tingkat mortalitas BATCH-PAK-002 meningkat 0.2% minggu ini", time: "4 hari lalu" },
  { id: "a8", type: "success" as const, message: "Penerimaan GRN-2026-0001 (Bungkil Kopra) selesai di-input", time: "5 hari lalu" },
];

export const chartDataHarvest = [
  { month: "Mar '25", panen: 3200 },
  { month: "Apr '25", panen: 3800 },
  { month: "May '25", panen: 4100 },
  { month: "Jun '25", panen: 3900 },
  { month: "Jul '25", panen: 4200 },
  { month: "Aug '25", panen: 4800 },
  { month: "Sep '25", panen: 4500 },
  { month: "Oct '25", panen: 5100 },
  { month: "Nov '25", panen: 2800 },
  { month: "Dec '25", panen: 7500 },
  { month: "Jan '26", panen: 9600 },
  { month: "Feb '26", panen: 4500 },
];

export const chartDataProduction = [
  { month: "Mar '25", output: 4000, target: 4500 },
  { month: "Apr '25", output: 4200, target: 4500 },
  { month: "May '25", output: 4800, target: 5000 },
  { month: "Jun '25", output: 4900, target: 5000 },
  { month: "Jul '25", output: 5100, target: 5500 },
  { month: "Aug '25", output: 5400, target: 5500 },
  { month: "Sep '25", output: 5500, target: 6000 },
  { month: "Oct '25", output: 6200, target: 6000 },
  { month: "Nov '25", output: 5800, target: 6500 },
  { month: "Dec '25", output: 7100, target: 7000 },
  { month: "Jan '26", output: 6800, target: 7000 },
  { month: "Feb '26", output: 6500, target: 7500 },
];
