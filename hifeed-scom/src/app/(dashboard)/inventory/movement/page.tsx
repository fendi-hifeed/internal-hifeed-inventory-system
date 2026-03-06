"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    ArrowDownRight,
    ArrowUpLeft,
    ShoppingCart,
    Megaphone,
    FlaskConical,
    ArrowLeftRight,
    AlertTriangle,
    RotateCcw,
    Plus,
    Lock,
} from "lucide-react";
import {
    inventoryMovements,
    movementFlagLabels,
    stockItems,
    rndBudget,
    type MovementFlag,
} from "@/data/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { useState, useMemo } from "react";

const flagIcons: Record<MovementFlag, typeof ShoppingCart> = {
    SALES: ShoppingCart,
    MARKETING_SAMPLE: Megaphone,
    RND_SAMPLE: FlaskConical,
    WAREHOUSE_TRANSFER: ArrowLeftRight,
    DEFECT: AlertTriangle,
    RETURN: RotateCcw,
};

const flagColors: Record<MovementFlag, string> = {
    SALES: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MARKETING_SAMPLE: "bg-amber-50 text-amber-700 border-amber-200",
    RND_SAMPLE: "bg-violet-50 text-violet-700 border-violet-200",
    WAREHOUSE_TRANSFER: "bg-blue-50 text-blue-700 border-blue-200",
    DEFECT: "bg-red-50 text-red-700 border-red-200",
    RETURN: "bg-sky-50 text-sky-700 border-sky-200",
};

const flagAccounting: Record<MovementFlag, string> = {
    SALES: "Revenue / AR",
    MARKETING_SAMPLE: "Sales & Mktg Expense",
    RND_SAMPLE: "R&D Expense",
    WAREHOUSE_TRANSFER: "No valuasi change",
    DEFECT: "Write-off / Loss",
    RETURN: "Reverse Revenue",
};

// ---- HARD LOCK: Pagu limits ----
const MARKETING_SAMPLE_LIMIT_KG = 100; // max 100 KG total marketing samples
const RND_SAMPLE_LIMIT_PERCENT = 2; // max 2% of total inventory value

export default function MovementPage() {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [flagFilter, setFlagFilter] = useState("ALL");
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formFlag, setFormFlag] = useState<MovementFlag | "">("");
    const [formProduct, setFormProduct] = useState("");
    const [formQty, setFormQty] = useState("");
    const [formDest, setFormDest] = useState("");
    const [formReason, setFormReason] = useState("");
    const [formError, setFormError] = useState("");

    const totalInventoryValue = stockItems.reduce(
        (s, i) => s + i.totalValue,
        0
    );

    // Calculate current usage
    const marketingSampleUsed = inventoryMovements
        .filter((m) => m.flag === "MARKETING_SAMPLE")
        .reduce((s, m) => s + m.qtyKg, 0);

    const rndSampleUsed = inventoryMovements
        .filter((m) => m.flag === "RND_SAMPLE")
        .reduce((s, m) => s + m.qtyKg, 0);

    const rndLimitValue = totalInventoryValue * (RND_SAMPLE_LIMIT_PERCENT / 100);
    const rndSampleValueUsed = rndSampleUsed * 3000; // rough avg cost per KG

    // Filter
    const filtered = inventoryMovements.filter((m) => {
        const matchSearch =
            m.productName.toLowerCase().includes(search.toLowerCase()) ||
            m.destination.toLowerCase().includes(search.toLowerCase()) ||
            m.reason.toLowerCase().includes(search.toLowerCase());
        const matchFlag = flagFilter === "ALL" || m.flag === flagFilter;
        return matchSearch && matchFlag;
    });

    // Stats by flag
    const byFlag = useMemo(() => {
        const result: Record<string, { count: number; qty: number }> = {};
        inventoryMovements.forEach((m) => {
            if (!result[m.flag]) result[m.flag] = { count: 0, qty: 0 };
            result[m.flag].count++;
            result[m.flag].qty += m.qtyKg;
        });
        return result;
    }, []);

    // Hard lock validation
    const validateSubmit = () => {
        const qty = parseFloat(formQty) || 0;
        if (formFlag === "MARKETING_SAMPLE") {
            const newTotal = marketingSampleUsed + qty;
            if (newTotal > MARKETING_SAMPLE_LIMIT_KG) {
                setFormError(
                    `❌ HARD LOCK: Total marketing sample akan ${newTotal} KG, melebihi limit ${MARKETING_SAMPLE_LIMIT_KG} KG. Sisa kuota: ${MARKETING_SAMPLE_LIMIT_KG - marketingSampleUsed} KG.`
                );
                return false;
            }
        }
        if (formFlag === "RND_SAMPLE") {
            const newValueTotal = rndSampleValueUsed + qty * 3000;
            if (newValueTotal > rndLimitValue) {
                setFormError(
                    `❌ HARD LOCK: Total R&D sample akan melebihi pagu ${RND_SAMPLE_LIMIT_PERCENT}% dari inventory value (Rp ${(rndLimitValue / 1000000).toFixed(1)}M). Tidak bisa submit. Butuh approval Owner.`
                );
                return false;
            }
        }
        setFormError("");
        return true;
    };

    const handleSubmit = () => {
        if (!validateSubmit()) return;
        // In real implementation, this would POST to backend
        setShowForm(false);
        setFormFlag("");
        setFormProduct("");
        setFormQty("");
        setFormDest("");
        setFormReason("");
        setFormError("");
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Flagging dan tracking setiap barang yang keluar dari inventory — Sales, Sample, Transfer, Defect, atau Retur.
            </p>

            {/* Pagu Limits Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Megaphone className="h-4 w-4 text-amber-500" />
                                <span className="text-xs font-semibold">Marketing Sample Limit</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {marketingSampleUsed} / {MARKETING_SAMPLE_LIMIT_KG} KG
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                            <div
                                className={`h-full rounded-full ${(marketingSampleUsed / MARKETING_SAMPLE_LIMIT_KG) * 100 >= 90 ? "bg-red-500" : (marketingSampleUsed / MARKETING_SAMPLE_LIMIT_KG) * 100 >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${Math.min((marketingSampleUsed / MARKETING_SAMPLE_LIMIT_KG) * 100, 100)}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Sisa: {MARKETING_SAMPLE_LIMIT_KG - marketingSampleUsed} KG
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <FlaskConical className="h-4 w-4 text-violet-500" />
                                <span className="text-xs font-semibold">R&D Sample Pagu (2%)</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Rp {(rndSampleValueUsed / 1000).toFixed(0)}K / Rp {(rndLimitValue / 1000).toFixed(0)}K
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                            <div
                                className={`h-full rounded-full ${(rndSampleValueUsed / rndLimitValue) * 100 >= 90 ? "bg-red-500" : (rndSampleValueUsed / rndLimitValue) * 100 >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${Math.min((rndSampleValueUsed / Math.max(rndLimitValue, 1)) * 100, 100)}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            {((rndSampleValueUsed / Math.max(rndLimitValue, 1)) * 100).toFixed(1)}% terpakai
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Flag Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {(Object.keys(movementFlagLabels) as MovementFlag[]).map((flag) => {
                    const data = byFlag[flag] || { count: 0, qty: 0 };
                    const Icon = flagIcons[flag];
                    return (
                        <Card key={flag} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setFlagFilter(flag)}>
                            <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${flagColors[flag]}`}>
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-semibold truncate">{movementFlagLabels[flag]}</p>
                                        <p className="text-[9px] text-muted-foreground">{data.qty} KG • {data.count}x</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Add Movement Button + Form */}
            <div className="flex justify-end">
                <Button onClick={() => setShowForm(!showForm)} className="gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Record Barang Keluar
                </Button>
            </div>

            {showForm && (
                <Card className="border-0 shadow-sm border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Input Barang Keluar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Flag / Kategori *</Label>
                                <Select value={formFlag} onValueChange={(v) => { setFormFlag(v as MovementFlag); setFormError(""); }}>
                                    <SelectTrigger><SelectValue placeholder="Pilih flag" /></SelectTrigger>
                                    <SelectContent>
                                        {(Object.keys(movementFlagLabels) as MovementFlag[]).map((f) => (
                                            <SelectItem key={f} value={f}>{movementFlagLabels[f]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formFlag && (
                                    <p className="text-[10px] text-muted-foreground">
                                        Akun: {flagAccounting[formFlag as MovementFlag]}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Produk *</Label>
                                <Select value={formProduct} onValueChange={setFormProduct}>
                                    <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
                                    <SelectContent>
                                        {stockItems.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>{s.productName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Qty (KG) *</Label>
                                <Input type="number" placeholder="0" value={formQty} onChange={(e) => { setFormQty(e.target.value); setFormError(""); }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Destination / Tujuan *</Label>
                                <Input placeholder="Nama customer, gudang, lab..." value={formDest} onChange={(e) => setFormDest(e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Alasan *</Label>
                                <Input placeholder="Alasan pengeluaran barang..." value={formReason} onChange={(e) => setFormReason(e.target.value)} />
                            </div>
                        </div>

                        {/* Hard Lock Error */}
                        {formError && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                                <Lock className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                                <p className="text-xs text-red-700 font-medium">{formError}</p>
                            </div>
                        )}

                        {/* Pagu warning */}
                        {formFlag === "MARKETING_SAMPLE" && !formError && (
                            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-700">
                                ⚠️ Marketing Sample: sisa kuota {MARKETING_SAMPLE_LIMIT_KG - marketingSampleUsed} KG
                            </div>
                        )}
                        {formFlag === "RND_SAMPLE" && !formError && (
                            <div className="rounded-lg bg-violet-50 border border-violet-200 p-2 text-[11px] text-violet-700">
                                ⚠️ R&D Sample: pagu {RND_SAMPLE_LIMIT_PERCENT}% inventory. Sisa: Rp {((rndLimitValue - rndSampleValueUsed) / 1000).toFixed(0)}K
                            </div>
                        )}
                        {formFlag === "DEFECT" && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-2 text-[11px] text-red-700">
                                ⚠️ Defect: wajib upload foto bukti di langkah berikutnya
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowForm(false)} className="cursor-pointer">Batal</Button>
                            <Button onClick={handleSubmit} className="cursor-pointer">Submit Barang Keluar</Button>
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
                            <Input placeholder="Search product, destination, reason..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-muted/30 border-0" />
                        </div>
                        <Select value={flagFilter} onValueChange={setFlagFilter}>
                            <SelectTrigger className="w-full sm:w-44 bg-muted/30 border-0">
                                <SelectValue placeholder="All Flags" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Flags</SelectItem>
                                {(Object.keys(movementFlagLabels) as MovementFlag[]).map((f) => (
                                    <SelectItem key={f} value={f}>{movementFlagLabels[f]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Movement Log Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 text-[10px]">
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Flag</TableHead>
                                <TableHead className="font-semibold">Product</TableHead>
                                <TableHead className="font-semibold text-right">Qty (KG)</TableHead>
                                <TableHead className="font-semibold">Destination</TableHead>
                                <TableHead className="font-semibold">Akun</TableHead>
                                <TableHead className="font-semibold">Reason</TableHead>
                                <TableHead className="font-semibold">By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((m) => {
                                const FlagIcon = flagIcons[m.flag];
                                const isOut = m.flag !== "RETURN";
                                return (
                                    <TableRow key={m.id} className="hover:bg-muted/20 text-[11px]">
                                        <TableCell className="font-mono text-[10px]">{m.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] gap-1 ${flagColors[m.flag]}`}>
                                                <FlagIcon className="h-3 w-3" />
                                                {movementFlagLabels[m.flag]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{m.productName}</TableCell>
                                        <TableCell className="text-right font-mono font-bold">
                                            <span className={isOut ? "text-red-600" : "text-emerald-600"}>
                                                {isOut ? "-" : "+"}{m.qtyKg}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[10px]">{m.destination}</TableCell>
                                        <TableCell className="text-[10px] text-muted-foreground">{flagAccounting[m.flag]}</TableCell>
                                        <TableCell className="max-w-[180px]">
                                            <p className="text-[10px] text-muted-foreground truncate">{m.reason}</p>
                                        </TableCell>
                                        <TableCell className="text-[10px]">{m.createdBy}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
