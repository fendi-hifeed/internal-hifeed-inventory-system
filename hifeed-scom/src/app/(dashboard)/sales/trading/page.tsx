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
    ArrowRightLeft,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Download,
    Package,
} from "lucide-react";
import { useState } from "react";

type TradingStatus = "SOURCING" | "PO_SUPPLIER" | "IN_TRANSIT" | "IN_STOCK" | "SOLD" | "DELIVERED" | "INVOICED" | "PAID" | "CANCELLED";

interface TradingOrder {
    id: string;
    tradingId: string;
    status: TradingStatus;
    commodity: string;
    buyFromSupplier: string;
    supplierArea: string;
    buyPricePerKg: number;
    buyQtyKg: number;
    totalBuyCost: number;
    sellToCustomer: string;
    customerArea: string;
    sellPricePerKg: number;
    sellQtyKg: number;
    totalSellPrice: number;
    logisticCost: number;
    marginPerKg: number;
    marginPercent: number;
    gpTotal: number;
    noPoBuy: string;
    noPoSell: string;
    noInvoice: string;
    paymentStatus: "UNPAID" | "DP_RECEIVED" | "FULL_PAID";
    dateCreated: string;
    etaDelivery: string;
    picSales: string;
    notes: string;
}

const statusConfig: Record<TradingStatus, { color: string; label: string }> = {
    SOURCING: { color: "bg-gray-100 text-gray-700 border-gray-200", label: "Sourcing" },
    PO_SUPPLIER: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "PO Supplier" },
    IN_TRANSIT: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "In Transit" },
    IN_STOCK: { color: "bg-violet-50 text-violet-700 border-violet-200", label: "In Stock" },
    SOLD: { color: "bg-sky-50 text-sky-700 border-sky-200", label: "Sold" },
    DELIVERED: { color: "bg-teal-50 text-teal-700 border-teal-200", label: "Delivered" },
    INVOICED: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Invoiced" },
    PAID: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Paid" },
    CANCELLED: { color: "bg-gray-50 text-gray-400 border-gray-200", label: "Cancelled" },
};

const paymentColors: Record<string, string> = {
    UNPAID: "bg-red-50 text-red-700 border-red-200",
    DP_RECEIVED: "bg-amber-50 text-amber-700 border-amber-200",
    FULL_PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const mockTradingOrders: TradingOrder[] = [
    {
        id: "t1", tradingId: "TRD-2026-001", status: "PAID", commodity: "Karung 65x105 cm",
        buyFromSupplier: "Pabrik Kemasan Plastik", supplierArea: "Tangerang",
        buyPricePerKg: 2500, buyQtyKg: 2000, totalBuyCost: 5000000,
        sellToCustomer: "Karya Langit Bumi Permaculture", customerArea: "Lampung Selatan",
        sellPricePerKg: 3200, sellQtyKg: 2000, totalSellPrice: 6400000,
        logisticCost: 350000, marginPerKg: 525, marginPercent: 16.4, gpTotal: 1050000,
        noPoBuy: "PO-T-001", noPoSell: "SO-T-001", noInvoice: "INV-T-001",
        paymentStatus: "FULL_PAID", dateCreated: "2026-02-15", etaDelivery: "2026-02-22",
        picSales: "Ahmad Fauzi", notes: "Kemasan untuk repackaging customer",
    },
    {
        id: "t2", tradingId: "TRD-2026-002", status: "DELIVERED", commodity: "Plastik 60 Micron",
        buyFromSupplier: "Pabrik Kemasan Plastik", supplierArea: "Tangerang",
        buyPricePerKg: 18000, buyQtyKg: 500, totalBuyCost: 9000000,
        sellToCustomer: "Metro Customer", customerArea: "Metro",
        sellPricePerKg: 22000, sellQtyKg: 500, totalSellPrice: 11000000,
        logisticCost: 400000, marginPerKg: 3200, marginPercent: 14.5, gpTotal: 1600000,
        noPoBuy: "PO-T-002", noPoSell: "SO-T-002", noInvoice: "-",
        paymentStatus: "UNPAID", dateCreated: "2026-03-01", etaDelivery: "2026-03-08",
        picSales: "Ahmad Fauzi", notes: "Plastik wrapping untuk silase",
    },
    {
        id: "t3", tradingId: "TRD-2026-003", status: "IN_TRANSIT", commodity: "Premix Mineral",
        buyFromSupplier: "PT. Nutrisi Ternak Indo", supplierArea: "Surabaya",
        buyPricePerKg: 15000, buyQtyKg: 1000, totalBuyCost: 15000000,
        sellToCustomer: "Peternakan Sejahtera", customerArea: "Lampung Timur",
        sellPricePerKg: 18500, sellQtyKg: 1000, totalSellPrice: 18500000,
        logisticCost: 1200000, marginPerKg: 2300, marginPercent: 12.4, gpTotal: 2300000,
        noPoBuy: "PO-T-003", noPoSell: "SO-T-003", noInvoice: "-",
        paymentStatus: "DP_RECEIVED", dateCreated: "2026-03-04", etaDelivery: "2026-03-12",
        picSales: "Ahmad Fauzi", notes: "Drop ship langsung dari supplier ke customer",
    },
    {
        id: "t4", tradingId: "TRD-2026-004", status: "SOURCING", commodity: "Calcium/DCP/Mineral",
        buyFromSupplier: "CV. Mineral Jaya", supplierArea: "Gresik",
        buyPricePerKg: 8500, buyQtyKg: 3000, totalBuyCost: 25500000,
        sellToCustomer: "Koperasi Ternak Makmur", customerArea: "Pringsewu",
        sellPricePerKg: 10500, sellQtyKg: 3000, totalSellPrice: 31500000,
        logisticCost: 2100000, marginPerKg: 1300, marginPercent: 12.4, gpTotal: 3900000,
        noPoBuy: "-", noPoSell: "-", noInvoice: "-",
        paymentStatus: "UNPAID", dateCreated: "2026-03-06", etaDelivery: "2026-03-20",
        picSales: "Ahmad Fauzi", notes: "Customer butuh bulk mineral untuk campuran pakan",
    },
];

export default function TradingPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filtered = mockTradingOrders.filter((o) => {
        const matchSearch =
            o.commodity.toLowerCase().includes(search.toLowerCase()) ||
            o.tradingId.toLowerCase().includes(search.toLowerCase()) ||
            o.sellToCustomer.toLowerCase().includes(search.toLowerCase()) ||
            o.buyFromSupplier.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalBuy = mockTradingOrders.reduce((s, o) => s + o.totalBuyCost, 0);
    const totalSell = mockTradingOrders.reduce((s, o) => s + o.totalSellPrice, 0);
    const totalGP = mockTradingOrders.reduce((s, o) => s + o.gpTotal, 0);
    const avgMargin = mockTradingOrders.length > 0
        ? mockTradingOrders.reduce((s, o) => s + o.marginPercent, 0) / mockTradingOrders.length
        : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Trading komoditas — beli langsung jual. HiFeed sebagai intermediary.
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 cursor-pointer" size="sm">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button className="gap-2 cursor-pointer" size="sm">
                        <Plus className="h-4 w-4" />
                        New Trade
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <DollarSign className="h-5 w-5 mx-auto mb-1 text-red-400" />
                        <p className="text-lg font-bold text-red-500">
                            {(totalBuy / 1_000_000).toFixed(0)}M
                        </p>
                        <p className="text-xs text-muted-foreground">Total Buy (Cost)</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <DollarSign className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                        <p className="text-lg font-bold text-emerald-600">
                            {(totalSell / 1_000_000).toFixed(0)}M
                        </p>
                        <p className="text-xs text-muted-foreground">Total Sell (Revenue)</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-lg font-bold text-primary">
                            {(totalGP / 1_000_000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-muted-foreground">Gross Profit</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <ArrowRightLeft className="h-5 w-5 mx-auto mb-1 text-violet-500" />
                        <p className="text-lg font-bold text-violet-600">
                            {avgMargin.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Avg Margin</p>
                    </CardContent>
                </Card>
            </div>

            {/* Flow explanation */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20">
                <CardContent className="p-4 flex items-center gap-4">
                    <ArrowRightLeft className="h-6 w-6 text-sky-600 shrink-0" />
                    <div className="flex-1 flex items-center gap-3 text-sm">
                        <div className="text-center">
                            <p className="font-bold text-sky-800">Supplier</p>
                            <p className="text-[10px] text-sky-600">Beli</p>
                        </div>
                        <div className="flex-1 border-t-2 border-dashed border-sky-300 relative">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-sky-100 px-2 rounded text-sky-700 font-bold">
                                HiFeed (Trading)
                            </span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-indigo-800">Customer</p>
                            <p className="text-[10px] text-indigo-600">Jual</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search commodity, supplier, customer..."
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

            {/* Trading Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="min-w-[1600px]">
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 text-[10px]">
                                <TableHead className="font-semibold sticky left-0 bg-muted/30 z-10">Trade ID</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Commodity</TableHead>
                                <TableHead className="font-semibold">Supplier</TableHead>
                                <TableHead className="font-semibold text-right">Buy/KG</TableHead>
                                <TableHead className="font-semibold text-right">Qty (KG)</TableHead>
                                <TableHead className="font-semibold text-right">Total Buy</TableHead>
                                <TableHead className="font-semibold">Customer</TableHead>
                                <TableHead className="font-semibold text-right">Sell/KG</TableHead>
                                <TableHead className="font-semibold text-right">Total Sell</TableHead>
                                <TableHead className="font-semibold text-right">Logistic</TableHead>
                                <TableHead className="font-semibold text-right">Margin/KG</TableHead>
                                <TableHead className="font-semibold text-right">%</TableHead>
                                <TableHead className="font-semibold text-right">GP</TableHead>
                                <TableHead className="font-semibold">Payment</TableHead>
                                <TableHead className="font-semibold">PO Buy</TableHead>
                                <TableHead className="font-semibold">Invoice</TableHead>
                                <TableHead className="font-semibold">ETA</TableHead>
                                <TableHead className="font-semibold text-center">Act</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((o) => {
                                const st = statusConfig[o.status];
                                return (
                                    <TableRow key={o.id} className="hover:bg-muted/20 text-[11px]">
                                        <TableCell className="sticky left-0 bg-background z-10">
                                            <div className="flex items-center gap-1">
                                                <ArrowRightLeft className="h-3 w-3 text-primary/60" />
                                                <span className="font-medium">{o.tradingId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] ${st.color}`}>{st.label}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{o.commodity}</TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="text-[11px]">{o.buyFromSupplier}</span>
                                                <p className="text-[9px] text-muted-foreground">{o.supplierArea}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-red-500">{o.buyPricePerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono">{o.buyQtyKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono text-red-500">{(o.totalBuyCost / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="text-[11px]">{o.sellToCustomer}</span>
                                                <p className="text-[9px] text-muted-foreground">{o.customerArea}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-emerald-600">{o.sellPricePerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono text-emerald-600 font-medium">{(o.totalSellPrice / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell className="text-right font-mono text-amber-600">{(o.logisticCost / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell className="text-right font-mono font-medium">{o.marginPerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            <span className={o.marginPercent >= 15 ? "text-emerald-600" : "text-amber-600"}>
                                                {o.marginPercent.toFixed(1)}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold text-emerald-700">{(o.gpTotal / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] ${paymentColors[o.paymentStatus]}`}>
                                                {o.paymentStatus === "FULL_PAID" ? "Paid" : o.paymentStatus === "DP_RECEIVED" ? "DP" : "Unpaid"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-[10px]">{o.noPoBuy}</TableCell>
                                        <TableCell className="font-mono text-[10px]">{o.noInvoice}</TableCell>
                                        <TableCell className="text-[10px]">{o.etaDelivery}</TableCell>
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

            {/* Info */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <ArrowRightLeft className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">Trading Komoditas</p>
                            <p>• <strong>Buy → Sell</strong>: HiFeed membeli barang dari supplier dan langsung menjual ke customer (beli-putus)</p>
                            <p>• Barang <strong>tidak masuk proses produksi</strong> — langsung forward atau transit di gudang</p>
                            <p>• Margin = Harga Jual - Harga Beli - Logistic Cost</p>
                            <p>• Cocok untuk: kemasan, mineral, premix, dan barang non-core lainnya</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
