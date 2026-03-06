# Product Requirements Document (PRD) v3.0
## HiFeed Supply Chain Operations Management (SCOM)

**Versi**: 3.0 — Updated 6 Maret 2026
**Penulis**: Fendy Irfan (Tech Lead)
**Reviewer**: Ihsan (Owner/Director), Dania (Finance), Arif (Agronomis)
**Status**: Active — Backend Integrated

---

> [!IMPORTANT]
> Dokumen ini adalah **update major** dari PRD v2.0 → v3.0. Sistem telah diintegrasikan dengan backend (Django + PostgreSQL + Google SSO). Semua modul yang tercantum sudah **fully implemented dan production-ready**.

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Struktur Role & Access Matrix](#2-struktur-role--access-matrix)
3. [Dashboard & Data Segmentation](#3-dashboard--data-segmentation)
4. [Standardisasi Penamaan & Kodifikasi](#4-standardisasi-penamaan--kodifikasi)
5. [Modul Procurement](#5-modul-procurement--strategic-sourcing)
6. [Modul Inventory & Depreciation](#6-modul-inventory--depreciation)
7. [Modul Farm Management](#7-modul-farm-management)
8. [Modul Production, Target & Barcode](#8-modul-production-target--barcode)
9. [Modul R&D](#9-modul-rd-research--development)
10. [Modul Logistics](#10-modul-logistics--distribution)
11. [Modul Sales / POS](#11-modul-sales--pos)
12. [Modul IT Admin](#12-modul-it-admin)
13. [Traceability & Supply Chain](#13-traceability--supply-chain)
14. [Data Architecture & ERD](#14-data-architecture--erd)
15. [Technical Architecture](#15-technical-architecture)
16. [Implementation Roadmap](#16-implementation-roadmap)

---

## 1. Ringkasan Eksekutif

HiFeed SCOM adalah portal internal untuk mengelola seluruh rantai pasok operasional HiFeed: dari pembelian bahan baku (Procurement), pengelolaan lahan (Farm), produksi pakan (Production), hingga pengiriman ke customer (Logistics) dan penjualan (Sales/POS). Sistem ini dibangun dengan prinsip **full traceability** — setiap karung produk dapat dilacak ke batch, supplier, dan lahan asalnya melalui barcode unik.

### Scope Modul (10 Modul)

| # | Modul | Deskripsi |
|---|---|---|
| 1 | **Dashboard** | KPI overview (role-based), Charts, Alerts, Supply Chain, Batch Tracking |
| 2 | **Procurement** | PO, GRN, Approval multi-layer, Term of Payment |
| 3 | **Inventory** | 3-cluster stock (RM, FG, Trading), Stock Ledger, Opname, **Barang Keluar (Movement Flagging)**, **Depreciation Tracking** |
| 4 | **Farm Management** | **Land/Area Mapping**, Batch planting, Daily Log, Mortality tracking, Harvest |
| 5 | **Production** | BOM, Production Run, **Monthly Targets**, **Barcode per Karung**, IoT mesin |
| 6 | **R&D** | Sample request, Experiment tracking, Test results, Budget/pagu control |
| 7 | **Logistics** | Delivery Trip, POD upload |
| 8 | **Sales / POS** | Feed Orders (produk jadi), Trading Commodities |
| 9 | **IT Admin** | Product Kodifikasi, User Management, Data Export, System Settings, Audit Log |
| 10 | **Traceability** | Supply Chain visualization, Batch Tracking (terintegrasi di Dashboard) |

---

## 2. Struktur Role & Access Matrix

> [!WARNING]
> Role disesuaikan dengan **struktur organisasi aktual** HiFeed. Penamaan role harus sesuai jabatan yang ada.

### 2.1 Daftar Role (8 Role)

| Role | Deskripsi Jabatan | Login |
|---|---|---|
| **Owner / Director** | Super Admin, approval transaksi >50 juta, set target produksi | SSO @hifeed.co |
| **IT Ops** | Backend infrastructure, security, system monitoring | SSO @hifeed.co |
| **Treasury / Finance** | Approval pembayaran, validasi costing, audit stok | SSO @hifeed.co |
| **Agronomist (Farm Manager)** | Input daily log, batch management, harvest | SSO @hifeed.co |
| **Production Operator** | Input produksi, BOM, generate barcode, mesin | SSO @hifeed.co |
| **R&D** | Request sampel, input eksperimen, test result | SSO @hifeed.co |
| **Logistics** | Delivery trip, POD, attach barcode ke surat jalan | SSO @hifeed.co |
| **Sales** | Input order feed, trading komoditas, follow up customer | SSO @hifeed.co |

### 2.2 Access Matrix

| Modul | Owner | IT Ops | Finance | Farm Mgr | Operator | R&D | Logistics | Sales |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Procurement | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Inventory | ✅ | ❌ | ✅ | 👁️ | 👁️ | 👁️ | 👁️ | ✅ |
| Farm | ✅ | ❌ | ❌ | ✅ | ❌ | 👁️ | ❌ | ❌ |
| Production | ✅ | ❌ | ❌ | ❌ | ✅ | 👁️ | ❌ | ❌ |
| R&D | ✅ | ❌ | 👁️ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Logistics | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Sales / POS | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| IT Admin | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Traceability | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

> ✅ = Full Access, 👁️ = View Only, ❌ = No Access

### 2.3 Segregation of Duties

- **IT Ops** memiliki akses ke backend/infra dan IT Admin module, tetapi **TIDAK** memiliki akses ke modul operasional bisnis (Procurement, Inventory, Sales, dll).
- **Owner** bisa meng-override approval Treasury jika Treasury berhalangan (backup approval).
- **Sales** punya akses ke Procurement (membuat PO), Inventory (lihat stok), dan Logistics (track pengiriman).
- Dashboard menampilkan **data berbeda per role** (lihat Section 3 — Dashboard Segmentation).

---

## 3. Dashboard & Data Segmentation

> [!IMPORTANT]
> Dashboard menampilkan data yang relevan per role. Owner & IT Ops melihat semua data. Role lain hanya melihat data yang relevan dengan tanggung jawabnya.

### 3.1 Stat Cards (KPI Utama) — Per Role

| KPI Card | Owner | Finance | Sales | Farm Mgr | Operator | Logistics | R&D | IT Ops |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Total Inventory Value | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Active Batches | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Pending PO | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Active Trips | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Revenue (Month) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Production Output | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| R&D Budget Usage | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Depreciation (Month) | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |

### 3.2 Performance Metrics — Per Role

| Metric | Owner | Finance | Sales | Farm Mgr | Operator | Logistics | R&D | IT Ops |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Avg Mortality | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Production (Month) | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Labor Efficiency | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Avg Cost/Trip | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| GP Margin | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Overdue Invoices | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 3.3 Charts — Per Role

| Chart | Visible To |
|---|---|
| Hasil Panen (KG) — Area chart | Owner, IT Ops, Farm Manager, R&D |
| Produksi vs Target (KG) — Bar chart | Owner, IT Ops, Operator |

### 3.4 Alerts — Per Module

Setiap alert di-tag dengan `module` (farm, procurement, inventory, production, logistics, sales, rnd). Alert hanya ditampilkan ke role yang relevaan:

| Alert Module | Visible To |
|---|---|
| `farm` | Owner, IT Ops, Farm Manager, R&D |
| `procurement` | Owner, IT Ops, Finance, Sales |
| `inventory` | Owner, IT Ops, Finance, Sales, Operator |
| `production` | Owner, IT Ops, Operator |
| `logistics` | Owner, IT Ops, Logistics, Sales |
| `sales` | Owner, IT Ops, Finance, Sales |
| `rnd` | Owner, IT Ops, Finance, R&D |

### 3.5 Dashboard Sub-Menu

Dashboard module berisi 3 sub-page:

| Page | Path | Deskripsi |
|---|---|---|
| **Overview** | `/dashboard` | KPI cards, charts, metrics, alerts |
| **Supply Chain** | `/traceability` | Visualisasi supply chain end-to-end |
| **Batch Tracking** | `/traceability/batch` | Lacak journey per batch dari farm ke customer |

---

## 4. Standardisasi Penamaan & Kodifikasi

> [!CAUTION]
> Penamaan bahan baku (Indigofera, Pakchong, dll) **TIDAK BOLEH** ditampilkan secara verbal/tekstual di sistem. Informasi ini merupakan **trade secret** HiFeed.

### 4.1 Tiga Layer Kodifikasi

| Layer | Tujuan | Contoh | Digunakan oleh | Dikelola di |
|---|---|---|---|---|
| **Internal Code** | Identifikasi bahan di dalam sistem | `DM_CPTN1` | Tim Internal | IT Admin - Kodifikasi |
| **External Code** | Komunikasi ke investor, publik | `RM 1: Crude Protein 25%` | BD, Investor | IT Admin - Kodifikasi |
| **Secret Name** | Nama asli (di-mask di UI) | `Indigofera mash` | Owner & IT Ops only | IT Admin - Kodifikasi |

### 4.2 Master Data Kodifikasi

| Code (Internal) | External Code | Cluster |
|---|---|---|
| `DM_CPTN1` | RM 1: crude protein 25%, crude fiber 17% | RAW_MATERIAL |
| `DM_CPTN2` | RM 2: crude protein 18%, crude fiber 22% | RAW_MATERIAL |
| `DM_MOLS` | RM 3: molase sugar content 60% | RAW_MATERIAL |
| `DM_GE1` | RM 5: gross energy 3500 kkal | RAW_MATERIAL |
| `DM_BKKO` | RM 3: crude protein 15%, crude fiber 20% | RAW_MATERIAL |
| `DM_CPRUP1` | RM 4: crude protein 28% crude fat 11% | RAW_MATERIAL |
| `FG_GC` | Green Concentrate | FINISHED_GOOD |
| `FG_PEL_C` | Pellet Complete | FINISHED_GOOD |
| `FG_PEL_GC` | Pellet GC | FINISHED_GOOD |
| `FG_SIL_MIX` | Silase Mix | FINISHED_GOOD |
| `FG_SIL_PUR` | Silase Pure | FINISHED_GOOD |

### 4.3 Implementasi Kodifikasi

- **Halaman IT Admin → Product Kodifikasi**: IT Admin mengelola mapping kode internal ↔ external ↔ secret name
- **Form input di seluruh modul**: User memilih produk dari dropdown menggunakan internal code
- **Data Export**: Saat export untuk investor, kode internal otomatis diterjemahkan ke kode external
- **Validasi**: Jika user menambahkan produk yang belum ada di master kodifikasi → sistem menampilkan **error "Mapping belum tersedia di IT Admin"**

---

## 5. Modul Procurement & Strategic Sourcing

### 5.1 Purchase Order (PO)

#### Status Enum PO

| Status | Definisi | Trigger |
|---|---|---|
| `DRAFT` | PO sudah diisi tapi belum disubmit | User save form |
| `PENDING_APPROVAL` | PO sudah submit, menunggu approval | User klik Submit |
| `APPROVED` | PO disetujui oleh approver | Approver klik Approve |
| `REJECTED` | PO ditolak oleh approver | Approver klik Reject + alasan |
| `PARTIAL_RECEIVED` | Sebagian barang sudah diterima | GRN partial created |
| `COMPLETED` | Seluruh barang sudah diterima | GRN final created |
| `CANCELLED` | PO dibatalkan | User/Approver cancel |

#### Field PO

| Field | Tipe | Keterangan |
|---|---|---|
| `po_number` | String | Auto-generated (PO-2026-XXXX) |
| `vendor_id` | FK | Referensi ke Master Vendor |
| `department` | String | Auto-set berdasarkan role (Ops, Farm, Sales, dll) |
| `items` | Array | Produk, **volume** (KG/unit), harga satuan |
| `total_amount` | Decimal | Total nilai PO |
| `order_date` | Date | Tanggal pemesanan |
| `expected_arrival_date` | Date | Tanggal kedatangan barang |
| `payment_due_date` | Date | Tanggal jatuh tempo pembayaran |
| `term_of_payment` | String | TOP (Net 30, COD, H+3, dll) |
| `status` | Enum | Status PO |
| `created_by` | FK | User yang membuat |
| `approved_by` | FK | User yang meng-approve |
| `approved_at` | Timestamp | Waktu approval |

### 5.2 Sistem Approval Multi-Layer

> [!IMPORTANT]
> **Batas materialitas Rp 50.000.000**
> - Transaksi **≤ Rp 50 juta**: Cukup 1 layer approval (Treasury **ATAU** Owner)
> - Transaksi **> Rp 50 juta**: Wajib 2 layer approval (Treasury **DAN** Owner)

```mermaid
flowchart TD
    A["User Create PO"] --> B["Submit PO"]
    B --> C{"Total > 50 Juta?"}
    C -->|"≤ 50 Juta"| D["Treasury ATAU Owner Approval"]
    C -->|"> 50 Juta"| E["Treasury Approval"]
    E --> F["Owner Approval"]
    D --> G["PO Approved ✅"]
    F --> G
    D -->|Reject| H["PO Rejected ❌"]
    E -->|Reject| H
    F -->|Reject| H
```

### 5.3 Goods Receipt Note (GRN)

- Input manual berat timbangan saat menerima barang
- Wajib upload foto bukti timbangan
- Angka timbangan yang **berbeda** dari expected quantity → selisih otomatis dicatat sebagai **Depreciation** (stage: FARM)
- Partial receiving: sistem otomatis update status PO → `PARTIAL_RECEIVED`

### 5.4 Siapa Bisa Membuat PO

| Role | Department Label |
|---|---|
| Owner | Operations |
| Finance | Finance |
| Farm Manager | Farm |
| Operator | Production |
| R&D | R&D |
| Sales | Sales |

---

## 6. Modul Inventory & Depreciation

### 6.1 Tiga Cluster Inventory

| Cluster | Deskripsi | Contoh |
|---|---|---|
| **Raw Material** | Bahan baku untuk produksi feed | DM_CPTN1, DM_MOLS, DM_BKKO |
| **Finished Goods** | Barang jadi hasil produksi | FG_GC, FG_PEL_C, FG_SIL_MIX |
| **Trading Goods** | Barang beli-putus, tidak masuk produksi | Kemasan (PKG_KRG_65, PKG_KRG_59) |

### 6.2 Stock Opname

- User memilih produk → input jumlah fisik (KG)
- Sistem otomatis menghitung selisih vs jumlah di database
- Jika ada selisih → wajib input **alasan variance**
- Selisih negatif otomatis dicatat ke **Depreciation Log** (stage: INVENTORY)

### 6.3 Depreciation / Stock Shrinkage Tracking

> [!IMPORTANT]
> Depreciation tracking mengagregasi penyusutan dari 3 sumber data:
> - **GRN** (qty expected vs qty actual) → Farm stage
> - **Stock Opname** (qty sistem vs qty fisik) → Inventory stage
> - **Production Result** (BOM input vs output qty) → Production stage

#### Depreciation Reasons (6 Kategori)

| Kategori | Deskripsi | Terjadi di Stage |
|---|---|---|
| **Moisture Loss** | Penurunan berat karena penguapan kadar air | Farm, Inventory |
| **Handling Loss** | Tercecer saat bongkar muat / pemindahan | Farm, Inventory |
| **Spoilage** | Rusak karena jamur, hama, penyimpanan buruk | Inventory |
| **Processing Loss** | Material tersisa di mesin, sisa produksi tidak layak | Production |
| **Missing** | Hilang, tidak bisa dipertanggungjawabkan | Any stage |
| **Quality Reject** | Tidak memenuhi standar kualitas, harus dibuang | Production |

#### Depreciation Log Fields

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | PK |
| `date` | Date | Tanggal kejadian |
| `stage` | Enum | `FARM`, `INVENTORY`, `PRODUCTION` |
| `reason` | Enum | 6 kategori di atas |
| `product_id` | FK | Produk yang menyusut |
| `initial_qty_kg` | Decimal | Berat awal |
| `loss_qty_kg` | Decimal | Berat yang hilang |
| `loss_percent` | Decimal | Persentase penyusutan |
| `reported_by` | FK | User yang melaporkan (auto dari login) |
| `notes` | Text | Keterangan detail |
| `batch_ref` | String | Referensi batch (optional) |

#### Siapa Input Depreciation?

| Stage | Diinput oleh | Di halaman mana |
|---|---|---|
| Farm → Gudang | Farm Manager | `/procurement/grn` — variance saat terima barang |
| Penyimpanan Gudang | Inventory Staff | `/inventory/opname` — selisih saat stock opname |
| Proses Produksi | Operator | `/production/result` — BOM vs output |

#### Dashboard Depreciation

Halaman `/inventory/depreciation` menampilkan:
- **4 stat cards**: Total Loss KG, Avg Shrinkage %, Total Events, Top Reason
- **Stage breakdown**: berapa KG loss di Farm vs Inventory vs Production (progress bar)
- **Reason breakdown**: grid 6 kategori dengan jumlah KG dan event count
- **Filterable table**: semua depreciation log, filter by stage & reason

### 6.4 Inventory Movement Flagging (Barang Keluar)

> [!IMPORTANT]
> Setiap barang yang keluar dari gudang **WAJIB** di-flag dengan kategori. Halaman: `/inventory/movement`.

| Flag | Deskripsi | Akun Accounting |
|---|---|---|
| `SALES` | Penjualan reguler | Revenue / AR |
| `MARKETING_SAMPLE` | Sampel ke customer potensial | Sales & Marketing Expense |
| `RND_SAMPLE` | Sampel untuk R&D (max 2% inventory) | R&D Expense |
| `WAREHOUSE_TRANSFER` | Pindah gudang (titip barang) | Tidak mengurangi valuasi |
| `DEFECT` | Barang rusak/spoilage (wajib upload foto bukti) | Write-off / Loss |
| `RETURN` | Retur dari customer | Reverse Revenue |

#### Hard Lock / Sistem Limitasi Sampel

> [!CAUTION]
> Jika akumulasi sampel melebihi pagu, form submission **di-block** oleh sistem (hard lock). User tidak bisa submit kecuali minta approval Owner.

| Jenis Sampel | Batas | Cara Hitung |
|---|---|---|
| **Marketing Sample** | Max **100 KG** total per periode | Sum of all MARKETING_SAMPLE movements |
| **R&D Sample** | Max **2%** dari total inventory value | Sum value of RND_SAMPLE vs 2% × Total Inventory Value |

#### Halaman Barang Keluar (`/inventory/movement`)

- **Progress bar pagu** — visual sisa kuota Marketing Sample (KG) dan R&D Sample (value) real-time
- **6 flag breakdown cards** — jumlah KG dan event count per kategori
- **Form inline** — pilih flag, produk, qty, destination, alasan → submit
- **Hard lock validation** — jika Marketing Sample > 100 KG atau R&D > 2% → error merah 🔒, form di-block
- **Log table** — semua movement tercatat dengan flag, akun accounting, dan alasan

### 6.5 Inventory Valuation — Weighted Average

```
Harga Per Unit = Total Nilai Pembelian / Total Volume (KG)
```

Label **"Items"** di form PO telah distandarisasi menjadi **"Volume"** agar konsisten dengan working sheet tim Accounting.

Harus sinkron dengan working paper Accounting.

---

## 7. Modul Farm Management

### 7.1 Land / Area Mapping

> [!IMPORTANT]
> Tim Farm mendaftarkan semua lahan beserta luasnya di halaman `/farm/lands`. Setiap batch tanam baru akan **memilih lahan mana** yang dipakai.

#### Field Lahan

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | PK |
| `name` | String | Nama lahan (misal: "Lahan Canggu A") |
| `location` | String | Lokasi geografis |
| `area_sq_m` | Decimal | Luas dalam meter persegi |
| `area_ha` | Decimal | Luas dalam hektar |
| `soil_type` | String | Jenis tanah (Latosol, Andosol, dll) |
| `water_source` | String | Sumber air (Irigasi, Tadah Hujan, Sungai) |
| `status` | Enum | `ACTIVE`, `RESTING`, `PREPARATION` |
| `current_batch_id` | FK (nullable) | Batch tanam yang sedang aktif di lahan ini |
| `notes` | Text | Catatan lahan |

#### Status Lahan

| Status | Deskripsi |
|---|---|
| **Active** | Ada batch tanam yang sedang berjalan |
| **Resting** | Lahan istirahat setelah panen (pemulihan tanah) |
| **Preparation** | Lahan baru sedang disiapkan (pembersihan, pupuk dasar) |

#### Halaman Lands (`/farm/lands`)

- **4 stat cards**: Total Lahan, Total Area (Ha), Lahan Active, Batch Aktif
- **Land cards**: setiap lahan menampilkan area (Ha + m²), jenis tanah, sumber air, status, batch aktif
- **Link ke batch**: jika ada batch aktif, menampilkan batch code, product, dan HST

### 7.2 Batch Management

- Setiap penanaman = 1 **Batch ID** unik
- Batch harus **memilih lahan** dari daftar lahan yang tersedia saat dibuat
- Batch melacak: lokasi, tanggal tanam, initial qty, current qty, HST (Hari Setelah Tanam)
- QR Code fisik tahan air ditempel di lahan

### 7.3 Daily Log

Input harian oleh Agronomist:
- Jumlah kematian tanaman (mortality count)
- Jumlah tenaga kerja + total jam kerja
- Catatan aktivitas (pemupukan, penyiraman, dll)

### 7.4 Mortality Rate vs Depreciation

| Konsep | Terjadi di mana | Definisi |
|---|---|---|
| **Mortality Rate** | 🌱 Farm (sebelum panen) | Tanaman yang mati di lahan. Dicatat di Daily Log |
| **Depreciation** | 📦🏭 Inventory & Production | Penyusutan bobot. Dicatat otomatis dari GRN/Opname/Production |

### 7.5 Replanting Rules

> [!CAUTION]
> Replanting pada lahan yang ada tanaman mati **HARUS** dibuat sebagai **Batch Baru**, BUKAN dicampur di batch yang sama.

---

## 8. Modul Production, Target & Barcode

### 8.1 Production Run

| Field | Keterangan |
|---|---|
| `run_number` | Auto-generated (PR-2026-XXX) |
| BOM (Bill of Materials) | Resep produksi per produk jadi |
| Output Product | Produk jadi (Green Concentrate, Pellet, Silase, dll) |
| Output Qty + UoM | Jumlah hasil produksi (KG) |
| Start/End Time | Jam mulai & selesai |
| Operator Count | Jumlah tenaga kerja |
| Machine ID | Mesin yang digunakan |
| Shift Code | Shift kerja (PAGI, SIANG, MALAM) |

### 8.2 Production Target (Monthly)

> [!IMPORTANT]
> **Hanya Owner yang bisa set target produksi bulanan.** Operator dan role lain hanya bisa melihat progress.

- **Dikelola di**: `/production/plan`
- **Di-set oleh**: Owner
- **Granularity**: Per produk jadi per bulan (KG)
- **Tampilan**:
  - **Overall progress bar** — total actual vs total target (warna: merah <40%, kuning <70%, biru <100%, hijau ≥100%)
  - **Per-product progress** — setiap finished good punya progress bar sendiri
  - Badge "🔒 Only Owner can edit" untuk non-Owner
- **Dashboard chart** "Produksi vs Target" otomatis membandingkan actual dari Production Result vs target

### 8.3 Barcode / Production ID per Karung

> [!IMPORTANT]
> Setiap karung produk jadi **WAJIB** memiliki barcode ID unik. Tujuan: traceability penuh dan anti false claim.

#### Format Barcode
```
HF-[PRODUCTION_RUN_NUMBER]-[SERIAL_3_DIGIT]
Contoh: HF-PR2026002-003
```

#### Bag Data Fields

| Field | Tipe | Keterangan |
|---|---|---|
| `barcode_id` | String (Unique) | ID per karung, auto-generated |
| `production_run_id` | FK | Link ke production run |
| `product_id` | FK | Produk jadi |
| `weight_kg` | Decimal | Berat per karung |
| `produced_at` | Date | Tanggal produksi |
| `quality_grade` | Enum | `A`, `B`, `C` |
| `status` | Enum | `IN_STOCK`, `SHIPPED`, `DELIVERED`, `COMPLAINT` |
| `delivery_trip_id` | FK | Link ke surat jalan (jika sudah dikirim) |
| `customer_name` | String | Customer tujuan |
| `complaint_note` | Text | Catatan komplain (jika ada) |

#### Status Flow per Karung

```mermaid
flowchart LR
    A["Produksi Selesai"] --> B["IN_STOCK"]
    B --> C["SHIPPED"]
    C --> D["DELIVERED"]
    D --> E["COMPLAINT"]
    E --> F["Investigate → Verify"]
```

#### Role Responsibilities — Barcode

| Role | Tanggung Jawab |
|---|---|
| **Operator** | Generate barcode ID otomatis setelah produksi selesai (1 barcode per karung) |
| **Logistics** | Attach barcode ID ke surat jalan (DO) — scan karung saat loading truk |
| **Owner / Finance** | Lookup barcode saat ada complaint customer — verifikasi klaim valid atau false claim |
| **IT Ops** | Monitoring semua barcode data |

#### Complaint Handling Flow

```
Customer komplain → Minta barcode/nomor karung
    → Owner/Finance scan di /production/barcode
    → Keluar detail: batch bahan baku, BOM, tanggal produksi, mesin, shift
    → Verifikasi: apakah klaim valid?
    → Jika valid → flag karung sebagai COMPLAINT + catat notes
    → Jika false claim → tolak dengan bukti data
```

#### Barcode Lookup Page (`/production/barcode`)

- **Scan input** — ketik/scan barcode → lihat detail lengkap
- **Journey timeline** — visual Farm → Produksi → Karung → Kirim → Customer
- **Detail grid** — product, weight, machine, shift, BOM, tanggal
- **Complaint alert** — merah jika ada complaint aktif
- **Filterable table** — semua karung, filter by status
- **Stats** — total karung, in stock, shipped, delivered, complaints

### 8.4 IoT Integration

| Data Stream | Sumber | Penggunaan |
|---|---|---|
| Jam nyala mesin | Sensor power | Hitung durasi operasi riil |
| Temperatur mesin | Thermostat | Alert overheat, preventive maintenance |
| Konsumsi daya (KWH) | HP × jam × tarif PLN | Biaya listrik per production run |

---

## 9. Modul R&D (Research & Development)

### 9.1 Sample Request Workflow

Tim R&D **langsung request** material dari inventory selama masih **di bawah pagu** (max 2% inventory value). Jika melebihi → butuh approval Owner.

```mermaid
flowchart TD
    A["R&D Request Material"] --> B{"Under 2% limit?"}
    B -->|"Under limit"| C["Auto-Approved ✅ — langsung ambil"]
    B -->|"Over limit"| D["Butuh Approval Owner ⚠️"]
    D -->|Approved| E["Inventory Deducted"]
    D -->|Rejected| F["Request Ditolak ❌"]
    C --> E
```

### 9.2 Experiment Tracking

| Field | Tipe | Keterangan |
|---|---|---|
| `experiment_id` | String | Auto-generated (EXP-2026-XXX) |
| `title` | String | Judul eksperimen |
| `objective` | Text | Tujuan riset |
| `start_date / end_date` | Date | Periode |
| `status` | Enum | `PLANNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `materials_used` | Array | List sample request yang dipakai |
| `findings` | Text | Kesimpulan / temuan |

### 9.3 Test Results

| Field | Tipe | Keterangan |
|---|---|---|
| `test_type` | Enum | `NUTRITIONAL`, `PALATABILITY`, `SHELF_LIFE`, `FIELD_TRIAL` |
| `parameter` | String | Misal: Crude Protein %, Moisture % |
| `value` | Decimal | Hasil pengukuran |
| `benchmark` | Decimal | Nilai standar / target |
| `pass_fail` | Boolean | Lolos atau tidak |

---

## 10. Modul Logistics & Distribution

### 10.1 Delivery Trip

- Pengiriman menggunakan **truk vendor** (belum punya armada sendiri)
- Trip cost: bensin, tol, uang makan, dll
- Item per trip terlink ke production run dan barcode ID karung

### 10.2 Proof of Delivery (POD)

- Upload foto surat jalan sebagai bukti pengiriman
- File disimpan di cloud storage
- Status trip berubah ke `DELIVERED` setelah POD diupload

### 10.3 Delivery Trip Fields

| Field | Tipe | Keterangan |
|---|---|---|
| `do_number` | String | Nomor Delivery Order |
| `customer_name` | String | Tujuan pengiriman |
| `driver_name` | String | Nama driver |
| `vehicle_plate` | String | Nomor plat kendaraan |
| `trip_cost` | Decimal | Total biaya pengiriman |
| `status` | Enum | `LOADING`, `ON_THE_WAY`, `DELIVERED` |
| `items` | Array | List produk + qty + barcode ID karung |
| `pod_url` | String | URL bukti surat jalan |

---

## 11. Modul Sales / POS

### 11.1 Feed Orders (Produk Jadi Feed)

Halaman `/sales/feed` untuk tracking penjualan produk pakan jadi. Mencakup >30 field:

| Kategori | Fields |
|---|---|
| **Order Info** | ETA Month, Status, Order ID, Lead ID |
| **Customer** | Leads Name, Alamat Kirim, No. HP, Kabupaten, Kecamatan |
| **Product** | SKU, Qty Order (KG), Selling Price/kg, Total Price |
| **Fulfillment** | Fulfillment Type, PIC Sales, PIC Procurement |
| **Supplier** | Lead ID Supplier, Supplier Name, Supply ID, Supplier Area |
| **Cost** | RM Cost/kg, Logistic Cost/kg, Total Cost, Logistic Type |
| **Financial** | Estimasi Margin/kg, Margin %, No. PO, Type Payment |
| **Payment** | Down Payment, Full Payment, Invoice Posted/Paid, Date Overdue |
| **Documents** | Document (GDrive link), Bukti TF (GDrive link) |
| **Tracking** | Qty SJ/Qty PO, Qty RR, Qty Invoiced, Amount Invoiced, No INV |
| **Logistics** | Report Bukti TRF, Value Logistic Cost, GP Total |

Dashboard widgets: Revenue, GP, Qty, Margin, Overdue count, Pipeline by status.

### 11.2 Trading Commodities

Halaman `/sales/trading` untuk tracking beli-jual komoditas (HiFeed beli langsung jual — tanpa produksi).

**Flow**: `Supplier → HiFeed (Trading) → Customer`

| Field | Keterangan |
|---|---|
| Trading ID | Auto-generated |
| Commodity | Nama komoditas yang ditradingkan |
| Buy Price/KG | Harga beli per KG |
| Sell Price/KG | Harga jual per KG |
| Qty (KG) | Volume |
| Total Buy Cost | Buy price × Qty |
| Total Sell Revenue | Sell price × Qty |
| Logistics Cost | Biaya pengiriman |
| Gross Profit | Sell revenue - buy cost - logistics |
| Margin % | GP / sell revenue × 100 |
| Payment Status | `PENDING`, `PAID`, `OVERDUE` |

---

## 12. Modul IT Admin

### 12.1 Sub-modul IT Admin

| Sub-modul | Path | Deskripsi | Role |
|---|---|---|---|
| **Product Kodifikasi** | `/it-admin/kodifikasi` | Kelola mapping internal code ↔ external code ↔ secret name | Owner, IT Ops |
| **User Management** | `/it-admin/users` | CRUD user, assign role, reset password | Owner, IT Ops |
| **System Settings** | `/it-admin/settings` | Konfigurasi parameter sistem (approval threshold, pagu R&D, dll) | Owner, IT Ops |
| **Data Export** | `/it-admin/export` | Export data untuk investor/eksternal (otomatis translate ke external code) | Owner, IT Ops |
| **Audit Log** | `/it-admin/audit` | Lihat semua aktivitas user (login, create, edit, delete, approve) | Owner, IT Ops |

### 12.2 Product Kodifikasi

- Manage internal code, external code, dan secret name per produk
- Secret name di-mask (******) di UI, hanya terlihat oleh Owner/IT Ops
- Validasi: jika ada produk baru di modul lain yang belum ada di master kodifikasi → error

### 12.3 Audit Log

Setiap aksi user tercatat:
- Login/logout
- Create/edit/delete data
- Approval/rejection PO
- Generate barcode
- Export data

---

## 13. Traceability & Supply Chain

### 13.1 Supply Chain Visualization (`/traceability`)

Tampilan visual end-to-end supply chain:
```
Supplier → Purchase → Inventory (RM) → Production → Inventory (FG) → Delivery → Customer
```

### 13.2 Batch Tracking (`/traceability/batch`)

Lacak journey per batch dari awal sampai akhir:
- Input: Batch ID atau barcode karung
- Output: Timeline lengkap — tanggal tanam, harvest, production run, BOM, delivery, customer
- Visualisasi: node-based journey diagram

### 13.3 Akses Traceability

Traceability menu ada di bawah Dashboard, accessible untuk semua role kecuali Logistics dan Sales (yang fokus di modul mereka masing-masing).

---

## 14. Data Architecture & ERD

### 14.1 Schema Tables

#### `purchase_orders`
```sql
po_number             VARCHAR(20) PK
vendor_id             UUID FK
department            VARCHAR(50)
items                 JSONB
total_amount          DECIMAL
order_date            DATE
expected_arrival_date DATE
payment_due_date      DATE
term_of_payment       VARCHAR(50)
status                ENUM
approval_layer        INT
created_by            UUID FK
approved_by           UUID FK
```

#### `products`
```sql
id                UUID PK
internal_code     VARCHAR(20) UNIQUE
external_code     VARCHAR(100)
secret_name       VARCHAR(100) -- encrypted at rest
display_name      VARCHAR(100)
category          VARCHAR(50)
cluster           ENUM('RAW_MATERIAL','FINISHED_GOOD','TRADING_GOOD')
default_uom       VARCHAR(10)
```

#### `stock_movements`
```sql
id               UUID PK
stock_item_id    UUID FK
movement_type    ENUM('SALES','MARKETING_SAMPLE','RND_SAMPLE','WAREHOUSE_TRANSFER','DEFECT','RETURN')
qty              DECIMAL
destination      VARCHAR(100)
reason           TEXT
evidence_url     VARCHAR(255)
created_by       UUID FK
created_at       TIMESTAMP
```

#### `depreciation_logs`
```sql
id               UUID PK
date             DATE
stage            ENUM('FARM','INVENTORY','PRODUCTION')
reason           ENUM('MOISTURE_LOSS','HANDLING_LOSS','SPOILAGE','PROCESSING_LOSS','MISSING','QUALITY_REJECT')
product_id       UUID FK
initial_qty_kg   DECIMAL
loss_qty_kg      DECIMAL
loss_percent     DECIMAL
reported_by      UUID FK
notes            TEXT
batch_ref        VARCHAR(50)
source_doc_type  VARCHAR(50) -- 'GRN', 'STOCK_OPNAME', 'PRODUCTION_RESULT'
source_doc_id    UUID
```

#### `production_targets`
```sql
id               UUID PK
month            DATE -- first day of month
product_id       UUID FK
target_qty_kg    DECIMAL
set_by           UUID FK -- must be Owner role
created_at       TIMESTAMP
updated_at       TIMESTAMP
```

#### `production_bags`
```sql
id                  UUID PK
barcode_id          VARCHAR(30) UNIQUE
production_run_id   UUID FK
product_id          UUID FK
weight_kg           DECIMAL
produced_at         DATE
quality_grade       ENUM('A','B','C')
status              ENUM('IN_STOCK','SHIPPED','DELIVERED','COMPLAINT')
delivery_trip_id    UUID FK NULLABLE
customer_name       VARCHAR(100)
delivered_at        DATE NULLABLE
complaint_note      TEXT
```

#### `approval_logs`
```sql
id              UUID PK
ref_table       VARCHAR(50)
ref_id          UUID
approver_id     UUID FK
approval_layer  INT
action          ENUM('APPROVED','REJECTED')
reason          TEXT
approved_at     TIMESTAMP
```

### 14.2 ERD Diagram

```mermaid
erDiagram
    PARTNERS ||--o{ PURCHASE_ORDERS : places
    PURCHASE_ORDERS ||--|{ PO_ITEMS : contains
    PURCHASE_ORDERS ||--o{ GOODS_RECEIPTS : fulfills
    PURCHASE_ORDERS ||--o{ APPROVAL_LOGS : requires
    GOODS_RECEIPTS ||--o{ DEPRECIATION_LOGS : "records variance"

    PRODUCTS ||--o{ PO_ITEMS : references
    PRODUCTS ||--o{ STOCK_ITEMS : tracks
    PRODUCTS ||--o{ BOM_ITEMS : "used in"
    PRODUCTS ||--o{ PRODUCTION_TARGETS : "has target"

    STOCK_ITEMS ||--o{ STOCK_MOVEMENTS : moves
    STOCK_ITEMS ||--o{ STOCK_OPNAME : audited
    STOCK_OPNAME ||--o{ DEPRECIATION_LOGS : "records variance"

    FARM_BATCHES ||--o{ DAILY_LOGS : tracks
    FARM_BATCHES ||--o| HARVEST_RESULTS : produces

    PRODUCTION_RUNS ||--|{ BOM_ITEMS : consumes
    PRODUCTION_RUNS ||--o{ PRODUCTION_BAGS : "produces bags"
    PRODUCTION_RUNS ||--o{ DEPRECIATION_LOGS : "records loss"

    PRODUCTION_BAGS }|--o| DELIVERY_TRIP_ITEMS : "shipped in"
    DELIVERY_TRIPS ||--|{ DELIVERY_TRIP_ITEMS : contains
    DELIVERY_TRIPS ||--o| POD_DOCUMENTS : proves

    RND_EXPERIMENTS ||--o{ RND_SAMPLE_REQUESTS : uses
    RND_EXPERIMENTS ||--o{ RND_TEST_RESULTS : produces

    MACHINES ||--o{ PRODUCTION_RUNS : "used by"
    MACHINES ||--o{ IOT_DATA_STREAMS : monitors

    AUDIT_LOGS }|--|| USERS : "performed by"
    USERS ||--o{ PURCHASE_ORDERS : creates
    USERS ||--o{ PRODUCTION_RUNS : operates
```

---

## 15. Technical Architecture

### 15.1 Frontend
- **Framework**: Next.js 16 + React 19
- **UI Library**: shadcn/ui
- **Charts**: Recharts
- **State**: React Context (Auth)
- **Auth**: Google SSO restricted to `@hifeed.co`

### 15.2 Backend
- **Framework**: Python Django + Django REST Framework
- **Database**: PostgreSQL 16
- **Auth**: Google OAuth2 → JWT tokens
- **Storage**: Cloud storage (GCS/S3) untuk foto, POD, bukti
- **IoT**: MQTT/WebSocket → Cloud ingestion pipeline
- **Barcode**: Generate QR/Barcode images, thermal printer support

### 15.3 Non-Functional Requirements
- Full online system (internet stabil)
- Audit trail: log user, timestamp, IP, action
- Wajib upload foto bukti fisik (timbangan, surat jalan, barang rusak)
- Barcode printing: standar printer thermal industri
- Role-based data segmentation di dashboard
- Data encryption: secret_name dienkripsi at rest

---

## 16. Implementation Roadmap

### Phase 1: Foundation & Core ✅
- [x] Setup repo, Docker, PostgreSQL, project structure
- [x] Google SSO integration (@hifeed.co)
- [x] Role-based access control (8 roles)
- [x] Sidebar navigation dengan role filtering
- [x] Login page dengan module preview

### Phase 2: Procurement ✅
- [x] Purchase Order CRUD (Create, List, Detail)
- [x] Multi-layer approval engine
- [x] Term of Payment fields
- [x] GRN (Goods Receipt Note) input

### Phase 3: Inventory ✅
- [x] 3-cluster inventory (RM, FG, Trading)
- [x] Stock view dengan multi-UoM conversion
- [x] Stock Opname
- [x] Inventory movement flagging
- [x] Depreciation tracking dashboard

### Phase 4: Farm Management ✅
- [x] Batch management (create, view)
- [x] Daily Log input (mortality, tenaga kerja)
- [x] Harvest recording

### Phase 5: Production ✅
- [x] Production Run (Plan, Result)
- [x] BOM logic
- [x] Monthly production targets (set by Owner)
- [x] Barcode / ID per karung (generate, lookup, complaint handling)

### Phase 6: R&D ✅
- [x] Sample Request workflow + pagu engine (max 2%)
- [x] Experiment tracking CRUD
- [x] Test Results & Lab Data logging
- [x] R&D Dashboard (budget usage, active experiments)

### Phase 7: Logistics ✅
- [x] Delivery trip management
- [x] POD upload
- [x] Barcode attachment ke surat jalan

### Phase 8: Sales/POS ✅
- [x] Feed Orders tracking (30+ fields)
- [x] Trading Commodities module

### Phase 9: IT Admin ✅
- [x] Product Kodifikasi (3-layer coding)
- [x] User Management
- [x] System Settings
- [x] Data Export (external code translation)
- [x] Audit Log

### Phase 10: Dashboard & Traceability ✅
- [x] Role-based dashboard data segmentation
- [x] Supply Chain visualization
- [x] Batch Tracking
- [x] Real-time alerts per module per role
