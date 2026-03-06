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
    Truck,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Download,
} from "lucide-react";
import { products } from "@/data/mock-data";
import { useState, useMemo } from "react";

type OrderStatus = "LEAD" | "CONFIRMED" | "PO_ISSUED" | "IN_PRODUCTION" | "SHIPPED" | "DELIVERED" | "INVOICED" | "PAID" | "OVERDUE" | "CANCELLED";
type FulfillmentType = "DIRECT" | "DROP_SHIP" | "WAREHOUSE";

interface FeedOrder {
    id: string;
    etaMonth: string;
    status: OrderStatus;
    orderId: string;
    leadId: string;
    leadsName: string;
    alamatKirim: string;
    noHp: string;
    qtyOrderKg: number;
    sku: string;
    sellingPricePerKg: number;
    totalPrice: number;
    eta: string;
    wrt: string;
    kabupaten: string;
    kecamatan: string;
    picSales: string;
    documentLink: string;
    buktiTfLink: string;
    fulfillmentType: FulfillmentType;
    picProcurement: string;
    leadIdSupplier: string;
    supplierName: string;
    supplyId: string;
    supplierArea: string;
    logisticType: string;
    rmCostPerKg: number;
    logCostPerKg: number;
    totalCost: number;
    nomorRekening: string;
    namaRekening: string;
    bankDaerah: string;
    estimasiMarginPerKg: number;
    marginPercent: number;
    noPo: string;
    typePayment: string;
    downPayment: number;
    fullPayment: number;
    qtySjPerQtyPo: string;
    qtyRr: number;
    qtyInvoiced: number;
    amountInvoiced: number;
    invoicePosted: boolean;
    invoicePaid: boolean;
    dateOverdue: string;
    noInv: string;
    reportBuktiTrf: string;
    valueLogisticCost: number;
    gpTotal: number;
}

const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
    LEAD: { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Lead" },
    CONFIRMED: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Confirmed" },
    PO_ISSUED: { color: "bg-violet-50 text-violet-700 border-violet-200", label: "PO Issued" },
    IN_PRODUCTION: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "In Production" },
    SHIPPED: { color: "bg-sky-50 text-sky-700 border-sky-200", label: "Shipped" },
    DELIVERED: { color: "bg-teal-50 text-teal-700 border-teal-200", label: "Delivered" },
    INVOICED: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Invoiced" },
    PAID: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Paid" },
    OVERDUE: { color: "bg-red-50 text-red-700 border-red-200", label: "Overdue" },
    CANCELLED: { color: "bg-gray-50 text-gray-400 border-gray-200", label: "Cancelled" },
};

const mockFeedOrders: FeedOrder[] = [
    {
        id: "fo1", etaMonth: "Mar 2026", status: "PAID", orderId: "ORD-2026-001", leadId: "L001",
        leadsName: "Karya Langit Bumi Permaculture", alamatKirim: "Jl. Permaculture No. 1, Lampung", noHp: "08381796000",
        qtyOrderKg: 5000, sku: "FG_GC", sellingPricePerKg: 4500, totalPrice: 22500000,
        eta: "2026-03-10", wrt: "H+3", kabupaten: "Lampung Selatan", kecamatan: "Natar",
        picSales: "Ahmad Fauzi", documentLink: "https://drive.google.com/doc1", buktiTfLink: "https://drive.google.com/tf1",
        fulfillmentType: "DIRECT", picProcurement: "Siti Rahma", leadIdSupplier: "-", supplierName: "-",
        supplyId: "-", supplierArea: "-", logisticType: "Truk Vendor",
        rmCostPerKg: 2800, logCostPerKg: 350, totalCost: 15750000,
        nomorRekening: "1234567890", namaRekening: "PT HiFeed Indonesia", bankDaerah: "BCA Lampung",
        estimasiMarginPerKg: 1350, marginPercent: 30, noPo: "PO-2026-0001",
        typePayment: "DP + Full", downPayment: 11250000, fullPayment: 11250000,
        qtySjPerQtyPo: "5000/5000", qtyRr: 5000, qtyInvoiced: 5000, amountInvoiced: 22500000,
        invoicePosted: true, invoicePaid: true, dateOverdue: "-", noInv: "INV-2026-001",
        reportBuktiTrf: "https://drive.google.com/trf1", valueLogisticCost: 1750000, gpTotal: 6750000,
    },
    {
        id: "fo2", etaMonth: "Mar 2026", status: "SHIPPED", orderId: "ORD-2026-002", leadId: "L002",
        leadsName: "Metro Customer", alamatKirim: "Jl. Metro Raya No. 5, Metro", noHp: "08527909000",
        qtyOrderKg: 3000, sku: "FG_PEL_C", sellingPricePerKg: 5200, totalPrice: 15600000,
        eta: "2026-03-15", wrt: "H+5", kabupaten: "Metro", kecamatan: "Metro Utara",
        picSales: "Ahmad Fauzi", documentLink: "https://drive.google.com/doc2", buktiTfLink: "",
        fulfillmentType: "DIRECT", picProcurement: "Siti Rahma", leadIdSupplier: "-", supplierName: "-",
        supplyId: "-", supplierArea: "-", logisticType: "Truk Vendor",
        rmCostPerKg: 3200, logCostPerKg: 400, totalCost: 10800000,
        nomorRekening: "0987654321", namaRekening: "PT HiFeed Indonesia", bankDaerah: "BCA Metro",
        estimasiMarginPerKg: 1600, marginPercent: 30.8, noPo: "PO-2026-0002",
        typePayment: "COD", downPayment: 0, fullPayment: 0,
        qtySjPerQtyPo: "3000/3000", qtyRr: 0, qtyInvoiced: 0, amountInvoiced: 0,
        invoicePosted: false, invoicePaid: false, dateOverdue: "-", noInv: "-",
        reportBuktiTrf: "", valueLogisticCost: 1200000, gpTotal: 4800000,
    },
    {
        id: "fo3", etaMonth: "Mar 2026", status: "CONFIRMED", orderId: "ORD-2026-003", leadId: "L003",
        leadsName: "Bandung Customer", alamatKirim: "Jl. Ranca Ekek No. 10, Bandung", noHp: "08123456789",
        qtyOrderKg: 10000, sku: "FG_PEL_GC", sellingPricePerKg: 4800, totalPrice: 48000000,
        eta: "2026-03-20", wrt: "H+7", kabupaten: "Bandung", kecamatan: "Rancaekek",
        picSales: "Ahmad Fauzi", documentLink: "", buktiTfLink: "",
        fulfillmentType: "DROP_SHIP", picProcurement: "Siti Rahma", leadIdSupplier: "LS001", supplierName: "PT Maju Jaya Feed",
        supplyId: "SUP-001", supplierArea: "Jawa Barat", logisticType: "Ekspedisi",
        rmCostPerKg: 3000, logCostPerKg: 500, totalCost: 35000000,
        nomorRekening: "5678901234", namaRekening: "PT HiFeed Indonesia", bankDaerah: "Mandiri Bandung",
        estimasiMarginPerKg: 1300, marginPercent: 27.1, noPo: "-",
        typePayment: "Net 30", downPayment: 0, fullPayment: 0,
        qtySjPerQtyPo: "0/10000", qtyRr: 0, qtyInvoiced: 0, amountInvoiced: 0,
        invoicePosted: false, invoicePaid: false, dateOverdue: "-", noInv: "-",
        reportBuktiTrf: "", valueLogisticCost: 5000000, gpTotal: 13000000,
    },
    {
        id: "fo4", etaMonth: "Feb 2026", status: "OVERDUE", orderId: "ORD-2026-004", leadId: "L004",
        leadsName: "Peternakan Sejahtera", alamatKirim: "Desa Tanjung, Lampung Timur", noHp: "08191234567",
        qtyOrderKg: 2000, sku: "FG_SIL_MIX", sellingPricePerKg: 3800, totalPrice: 7600000,
        eta: "2026-02-25", wrt: "H+3", kabupaten: "Lampung Timur", kecamatan: "Sukadana",
        picSales: "Ahmad Fauzi", documentLink: "https://drive.google.com/doc4", buktiTfLink: "",
        fulfillmentType: "DIRECT", picProcurement: "Siti Rahma", leadIdSupplier: "-", supplierName: "-",
        supplyId: "-", supplierArea: "-", logisticType: "Truk Vendor",
        rmCostPerKg: 2500, logCostPerKg: 300, totalCost: 5600000,
        nomorRekening: "1122334455", namaRekening: "PT HiFeed Indonesia", bankDaerah: "BRI Lampung Timur",
        estimasiMarginPerKg: 1000, marginPercent: 26.3, noPo: "PO-2026-0004",
        typePayment: "Net 14", downPayment: 0, fullPayment: 0,
        qtySjPerQtyPo: "2000/2000", qtyRr: 2000, qtyInvoiced: 2000, amountInvoiced: 7600000,
        invoicePosted: true, invoicePaid: false, dateOverdue: "2026-03-11", noInv: "INV-2026-004",
        reportBuktiTrf: "", valueLogisticCost: 600000, gpTotal: 2000000,
    },
    {
        id: "fo5", etaMonth: "Mar 2026", status: "LEAD", orderId: "ORD-2026-005", leadId: "L005",
        leadsName: "Koperasi Ternak Makmur", alamatKirim: "Jl. Koperasi No. 3, Pringsewu", noHp: "082112345678",
        qtyOrderKg: 8000, sku: "FG_GC", sellingPricePerKg: 4500, totalPrice: 36000000,
        eta: "2026-04-05", wrt: "H+5", kabupaten: "Pringsewu", kecamatan: "Pringsewu",
        picSales: "Ahmad Fauzi", documentLink: "", buktiTfLink: "",
        fulfillmentType: "DIRECT", picProcurement: "-", leadIdSupplier: "-", supplierName: "-",
        supplyId: "-", supplierArea: "-", logisticType: "Truk Vendor",
        rmCostPerKg: 2800, logCostPerKg: 350, totalCost: 25200000,
        nomorRekening: "", namaRekening: "", bankDaerah: "",
        estimasiMarginPerKg: 1350, marginPercent: 30, noPo: "-",
        typePayment: "-", downPayment: 0, fullPayment: 0,
        qtySjPerQtyPo: "0/0", qtyRr: 0, qtyInvoiced: 0, amountInvoiced: 0,
        invoicePosted: false, invoicePaid: false, dateOverdue: "-", noInv: "-",
        reportBuktiTrf: "", valueLogisticCost: 2800000, gpTotal: 10800000,
    },
];

const fgProducts = products.filter(p => p.cluster === "FINISHED_GOOD");

export default function FeedOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [monthFilter, setMonthFilter] = useState("ALL");

    const filtered = mockFeedOrders.filter((o) => {
        const matchSearch =
            o.leadsName.toLowerCase().includes(search.toLowerCase()) ||
            o.orderId.toLowerCase().includes(search.toLowerCase()) ||
            o.kabupaten.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
        const matchMonth = monthFilter === "ALL" || o.etaMonth === monthFilter;
        return matchSearch && matchStatus && matchMonth;
    });

    // Stats
    const totalRevenue = mockFeedOrders.reduce((s, o) => s + o.totalPrice, 0);
    const totalGP = mockFeedOrders.reduce((s, o) => s + o.gpTotal, 0);
    const totalQty = mockFeedOrders.reduce((s, o) => s + o.qtyOrderKg, 0);
    const overdueCount = mockFeedOrders.filter((o) => o.status === "OVERDUE").length;
    const avgMargin = mockFeedOrders.length > 0
        ? mockFeedOrders.reduce((s, o) => s + o.marginPercent, 0) / mockFeedOrders.length
        : 0;

    const skuName = (sku: string) => {
        const p = fgProducts.find((p) => p.internalCode === sku);
        return p ? p.displayName : sku;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Penjualan produk jadi pakan (Feed Products) — tracking dari lead hingga payment.
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 cursor-pointer" size="sm">
                        <Download className="h-4 w-4" />
                        Export Excel
                    </Button>
                    <Button className="gap-2 cursor-pointer" size="sm">
                        <Plus className="h-4 w-4" />
                        New Order
                    </Button>
                </div>
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
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800">{overdueCount} order overdue — segera follow up pembayaran!</p>
                        </div>
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
                                placeholder="Search customer, order ID, kabupaten..."
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
                        <Select value={monthFilter} onValueChange={setMonthFilter}>
                            <SelectTrigger className="w-full sm:w-36 bg-muted/30 border-0">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Months</SelectItem>
                                <SelectItem value="Mar 2026">Mar 2026</SelectItem>
                                <SelectItem value="Feb 2026">Feb 2026</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table — Horizontal scrollable */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="min-w-[2800px]">
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 text-[10px]">
                                <TableHead className="font-semibold sticky left-0 bg-muted/30 z-10 min-w-[100px]">Order ID</TableHead>
                                <TableHead className="font-semibold min-w-[70px]">Status</TableHead>
                                <TableHead className="font-semibold min-w-[60px]">ETA</TableHead>
                                <TableHead className="font-semibold min-w-[150px]">Customer</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">No. HP</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">Kabupaten</TableHead>
                                <TableHead className="font-semibold min-w-[100px]">SKU</TableHead>
                                <TableHead className="font-semibold text-right min-w-[70px]">Qty (KG)</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">Price/KG</TableHead>
                                <TableHead className="font-semibold text-right min-w-[100px]">Total Price</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">Fulfillment</TableHead>
                                <TableHead className="font-semibold min-w-[90px]">PIC Sales</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">RM Cost/KG</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">Log Cost/KG</TableHead>
                                <TableHead className="font-semibold text-right min-w-[100px]">Total Cost</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">Margin/KG</TableHead>
                                <TableHead className="font-semibold text-right min-w-[60px]">%</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">GP Total</TableHead>
                                <TableHead className="font-semibold min-w-[90px]">No. PO</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">Payment</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">DP</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">Full Pay</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">SJ/PO</TableHead>
                                <TableHead className="font-semibold text-right min-w-[60px]">Qty RR</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">No. INV</TableHead>
                                <TableHead className="font-semibold text-right min-w-[90px]">Amt Invoiced</TableHead>
                                <TableHead className="font-semibold min-w-[60px]">Posted</TableHead>
                                <TableHead className="font-semibold min-w-[60px]">Paid</TableHead>
                                <TableHead className="font-semibold min-w-[80px]">Overdue</TableHead>
                                <TableHead className="font-semibold text-right min-w-[80px]">Log Cost</TableHead>
                                <TableHead className="font-semibold text-center min-w-[50px]">Act</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((o) => {
                                const st = statusConfig[o.status];
                                return (
                                    <TableRow key={o.id} className={`hover:bg-muted/20 text-[11px] ${o.status === "OVERDUE" ? "bg-red-50/50" : ""}`}>
                                        <TableCell className="sticky left-0 bg-background z-10">
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-3 w-3 text-primary/60" />
                                                <span className="font-medium">{o.orderId}</span>
                                            </div>
                                            <p className="text-[9px] text-muted-foreground">{o.leadId}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] ${st.color}`}>{st.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-[10px]">{o.etaMonth}</TableCell>
                                        <TableCell>
                                            <span className="font-medium text-[11px]">{o.leadsName}</span>
                                        </TableCell>
                                        <TableCell className="text-[10px] font-mono">{o.noHp}</TableCell>
                                        <TableCell className="text-[10px]">{o.kabupaten}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-[9px]">{skuName(o.sku)}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{o.qtyOrderKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono">{o.sellingPricePerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-medium font-mono">{(o.totalPrice / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[9px]">{o.fulfillmentType}</Badge>
                                        </TableCell>
                                        <TableCell className="text-[10px]">{o.picSales}</TableCell>
                                        <TableCell className="text-right font-mono">{o.rmCostPerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono">{o.logCostPerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono">{(o.totalCost / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell className="text-right font-mono text-emerald-600 font-medium">{o.estimasiMarginPerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            <span className={o.marginPercent >= 25 ? "text-emerald-600" : "text-amber-600"}>
                                                {o.marginPercent.toFixed(1)}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold text-emerald-700">{(o.gpTotal / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell className="font-mono text-[10px]">{o.noPo}</TableCell>
                                        <TableCell className="text-[10px]">{o.typePayment}</TableCell>
                                        <TableCell className="text-right font-mono">{o.downPayment > 0 ? (o.downPayment / 1_000_000).toFixed(1) + "M" : "-"}</TableCell>
                                        <TableCell className="text-right font-mono">{o.fullPayment > 0 ? (o.fullPayment / 1_000_000).toFixed(1) + "M" : "-"}</TableCell>
                                        <TableCell className="font-mono text-[10px]">{o.qtySjPerQtyPo}</TableCell>
                                        <TableCell className="text-right font-mono">{o.qtyRr > 0 ? o.qtyRr.toLocaleString("id-ID") : "-"}</TableCell>
                                        <TableCell className="font-mono text-[10px]">{o.noInv}</TableCell>
                                        <TableCell className="text-right font-mono">{o.amountInvoiced > 0 ? (o.amountInvoiced / 1_000_000).toFixed(1) + "M" : "-"}</TableCell>
                                        <TableCell className="text-center">
                                            {o.invoicePosted ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mx-auto" /> : <XCircle className="h-3.5 w-3.5 text-gray-300 mx-auto" />}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {o.invoicePaid ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mx-auto" /> : <XCircle className="h-3.5 w-3.5 text-gray-300 mx-auto" />}
                                        </TableCell>
                                        <TableCell className="text-[10px]">
                                            {o.dateOverdue !== "-" ? (
                                                <span className="text-red-600 font-bold">{o.dateOverdue}</span>
                                            ) : "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">{(o.valueLogisticCost / 1_000_000).toFixed(1)}M</TableCell>
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
                            const count = mockFeedOrders.filter(o => o.status === key).length;
                            if (count === 0) return null;
                            const value = mockFeedOrders.filter(o => o.status === key).reduce((s, o) => s + o.totalPrice, 0);
                            return (
                                <div key={key} className="flex items-center justify-between">
                                    <Badge variant="outline" className={`text-[10px] ${cfg.color}`}>{cfg.label}</Badge>
                                    <div className="text-right">
                                        <span className="text-sm font-bold">{count}</span>
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
                        <p>• <strong>Feed Orders</strong> — penjualan produk jadi pakan HiFeed</p>
                        <p>• Scroll horizontal untuk melihat seluruh kolom (30+ field)</p>
                        <p>• <strong>GP Total</strong> = Total Price - Total Cost (RM + Logistic)</p>
                        <p>• Order overdue ditandai merah, segera follow up pembayaran</p>
                        <p>• Kolom <strong>SJ/PO</strong> = Qty Surat Jalan / Qty PO</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
