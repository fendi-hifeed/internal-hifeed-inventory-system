// Default mock data based on real HiFeed operation Excel

export type UserRole = "OWNER" | "FARM_MANAGER" | "LOGISTICS" | "FINANCE" | "OPERATOR" | "RND" | "IT_OPS" | "SALES";
export type AccessKey = "dashboard" | "procurement" | "farm" | "inventory" | "production" | "logistics" | "traceability" | "rnd" | "it_admin" | "sales";

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
  { id: "u7", name: "Rina Peneliti", email: "rina.rnd@hifeed.co", role: "RND" },
  { id: "u8", name: "Fendi IT", email: "fendi.it@hifeed.co", role: "IT_OPS" },
  { id: "u9", name: "Yoga Sales", email: "yoga.sales@hifeed.co", role: "SALES" },
];

export const roleAccessMatrix: Record<UserRole, AccessKey[]> = {
  OWNER: ["dashboard", "procurement", "farm", "inventory", "production", "logistics", "traceability", "rnd", "sales"],
  FARM_MANAGER: ["dashboard", "procurement", "farm", "inventory"],
  LOGISTICS: ["dashboard", "procurement", "inventory", "logistics"],
  FINANCE: ["dashboard", "procurement", "inventory", "traceability", "sales"],
  OPERATOR: ["dashboard", "procurement", "production", "inventory"],
  RND: ["dashboard", "procurement", "rnd", "inventory"],
  IT_OPS: ["dashboard", "procurement", "farm", "inventory", "production", "logistics", "traceability", "rnd", "it_admin", "sales"],
  SALES: ["dashboard", "procurement", "sales", "inventory", "logistics"],
};

export const roleLabels: Record<UserRole, string> = {
  OWNER: "Owner / Director",
  FARM_MANAGER: "Farm Manager",
  LOGISTICS: "Logistics",
  FINANCE: "Finance Admin",
  OPERATOR: "Production Operator",
  RND: "R&D Scientist",
  IT_OPS: "IT Operations",
  SALES: "Sales",
};

export const roleBadgeColors: Record<UserRole, string> = {
  OWNER: "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/50",
  FARM_MANAGER: "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/50",
  LOGISTICS: "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border-blue-500/50",
  FINANCE: "bg-purple-500/15 text-purple-500 hover:bg-purple-500/25 border-purple-500/50",
  OPERATOR: "bg-slate-500/15 text-slate-500 hover:bg-slate-500/25 border-slate-500/50",
  RND: "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border-rose-500/50",
  IT_OPS: "bg-cyan-500/15 text-cyan-500 hover:bg-cyan-500/25 border-cyan-500/50",
  SALES: "bg-orange-500/15 text-orange-500 hover:bg-orange-500/25 border-orange-500/50",
};

export type ModuleAccess = {
  label: string;
  icon: any;
  basePath: string;
  accessKey: AccessKey;
  items: { label: string; href: string }[];
};

export type MockUser = User;

// --- Product Catalog — 3 Layer Kodifikasi ---
// TRADE SECRET: secretName TIDAK BOLEH ditampilkan di UI. Hanya untuk referensi admin.
export type ProductCluster = "RAW_MATERIAL" | "FINISHED_GOOD" | "TRADING_GOOD" | "ADDITIVE" | "PACKAGING";

export interface Product {
  id: string;
  internalCode: string;   // Kode internal (DM_CPTN1) — displayed to internal users
  externalCode: string;   // Kode nutrisi publik (RM 1: crude protein 25%...) — for export / investors
  secretName: string;     // Nama asli bahan (HIDDEN di UI) — trade secret
  displayName: string;    // Label yang ditampilkan di UI (= internalCode + short desc)
  category: "Seed" | "Raw Material" | "Medicine" | "Finished Goods" | "Packaging";
  cluster: ProductCluster;
  defaultUom: string;
}

export const products: Product[] = [
  // Raw Materials — Kodifikasi dari tabel meeting
  { id: "p1", internalCode: "DM_CPTN1", externalCode: "Material - Crude Protein", secretName: "Indigofera mash", displayName: "DM_CPTN1 — Crude Protein", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },
  { id: "p2", internalCode: "DM_CFHP1", externalCode: "Material - Crude Fiber", secretName: "Pakchong/hybrid napier", displayName: "DM_CFHP1 — Crude Fiber", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },
  { id: "p3", internalCode: "DM_CPEE1", externalCode: "Material - Crude Protein", secretName: "Coconut meal", displayName: "DM_CPEE1 — Crude Protein", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },
  { id: "p4", internalCode: "DM_GE1", externalCode: "Material - Energy", secretName: "Cassava meal", displayName: "DM_GE1 — Energy", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },
  { id: "p5", internalCode: "DM_CPCF1", externalCode: "Material - Crude Protein", secretName: "Palm kernel expeller", displayName: "DM_CPCF1 — Crude Protein", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },
  { id: "p6", internalCode: "DM_CPRUP1", externalCode: "Material - Crude Protein", secretName: "Corn DDGS", displayName: "DM_CPRUP1 — Crude Protein", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },
  { id: "p7", internalCode: "DM_CF1", externalCode: "Material - Crude Fiber, Tanin", secretName: "Cascara/coffee husk", displayName: "DM_CF1 — Crude Fiber, Tanin", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },
  { id: "p18", internalCode: "DM_FA1", externalCode: "Material - Additive", secretName: "Premix", displayName: "DM_FA1 — Additive", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },
  { id: "p19", internalCode: "DM_FA2", externalCode: "Material - Additive", secretName: "Calcium/DCP/Mineral", displayName: "DM_FA2 — Additive", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },
  { id: "p20", internalCode: "DM_FA3", externalCode: "Material - Additive", secretName: "Natrium/salt", displayName: "DM_FA3 — Additive", category: "Raw Material", cluster: "RAW_MATERIAL", defaultUom: "KG" },

  // Medicine / Additives
  { id: "p8", internalCode: "ADD_EM4", externalCode: "Additive - Fermentation Agent", secretName: "EM4", displayName: "ADD_EM4 — Fermentasi", category: "Medicine", cluster: "ADDITIVE", defaultUom: "LITER" },

  // Finished Goods
  { id: "p9", internalCode: "FG_GC", externalCode: "Finished Good - Green Concentrate", secretName: "Green Concentrate", displayName: "FG_GC — Green Concentrate", category: "Finished Goods", cluster: "FINISHED_GOOD", defaultUom: "KG" },
  { id: "p10", internalCode: "FG_PEL_C", externalCode: "Finished Good - Pellet Complete", secretName: "Pellet Complete", displayName: "FG_PEL_C — Pellet Complete", category: "Finished Goods", cluster: "FINISHED_GOOD", defaultUom: "KG" },
  { id: "p11", internalCode: "FG_PEL_GC", externalCode: "Finished Good - Pellet Green Concentrate", secretName: "Pellet GC", displayName: "FG_PEL_GC — Pellet GC", category: "Finished Goods", cluster: "FINISHED_GOOD", defaultUom: "KG" },
  { id: "p12", internalCode: "FG_SIL_MIX", externalCode: "Finished Good - Silase Mixed", secretName: "Silase Pakchong x Indigofera", displayName: "FG_SIL_MIX — Silase Mix", category: "Finished Goods", cluster: "FINISHED_GOOD", defaultUom: "KG" },
  { id: "p13", internalCode: "FG_SIL_PUR", externalCode: "Finished Good - Silase Pure", secretName: "Silase Indigofera Murni", displayName: "FG_SIL_PUR — Silase Pure", category: "Finished Goods", cluster: "FINISHED_GOOD", defaultUom: "KG" },

  // Packaging — Trading Goods
  { id: "p14", internalCode: "PKG_KRG_65", externalCode: "Packaging - Karung 65x105", secretName: "Karung 65x105", displayName: "PKG_KRG_65 — Karung Besar", category: "Packaging", cluster: "TRADING_GOOD", defaultUom: "PCS" },
  { id: "p15", internalCode: "PKG_KRG_59", externalCode: "Packaging - Karung Sablon 59x90", secretName: "Karung Sablon 59x90", displayName: "PKG_KRG_59 — Karung Sablon", category: "Packaging", cluster: "TRADING_GOOD", defaultUom: "PCS" },
  { id: "p16", internalCode: "PKG_PLS_60", externalCode: "Packaging - Plastik 60 Micron", secretName: "Plastik 60 Micron", displayName: "PKG_PLS_60 — Plastik 60μ", category: "Packaging", cluster: "TRADING_GOOD", defaultUom: "PCS" },
  { id: "p17", internalCode: "PKG_PLS_110", externalCode: "Packaging - Plastik 110 Micron", secretName: "Plastik 110 Micron", displayName: "PKG_PLS_110 — Plastik 110μ", category: "Packaging", cluster: "TRADING_GOOD", defaultUom: "PCS" },
];

// Helper: get product display name by ID (use this everywhere in UI)
export function getProductDisplay(productId: string): string {
  return products.find(p => p.id === productId)?.displayName ?? productId;
}

export const traceableProducts = products.filter(p => p.cluster === "FINISHED_GOOD" || p.cluster === "RAW_MATERIAL");

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
export type POStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED_L1" | "APPROVED" | "PARTIAL_RECEIVED" | "COMPLETED" | "CANCELLED" | "REJECTED";

// Approval rules:
// ≤ 50 Juta → 1-layer: Finance ATAU Owner approves
// > 50 Juta → 2-layer: Finance approves L1, THEN Owner approves L2
export const PO_APPROVAL_THRESHOLD = 50_000_000; // Rp 50 Juta

export type ApprovalRole = "FINANCE" | "OWNER";

export interface POApproval {
  level: 1 | 2;
  approverRole: ApprovalRole;
  approverId?: string;
  approverName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedAt?: string;
  notes?: string;
}

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
  // Multi-department PO fields
  createdByUserId: string;
  createdByRole: UserRole;
  department: string; // Display label
  // Approval workflow
  approvalLevel: 1 | 2; // Auto-calculated: ≤50M=1, >50M=2
  approvals: POApproval[];
  notes?: string;
}

export const purchaseOrders: PurchaseOrder[] = [
  // === Farm Department POs ===
  {
    id: "po1", poNumber: "PO-2026-0001", vendorName: "PT. Sumber Sawit", createdAt: "2025-12-15", expectedDeliveryDate: "2025-12-20",
    status: "COMPLETED", totalAmount: 13986300,
    items: [{ id: "poi1", productId: "p6", productName: "DM_CPRUP1 — Crude Protein", qty: 6081, uom: "KG", unitPrice: 2300, totalPrice: 13986300 }],
    createdByUserId: "u2", createdByRole: "FARM_MANAGER", department: "Farm Management",
    approvalLevel: 1,
    approvals: [
      { level: 1, approverRole: "FINANCE", approverId: "u4", approverName: "Siti Rahma", status: "APPROVED", approvedAt: "2025-12-15" },
    ],
  },
  {
    id: "po2", poNumber: "PO-2026-0002", vendorName: "CV. Makmur Kopra", createdAt: "2026-01-05", expectedDeliveryDate: "2026-01-10",
    status: "COMPLETED", totalAmount: 22515300,
    items: [{ id: "poi2", productId: "p5", productName: "DM_CPCF1 — Crude Protein", qty: 8339, uom: "KG", unitPrice: 2700, totalPrice: 22515300 }],
    createdByUserId: "u2", createdByRole: "FARM_MANAGER", department: "Farm Management",
    approvalLevel: 1,
    approvals: [
      { level: 1, approverRole: "FINANCE", approverId: "u4", approverName: "Siti Rahma", status: "APPROVED", approvedAt: "2026-01-05" },
    ],
  },

  // === Finance/Procurement POs ===
  {
    id: "po3", poNumber: "PO-2026-0003", vendorName: "Toko Pertanian Subur", createdAt: "2026-02-10", expectedDeliveryDate: "2026-02-15",
    status: "COMPLETED", totalAmount: 2100000,
    items: [{ id: "poi3", productId: "p4", productName: "DM_GE1 — Energy", qty: 300, uom: "KG", unitPrice: 7000, totalPrice: 2100000 }],
    createdByUserId: "u4", createdByRole: "FINANCE", department: "Finance",
    approvalLevel: 1,
    approvals: [
      { level: 1, approverRole: "FINANCE", approverId: "u4", approverName: "Siti Rahma", status: "APPROVED", approvedAt: "2026-02-10" },
    ],
  },
  {
    id: "po4", poNumber: "PO-2026-0004", vendorName: "Pabrik Kemasan Plastik", createdAt: "2026-02-18", expectedDeliveryDate: "2026-02-22",
    status: "PARTIAL_RECEIVED", totalAmount: 4571500,
    items: [
      { id: "poi4_1", productId: "p16", productName: "PKG_PLS_60 — Plastik 60μ", qty: 500, uom: "PCS", unitPrice: 1833, totalPrice: 916500 },
      { id: "poi4_2", productId: "p17", productName: "PKG_PLS_110 — Plastik 110μ", qty: 500, uom: "PCS", unitPrice: 7310, totalPrice: 3655000 },
    ],
    createdByUserId: "u4", createdByRole: "FINANCE", department: "Finance",
    approvalLevel: 1,
    approvals: [
      { level: 1, approverRole: "FINANCE", approverId: "u4", approverName: "Siti Rahma", status: "APPROVED", approvedAt: "2026-02-18" },
    ],
  },

  // === Production Department PO ===
  {
    id: "po5", poNumber: "PO-2026-0005", vendorName: "CV. Maju Teknik", createdAt: "2026-02-25", expectedDeliveryDate: "2026-03-05",
    status: "APPROVED", totalAmount: 15500000,
    items: [
      { id: "poi5_1", productId: "p18", productName: "DM_FA1 — Additive", qty: 200, uom: "KG", unitPrice: 45000, totalPrice: 9000000 },
      { id: "poi5_2", productId: "p19", productName: "DM_FA2 — Additive", qty: 500, uom: "KG", unitPrice: 13000, totalPrice: 6500000 },
    ],
    createdByUserId: "u5", createdByRole: "OPERATOR", department: "Production",
    approvalLevel: 1,
    approvals: [
      { level: 1, approverRole: "FINANCE", approverId: "u4", approverName: "Siti Rahma", status: "APPROVED", approvedAt: "2026-02-26" },
    ],
  },

  // === Logistics PO (> 50M → 2-layer approval) ===
  {
    id: "po6", poNumber: "PO-2026-0006", vendorName: "PT. Angkutan Sejahtera", createdAt: "2026-03-01", expectedDeliveryDate: "2026-03-10",
    status: "APPROVED_L1", totalAmount: 75000000,
    items: [
      { id: "poi6_1", productId: "p6", productName: "DM_CPRUP1 — Crude Protein", qty: 25000, uom: "KG", unitPrice: 3000, totalPrice: 75000000 },
    ],
    createdByUserId: "u3", createdByRole: "LOGISTICS", department: "Logistics",
    approvalLevel: 2,
    approvals: [
      { level: 1, approverRole: "FINANCE", approverId: "u4", approverName: "Siti Rahma", status: "APPROVED", approvedAt: "2026-03-01" },
      { level: 2, approverRole: "OWNER", status: "PENDING" },
    ],
    notes: "Pengadaan bulk untuk stockpile Q2 2026",
  },

  // === R&D PO ===
  {
    id: "po7", poNumber: "PO-2026-0007", vendorName: "Lab Nutrisi Unila", createdAt: "2026-03-02", expectedDeliveryDate: "2026-03-07",
    status: "PENDING_APPROVAL", totalAmount: 3750000,
    items: [
      { id: "poi7_1", productId: "p20", productName: "DM_FA3 — Additive", qty: 50, uom: "KG", unitPrice: 75000, totalPrice: 3750000 },
    ],
    createdByUserId: "u7", createdByRole: "RND", department: "R&D",
    approvalLevel: 1,
    approvals: [
      { level: 1, approverRole: "FINANCE", status: "PENDING" },
    ],
    notes: "Untuk eksperimen formulasi NaCl optimal",
  },

  // === Farm PO (> 50M → 2-layer, PENDING both) ===
  {
    id: "po8", poNumber: "PO-2026-0008", vendorName: "PT. Bibit Unggul Nusantara", createdAt: "2026-03-03", expectedDeliveryDate: "2026-03-15",
    status: "PENDING_APPROVAL", totalAmount: 62000000,
    items: [
      { id: "poi8_1", productId: "p1", productName: "DM_CPTN1 — Crude Protein", qty: 20000, uom: "KG", unitPrice: 3100, totalPrice: 62000000 },
    ],
    createdByUserId: "u6", createdByRole: "FARM_MANAGER", department: "Farm Management",
    approvalLevel: 2,
    approvals: [
      { level: 1, approverRole: "FINANCE", status: "PENDING" },
      { level: 2, approverRole: "OWNER", status: "PENDING" },
    ],
    notes: "Pengadaan besar untuk ekspansi lahan Tanjung Sari",
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
    items: [{ productId: "p6", productName: "DM_CPRUP1 — Crude Protein", qtyOrdered: 6081, qtyReceived: 6081, qtyRejected: 0, uom: "KG", weight: 6081 }],
  },
  {
    id: "grn2", poId: "po2", grnNumber: "GRN-2026-0002", receivedDate: "2026-01-08", receivedBy: "Pak Ihsan",
    items: [{ productId: "p5", productName: "DM_CPCF1 — Crude Protein", qtyOrdered: 8339, qtyReceived: 8200, qtyRejected: 139, uom: "KG", weight: 8200 }],
  },
  {
    id: "grn3", poId: "po3", grnNumber: "GRN-2026-0003", receivedDate: "2026-02-12", receivedBy: "Dian",
    items: [{ productId: "p4", productName: "DM_GE1 — Energy", qtyOrdered: 300, qtyReceived: 300, qtyRejected: 0, uom: "KG", weight: 300 }],
  },
];

// --- Farm Lands / Area Mapping ---
export interface FarmLand {
  id: string;
  name: string;
  location: string;
  areaSqM: number; // square meters
  areaHa: number;  // hectares
  soilType: string;
  waterSource: string;
  status: "ACTIVE" | "RESTING" | "PREPARATION";
  currentBatchId?: string;
  currentBatchCode?: string;
  notes: string;
  createdAt: string;
}

export const farmLands: FarmLand[] = [
  { id: "l1", name: "Lahan Canggu A", location: "Canggu, Bali", areaSqM: 15000, areaHa: 1.5, soilType: "Latosol", waterSource: "Irigasi", status: "ACTIVE", currentBatchId: "fb1", currentBatchCode: "BATCH-CPTN1-001", notes: "Lahan utama Indigofera", createdAt: "2025-08-01" },
  { id: "l2", name: "Lahan Gunung Terang", location: "Gunung Terang, Lampung", areaSqM: 40000, areaHa: 4.0, soilType: "Andosol", waterSource: "Tadah hujan + sumur bor", status: "ACTIVE", currentBatchId: "fb3", currentBatchCode: "BATCH-CFHP1-002", notes: "Lahan luas untuk Pakchong", createdAt: "2025-06-15" },
  { id: "l3", name: "Lahan Tanjung Sari", location: "Tanjung Sari, Lampung", areaSqM: 8000, areaHa: 0.8, soilType: "Latosol-Regosol", waterSource: "Sungai kecil", status: "ACTIVE", currentBatchId: "fb4", currentBatchCode: "BATCH-CPTN1-002", notes: "Lahan baru pembibitan", createdAt: "2026-01-10" },
  { id: "l4", name: "Lahan Canggu B", location: "Canggu, Bali", areaSqM: 5000, areaHa: 0.5, soilType: "Latosol", waterSource: "Irigasi", status: "RESTING", notes: "Lahan istirahat setelah panen batch sebelumnya", createdAt: "2025-08-01" },
  { id: "l5", name: "Lahan Jurang Jero", location: "Jurang Jero, Lampung", areaSqM: 25000, areaHa: 2.5, soilType: "Andosol", waterSource: "Tadah hujan", status: "PREPARATION", notes: "Lahan baru sedang dipersiapkan untuk penanaman Maret 2026", createdAt: "2026-02-20" },
];

// --- Inventory Movement (Barang Keluar) ---
export type MovementFlag = "SALES" | "MARKETING_SAMPLE" | "RND_SAMPLE" | "WAREHOUSE_TRANSFER" | "DEFECT" | "RETURN";

export interface InventoryMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  flag: MovementFlag;
  qtyKg: number;
  destination: string;
  reason: string;
  evidenceUrl?: string;
  createdBy: string;
}

export const movementFlagLabels: Record<MovementFlag, string> = {
  SALES: "Sales (Penjualan)",
  MARKETING_SAMPLE: "Marketing Sample",
  RND_SAMPLE: "R&D Sample",
  WAREHOUSE_TRANSFER: "Transfer Gudang",
  DEFECT: "Defect / Rusak",
  RETURN: "Return (Retur)",
};

export const inventoryMovements: InventoryMovement[] = [
  { id: "mv1", date: "2026-02-15", productId: "p9", productName: "FG_GC — Green Concentrate", flag: "SALES", qtyKg: 120, destination: "Metro Customer", reason: "Order reguler", createdBy: "Budi Sales" },
  { id: "mv2", date: "2026-02-17", productId: "p10", productName: "FG_PEL_C — Pellet Complete", flag: "SALES", qtyKg: 75, destination: "Bandung Customer", reason: "Order rekanan baru", createdBy: "Budi Sales" },
  { id: "mv3", date: "2026-02-18", productId: "p9", productName: "FG_GC — Green Concentrate", flag: "MARKETING_SAMPLE", qtyKg: 30, destination: "CV Sinar Tani (prospek)", reason: "Sampel untuk demo ke calon customer", createdBy: "Budi Sales" },
  { id: "mv4", date: "2026-02-20", productId: "p1", productName: "DM_CPTN1 — Crude Protein", flag: "RND_SAMPLE", qtyKg: 15, destination: "Lab R&D Internal", reason: "EXP-2026-001: pengujian nutrisi batch terbaru", createdBy: "R&D Team" },
  { id: "mv5", date: "2026-02-22", productId: "p5", productName: "DM_CPCF1 — Crude Protein", flag: "DEFECT", qtyKg: 28, destination: "Gudang Write-off", reason: "Bungkil kopra berjamur setelah kebocoran atap", evidenceUrl: "https://drive.google.com/file/d/xxx", createdBy: "Siti Rahma" },
  { id: "mv6", date: "2026-02-25", productId: "p10", productName: "FG_PEL_C — Pellet Complete", flag: "WAREHOUSE_TRANSFER", qtyKg: 100, destination: "Gudang B (Titipan Langgeng)", reason: "Pindah stok ke gudang penyimpanan jangka panjang", createdBy: "Logistic Team" },
  { id: "mv7", date: "2026-03-01", productId: "p9", productName: "FG_GC — Green Concentrate", flag: "RETURN", qtyKg: 30, destination: "Return dari Metro Customer", reason: "Customer retur karena kemasan rusak saat pengiriman", createdBy: "Budi Sales" },
  { id: "mv8", date: "2026-03-03", productId: "p1", productName: "DM_CPTN1 — Crude Protein", flag: "RND_SAMPLE", qtyKg: 10, destination: "Lab R&D Internal", reason: "EXP-2026-002: formulasi pakan laktasi baru", createdBy: "R&D Team" },
  { id: "mv9", date: "2026-03-05", productId: "p9", productName: "FG_GC — Green Concentrate", flag: "MARKETING_SAMPLE", qtyKg: 20, destination: "PT Agri Jaya (prospek)", reason: "Demo produk untuk pameran agribisnis", createdBy: "Budi Sales" },
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
  { id: "fb1", batchCode: "BATCH-CPTN1-001", locationId: "l1", locationName: "Canggu", productName: "DM_CPTN1 — Crude Protein", status: "READY_HARVEST", startDate: "2025-10-01", initialQty: 25090, currentQty: 25090, mortalityRate: 0.58, hst: 140, lastLogDate: "2026-02-19", inputProductId: "p1", inputProductName: "DM_CPTN1 — Crude Protein" },
  { id: "fb2", batchCode: "BATCH-CFHP1-001", locationId: "l1", locationName: "Canggu", productName: "DM_CFHP1 — Crude Fiber", status: "GROWING", startDate: "2026-01-15", initialQty: 4000, currentQty: 4000, mortalityRate: 0, hst: 35, lastLogDate: "2026-02-19", inputProductId: "p2", inputProductName: "DM_CFHP1 — Crude Fiber" },
  { id: "fb3", batchCode: "BATCH-CFHP1-002", locationId: "l2", locationName: "Gunung Terang", productName: "DM_CFHP1 — Crude Fiber", status: "GROWING", startDate: "2025-11-20", initialQty: 30000, currentQty: 29800, mortalityRate: 0.6, hst: 90, lastLogDate: "2026-02-18", inputProductId: "p2", inputProductName: "DM_CFHP1 — Crude Fiber" },
  { id: "fb4", batchCode: "BATCH-CPTN1-002", locationId: "l3", locationName: "Tanjung Sari", productName: "DM_CPTN1 — Crude Protein", status: "GROWING", startDate: "2026-02-01", initialQty: 4000, currentQty: 3950, mortalityRate: 1.25, hst: 19, lastLogDate: "2026-02-18", inputProductId: "p1", inputProductName: "DM_CPTN1 — Crude Protein" },
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
  { id: "dl1", batchId: "fb1", batchCode: "BATCH-CPTN1-001", logDate: "2026-02-19", mortalityCount: 0, manPowerCount: 4, totalLaborHours: 32, feedUsedKg: 0, notes: "Pemupukan dan pembersihan gulma", loggedBy: "Pak Darmo" },
  { id: "dl2", batchId: "fb1", batchCode: "BATCH-CPTN1-001", logDate: "2026-02-18", mortalityCount: 5, manPowerCount: 3, totalLaborHours: 24, feedUsedKg: 0, notes: "Pengecekan rutin Canggu", loggedBy: "Pak Darmo" },
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
  { id: "hr1", batchId: "fb1", batchCode: "BATCH-CPTN1-001", harvestDate: "2026-01-14", totalWeightKg: 1074, sampleAvgWeight: 0.1, estimatedPopulation: 10000, mortalityRate: 0, hppPerKg: 300, harvestedBy: "Tim Harian (4 org)", proofUrl: "/proof/panen_ind.jpg", outputProductId: "p1", outputProductName: "DM_CPTN1 — Crude Protein", outputStockItemId: "s1" },
  { id: "hr2", batchId: "fb1", batchCode: "BATCH-CPTN1-001", harvestDate: "2026-01-15", totalWeightKg: 1425, sampleAvgWeight: 0.1, estimatedPopulation: 14000, mortalityRate: 0, hppPerKg: 300, harvestedBy: "Tim Borongan (5 org)", proofUrl: "/proof/panen_ind2.jpg", outputProductId: "p1", outputProductName: "DM_CPTN1 — Crude Protein", outputStockItemId: "s1" },
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
  { id: "s1", productId: "p1", productName: "DM_CPTN1 — Crude Protein", skuCode: "DM_CPTN1", currentQty: 3599, baseUom: "KG", purchaseUom: "KG", purchaseConversionRate: 1, avgCost: 350, totalValue: 1259650, lastMovement: "2026-02-15", location: "Warehouse Lampung" },
  { id: "s2", productId: "p2", productName: "DM_CFHP1 — Crude Fiber", skuCode: "DM_CFHP1", currentQty: 2500, baseUom: "KG", purchaseUom: "KG", purchaseConversionRate: 1, avgCost: 300, totalValue: 750000, lastMovement: "2026-02-10", location: "Warehouse Lampung" },
  { id: "s3", productId: "p5", productName: "DM_CPCF1 — Crude Protein", skuCode: "DM_CPCF1", currentQty: 1952, baseUom: "KG", purchaseUom: "KG", purchaseConversionRate: 1, avgCost: 2700, totalValue: 5270400, lastMovement: "2026-02-12", location: "Warehouse Lampung" },
  { id: "s4", productId: "p6", productName: "DM_CPRUP1 — Crude Protein", skuCode: "DM_CPRUP1", currentQty: 921, baseUom: "KG", purchaseUom: "KG", purchaseConversionRate: 1, avgCost: 2300, totalValue: 2118300, lastMovement: "2026-02-14", location: "Warehouse Lampung" },
  { id: "s5", productId: "p4", productName: "DM_GE1 — Energy", skuCode: "DM_GE1", currentQty: 73, baseUom: "KG", purchaseUom: "JERRYCAN", purchaseConversionRate: 30, avgCost: 7000, totalValue: 511000, lastMovement: "2026-02-18", location: "Warehouse Lampung" },
  { id: "s6", productId: "p9", productName: "FG_GC — Green Concentrate", skuCode: "FG_GC", currentQty: 4160, baseUom: "KG", purchaseUom: "KARUNG", purchaseConversionRate: 30, avgCost: 4500, totalValue: 18720000, lastMovement: "2026-02-20", location: "Gudang Jadi" },
  { id: "s7", productId: "p10", productName: "FG_PEL_C — Pellet Complete", skuCode: "FG_PEL_C", currentQty: 815, baseUom: "KG", purchaseUom: "KARUNG", purchaseConversionRate: 25, avgCost: 5500, totalValue: 4482500, lastMovement: "2026-02-19", location: "Gudang Jadi" },
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
  { id: "sl2", date: "2026-02-19", transactionType: "IN_PROD", refDoc: "PR-2026-003", qtyChange: 500, balanceAfter: 4280, uom: "KG", note: "Hasil PR-2026-003 (FG_GC)" },
  { id: "sl3", date: "2026-02-18", transactionType: "OUT_PROD", refDoc: "PR-2026-003", qtyChange: -227, balanceAfter: 73, uom: "KG", note: "Digunakan DM_GE1 untuk silase" },
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
    outputProductId: "p13", outputProductName: "FG_SIL_PUR — Silase Pure", outputQty: 1000, outputUom: "KG",
    startTime: "2026-01-20 08:00", endTime: "2026-01-20 16:00", operatorCount: 3, shiftCode: "PAGI",
    status: "FINISHED",
    bomItems: [
      { name: "DM_CPTN1", qty: 1050, uom: "KG", productId: "p1", stockItemId: "s1" },
      { name: "DM_GE1", qty: 20, uom: "KG", productId: "p4", stockItemId: "s5" },
    ],
    sourceBatchId: "fb1", sourceBatchCode: "BATCH-CPTN1-001"
  },
  {
    id: "pr2", runNumber: "PR-2026-002", machineId: "MIX-01", machineName: "Mixer Besar",
    outputProductId: "p9", outputProductName: "FG_GC — Green Concentrate", outputQty: 1500, outputUom: "KG",
    startTime: "2026-02-10 07:00", endTime: "2026-02-10 14:00", operatorCount: 4, shiftCode: "PAGI",
    status: "FINISHED", outputStockItemId: "s6",
    bomItems: [
      { name: "DM_CPTN1", qty: 300, uom: "KG", productId: "p1", stockItemId: "s1" },
      { name: "DM_CPCF1", qty: 140, uom: "KG", productId: "p5", stockItemId: "s3" },
      { name: "DM_CPRUP1", qty: 180, uom: "KG", productId: "p6", stockItemId: "s4" },
    ]
  },
  {
    id: "pr3", runNumber: "PR-2026-003", machineId: "PEL-01", machineName: "Mesin Pellet",
    outputProductId: "p10", outputProductName: "FG_PEL_C — Pellet Complete", outputQty: 500, outputUom: "KG",
    startTime: "2026-02-19 09:00", endTime: "2026-02-19 16:00", operatorCount: 2, shiftCode: "PAGI",
    status: "FINISHED", outputStockItemId: "s7",
    bomItems: [
      { name: "FG_PEL_GC", qty: 340, uom: "KG", productId: "p11" },
      { name: "DM_CPTN1", qty: 150, uom: "KG", productId: "p1", stockItemId: "s1" },
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
    items: [{ productName: "FG_SIL_MIX — Silase Mix", qty: 4000, uom: "KG", productId: "p12" }],
    createdAt: "2026-02-10", deliveredAt: "2026-02-11"
  },
  {
    id: "dt2", doNumber: "DO-2026-002", customerName: "Metro Customer", customerId: "c2",
    driverName: "Supriyanto", vehiclePlate: "BE 5678 CD (L300)", tripCost: 850000,
    status: "DELIVERED",
    items: [{ productName: "FG_GC — Green Concentrate", qty: 1500, uom: "KG", productId: "p9", sourceProductionRunId: "pr2", sourceProductionRunNumber: "PR-2026-002", stockItemId: "s6" }],
    createdAt: "2026-02-15", deliveredAt: "2026-02-15"
  },
  {
    id: "dt3", doNumber: "DO-2026-003", customerName: "Bandung Customer", customerId: "c3",
    driverName: "Rendi", vehiclePlate: "D 9012 EF", tripCost: 1500000,
    status: "ON_THE_WAY",
    items: [{ productName: "FG_PEL_C — Pellet Complete", qty: 25, uom: "KARUNG", productId: "p10", sourceProductionRunId: "pr3", sourceProductionRunNumber: "PR-2026-003", stockItemId: "s7" }],
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
  { id: "a1", type: "warning" as const, module: "farm", message: "Batch BATCH-IND-001 sudah memasuki masa panen (HST: 140 hari)", time: "2 jam lalu" },
  { id: "a2", type: "info" as const, module: "procurement", message: "PO-2026-0004 (Kemasan) masih partial, 500 plastik 110 micron belum diterima", time: "5 jam lalu" },
  { id: "a3", type: "danger" as const, module: "inventory", message: "Stok Molase tinggal 73 KG (< safety stock)", time: "1 hari lalu" },
  { id: "a4", type: "success" as const, module: "production", message: "Produksi PR-2026-003 selesai: 500 Kg Pellet Complete", time: "2 hari lalu" },
  { id: "a5", type: "info" as const, module: "production", message: "Jadwal perawatan rutin Chopper Silase Bensin besok pagi", time: "2 hari lalu" },
  { id: "a6", type: "success" as const, module: "logistics", message: "Pengiriman DO-2026-002 (Metro Customer) telah tiba di tujuan", time: "3 hari lalu" },
  { id: "a7", type: "warning" as const, module: "farm", message: "Tingkat mortalitas BATCH-PAK-002 meningkat 0.2% minggu ini", time: "4 hari lalu" },
  { id: "a8", type: "success" as const, module: "procurement", message: "Penerimaan GRN-2026-0001 (Bungkil Kopra) selesai di-input", time: "5 hari lalu" },
  { id: "a9", type: "warning" as const, module: "sales", message: "Invoice INV-2026-004 overdue — segera follow up pembayaran", time: "1 hari lalu" },
  { id: "a10", type: "info" as const, module: "rnd", message: "Budget R&D sudah 68% terpakai — mendekati limit 70%", time: "3 hari lalu" },
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

// --- R&D Module ---
export type RndSampleStatus = "PENDING" | "APPROVED" | "REJECTED" | "FULFILLED";
export type RndMaterialType = "RAW_WET" | "RAW_DRY" | "FINISHED_GOOD";
export type ExperimentStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TestType = "NUTRITIONAL" | "PALATABILITY" | "SHELF_LIFE" | "FIELD_TRIAL";

export interface RndSampleRequest {
  id: string;
  requestNumber: string;
  requesterId: string;
  requesterName: string;
  materialType: RndMaterialType;
  productId: string;
  productName: string;
  qtyRequested: number;
  uom: string;
  purpose: string;
  experimentId?: string;
  status: RndSampleStatus;
  approvedBy?: string;
  createdAt: string;
  fulfilledAt?: string;
  estimatedValue: number;
}

export interface RndExperiment {
  id: string;
  experimentCode: string;
  title: string;
  objective: string;
  startDate: string;
  endDate?: string;
  status: ExperimentStatus;
  leadResearcher: string;
  sampleRequestIds: string[];
  findings?: string;
  attachmentCount: number;
}

export interface RndTestResult {
  id: string;
  experimentId: string;
  testType: TestType;
  parameter: string;
  value: number;
  unit: string;
  benchmark: number;
  passFail: boolean;
  notes?: string;
  testedAt: string;
}

// Pagu R&D: 2% dari total inventory value
export const rndBudget = {
  totalInventoryValue: 33157200,
  paguPercent: 2,
  paguAmount: 33157200 * 0.02, // Rp 663.144
  consumed: 387500,
  get remaining() { return this.paguAmount - this.consumed; },
  get usagePercent() { return (this.consumed / this.paguAmount) * 100; },
};

export const rndSampleRequests: RndSampleRequest[] = [
  {
    id: "rsr1", requestNumber: "RND-2026-001", requesterId: "u7", requesterName: "Rina Peneliti",
    materialType: "RAW_DRY", productId: "p1", productName: "DM_CPTN1 — Crude Protein",
    qtyRequested: 25, uom: "KG", purpose: "Analisis kandungan crude protein batch terbaru",
    experimentId: "exp1", status: "FULFILLED", approvedBy: "System (under pagu)",
    createdAt: "2026-01-15", fulfilledAt: "2026-01-16", estimatedValue: 62500,
  },
  {
    id: "rsr2", requestNumber: "RND-2026-002", requesterId: "u7", requesterName: "Rina Peneliti",
    materialType: "FINISHED_GOOD", productId: "p9", productName: "FG_GC — Green Concentrate",
    qtyRequested: 50, uom: "KG", purpose: "Uji palatabilitas formula GC baru pada sapi laktasi",
    experimentId: "exp2", status: "FULFILLED", approvedBy: "System (under pagu)",
    createdAt: "2026-01-22", fulfilledAt: "2026-01-23", estimatedValue: 175000,
  },
  {
    id: "rsr3", requestNumber: "RND-2026-003", requesterId: "u7", requesterName: "Rina Peneliti",
    materialType: "RAW_WET", productId: "p1", productName: "DM_CPTN1 — Crude Protein (Basah)",
    qtyRequested: 100, uom: "KG", purpose: "Pengukuran kadar air dan shrinkage rate batch baru",
    experimentId: "exp3", status: "APPROVED", approvedBy: "System (under pagu)",
    createdAt: "2026-02-20", estimatedValue: 100000,
  },
  {
    id: "rsr4", requestNumber: "RND-2026-004", requesterId: "u7", requesterName: "Rina Peneliti",
    materialType: "FINISHED_GOOD", productId: "p10", productName: "FG_PEL_C — Pellet Complete",
    qtyRequested: 30, uom: "KG", purpose: "Uji shelf-life pellet dalam kemasan baru",
    experimentId: "exp4", status: "PENDING",
    createdAt: "2026-03-01", estimatedValue: 50000,
  },
  {
    id: "rsr5", requestNumber: "RND-2026-005", requesterId: "u7", requesterName: "Rina Peneliti",
    materialType: "RAW_DRY", productId: "p2", productName: "DM_CFHP1 — Crude Fiber",
    qtyRequested: 15, uom: "KG", purpose: "Perbandingan crude fiber DM_CFHP1 vs DM_CPTN1",
    status: "REJECTED", approvedBy: "Ahmad Fauzi",
    createdAt: "2026-02-05", estimatedValue: 37500,
  },
];

export const rndExperiments: RndExperiment[] = [
  {
    id: "exp1", experimentCode: "EXP-2026-001",
    title: "Analisis Crude Protein DM_CPTN1 Batch Baru",
    objective: "Mengukur kadar crude protein pada DM_CPTN1 dari batch BATCH-CPTN1-001 untuk validasi kualitas pakan",
    startDate: "2026-01-16", endDate: "2026-01-30",
    status: "COMPLETED", leadResearcher: "Rina Peneliti",
    sampleRequestIds: ["rsr1"],
    findings: "Crude protein 24.8% — sedikit di bawah target 25% tapi masih dalam toleransi. Tannin 0.58 ppm, aman.",
    attachmentCount: 3,
  },
  {
    id: "exp2", experimentCode: "EXP-2026-002",
    title: "Uji Palatabilitas Green Concentrate Formula V2",
    objective: "Menguji apakah formula GC V2 lebih disukai sapi laktasi dibanding V1",
    startDate: "2026-01-23", endDate: "2026-02-15",
    status: "COMPLETED", leadResearcher: "Rina Peneliti",
    sampleRequestIds: ["rsr2"],
    findings: "Tingkat konsumsi meningkat 12% dibanding V1. Sapi rata-rata menghabiskan 95% porsi dalam 30 menit.",
    attachmentCount: 5,
  },
  {
    id: "exp3", experimentCode: "EXP-2026-003",
    title: "Pengukuran Shrinkage Rate DM_CPTN1 Basah→Kering",
    objective: "Mengukur persentase penyusutan bobot DM_CPTN1 dari kondisi basah ke kering pada berbagai metode pengeringan",
    startDate: "2026-02-22",
    status: "IN_PROGRESS", leadResearcher: "Rina Peneliti",
    sampleRequestIds: ["rsr3"],
    attachmentCount: 1,
  },
  {
    id: "exp4", experimentCode: "EXP-2026-004",
    title: "Shelf-Life Test Pellet Complete Kemasan Baru",
    objective: "Menguji daya simpan Pellet Complete dalam kemasan vacuum seal vs kemasan karung biasa",
    startDate: "2026-03-05",
    status: "PLANNED", leadResearcher: "Rina Peneliti",
    sampleRequestIds: ["rsr4"],
    attachmentCount: 0,
  },
];

export const rndTestResults: RndTestResult[] = [
  // EXP-001: Crude Protein analysis
  { id: "tr1", experimentId: "exp1", testType: "NUTRITIONAL", parameter: "Crude Protein", value: 24.8, unit: "%", benchmark: 25.0, passFail: true, notes: "Dalam toleransi ±1%", testedAt: "2026-01-25" },
  { id: "tr2", experimentId: "exp1", testType: "NUTRITIONAL", parameter: "Crude Fiber", value: 17.2, unit: "%", benchmark: 17.0, passFail: true, notes: "Sesuai standar", testedAt: "2026-01-25" },
  { id: "tr3", experimentId: "exp1", testType: "NUTRITIONAL", parameter: "Tannin Content", value: 0.58, unit: "ppm", benchmark: 0.6, passFail: true, notes: "Di bawah batas maks", testedAt: "2026-01-26" },
  { id: "tr4", experimentId: "exp1", testType: "NUTRITIONAL", parameter: "Moisture", value: 11.2, unit: "%", benchmark: 12.0, passFail: true, notes: "Kadar air normal", testedAt: "2026-01-26" },

  // EXP-002: Palatability test
  { id: "tr5", experimentId: "exp2", testType: "PALATABILITY", parameter: "Consumption Rate", value: 95, unit: "%", benchmark: 85, passFail: true, notes: "Sapi menghabiskan 95% porsi", testedAt: "2026-02-05" },
  { id: "tr6", experimentId: "exp2", testType: "PALATABILITY", parameter: "Avg Intake Time", value: 28, unit: "menit", benchmark: 30, passFail: true, notes: "Lebih cepat dari target", testedAt: "2026-02-05" },
  { id: "tr7", experimentId: "exp2", testType: "FIELD_TRIAL", parameter: "Milk Yield Change", value: 3.2, unit: "%", benchmark: 2.0, passFail: true, notes: "Kenaikan produksi susu signifikan", testedAt: "2026-02-12" },
  { id: "tr8", experimentId: "exp2", testType: "FIELD_TRIAL", parameter: "Body Weight Change", value: 0.8, unit: "kg/minggu", benchmark: 0.5, passFail: true, notes: "Pertambahan BB di atas target", testedAt: "2026-02-12" },

  // EXP-003: Shrinkage (in progress)
  { id: "tr9", experimentId: "exp3", testType: "NUTRITIONAL", parameter: "Moisture (Basah)", value: 72.5, unit: "%", benchmark: 75.0, passFail: true, notes: "Pengukuran awal", testedAt: "2026-02-25" },
  { id: "tr10", experimentId: "exp3", testType: "NUTRITIONAL", parameter: "Shrinkage Rate (Oven)", value: 22.3, unit: "%", benchmark: 25.0, passFail: true, notes: "Metode oven 60°C / 48 jam", testedAt: "2026-02-28" },
  { id: "tr11", experimentId: "exp3", testType: "NUTRITIONAL", parameter: "Shrinkage Rate (Matahari)", value: 28.1, unit: "%", benchmark: 25.0, passFail: false, notes: "Metode jemur matahari — loss terlalu tinggi", testedAt: "2026-02-28" },
];

// --- Depreciation / Stock Shrinkage ---
export type DepreciationStage = "FARM" | "INVENTORY" | "PRODUCTION";
export type DepreciationReason = "MOISTURE_LOSS" | "HANDLING_LOSS" | "SPOILAGE" | "PROCESSING_LOSS" | "MISSING" | "QUALITY_REJECT";

export interface DepreciationLog {
  id: string;
  date: string;
  stage: DepreciationStage;
  reason: DepreciationReason;
  productId: string;
  productName: string;
  initialQtyKg: number;
  lossQtyKg: number;
  lossPercent: number;
  reportedBy: string;
  notes: string;
  batchRef?: string;
}

export const depreciationReasonLabels: Record<DepreciationReason, string> = {
  MOISTURE_LOSS: "Moisture Loss",
  HANDLING_LOSS: "Handling Loss",
  SPOILAGE: "Spoilage / Rusak",
  PROCESSING_LOSS: "Processing Loss",
  MISSING: "Missing / Hilang",
  QUALITY_REJECT: "Quality Reject",
};

export const depreciationStageLabels: Record<DepreciationStage, string> = {
  FARM: "Farm → Gudang",
  INVENTORY: "Penyimpanan Gudang",
  PRODUCTION: "Proses Produksi",
};

export const depreciationLogs: DepreciationLog[] = [
  // Farm stage
  {
    id: "dep1", date: "2026-02-10", stage: "FARM", reason: "MOISTURE_LOSS",
    productId: "p1", productName: "DM_CPTN1 — Crude Protein", initialQtyKg: 1200, lossQtyKg: 96, lossPercent: 8.0,
    reportedBy: "Pak Darmo", notes: "Penurunan kadar air setelah penjemuran 3 hari, dari 65% ke 57% moisture",
    batchRef: "BATCH-IND-001",
  },
  {
    id: "dep2", date: "2026-02-12", stage: "FARM", reason: "HANDLING_LOSS",
    productId: "p2", productName: "DM_CPTN2 — CP 18%", initialQtyKg: 800, lossQtyKg: 24, lossPercent: 3.0,
    reportedBy: "Pak Darmo", notes: "Tercecer saat bongkar muat dari truk ke gudang penyimpanan",
    batchRef: "BATCH-PAK-002",
  },
  {
    id: "dep3", date: "2026-02-15", stage: "FARM", reason: "QUALITY_REJECT",
    productId: "p1", productName: "DM_CPTN1 — Crude Protein", initialQtyKg: 500, lossQtyKg: 35, lossPercent: 7.0,
    reportedBy: "Pak Darmo", notes: "Bagian bawah tumpukan terkena jamur karena kelembaban tinggi",
    batchRef: "BATCH-IND-001",
  },
  // Inventory stage
  {
    id: "dep4", date: "2026-02-18", stage: "INVENTORY", reason: "MOISTURE_LOSS",
    productId: "p3", productName: "DM_MOLS — Molase", initialQtyKg: 200, lossQtyKg: 6, lossPercent: 3.0,
    reportedBy: "Siti Rahma", notes: "Evaporasi alami selama penyimpanan 2 minggu di drum terbuka",
  },
  {
    id: "dep5", date: "2026-02-20", stage: "INVENTORY", reason: "SPOILAGE",
    productId: "p5", productName: "DM_CPCF1 — Crude Protein", initialQtyKg: 350, lossQtyKg: 28, lossPercent: 8.0,
    reportedBy: "Siti Rahma", notes: "Sebagian stok berjamur karena kebocoran atap gudang setelah hujan lebat",
  },
  {
    id: "dep6", date: "2026-02-22", stage: "INVENTORY", reason: "MISSING",
    productId: "p7", productName: "DM_KMSG — Kemasan 65x105", initialQtyKg: 50, lossQtyKg: 50, lossPercent: 100.0,
    reportedBy: "Siti Rahma", notes: "50 lembar kemasan tidak ditemukan saat stock opname — kemungkinan salah catat",
  },
  // Production stage
  {
    id: "dep7", date: "2026-02-25", stage: "PRODUCTION", reason: "PROCESSING_LOSS",
    productId: "p1", productName: "DM_CPTN1 — Crude Protein", initialQtyKg: 600, lossQtyKg: 30, lossPercent: 5.0,
    reportedBy: "Arif Operator", notes: "Material tersisa di mesin chopper dan mixer setelah batch selesai",
  },
  {
    id: "dep8", date: "2026-02-26", stage: "PRODUCTION", reason: "PROCESSING_LOSS",
    productId: "p2", productName: "DM_CPTN2 — CP 18%", initialQtyKg: 400, lossQtyKg: 16, lossPercent: 4.0,
    reportedBy: "Arif Operator", notes: "Sisa pellet hancur tidak memenuhi ukuran standar, dibuang",
  },
  {
    id: "dep9", date: "2026-03-01", stage: "PRODUCTION", reason: "QUALITY_REJECT",
    productId: "p1", productName: "DM_CPTN1 — Crude Protein", initialQtyKg: 300, lossQtyKg: 45, lossPercent: 15.0,
    reportedBy: "Arif Operator", notes: "Hasil mixing tidak homogen, kandungan CP di bawah standar 25% — harus dibuang",
  },
  {
    id: "dep10", date: "2026-03-03", stage: "FARM", reason: "MOISTURE_LOSS",
    productId: "p1", productName: "DM_CPTN1 — Crude Protein", initialQtyKg: 1500, lossQtyKg: 105, lossPercent: 7.0,
    reportedBy: "David Mnt", notes: "Penurunan berat setelah pengeringan batch ke-3 bulan ini",
    batchRef: "BATCH-IND-003",
  },
  {
    id: "dep11", date: "2026-03-05", stage: "INVENTORY", reason: "HANDLING_LOSS",
    productId: "p5", productName: "DM_CPCF1 — Crude Protein", initialQtyKg: 500, lossQtyKg: 10, lossPercent: 2.0,
    reportedBy: "Budi Setiawan", notes: "Tercecer saat pemindahan ke area produksi",
  },
  {
    id: "dep12", date: "2026-03-06", stage: "PRODUCTION", reason: "PROCESSING_LOSS",
    productId: "p3", productName: "DM_MOLS — Molase", initialQtyKg: 150, lossQtyKg: 8, lossPercent: 5.3,
    reportedBy: "Arif Operator", notes: "Sisa molase mengental di pipa mixer, sulit dibersihkan sepenuhnya",
  },
];

// --- Production Bag ID / Barcode per Karung ---
export type BagStatus = "IN_STOCK" | "SHIPPED" | "DELIVERED" | "COMPLAINT";

export interface ProductionBag {
  id: string;
  barcodeId: string; // e.g. HF-PR2026002-001
  productionRunId: string;
  productionRunNumber: string;
  productId: string;
  productName: string;
  weightKg: number;
  producedAt: string;
  status: BagStatus;
  deliveryTripId?: string;
  deliveryDoNumber?: string;
  customerName?: string;
  deliveredAt?: string;
  complaintNote?: string;
  qualityGrade?: "A" | "B" | "C";
}

// Role responsibilities for barcode feature:
// OPERATOR: generates barcodes after production (auto-created per karung)
// LOGISTICS: attaches bag IDs to surat jalan / delivery trip
// OWNER/FINANCE: lookup barcodes for complaint handling & traceability
// IT_OPS: monitoring all barcode data

export const productionBags: ProductionBag[] = [
  // PR-2026-002 (Green Concentrate, 1500 KG, 30 KG/karung = 50 karung)
  { id: "bag1", barcodeId: "HF-PR2026002-001", productionRunId: "pr2", productionRunNumber: "PR-2026-002", productId: "p9", productName: "FG_GC — Green Concentrate", weightKg: 30, producedAt: "2026-02-10", status: "DELIVERED", deliveryTripId: "dt2", deliveryDoNumber: "DO-2026-002", customerName: "Metro Customer", deliveredAt: "2026-02-15", qualityGrade: "A" },
  { id: "bag2", barcodeId: "HF-PR2026002-002", productionRunId: "pr2", productionRunNumber: "PR-2026-002", productId: "p9", productName: "FG_GC — Green Concentrate", weightKg: 30, producedAt: "2026-02-10", status: "DELIVERED", deliveryTripId: "dt2", deliveryDoNumber: "DO-2026-002", customerName: "Metro Customer", deliveredAt: "2026-02-15", qualityGrade: "A" },
  { id: "bag3", barcodeId: "HF-PR2026002-003", productionRunId: "pr2", productionRunNumber: "PR-2026-002", productId: "p9", productName: "FG_GC — Green Concentrate", weightKg: 30, producedAt: "2026-02-10", status: "COMPLAINT", deliveryTripId: "dt2", deliveryDoNumber: "DO-2026-002", customerName: "Metro Customer", deliveredAt: "2026-02-15", qualityGrade: "B", complaintNote: "Customer melaporkan sapi cenderung tidak mau makan — diduga kualitas batch ini kurang baik" },
  { id: "bag4", barcodeId: "HF-PR2026002-004", productionRunId: "pr2", productionRunNumber: "PR-2026-002", productId: "p9", productName: "FG_GC — Green Concentrate", weightKg: 30, producedAt: "2026-02-10", status: "DELIVERED", deliveryTripId: "dt2", deliveryDoNumber: "DO-2026-002", customerName: "Metro Customer", deliveredAt: "2026-02-15", qualityGrade: "A" },
  { id: "bag5", barcodeId: "HF-PR2026002-005", productionRunId: "pr2", productionRunNumber: "PR-2026-002", productId: "p9", productName: "FG_GC — Green Concentrate", weightKg: 30, producedAt: "2026-02-10", status: "IN_STOCK", qualityGrade: "A" },
  { id: "bag6", barcodeId: "HF-PR2026002-006", productionRunId: "pr2", productionRunNumber: "PR-2026-002", productId: "p9", productName: "FG_GC — Green Concentrate", weightKg: 30, producedAt: "2026-02-10", status: "IN_STOCK", qualityGrade: "A" },
  { id: "bag7", barcodeId: "HF-PR2026002-007", productionRunId: "pr2", productionRunNumber: "PR-2026-002", productId: "p9", productName: "FG_GC — Green Concentrate", weightKg: 30, producedAt: "2026-02-10", status: "SHIPPED", deliveryTripId: "dt3", deliveryDoNumber: "DO-2026-003", customerName: "Bandung Customer", qualityGrade: "A" },

  // PR-2026-003 (Pellet Complete, 500 KG, 25 KG/karung = 20 karung)
  { id: "bag8", barcodeId: "HF-PR2026003-001", productionRunId: "pr3", productionRunNumber: "PR-2026-003", productId: "p10", productName: "FG_PEL_C — Pellet Complete", weightKg: 25, producedAt: "2026-02-19", status: "DELIVERED", deliveryTripId: "dt3", deliveryDoNumber: "DO-2026-003", customerName: "Bandung Customer", deliveredAt: "2026-02-22", qualityGrade: "A" },
  { id: "bag9", barcodeId: "HF-PR2026003-002", productionRunId: "pr3", productionRunNumber: "PR-2026-003", productId: "p10", productName: "FG_PEL_C — Pellet Complete", weightKg: 25, producedAt: "2026-02-19", status: "DELIVERED", deliveryTripId: "dt3", deliveryDoNumber: "DO-2026-003", customerName: "Bandung Customer", deliveredAt: "2026-02-22", qualityGrade: "A" },
  { id: "bag10", barcodeId: "HF-PR2026003-003", productionRunId: "pr3", productionRunNumber: "PR-2026-003", productId: "p10", productName: "FG_PEL_C — Pellet Complete", weightKg: 25, producedAt: "2026-02-19", status: "IN_STOCK", qualityGrade: "A" },
  { id: "bag11", barcodeId: "HF-PR2026003-004", productionRunId: "pr3", productionRunNumber: "PR-2026-003", productId: "p10", productName: "FG_PEL_C — Pellet Complete", weightKg: 25, producedAt: "2026-02-19", status: "IN_STOCK", qualityGrade: "B" },
  { id: "bag12", barcodeId: "HF-PR2026003-005", productionRunId: "pr3", productionRunNumber: "PR-2026-003", productId: "p10", productName: "FG_PEL_C — Pellet Complete", weightKg: 25, producedAt: "2026-02-19", status: "COMPLAINT", customerName: "Bandung Customer", deliveryTripId: "dt3", deliveryDoNumber: "DO-2026-003", deliveredAt: "2026-02-22", qualityGrade: "C", complaintNote: "Customer klaim ternak penurunan berat badan — perlu verifikasi apakah karung ini penyebab atau faktor lain" },

  // PR-2026-001 (Silase Pure, 1000 KG, bulk — 40 KG bags = 25 karung)
  { id: "bag13", barcodeId: "HF-PR2026001-001", productionRunId: "pr1", productionRunNumber: "PR-2026-001", productId: "p13", productName: "FG_SIL_PUR — Silase Pure", weightKg: 40, producedAt: "2026-01-20", status: "DELIVERED", deliveryTripId: "dt1", deliveryDoNumber: "DO-2026-001", customerName: "Karya Langit Bumi Permaculture", deliveredAt: "2026-02-11", qualityGrade: "A" },
  { id: "bag14", barcodeId: "HF-PR2026001-002", productionRunId: "pr1", productionRunNumber: "PR-2026-001", productId: "p13", productName: "FG_SIL_PUR — Silase Pure", weightKg: 40, producedAt: "2026-01-20", status: "DELIVERED", deliveryTripId: "dt1", deliveryDoNumber: "DO-2026-001", customerName: "Karya Langit Bumi Permaculture", deliveredAt: "2026-02-11", qualityGrade: "A" },
  { id: "bag15", barcodeId: "HF-PR2026001-003", productionRunId: "pr1", productionRunNumber: "PR-2026-001", productId: "p13", productName: "FG_SIL_PUR — Silase Pure", weightKg: 40, producedAt: "2026-01-20", status: "IN_STOCK", qualityGrade: "A" },
];
