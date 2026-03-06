"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
    ScanBarcode,
    PackageCheck,
    Truck,
    Factory,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Eye,
    ArrowRight,
    Sprout,
    Package,
    User,
    Calendar,
    MapPin,
} from "lucide-react";
import {
    productionBags,
    productionRuns,
    type ProductionBag,
    type BagStatus,
} from "@/data/mock-data";
import { useState, useMemo } from "react";

const bagStatusConfig: Record<BagStatus, { color: string; label: string; icon: typeof PackageCheck }> = {
    IN_STOCK: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "In Stock", icon: Package },
    SHIPPED: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Shipped", icon: Truck },
    DELIVERED: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Delivered", icon: CheckCircle2 },
    COMPLAINT: { color: "bg-red-50 text-red-700 border-red-200", label: "Complaint", icon: AlertTriangle },
};

const gradeColors: Record<string, string> = {
    A: "bg-emerald-100 text-emerald-700",
    B: "bg-amber-100 text-amber-700",
    C: "bg-red-100 text-red-700",
};

export default function BarcodeLookupPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedBag, setSelectedBag] = useState<ProductionBag | null>(null);
    const [scanInput, setScanInput] = useState("");

    // Filter bags
    const filtered = productionBags.filter((b) => {
        const matchSearch =
            b.barcodeId.toLowerCase().includes(search.toLowerCase()) ||
            b.productName.toLowerCase().includes(search.toLowerCase()) ||
            (b.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
            b.productionRunNumber.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    // Stats
    const totalBags = productionBags.length;
    const inStock = productionBags.filter((b) => b.status === "IN_STOCK").length;
    const shipped = productionBags.filter((b) => b.status === "SHIPPED").length;
    const delivered = productionBags.filter((b) => b.status === "DELIVERED").length;
    const complaints = productionBags.filter((b) => b.status === "COMPLAINT").length;

    // Scan / Lookup
    const handleScan = () => {
        const found = productionBags.find(
            (b) => b.barcodeId.toLowerCase() === scanInput.trim().toLowerCase()
        );
        if (found) {
            setSelectedBag(found);
            setScanInput("");
        }
    };

    // Get production run details for selected bag
    const selectedRun = selectedBag
        ? productionRuns.find((r) => r.id === selectedBag.productionRunId)
        : null;

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Scan atau cari barcode karung untuk trace asal produksi, pengiriman, dan handle komplain.
            </p>

            {/* Scan Input — prominent */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <ScanBarcode className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm">Scan / Lookup Barcode</span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ketik atau scan barcode, contoh: HF-PR2026002-003"
                            value={scanInput}
                            onChange={(e) => setScanInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleScan()}
                            className="flex-1 bg-background border-primary/20 font-mono"
                        />
                        <Button onClick={handleScan} className="gap-2 cursor-pointer">
                            <Search className="h-4 w-4" />
                            Lookup
                        </Button>
                    </div>
                    {scanInput && !productionBags.find((b) => b.barcodeId.toLowerCase() === scanInput.trim().toLowerCase()) && scanInput.length > 5 && (
                        <p className="text-xs text-red-500 mt-2">⚠ Barcode tidak ditemukan — pastikan format benar (contoh: HF-PR2026002-001)</p>
                    )}
                </CardContent>
            </Card>

            {/* Detail Card — when a bag is selected */}
            {selectedBag && selectedRun && (
                <Card className="border-0 shadow-sm border-l-4 border-l-primary animate-fade-in-up">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ScanBarcode className="h-4 w-4 text-primary" />
                                Detail Karung: <span className="font-mono text-primary">{selectedBag.barcodeId}</span>
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={bagStatusConfig[selectedBag.status].color}>
                                    {bagStatusConfig[selectedBag.status].label}
                                </Badge>
                                {selectedBag.qualityGrade && (
                                    <Badge className={gradeColors[selectedBag.qualityGrade]}>
                                        Grade {selectedBag.qualityGrade}
                                    </Badge>
                                )}
                                <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => setSelectedBag(null)}>
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Complaint Alert */}
                        {selectedBag.status === "COMPLAINT" && selectedBag.complaintNote && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-red-800">Complaint Aktif</p>
                                    <p className="text-xs text-red-700 mt-1">{selectedBag.complaintNote}</p>
                                </div>
                            </div>
                        )}

                        {/* Journey Timeline */}
                        <div className="flex items-center gap-3 py-2">
                            <div className="text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 mx-auto">
                                    <Sprout className="h-5 w-5 text-emerald-600" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Farm</p>
                                <p className="text-[9px] font-mono">{selectedRun.sourceBatchCode || "-"}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 mx-auto">
                                    <Factory className="h-5 w-5 text-violet-600" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Produksi</p>
                                <p className="text-[9px] font-mono">{selectedRun.runNumber}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 mx-auto">
                                    <Package className="h-5 w-5 text-blue-600" />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Karung</p>
                                <p className="text-[9px] font-mono">{selectedBag.weightKg} KG</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="text-center">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl mx-auto ${selectedBag.deliveryDoNumber ? "bg-amber-100" : "bg-gray-100"}`}>
                                    <Truck className={`h-5 w-5 ${selectedBag.deliveryDoNumber ? "text-amber-600" : "text-gray-400"}`} />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Kirim</p>
                                <p className="text-[9px] font-mono">{selectedBag.deliveryDoNumber || "-"}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="text-center">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl mx-auto ${selectedBag.customerName ? "bg-teal-100" : "bg-gray-100"}`}>
                                    <User className={`h-5 w-5 ${selectedBag.customerName ? "text-teal-600" : "text-gray-400"}`} />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">Customer</p>
                                <p className="text-[9px] font-mono truncate max-w-[80px]">{selectedBag.customerName || "-"}</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Detail Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div>
                                <p className="text-muted-foreground">Product</p>
                                <p className="font-semibold">{selectedBag.productName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Weight</p>
                                <p className="font-semibold">{selectedBag.weightKg} KG</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Produced</p>
                                <p className="font-semibold">{selectedBag.producedAt}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Machine</p>
                                <p className="font-semibold">{selectedRun.machineName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Shift</p>
                                <p className="font-semibold">{selectedRun.shiftCode}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Operators</p>
                                <p className="font-semibold">{selectedRun.operatorCount} orang</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Delivered</p>
                                <p className="font-semibold">{selectedBag.deliveredAt || "-"}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Customer</p>
                                <p className="font-semibold">{selectedBag.customerName || "Belum dikirim"}</p>
                            </div>
                        </div>

                        <Separator />

                        {/* BOM from production run */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">BOM (Bill of Materials) — Bahan Baku yang Digunakan:</p>
                            <div className="space-y-1">
                                {selectedRun.bomItems.map((bom, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs rounded-md bg-muted/50 px-3 py-1.5">
                                        <span>{bom.name}</span>
                                        <span className="font-mono font-medium">{bom.qty} {bom.uom}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-3 text-center">
                        <p className="text-lg font-bold">{totalBags}</p>
                        <p className="text-[10px] text-muted-foreground">Total Karung</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-3 text-center">
                        <p className="text-lg font-bold text-blue-600">{inStock}</p>
                        <p className="text-[10px] text-muted-foreground">In Stock</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-3 text-center">
                        <p className="text-lg font-bold text-amber-600">{shipped}</p>
                        <p className="text-[10px] text-muted-foreground">Shipped</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-3 text-center">
                        <p className="text-lg font-bold text-emerald-600">{delivered}</p>
                        <p className="text-[10px] text-muted-foreground">Delivered</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-3 text-center">
                        <p className="text-lg font-bold text-red-600">{complaints}</p>
                        <p className="text-[10px] text-muted-foreground">Complaints</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search barcode, product, customer..."
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
                                {Object.entries(bagStatusConfig).map(([k, v]) => (
                                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bags Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 text-[10px]">
                                <TableHead className="font-semibold">Barcode ID</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Grade</TableHead>
                                <TableHead className="font-semibold">Product</TableHead>
                                <TableHead className="font-semibold text-right">Weight</TableHead>
                                <TableHead className="font-semibold">Prod. Run</TableHead>
                                <TableHead className="font-semibold">Produced</TableHead>
                                <TableHead className="font-semibold">DO#</TableHead>
                                <TableHead className="font-semibold">Customer</TableHead>
                                <TableHead className="font-semibold text-center">Detail</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((bag) => {
                                const st = bagStatusConfig[bag.status];
                                return (
                                    <TableRow
                                        key={bag.id}
                                        className={`hover:bg-muted/20 text-[11px] cursor-pointer ${bag.status === "COMPLAINT" ? "bg-red-50/30" : ""}`}
                                        onClick={() => setSelectedBag(bag)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <ScanBarcode className="h-3.5 w-3.5 text-primary" />
                                                <span className="font-mono font-bold text-primary">{bag.barcodeId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] ${st.color}`}>{st.label}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {bag.qualityGrade && (
                                                <Badge className={`text-[9px] ${gradeColors[bag.qualityGrade]}`}>
                                                    {bag.qualityGrade}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{bag.productName}</TableCell>
                                        <TableCell className="text-right font-mono">{bag.weightKg} KG</TableCell>
                                        <TableCell className="font-mono text-[10px]">{bag.productionRunNumber}</TableCell>
                                        <TableCell className="text-[10px]">{bag.producedAt}</TableCell>
                                        <TableCell className="font-mono text-[10px]">{bag.deliveryDoNumber || "-"}</TableCell>
                                        <TableCell className="text-[10px]">{bag.customerName || "-"}</TableCell>
                                        <TableCell className="text-center">
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-pointer" onClick={() => setSelectedBag(bag)}>
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

            {/* Role Responsibilities */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Role & Tanggung Jawab</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-start gap-2 rounded-lg bg-violet-50 p-3">
                            <Factory className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold text-violet-800">Operator</p>
                                <p className="text-violet-700">Generate barcode ID otomatis setelah produksi selesai — 1 barcode per karung</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3">
                            <Truck className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold text-amber-800">Logistics</p>
                                <p className="text-amber-700">Attach barcode ID ke surat jalan (DO) — scan karung saat loading truk</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
                            <User className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold text-blue-800">Owner / Finance</p>
                                <p className="text-blue-700">Lookup barcode saat ada komplain customer — verifikasi apakah klaim valid</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-3">
                            <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold text-rose-800">Complaint Flow</p>
                                <p className="text-rose-700">Customer komplain → scan barcode → lihat batch, BOM, tanggal produksi → hindari false claim</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
