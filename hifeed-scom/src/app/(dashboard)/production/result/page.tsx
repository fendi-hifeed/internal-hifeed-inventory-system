"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Save,
    Factory,
    Clock,
    Users,
    Package,
    Plus,
    Trash2,
    Zap,
    Timer,
    Play,
    Square,
    AlertTriangle,
    TrendingUp,
    Gauge,
    Flame,
} from "lucide-react";
import { products, stockItems } from "@/data/mock-data";
import { useState, useMemo, useCallback } from "react";

// --- Machine Master dengan spesifikasi ---
const machines = [
    { id: "MCHD1", name: "Chopper Silase Bensin", type: "CHOPPER", horsePower: 5.5, kw: 5.5 * 0.746, tarifPln: 1445 },
    { id: "MIX-01", name: "Mixer Besar", type: "MIXER", horsePower: 10, kw: 10 * 0.746, tarifPln: 1445 },
    { id: "PEL-01", name: "Mesin Pellet", type: "PELLET_MILL", horsePower: 15, kw: 15 * 0.746, tarifPln: 1445 },
    { id: "DRY-01", name: "Dryer Rotary", type: "DRYER", horsePower: 7.5, kw: 7.5 * 0.746, tarifPln: 1445 },
    { id: "GRD-01", name: "Grinder Hammer Mill", type: "GRINDER", horsePower: 20, kw: 20 * 0.746, tarifPln: 1445 },
];

const shifts = [
    { code: "PAGI", label: "Pagi (07:00 - 15:00)" },
    { code: "SIANG", label: "Siang (15:00 - 23:00)" },
    { code: "MALAM", label: "Malam (23:00 - 07:00)" },
];

// BOM line item
interface BomLine {
    id: string;
    productId: string;
    qty: string;
    uom: string;
}

// Machine runtime segment (on/off)
interface RuntimeSegment {
    id: string;
    startTime: string;
    endTime: string;
}

const rawMaterials = products.filter(
    (p) => p.cluster === "RAW_MATERIAL" || p.cluster === "ADDITIVE"
);

export default function ProductionResultPage() {
    const router = useRouter();
    const [machine, setMachine] = useState("");
    const [outputProduct, setOutputProduct] = useState("");
    const [outputQty, setOutputQty] = useState("");
    const [operators, setOperators] = useState("");
    const [shift, setShift] = useState("");

    // --- BOM Lines ---
    const [bomLines, setBomLines] = useState<BomLine[]>([
        { id: "bom-1", productId: "", qty: "", uom: "KG" },
    ]);

    const addBomLine = () => {
        setBomLines((prev) => [
            ...prev,
            { id: `bom-${Date.now()}`, productId: "", qty: "", uom: "KG" },
        ]);
    };

    const removeBomLine = (id: string) => {
        if (bomLines.length <= 1) return;
        setBomLines((prev) => prev.filter((b) => b.id !== id));
    };

    const updateBomLine = (id: string, field: keyof BomLine, value: string) => {
        setBomLines((prev) =>
            prev.map((b) => {
                if (b.id !== id) return b;
                const updated = { ...b, [field]: value };
                // Auto-set UOM from product
                if (field === "productId") {
                    const prod = products.find((p) => p.id === value);
                    if (prod) updated.uom = prod.defaultUom;
                }
                return updated;
            })
        );
    };

    // --- Machine Runtime Segments ---
    const [runtimeSegments, setRuntimeSegments] = useState<RuntimeSegment[]>([
        { id: "rt-1", startTime: "", endTime: "" },
    ]);

    const addRuntimeSegment = () => {
        setRuntimeSegments((prev) => [
            ...prev,
            { id: `rt-${Date.now()}`, startTime: "", endTime: "" },
        ]);
    };

    const removeRuntimeSegment = (id: string) => {
        if (runtimeSegments.length <= 1) return;
        setRuntimeSegments((prev) => prev.filter((s) => s.id !== id));
    };

    const updateRuntimeSegment = (
        id: string,
        field: "startTime" | "endTime",
        value: string
    ) => {
        setRuntimeSegments((prev) =>
            prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
        );
    };

    // --- Calculations ---
    const selectedMachine = useMemo(
        () => machines.find((m) => m.id === machine),
        [machine]
    );

    // Total runtime (jam) from all segments
    const totalRuntime = useMemo(() => {
        let total = 0;
        for (const seg of runtimeSegments) {
            if (seg.startTime && seg.endTime) {
                const diff =
                    (new Date(`2026-01-01T${seg.endTime}`).getTime() -
                        new Date(`2026-01-01T${seg.startTime}`).getTime()) /
                    3600000;
                if (diff > 0) total += diff;
            }
        }
        return total;
    }, [runtimeSegments]);

    // Electricity cost = KW × jam × tarif PLN per KWH
    const electricityCost = useMemo(() => {
        if (!selectedMachine || totalRuntime <= 0) return 0;
        return selectedMachine.kw * totalRuntime * selectedMachine.tarifPln;
    }, [selectedMachine, totalRuntime]);

    // Throughput & labor
    const outputNum = parseFloat(outputQty) || 0;
    const throughput =
        totalRuntime > 0 && outputNum > 0
            ? (outputNum / totalRuntime).toFixed(0)
            : "0";
    const laborEfficiency =
        parseInt(operators) && outputNum > 0
            ? (outputNum / parseInt(operators) / 1000).toFixed(1)
            : "0";

    // BOM validation — check stock availability
    const bomValidation = useMemo(() => {
        return bomLines.map((line) => {
            if (!line.productId || !line.qty) return { ...line, available: 0, sufficient: true };
            const stock = stockItems.find((s) => s.productId === line.productId);
            const available = stock?.currentQty ?? 0;
            const needed = parseFloat(line.qty) || 0;
            return { ...line, available, sufficient: available >= needed };
        });
    }, [bomLines]);

    const hasInsufficientStock = bomValidation.some((b) => !b.sufficient && b.productId && b.qty);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-sm text-muted-foreground">
                Input hasil produksi — raw material yang dipakai, runtime mesin, qty output.
            </p>

            {/* 1. Machine & Output */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Factory className="h-4 w-4 text-primary" />
                        Machine & Output
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Machine</Label>
                            <Select value={machine} onValueChange={setMachine}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select machine" />
                                </SelectTrigger>
                                <SelectContent>
                                    {machines.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>
                                            <div className="flex items-center gap-2">
                                                <span>{m.name}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    ({m.horsePower} HP / {m.kw.toFixed(1)} KW)
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Output Product</Label>
                            <Select
                                value={outputProduct}
                                onValueChange={setOutputProduct}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products
                                        .filter(
                                            (p) =>
                                                p.cluster === "FINISHED_GOOD"
                                        )
                                        .map((p) => (
                                            <SelectItem
                                                key={p.id}
                                                value={p.id}
                                            >
                                                {p.displayName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Machine Specs Badge */}
                    {selectedMachine && (
                        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-violet-200 dark:border-violet-800 p-3">
                            <Gauge className="h-5 w-5 text-violet-600" />
                            <div className="flex-1">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="font-semibold text-violet-700 dark:text-violet-400">
                                        {selectedMachine.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                    <span>⚡ {selectedMachine.horsePower} HP</span>
                                    <span>🔌 {selectedMachine.kw.toFixed(2)} KW</span>
                                    <span>💡 Tarif PLN: Rp {selectedMachine.tarifPln.toLocaleString()}/KWH</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-emerald-500" />
                            Output Quantity (Kg)
                        </Label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={outputQty}
                            onChange={(e) => setOutputQty(e.target.value)}
                            className="h-14 text-2xl text-center font-bold"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 2. BOM / Raw Material Input */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Flame className="h-4 w-4 text-orange-500" />
                            Raw Material (BOM)
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addBomLine}
                            className="h-8 text-xs gap-1"
                        >
                            <Plus className="h-3 w-3" /> Tambah Bahan
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Material yang dipakai akan otomatis mengurangi stok di Inventory.
                    </p>
                </CardHeader>
                <CardContent className="space-y-3">
                    {bomLines.map((line, idx) => {
                        const validation = bomValidation[idx];
                        const selectedProd = products.find(
                            (p) => p.id === line.productId
                        );
                        const stock = stockItems.find(
                            (s) => s.productId === line.productId
                        );

                        return (
                            <div
                                key={line.id}
                                className="rounded-xl border border-border/50 p-3 space-y-2"
                            >
                                <div className="flex items-start gap-2">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_120px_80px] gap-2">
                                        {/* Product Select */}
                                        <Select
                                            value={line.productId}
                                            onValueChange={(v) =>
                                                updateBomLine(
                                                    line.id,
                                                    "productId",
                                                    v
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Pilih bahan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rawMaterials.map((p) => (
                                                    <SelectItem
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.displayName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {/* Qty */}
                                        <Input
                                            type="number"
                                            placeholder="Qty"
                                            value={line.qty}
                                            onChange={(e) =>
                                                updateBomLine(
                                                    line.id,
                                                    "qty",
                                                    e.target.value
                                                )
                                            }
                                            className="h-9"
                                        />

                                        {/* UOM */}
                                        <div className="flex items-center justify-center h-9 rounded-md bg-muted/50 text-sm font-mono">
                                            {line.uom}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-red-400 hover:text-red-600 shrink-0"
                                        onClick={() => removeBomLine(line.id)}
                                        disabled={bomLines.length <= 1}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>

                                {/* Stock Availability Check */}
                                {line.productId && line.qty && (
                                    <div
                                        className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg ${validation?.sufficient
                                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                                                : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                                            }`}
                                    >
                                        {validation?.sufficient ? (
                                            <>
                                                <Package className="h-3 w-3" />
                                                Stok tersedia: {stock?.currentQty.toLocaleString() ?? 0} {line.uom}
                                                {stock?.location && (
                                                    <span className="text-muted-foreground ml-1">
                                                        ({stock.location})
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="h-3 w-3" />
                                                Stok kurang! Tersedia: {stock?.currentQty.toLocaleString() ?? 0} {line.uom}, Butuh: {parseFloat(line.qty).toLocaleString()} {line.uom}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {hasInsufficientStock && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3 py-2 text-xs text-red-700 dark:text-red-300">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span>
                                <strong>Warning:</strong> Ada material yang stoknya tidak cukup. Cek ulang sebelum submit.
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 3. Machine Runtime Tracking */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Timer className="h-4 w-4 text-sky-500" />
                            Machine Runtime
                            {totalRuntime > 0 && (
                                <Badge variant="secondary" className="ml-2 text-xs bg-sky-100 text-sky-700">
                                    Total: {totalRuntime.toFixed(1)} jam
                                </Badge>
                            )}
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addRuntimeSegment}
                            className="h-8 text-xs gap-1"
                        >
                            <Plus className="h-3 w-3" /> Tambah Segmen
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Catat setiap segmen mesin ON → OFF. Jika mesin mati lalu nyala lagi, tambah segmen baru.
                    </p>
                </CardHeader>
                <CardContent className="space-y-3">
                    {runtimeSegments.map((seg, idx) => {
                        const segDuration =
                            seg.startTime && seg.endTime
                                ? Math.max(
                                    0,
                                    (new Date(`2026-01-01T${seg.endTime}`).getTime() -
                                        new Date(`2026-01-01T${seg.startTime}`).getTime()) /
                                    3600000
                                )
                                : 0;

                        return (
                            <div
                                key={seg.id}
                                className="rounded-xl border border-border/50 p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground w-20 shrink-0">
                                        <div
                                            className={`h-2 w-2 rounded-full ${segDuration > 0
                                                    ? "bg-emerald-500"
                                                    : "bg-gray-300"
                                                }`}
                                        />
                                        Segmen {idx + 1}
                                    </div>
                                    <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                                        <div className="relative">
                                            <Play className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-emerald-500" />
                                            <Input
                                                type="time"
                                                value={seg.startTime}
                                                onChange={(e) =>
                                                    updateRuntimeSegment(
                                                        seg.id,
                                                        "startTime",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-9 pl-8 text-center"
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">→</span>
                                        <div className="relative">
                                            <Square className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-red-400" />
                                            <Input
                                                type="time"
                                                value={seg.endTime}
                                                onChange={(e) =>
                                                    updateRuntimeSegment(
                                                        seg.id,
                                                        "endTime",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-9 pl-8 text-center"
                                            />
                                        </div>
                                    </div>
                                    {segDuration > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs bg-sky-50 text-sky-700 shrink-0"
                                        >
                                            {segDuration.toFixed(1)}h
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-400 hover:text-red-600 shrink-0"
                                        onClick={() =>
                                            removeRuntimeSegment(seg.id)
                                        }
                                        disabled={runtimeSegments.length <= 1}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Runtime visual bar */}
                    {runtimeSegments.length > 1 && totalRuntime > 0 && (
                        <div className="rounded-lg bg-muted/30 p-3">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Timeline
                            </p>
                            <div className="flex items-center gap-1 h-4">
                                {runtimeSegments.map((seg, idx) => {
                                    const dur =
                                        seg.startTime && seg.endTime
                                            ? Math.max(
                                                0,
                                                (new Date(`2026-01-01T${seg.endTime}`).getTime() -
                                                    new Date(`2026-01-01T${seg.startTime}`).getTime()) /
                                                3600000
                                            )
                                            : 0;
                                    if (dur <= 0) return null;
                                    const pct = (dur / totalRuntime) * 100;
                                    return (
                                        <div
                                            key={seg.id}
                                            className="h-full rounded bg-sky-500 transition-all"
                                            style={{ width: `${pct}%` }}
                                            title={`Segmen ${idx + 1}: ${dur.toFixed(1)}h`}
                                        />
                                    );
                                })}
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                <span>{runtimeSegments.length} segmen</span>
                                <span>Total: {totalRuntime.toFixed(1)} jam</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 4. Shift & Operators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            Shift
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={shift} onValueChange={setShift}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select shift" />
                            </SelectTrigger>
                            <SelectContent>
                                {shifts.map((s) => (
                                    <SelectItem key={s.code} value={s.code}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Users className="h-4 w-4 text-sky-500" />
                            Operators
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="number"
                            placeholder="Jumlah operator/helper"
                            value={operators}
                            onChange={(e) => setOperators(e.target.value)}
                            className="h-12 text-2xl text-center font-bold"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* 5. Performance Metrics + Electricity */}
            {totalRuntime > 0 && outputNum > 0 && (
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-950/20 dark:to-sky-950/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">📊 Performance & Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-white dark:bg-background rounded-xl p-3.5 text-center shadow-sm">
                                <TrendingUp className="h-4 w-4 mx-auto mb-1.5 text-primary" />
                                <p className="text-[10px] text-muted-foreground">
                                    Throughput
                                </p>
                                <p className="text-xl font-bold text-primary">
                                    {throughput}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Kg/Jam
                                </p>
                            </div>
                            <div className="bg-white dark:bg-background rounded-xl p-3.5 text-center shadow-sm">
                                <Timer className="h-4 w-4 mx-auto mb-1.5 text-sky-600" />
                                <p className="text-[10px] text-muted-foreground">
                                    Total Runtime
                                </p>
                                <p className="text-xl font-bold text-sky-600">
                                    {totalRuntime.toFixed(1)}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Jam Nyala
                                </p>
                            </div>
                            <div className="bg-white dark:bg-background rounded-xl p-3.5 text-center shadow-sm">
                                <Zap className="h-4 w-4 mx-auto mb-1.5 text-amber-500" />
                                <p className="text-[10px] text-muted-foreground">
                                    Biaya Listrik
                                </p>
                                <p className="text-xl font-bold text-amber-600">
                                    {(electricityCost / 1000).toFixed(0)}K
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Rp ({selectedMachine?.kw.toFixed(1)} KW × {totalRuntime.toFixed(1)}h)
                                </p>
                            </div>
                            <div className="bg-white dark:bg-background rounded-xl p-3.5 text-center shadow-sm">
                                <Users className="h-4 w-4 mx-auto mb-1.5 text-violet-600" />
                                <p className="text-[10px] text-muted-foreground">
                                    Labor Efficiency
                                </p>
                                <p className="text-xl font-bold text-violet-600">
                                    {laborEfficiency}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Ton/Operator
                                </p>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        {electricityCost > 0 && (
                            <div className="mt-3 rounded-lg bg-white dark:bg-background border border-border/50 p-3">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    📐 Rumus Biaya Listrik
                                </p>
                                <div className="flex items-center gap-2 text-xs font-mono">
                                    <span className="text-violet-600 font-bold">{selectedMachine?.horsePower} HP</span>
                                    <span className="text-muted-foreground">× 0.746 =</span>
                                    <span className="font-bold">{selectedMachine?.kw.toFixed(2)} KW</span>
                                    <span className="text-muted-foreground">×</span>
                                    <span className="text-sky-600 font-bold">{totalRuntime.toFixed(1)} Jam</span>
                                    <span className="text-muted-foreground">×</span>
                                    <span className="text-amber-600 font-bold">Rp {selectedMachine?.tarifPln.toLocaleString()}</span>
                                    <span className="text-muted-foreground">=</span>
                                    <span className="text-emerald-600 font-bold text-sm">
                                        Rp {electricityCost.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <Button className="w-full h-14 text-base gap-2 rounded-xl shadow-lg cursor-pointer">
                <Save className="h-5 w-5" />
                Submit Production Result
            </Button>
        </div>
    );
}
