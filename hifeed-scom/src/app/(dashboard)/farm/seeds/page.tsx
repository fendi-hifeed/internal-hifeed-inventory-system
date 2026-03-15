"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    Sprout,
    Leaf,
    Calendar,
    MapPin,
    Users,
    DollarSign,
    ArrowRight,
    Package,
    AlertTriangle,
    Info,
} from "lucide-react";
import { farmLands, products } from "@/data/mock-data";
import { useState } from "react";

// ===== Types =====
interface SeedCollection {
    id: string;
    date: string;
    landId: string;
    landName: string;
    plantType: string;
    productCode: string;
    qtyKg: number;
    mandaysCount: number;
    wagePerDay: number;
    totalCost: number; // mandaysCount × wagePerDay
    costPerKg: number; // totalCost / qtyKg
    collectedBy: string;
    status: "COLLECTED" | "IN_NURSERY" | "PLANTED" | "CONSUMED";
    notes: string;
}

interface MortalityStandard {
    phase: string;
    rateMin: number;
    rateMax: number;
    description: string;
    color: string;
}

// ===== Mortality Rate Standards =====
const mortalityStandards: MortalityStandard[] = [
    { phase: "Nursery (Pembibitan)", rateMin: 5, rateMax: 15, description: "Normal untuk tanaman tropical. Bibit masih rentan terhadap hama dan cuaca.", color: "text-amber-600 bg-amber-50 border-amber-200" },
    { phase: "Growing (Penanaman)", rateMin: 1, rateMax: 5, description: "Setelah bibit kuat dan ditanam di lahan. Mortality rendah.", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { phase: "Ready Harvest", rateMin: 0, rateMax: 1, description: "Hampir tidak ada kematian. Tanaman sudah matang.", color: "text-sky-600 bg-sky-50 border-sky-200" },
];

// ===== Mock Data =====
const rawMaterials = products.filter(p => p.cluster === "RAW_MATERIAL");

const mockSeeds: SeedCollection[] = [
    {
        id: "sd1", date: "2026-02-10", landId: "l1", landName: "Lahan Canggu A",
        plantType: "Indigofera", productCode: "DM_CPTN1", qtyKg: 25,
        mandaysCount: 3, wagePerDay: 150000, totalCost: 450000, costPerKg: 18000,
        collectedBy: "Tim Harian (3 org)", status: "IN_NURSERY",
        notes: "Biji dari panen batch sebelumnya, kualitas bagus",
    },
    {
        id: "sd2", date: "2026-02-15", landId: "l2", landName: "Lahan Gunung Terang",
        plantType: "Pakchong", productCode: "DM_CFHP1", qtyKg: 40,
        mandaysCount: 5, wagePerDay: 150000, totalCost: 750000, costPerKg: 18750,
        collectedBy: "Tim Harian (4 org)", status: "PLANTED",
        notes: "Biji dari cutting batang Pakchong",
    },
    {
        id: "sd3", date: "2026-03-01", landId: "l1", landName: "Lahan Canggu A",
        plantType: "Indigofera", productCode: "DM_CPTN1", qtyKg: 15,
        mandaysCount: 2, wagePerDay: 150000, totalCost: 300000, costPerKg: 20000,
        collectedBy: "Tim Harian (2 org)", status: "COLLECTED",
        notes: "Biji baru dikumpulkan, belum masuk pembibitan",
    },
    {
        id: "sd4", date: "2026-03-05", landId: "l3", landName: "Lahan Tanjung Sari",
        plantType: "Indigofera", productCode: "DM_CPTN1", qtyKg: 10,
        mandaysCount: 2, wagePerDay: 120000, totalCost: 240000, costPerKg: 24000,
        collectedBy: "Tim Borongan (2 org)", status: "COLLECTED",
        notes: "Biji dari lahan baru, perlu seleksi kualitas",
    },
    {
        id: "sd5", date: "2026-03-08", landId: "l2", landName: "Lahan Gunung Terang",
        plantType: "Pakchong", productCode: "DM_CFHP1", qtyKg: 30,
        mandaysCount: 4, wagePerDay: 150000, totalCost: 600000, costPerKg: 20000,
        collectedBy: "Tim Harian (3 org)", status: "IN_NURSERY",
        notes: "Cutting untuk pembibitan batch baru",
    },
];

const statusConfig = {
    COLLECTED: { label: "Collected", color: "bg-gray-100 text-gray-700 border-gray-200" },
    IN_NURSERY: { label: "In Nursery", color: "bg-violet-50 text-violet-700 border-violet-200" },
    PLANTED: { label: "Planted", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CONSUMED: { label: "Used Up", color: "bg-sky-50 text-sky-700 border-sky-200" },
};

export default function FarmSeedsPage() {
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const filtered = mockSeeds.filter(s =>
        s.plantType.toLowerCase().includes(search.toLowerCase()) ||
        s.landName.toLowerCase().includes(search.toLowerCase())
    );

    const totalSeedKg = mockSeeds.reduce((s, sd) => s + sd.qtyKg, 0);
    const totalCost = mockSeeds.reduce((s, sd) => s + sd.totalCost, 0);
    const avgCostPerKg = totalSeedKg > 0 ? totalCost / totalSeedKg : 0;
    const collectedKg = mockSeeds.filter(s => s.status === "COLLECTED").reduce((s, sd) => s + sd.qtyKg, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-500 to-emerald-500 shadow-lg">
                        <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Seeds / Biji</h1>
                        <p className="text-sm text-muted-foreground">
                            Input biji dari lahan — harga dihitung dari mandays tenaga kerja
                        </p>
                    </div>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2 rounded-xl shadow-sm cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Input Biji Baru
                </Button>
            </div>

            {/* Phase Flow */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-lime-50/50 to-emerald-50/50 dark:from-lime-950/10 dark:to-emerald-950/10">
                <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-lime-100 text-lime-800 font-semibold">
                            <Leaf className="h-4 w-4" />
                            Biji (dari lahan)
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-100 text-violet-800 font-semibold">
                            <Sprout className="h-4 w-4" />
                            Bibit (Nursery)
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
                            <MapPin className="h-4 w-4" />
                            Tanam di Lahan
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-100 text-sky-800 font-semibold hidden sm:flex">
                            <Package className="h-4 w-4" />
                            Inventory
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-2">
                        Harga biji = total mandays × upah per hari → otomatis masuk valuasi inventory
                    </p>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-500 to-lime-600 shadow-lg">
                            <Leaf className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Biji</p>
                            <p className="text-xl font-bold">{totalSeedKg} KG</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Available (Collected)</p>
                            <p className="text-xl font-bold">{collectedKg} KG</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Cost</p>
                            <p className="text-xl font-bold">Rp {(totalCost / 1000).toFixed(0)}K</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Avg Cost/KG</p>
                            <p className="text-xl font-bold">Rp {avgCostPerKg.toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Input Form */}
            {showForm && (
                <Card className="border-0 shadow-sm border-l-4 border-l-lime-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-lime-600" />
                            Input Koleksi Biji Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Lahan Asal *</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Pilih lahan" /></SelectTrigger>
                                    <SelectContent>
                                        {farmLands.map(l => (
                                            <SelectItem key={l.id} value={l.id}>{l.name} ({l.location})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Jenis Tanaman *</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Pilih tanaman" /></SelectTrigger>
                                    <SelectContent>
                                        {rawMaterials.filter(p => ["DM_CPTN1", "DM_CFHP1"].includes(p.internalCode)).map(p => (
                                            <SelectItem key={p.id} value={p.internalCode}>{p.displayName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Qty Biji (KG) *</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Jumlah Mandays *</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Upah per Hari (Rp) *</Label>
                                <Input type="number" placeholder="150000" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Dikumpulkan oleh</Label>
                                <Input placeholder="Tim Harian (3 org)" />
                            </div>
                        </div>
                        <div className="rounded-lg bg-lime-50 border border-lime-200 p-3">
                            <p className="text-xs text-lime-800">
                                💡 <strong>Harga biji</strong> = Mandays × Upah per hari. Nilai ini akan otomatis masuk ke inventory sebagai valuasi bahan baku (seed).
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowForm(false)} className="cursor-pointer">Batal</Button>
                            <Button className="cursor-pointer gap-2">
                                <Leaf className="h-4 w-4" />
                                Simpan Koleksi Biji
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search jenis tanaman, lahan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-0 shadow-sm" />
            </div>

            {/* Seed Collection Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 text-[10px]">
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Lahan</TableHead>
                                <TableHead className="font-semibold">Tanaman</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold text-right">Qty (KG)</TableHead>
                                <TableHead className="font-semibold text-right">Mandays</TableHead>
                                <TableHead className="font-semibold text-right">Upah/Hari</TableHead>
                                <TableHead className="font-semibold text-right">Total Cost</TableHead>
                                <TableHead className="font-semibold text-right">Cost/KG</TableHead>
                                <TableHead className="font-semibold">Pekerja</TableHead>
                                <TableHead className="font-semibold">Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(sd => {
                                const st = statusConfig[sd.status];
                                return (
                                    <TableRow key={sd.id} className="hover:bg-muted/20 text-[11px]">
                                        <TableCell className="font-mono text-[10px]">{sd.date}</TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-emerald-500" />
                                                {sd.landName}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-[9px]">{sd.plantType}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] ${st.color}`}>{st.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold">{sd.qtyKg}</TableCell>
                                        <TableCell className="text-right font-mono">{sd.mandaysCount}</TableCell>
                                        <TableCell className="text-right font-mono">Rp {sd.wagePerDay.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-right font-mono font-bold text-amber-600">
                                            Rp {(sd.totalCost / 1000).toFixed(0)}K
                                        </TableCell>
                                        <TableCell className="text-right font-mono">Rp {sd.costPerKg.toLocaleString("id-ID")}</TableCell>
                                        <TableCell className="text-[10px]">{sd.collectedBy}</TableCell>
                                        <TableCell className="text-[10px] text-muted-foreground max-w-[200px] truncate">{sd.notes}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Mortality Rate Standards */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Standar Mortality Rate per Fase
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {mortalityStandards.map((ms, i) => (
                            <div key={i} className={`rounded-xl border p-4 space-y-2 ${ms.color}`}>
                                <p className="text-sm font-bold">{ms.phase}</p>
                                <p className="text-2xl font-black">{ms.rateMin}% — {ms.rateMax}%</p>
                                <p className="text-[10px] leading-relaxed">{ms.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 rounded-lg bg-muted/30 p-3 flex items-start gap-2">
                        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-[10px] text-muted-foreground">
                            Rate di atas adalah standar historis. Jika aktual mortality melebihi standar, sistem akan menampilkan peringatan di Daily Log dan Dashboard.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
