"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Plus,
    Eye,
    TrendingUp,
    DollarSign,
    Package,
    AlertTriangle,
    FileText,
    Download,
    ArrowRightLeft,
    CheckCircle2,
    XCircle,
    ShoppingCart,
} from "lucide-react";
import { products } from "@/data/mock-data";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";

// ===== Types =====
type OrderStatus = "LEAD" | "CONFIRMED" | "PO_ISSUED" | "IN_PRODUCTION" | "SHIPPED" | "DELIVERED" | "INVOICED" | "PAID" | "OVERDUE" | "CANCELLED" | "SOURCING" | "PO_SUPPLIER" | "IN_TRANSIT" | "IN_STOCK" | "SOLD";
type OrderType = "FEED" | "TRADING";

interface SalesOrder {
    id: string;
    type: OrderType;
    orderId: string;
    status: OrderStatus;
    etaMonth: string;
    customerName: string;
    customerArea: string;
    noHp: string;
    sku: string;
    qtyKg: number;
    sellingPricePerKg: number;
    totalPrice: number;
    rmCostPerKg: number;
    logCostPerKg: number;
    totalCost: number;
    marginPerKg: number;
    marginPercent: number;
    gpTotal: number;
    noPo: string;
    typePayment: string;
    noInv: string;
    invoicePaid: boolean;
    dateOverdue: string;
    picSales: string;
    // Trading-specific
    supplierName?: string;
    supplierArea?: string;
    buyPricePerKg?: number;
}

const statusConfig: Record<string, { color: string; label: string }> = {
    LEAD: { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Lead" },
    CONFIRMED: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Confirmed" },
    PO_ISSUED: { color: "bg-violet-50 text-violet-700 border-violet-200", label: "PO Issued" },
    IN_PRODUCTION: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "In Production" },
    SOURCING: { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Sourcing" },
    PO_SUPPLIER: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "PO Supplier" },
    IN_TRANSIT: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "In Transit" },
    IN_STOCK: { color: "bg-violet-50 text-violet-700 border-violet-200", label: "In Stock" },
    SOLD: { color: "bg-sky-50 text-sky-700 border-sky-200", label: "Sold" },
    SHIPPED: { color: "bg-sky-50 text-sky-700 border-sky-200", label: "Shipped" },
    DELIVERED: { color: "bg-teal-50 text-teal-700 border-teal-200", label: "Delivered" },
    INVOICED: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Invoiced" },
    PAID: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Paid" },
    OVERDUE: { color: "bg-red-50 text-red-700 border-red-200", label: "Overdue" },
    CANCELLED: { color: "bg-gray-50 text-gray-400 border-gray-200", label: "Cancelled" },
};

// ===== Mock Data =====
const allOrders: SalesOrder[] = [
    // Feed Orders
    {
        id: "fo1", type: "FEED", orderId: "ORD-2026-001", status: "PAID", etaMonth: "Mar 2026",
        customerName: "Karya Langit Bumi Permaculture", customerArea: "Lampung Selatan", noHp: "08381796000",
        sku: "FG_GC", qtyKg: 5000, sellingPricePerKg: 4500, totalPrice: 22500000,
        rmCostPerKg: 2800, logCostPerKg: 350, totalCost: 15750000,
        marginPerKg: 1350, marginPercent: 30, gpTotal: 6750000,
        noPo: "PO-2026-0001", typePayment: "DP + Full", noInv: "INV-2026-001",
        invoicePaid: true, dateOverdue: "-", picSales: "Ahmad Fauzi",
    },
    {
        id: "fo2", type: "FEED", orderId: "ORD-2026-002", status: "SHIPPED", etaMonth: "Mar 2026",
        customerName: "Metro Customer", customerArea: "Metro", noHp: "08527909000",
        sku: "FG_PEL_C", qtyKg: 3000, sellingPricePerKg: 5200, totalPrice: 15600000,
        rmCostPerKg: 3200, logCostPerKg: 400, totalCost: 10800000,
        marginPerKg: 1600, marginPercent: 30.8, gpTotal: 4800000,
        noPo: "PO-2026-0002", typePayment: "COD", noInv: "-",
        invoicePaid: false, dateOverdue: "-", picSales: "Ahmad Fauzi",
    },
    {
        id: "fo3", type: "FEED", orderId: "ORD-2026-003", status: "CONFIRMED", etaMonth: "Mar 2026",
        customerName: "Bandung Customer", customerArea: "Bandung", noHp: "08123456789",
        sku: "FG_PEL_GC", qtyKg: 10000, sellingPricePerKg: 4800, totalPrice: 48000000,
        rmCostPerKg: 3000, logCostPerKg: 500, totalCost: 35000000,
        marginPerKg: 1300, marginPercent: 27.1, gpTotal: 13000000,
        noPo: "-", typePayment: "Net 30", noInv: "-",
        invoicePaid: false, dateOverdue: "-", picSales: "Ahmad Fauzi",
    },
    {
        id: "fo4", type: "FEED", orderId: "ORD-2026-004", status: "OVERDUE", etaMonth: "Feb 2026",
        customerName: "Peternakan Sejahtera", customerArea: "Lampung Timur", noHp: "08191234567",
        sku: "FG_SIL_MIX", qtyKg: 2000, sellingPricePerKg: 3800, totalPrice: 7600000,
        rmCostPerKg: 2500, logCostPerKg: 300, totalCost: 5600000,
        marginPerKg: 1000, marginPercent: 26.3, gpTotal: 2000000,
        noPo: "PO-2026-0004", typePayment: "Net 14", noInv: "INV-2026-004",
        invoicePaid: false, dateOverdue: "2026-03-11", picSales: "Ahmad Fauzi",
    },
    {
        id: "fo5", type: "FEED", orderId: "ORD-2026-005", status: "LEAD", etaMonth: "Mar 2026",
        customerName: "Koperasi Ternak Makmur", customerArea: "Pringsewu", noHp: "082112345678",
        sku: "FG_GC", qtyKg: 8000, sellingPricePerKg: 4500, totalPrice: 36000000,
        rmCostPerKg: 2800, logCostPerKg: 350, totalCost: 25200000,
        marginPerKg: 1350, marginPercent: 30, gpTotal: 10800000,
        noPo: "-", typePayment: "-", noInv: "-",
        invoicePaid: false, dateOverdue: "-", picSales: "Ahmad Fauzi",
    },
    // Trading Orders
    {
        id: "t1", type: "TRADING", orderId: "TRD-2026-001", status: "PAID", etaMonth: "Feb 2026",
        customerName: "Karya Langit Bumi Permaculture", customerArea: "Lampung Selatan", noHp: "08381796000",
        sku: "PKG_KRG_65", qtyKg: 2000, sellingPricePerKg: 3200, totalPrice: 6400000,
        rmCostPerKg: 2500, logCostPerKg: 175, totalCost: 5350000,
        marginPerKg: 525, marginPercent: 16.4, gpTotal: 1050000,
        noPo: "PO-T-001", typePayment: "Full", noInv: "INV-T-001",
        invoicePaid: true, dateOverdue: "-", picSales: "Ahmad Fauzi",
        supplierName: "Pabrik Kemasan Plastik", supplierArea: "Tangerang", buyPricePerKg: 2500,
    },
    {
        id: "t2", type: "TRADING", orderId: "TRD-2026-002", status: "DELIVERED", etaMonth: "Mar 2026",
        customerName: "Metro Customer", customerArea: "Metro", noHp: "08527909000",
        sku: "PKG_PLS_60", qtyKg: 500, sellingPricePerKg: 22000, totalPrice: 11000000,
        rmCostPerKg: 18000, logCostPerKg: 800, totalCost: 9400000,
        marginPerKg: 3200, marginPercent: 14.5, gpTotal: 1600000,
        noPo: "PO-T-002", typePayment: "COD", noInv: "-",
        invoicePaid: false, dateOverdue: "-", picSales: "Ahmad Fauzi",
        supplierName: "Pabrik Kemasan Plastik", supplierArea: "Tangerang", buyPricePerKg: 18000,
    },
    {
        id: "t3", type: "TRADING", orderId: "TRD-2026-003", status: "IN_TRANSIT", etaMonth: "Mar 2026",
        customerName: "Peternakan Sejahtera", customerArea: "Lampung Timur", noHp: "08191234567",
        sku: "DM_FA1", qtyKg: 1000, sellingPricePerKg: 18500, totalPrice: 18500000,
        rmCostPerKg: 15000, logCostPerKg: 1200, totalCost: 16200000,
        marginPerKg: 2300, marginPercent: 12.4, gpTotal: 2300000,
        noPo: "PO-T-003", typePayment: "DP", noInv: "-",
        invoicePaid: false, dateOverdue: "-", picSales: "Ahmad Fauzi",
        supplierName: "PT. Nutrisi Ternak Indo", supplierArea: "Surabaya", buyPricePerKg: 15000,
    },
    {
        id: "t4", type: "TRADING", orderId: "TRD-2026-004", status: "SOURCING", etaMonth: "Mar 2026",
        customerName: "Koperasi Ternak Makmur", customerArea: "Pringsewu", noHp: "082112345678",
        sku: "DM_FA2", qtyKg: 3000, sellingPricePerKg: 10500, totalPrice: 31500000,
        rmCostPerKg: 8500, logCostPerKg: 700, totalCost: 27600000,
        marginPerKg: 1300, marginPercent: 12.4, gpTotal: 3900000,
        noPo: "-", typePayment: "-", noInv: "-",
        invoicePaid: false, dateOverdue: "-", picSales: "Ahmad Fauzi",
        supplierName: "CV. Mineral Jaya", supplierArea: "Gresik", buyPricePerKg: 8500,
    },
];

const fgProducts = products.filter(p => p.cluster === "FINISHED_GOOD" || p.cluster === "TRADING_GOOD" || p.cluster === "RAW_MATERIAL");

export default function SalesOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState<"ALL" | "FEED" | "TRADING">("ALL");

    const filtered = allOrders.filter((o) => {
        const matchSearch =
            o.customerName.toLowerCase().includes(search.toLowerCase()) ||
            o.orderId.toLowerCase().includes(search.toLowerCase()) ||
            o.customerArea.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
        const matchType = typeFilter === "ALL" || o.type === typeFilter;
        return matchSearch && matchStatus && matchType;
    });

    const feedOrders = allOrders.filter(o => o.type === "FEED");
    const tradingOrders = allOrders.filter(o => o.type === "TRADING");
    const totalRevenue = allOrders.reduce((s, o) => s + o.totalPrice, 0);
    const totalGP = allOrders.reduce((s, o) => s + o.gpTotal, 0);
    const totalQty = allOrders.reduce((s, o) => s + o.qtyKg, 0);
    const overdueCount = allOrders.filter((o) => o.status === "OVERDUE").length;
    const [showForm, setShowForm] = useState(false);

    const avgMargin = allOrders.length > 0
        ? allOrders.reduce((s, o) => s + o.marginPercent, 0) / allOrders.length
        : 0;

    const skuName = (sku: string) => {
        const p = fgProducts.find((p) => p.internalCode === sku);
        return p ? p.displayName : sku;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Semua order — produk jadi (Feed) dan trading komoditas (beli-putus) dalam satu view.
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 cursor-pointer" size="sm">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={() => setShowForm(!showForm)} className="gap-2 cursor-pointer" size="sm">
                        <Plus className="h-4 w-4" />
                        New Order
                    </Button>
                </div>
            </div>

            {/* New Order Form */}
            {showForm && (
                <Card className="border-0 shadow-sm border-l-4 border-l-sky-500 animate-fade-in-up">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-sky-600" />
                            Buat Order Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Tipe Order *</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FEED">Feed Product (produk jadi)</SelectItem>
                                        <SelectItem value="TRADING">Trading (beli-putus)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Customer *</Label>
                                <Input placeholder="Nama customer" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Area / Kabupaten</Label>
                                <Input placeholder="Misal: Lampung Selatan" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">No. HP</Label>
                                <Input placeholder="08xx" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">SKU / Produk *</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
                                    <SelectContent>
                                        {fgProducts.map(p => (
                                            <SelectItem key={p.id} value={p.internalCode}>{p.displayName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Qty (KG) *</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Harga Jual per KG *</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Payment Type</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Pilih payment" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COD">COD</SelectItem>
                                        <SelectItem value="DP">DP + Full</SelectItem>
                                        <SelectItem value="NET14">Net 14</SelectItem>
                                        <SelectItem value="NET30">Net 30</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowForm(false)} className="cursor-pointer">Batal</Button>
                            <Button className="cursor-pointer gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Buat Order
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Type Toggle */}
            <div className="flex gap-2">
                {(["ALL", "FEED", "TRADING"] as const).map((t) => {
                    const count = t === "ALL" ? allOrders.length : allOrders.filter(o => o.type === t).length;
                    return (
                        <Button
                            key={t}
                            variant={typeFilter === t ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTypeFilter(t)}
                            className="gap-2 cursor-pointer"
                        >
                            {t === "ALL" ? <Package className="h-3.5 w-3.5" /> : t === "FEED" ? <Package className="h-3.5 w-3.5" /> : <ArrowRightLeft className="h-3.5 w-3.5" />}
                            {t === "ALL" ? "All Orders" : t === "FEED" ? "Feed Products" : "Trading"}
                            <Badge variant="secondary" className="text-[9px] ml-1">{count}</Badge>
                        </Button>
                    );
                })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <DollarSign className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                        <p className="text-lg font-bold text-emerald-600">
                            {(totalRevenue / 1_000_000).toFixed(0)}M
                        </p>
                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-lg font-bold text-primary">
                            {(totalGP / 1_000_000).toFixed(0)}M
                        </p>
                        <p className="text-xs text-muted-foreground">Gross Profit</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <Package className="h-5 w-5 mx-auto mb-1 text-violet-500" />
                        <p className="text-lg font-bold text-violet-600">
                            {(totalQty / 1000).toFixed(0)} Ton
                        </p>
                        <p className="text-xs text-muted-foreground">Total Qty</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="h-5 w-5 mx-auto mb-1 text-sky-500" />
                        <p className="text-lg font-bold text-sky-600">
                            {avgMargin.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Avg Margin</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-red-500" />
                        <p className="text-lg font-bold text-red-600">{overdueCount}</p>
                        <p className="text-xs text-muted-foreground">Overdue</p>
                    </CardContent>
                </Card>
            </div>

            {/* Overdue Alert */}
            {overdueCount > 0 && (
                <Card className="border-0 shadow-sm bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-l-4 border-l-red-500">
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                        <p className="text-sm font-semibold text-red-800">{overdueCount} order overdue — segera follow up pembayaran!</p>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customer, order ID, area..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-0"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-36 bg-muted/30 border-0">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                {Object.entries(statusConfig).map(([k, v]) => (
                                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="min-w-[1800px]">
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 text-[10px]">
                                <TableHead className="font-semibold sticky left-0 bg-muted/30 z-10 min-w-[100px]">Order ID</TableHead>
                                <TableHead className="font-semibold min-w-[60px]">Type</TableHead>
                                <TableHead className="font-semibold min-w-[70px]">Status</TableHead>
                                <TableHead className="font-semibold min-w-[150px]">Customer</TableHead>
                                <TableHead className="font-semibold min-w-[100px]">SKU</TableHead>
                                <TableHead className="font-semibold text-right min-w-[70px]">Qty (KG)</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">Price/KG</TableHead>
                                <TableHead className="font-semibold text-right min-w-[100px]">Total Price</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">Cost/KG</TableHead>
                                <TableHead className="font-semibold text-right min-w-[100px]">Total Cost</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">Margin/KG</TableHead>
                                <TableHead className="font-semibold text-right min-w-[60px]">%</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">GP</TableHead>
                                <TableHead className="font-semibold min-w-[90px]">No. PO</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">Payment</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">Invoice</TableHead>
                                <TableHead className="font-semibold min-w-[60px]">Paid</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">Overdue</TableHead>
                                <TableHead className="font-semibold min-w-[90px]">Supplier</TableHead>
                                <TableHead className="font-semibold text-center min-w-[50px]">Act</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((o) => {
                                const st = statusConfig[o.status] || statusConfig.LEAD;
                                return (
                                    <TableRow key={o.id} className={`hover:bg-muted/20 text-[11px] ${o.status === "OVERDUE" ? "bg-red-50/50" : ""}`}>
                                        <TableCell className="sticky left-0 bg-background z-10">
                                            <div className="flex items-center gap-1">
                                                {o.type === "FEED" ? <FileText className="h-3 w-3 text-primary/60" /> : <ArrowRightLeft className="h-3 w-3 text-violet-500/60" />}
                                                <span className="font-medium">{o.orderId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] ${o.type === "FEED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-violet-50 text-violet-700 border-violet-200"}`}>
                                                {o.type === "FEED" ? "Feed" : "Trading"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] ${st.color}`}>{st.label}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-[11px]">{o.customerName}</span>
                                            <p className="text-[9px] text-muted-foreground">{o.customerArea}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-[9px]">{skuName(o.sku)}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{o.qtyKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono">{o.sellingPricePerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-medium font-mono">{(o.totalPrice / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell className="text-right font-mono text-red-500">{o.rmCostPerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono">{(o.totalCost / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell className="text-right font-mono text-emerald-600 font-medium">{o.marginPerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            <span className={o.marginPercent >= 25 ? "text-emerald-600" : "text-amber-600"}>
                                                {o.marginPercent.toFixed(1)}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold text-emerald-700">{(o.gpTotal / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell className="font-mono text-[10px]">{o.noPo}</TableCell>
                                        <TableCell className="text-[10px]">{o.typePayment}</TableCell>
                                        <TableCell className="font-mono text-[10px]">{o.noInv}</TableCell>
                                        <TableCell className="text-center">
                                            {o.invoicePaid ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mx-auto" /> : <XCircle className="h-3.5 w-3.5 text-gray-300 mx-auto" />}
                                        </TableCell>
                                        <TableCell className="text-[10px]">
                                            {o.dateOverdue !== "-" ? (
                                                <span className="text-red-600 font-bold">{o.dateOverdue}</span>
                                            ) : "-"}
                                        </TableCell>
                                        <TableCell className="text-[10px]">
                                            {o.supplierName || "-"}
                                            {o.supplierArea && <p className="text-[9px] text-muted-foreground">{o.supplierArea}</p>}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-pointer">
                                                <Eye className="h-3.5 w-3.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Pipeline by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {Object.entries(statusConfig).map(([key, cfg]) => {
                            const orders = filtered.filter(o => o.status === key);
                            if (orders.length === 0) return null;
                            const value = orders.reduce((s, o) => s + o.totalPrice, 0);
                            return (
                                <div key={key} className="flex items-center justify-between">
                                    <Badge variant="outline" className={`text-[10px] ${cfg.color}`}>{cfg.label}</Badge>
                                    <div className="text-right">
                                        <span className="text-sm font-bold">{orders.length}</span>
                                        <span className="text-xs text-muted-foreground ml-2">Rp {(value / 1_000_000).toFixed(0)}M</span>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-xs text-muted-foreground">
                        <p>• <strong>Feed</strong> = produk jadi HiFeed (GC, Pellet, Silase)</p>
                        <p>• <strong>Trading</strong> = beli-putus, HiFeed sebagai intermediary</p>
                        <p>• Semua order otomatis generate PO ke modul Procurement</p>
                        <p>• <strong>GP</strong> = Total Price - Total Cost (RM + Logistic)</p>
                        <p>• Order overdue ditandai merah — follow up ke AR Dashboard</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
