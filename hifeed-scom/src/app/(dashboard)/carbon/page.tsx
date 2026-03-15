"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Leaf,
    TrendingUp,
    TreePine,
    Droplets,
    Edit,
    Save,
    X,
    Info,
    Zap,
    Mountain,
    ArrowDown,
    ArrowUp,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import {
    defaultCarbonConstants,
    calcCarbonMetrics,
    carbonMonthlyData,
    farmLands,
    type CarbonConstants,
} from "@/data/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { useState, useMemo } from "react";

const PILLAR_COLORS = {
    enteric: "#3b82f6",    // blue
    sequestration: "#10b981", // green
};

const constLabels: Record<keyof CarbonConstants, { label: string; unit: string; desc: string }> = {
    dailyConsumptionPerCattle: { label: "Daily Consumption / Cattle", unit: "kg/hari", desc: "Jumlah pakan yang dikonsumsi 1 ekor sapi per hari" },
    emissionReductionBaseline: { label: "Emission Reduction Baseline", unit: "tCO₂e/tahun", desc: "Reduksi emisi metana per ekor sapi per tahun" },
    dryWeightConversion: { label: "Dry Weight Conversion", unit: "rasio", desc: "Persentase berat kering setelah pengeringan (0.33 = 33%)" },
    spoilageRate: { label: "Spoilage Rate", unit: "rasio", desc: "Tingkat kehilangan/rusak dari proses manual (0.14 = 14%)" },
    indogiferaFormulaRatio: { label: "Indigofera Formula Ratio", unit: "rasio", desc: "Persentase Indigofera dalam produk GC (0.30 = 30%)" },
    carbonSequestrationPerHa: { label: "Carbon Sequestration / Ha", unit: "tCO₂e/ha/thn", desc: "Karbon yang diserap per hektar lahan per tahun" },
    freshYieldPerHaPerHarvest: { label: "Fresh Yield / Ha / Harvest", unit: "ton", desc: "Hasil panen basah per hektar per kali panen" },
    harvestsPerYear: { label: "Harvests / Year", unit: "×/tahun", desc: "Jumlah kali panen per tahun" },
};

export default function CarbonDashboardPage() {
    const { user } = useAuth();
    const canEdit = user?.role === "OWNER" || user?.role === "RND" || user?.role === "IT_OPS";

    const [constants, setConstants] = useState<CarbonConstants>({ ...defaultCarbonConstants });
    const [editing, setEditing] = useState(false);
    const [editValues, setEditValues] = useState<CarbonConstants>({ ...defaultCarbonConstants });

    const metrics = useMemo(() => calcCarbonMetrics(constants), [constants]);

    // Total sales from monthly data
    const totalSalesTon = carbonMonthlyData.reduce((s, d) => s + d.salesTon, 0);
    const activeHa = farmLands.filter(l => l.status === "ACTIVE").reduce((s, l) => s + l.areaHa, 0);

    // Recalculate monthly data with current constants
    const chartData = useMemo(() => {
        return carbonMonthlyData.map(d => ({
            month: d.month.replace("20", "'"),
            enteric: +(d.salesTon * metrics.entericPerTon).toFixed(2),
            sequestration: +(d.salesTon * metrics.sequestrationPerTon).toFixed(2),
            total: +(d.salesTon * metrics.totalPerTon).toFixed(2),
            salesTon: d.salesTon,
        }));
    }, [metrics]);

    const totalCO2Saved = +(totalSalesTon * metrics.totalPerTon).toFixed(2);
    const totalEnteric = +(totalSalesTon * metrics.entericPerTon).toFixed(2);
    const totalSequestration = +(totalSalesTon * metrics.sequestrationPerTon).toFixed(2);

    // Equivalent trees (1 tree absorbs ~0.022 tCO2/year over 10 years)
    const equivalentTrees = Math.round(totalCO2Saved / 0.022);

    const pieData = [
        { name: "Enteric Reduction", value: totalEnteric, color: PILLAR_COLORS.enteric },
        { name: "Sequestration", value: totalSequestration, color: PILLAR_COLORS.sequestration },
    ];

    const startEdit = () => {
        setEditValues({ ...constants });
        setEditing(true);
    };

    const saveEdit = () => {
        setConstants({ ...editValues });
        setEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-sky-900 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-1">
                        <Leaf className="h-5 w-5 text-emerald-300" />
                        <span className="text-emerald-300 text-xs font-semibold uppercase tracking-widest">Carbon Bank — HiFeed Impact</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {/* Total */}
                        <div className="md:col-span-1">
                            <p className="text-emerald-200/80 text-xs">Total CO₂e Saved</p>
                            <p className="text-5xl md:text-6xl font-black tracking-tight mt-1">
                                {totalCO2Saved.toFixed(1)}
                            </p>
                            <p className="text-lg text-emerald-200/90 font-semibold">tCO₂e</p>
                            <p className="text-xs text-emerald-300/70 mt-2">
                                ≈ {equivalentTrees.toLocaleString()} pohon ditanam selama 10 tahun
                            </p>
                        </div>
                        {/* Breakdown */}
                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-3 w-3 rounded-full bg-blue-400" />
                                    <span className="text-xs text-blue-200 font-semibold">DOWNSTREAM</span>
                                </div>
                                <p className="text-2xl font-bold">{totalEnteric.toFixed(2)} <span className="text-sm font-normal text-blue-200">tCO₂e</span></p>
                                <p className="text-[11px] text-blue-200/80 mt-1">Enteric Methane Reduction</p>
                                <p className="text-[10px] text-blue-300/60 mt-0.5">
                                    {metrics.entericPerTon} tCO₂e per ton produk
                                </p>
                            </div>
                            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                                    <span className="text-xs text-emerald-200 font-semibold">UPSTREAM</span>
                                </div>
                                <p className="text-2xl font-bold">{totalSequestration.toFixed(2)} <span className="text-sm font-normal text-emerald-200">tCO₂e</span></p>
                                <p className="text-[11px] text-emerald-200/80 mt-1">Carbon Sequestration</p>
                                <p className="text-[10px] text-emerald-300/60 mt-0.5">
                                    {metrics.sequestrationPerTon} tCO₂e per ton produk
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-white/5 border border-white/10 px-4 py-2 inline-flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-300" />
                        <span className="text-sm font-semibold">
                            Magic Number: <span className="text-amber-300">{metrics.totalPerTon}</span> tCO₂e per ton produk
                        </span>
                    </div>
                </div>
            </div>

            {/* Dual Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pillar 1 — Enteric */}
                <Card className="border-0 shadow-sm border-t-4 border-t-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                            <Droplets className="h-4 w-4" />
                            Pilar 1: Enteric Methane Reduction (Hilir)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                            Menghitung reduksi gas metana dari sendawa/kotoran sapi karena mengkonsumsi pakan HiFeed.
                        </p>
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-1 text-xs">
                            <p>🐄 Konsumsi harian: <strong>{constants.dailyConsumptionPerCattle} kg</strong> / ekor / hari</p>
                            <p>📅 Konsumsi tahunan: <strong>{(constants.dailyConsumptionPerCattle * 365 / 1000).toFixed(3)} ton</strong> / ekor / tahun</p>
                            <p>🌿 Reduksi emisi: <strong>{constants.emissionReductionBaseline} tCO₂e</strong> / ekor / tahun</p>
                            <p className="pt-1 border-t border-blue-200 font-semibold text-blue-800">
                                → Per ton produk: {constants.emissionReductionBaseline} ÷ {(constants.dailyConsumptionPerCattle * 365 / 1000).toFixed(3)} = <span className="text-lg">{metrics.entericPerTon}</span> tCO₂e
                            </p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                Source: Sales POS
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">Data ditarik dari total penjualan pakan</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Pillar 2 — Sequestration */}
                <Card className="border-0 shadow-sm border-t-4 border-t-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2 text-emerald-700">
                            <TreePine className="h-4 w-4" />
                            Pilar 2: Carbon Sequestration (Hulu)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                            Menghitung karbon yang diserap oleh tanaman Indigofera di lahan HiFeed.
                        </p>
                        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 space-y-1 text-xs">
                            <p>🌾 Fresh yield: <strong>{constants.freshYieldPerHaPerHarvest} ton</strong> × {constants.harvestsPerYear}× panen = <strong>{metrics.freshYieldPerYear} ton/ha/thn</strong></p>
                            <p>☀️ Dry weight: {metrics.freshYieldPerYear} × {(constants.dryWeightConversion * 100).toFixed(0)}% = <strong>{metrics.dryWeight.toFixed(1)} ton</strong></p>
                            <p>📉 After spoilage ({(constants.spoilageRate * 100).toFixed(0)}%): <strong>{metrics.afterSpoilage.toFixed(3)} ton</strong></p>
                            <p>🏭 Product output: {metrics.afterSpoilage.toFixed(3)} ÷ {(constants.indogiferaFormulaRatio * 100).toFixed(0)}% = <strong>{metrics.productOutputPerHa.toFixed(2)} ton GC/ha</strong></p>
                            <p className="pt-1 border-t border-emerald-200 font-semibold text-emerald-800">
                                → Per ton produk: {constants.carbonSequestrationPerHa} ÷ {metrics.productOutputPerHa.toFixed(2)} = <span className="text-lg">{metrics.sequestrationPerTon}</span> tCO₂e
                            </p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                                Source: Farm + Inventory
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">Active: {activeHa} Ha lahan ({farmLands.filter(l => l.status === "ACTIVE").length} blok)</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Trend Chart */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Carbon Impact Trend — Monthly
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradEnteric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={PILLAR_COLORS.enteric} stopOpacity={0.4} />
                                        <stop offset="100%" stopColor={PILLAR_COLORS.enteric} stopOpacity={0.05} />
                                    </linearGradient>
                                    <linearGradient id="gradSeq" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={PILLAR_COLORS.sequestration} stopOpacity={0.4} />
                                        <stop offset="100%" stopColor={PILLAR_COLORS.sequestration} stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}`} />
                                <Tooltip
                                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                                    formatter={(value: number | undefined, name: string | undefined) => [
                                        `${(value ?? 0).toFixed(2)} tCO₂e`,
                                        (name === "enteric" ? "Enteric Reduction" : name === "sequestration" ? "Sequestration" : "Total"),
                                    ]}
                                />
                                <Area type="monotone" dataKey="sequestration" stackId="1" stroke={PILLAR_COLORS.sequestration} fill="url(#gradSeq)" strokeWidth={2} />
                                <Area type="monotone" dataKey="enteric" stackId="1" stroke={PILLAR_COLORS.enteric} fill="url(#gradEnteric)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-2">
                        <div className="flex items-center gap-1.5 text-xs">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PILLAR_COLORS.sequestration }} />
                            <span className="text-muted-foreground">Upstream (Sequestration)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PILLAR_COLORS.enteric }} />
                            <span className="text-muted-foreground">Downstream (Enteric)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dynamic Variables */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Mountain className="h-4 w-4 text-primary" />
                            Formula Variables (Konstanta Dinamis)
                        </CardTitle>
                        {canEdit && !editing && (
                            <Button variant="outline" size="sm" onClick={startEdit} className="gap-1 cursor-pointer">
                                <Edit className="h-3.5 w-3.5" />
                                Edit Variables
                            </Button>
                        )}
                        {editing && (
                            <div className="flex gap-1">
                                <Button size="sm" onClick={saveEdit} className="gap-1 cursor-pointer">
                                    <Save className="h-3.5 w-3.5" />
                                    Save
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="cursor-pointer">
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(Object.keys(constLabels) as (keyof CarbonConstants)[]).map((key) => {
                            const meta = constLabels[key];
                            return (
                                <div key={key} className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate">{meta.label}</p>
                                        <p className="text-[10px] text-muted-foreground">{meta.desc}</p>
                                    </div>
                                    {editing ? (
                                        <Input
                                            type="number"
                                            step="any"
                                            value={editValues[key]}
                                            onChange={(e) => setEditValues(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                                            className="w-24 text-right text-xs h-8"
                                        />
                                    ) : (
                                        <div className="text-right shrink-0">
                                            <span className="text-sm font-bold">{constants[key]}</span>
                                            <span className="text-[10px] text-muted-foreground ml-1">{meta.unit}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {!canEdit && (
                        <p className="text-[10px] text-muted-foreground mt-3">
                            ⚠️ Hanya Owner & RND yang bisa mengubah variabel formula ini.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Investor Summary */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-50 to-sky-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Info className="h-4 w-4 text-sky-600" />
                        Investor Summary — Carbon Impact per Ton
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                For every <strong>1 ton</strong> of HiFeed product sold, we offset:
                            </p>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600">
                                {metrics.totalPerTon} tCO₂e
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-8 rounded-full bg-emerald-500" />
                                    <span className="text-xs">Upstream Sequestration: <strong>{metrics.sequestrationPerTon}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-8 rounded-full bg-blue-500" />
                                    <span className="text-xs">Downstream Enteric: <strong>{metrics.entericPerTon}</strong></span>
                                </div>
                            </div>
                            <div className="rounded-lg bg-white border border-border/50 px-3 py-2 text-[11px] text-muted-foreground space-y-0.5">
                                <p>📊 Total penjualan kumulatif: <strong>{totalSalesTon} ton</strong></p>
                                <p>🌳 Total karbon terselamatkan: <strong>{totalCO2Saved.toFixed(2)} tCO₂e</strong></p>
                                <p>🏞️ Lahan aktif: <strong>{activeHa} Ha</strong> ({farmLands.filter(l => l.status === "ACTIVE").length} blok)</p>
                            </div>
                        </div>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        strokeWidth={2}
                                        stroke="white"
                                    >
                                        {pieData.map((entry, idx) => (
                                            <Cell key={idx} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                                    <Tooltip formatter={(v: number | undefined) => `${(v ?? 0).toFixed(2)} tCO₂e`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
