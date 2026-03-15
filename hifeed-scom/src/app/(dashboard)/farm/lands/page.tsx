"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Search,
    MapPin,
    Ruler,
    Droplets,
    Sprout,
    Pause,
    Wrench,
    Eye,
    Trees,
    Mountain,
} from "lucide-react";
import { farmLands, farmBatches } from "@/data/mock-data";
import { useState } from "react";

const statusConfig = {
    ACTIVE: { label: "Active", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Trees },
    RESTING: { label: "Resting", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Pause },
    PREPARATION: { label: "Preparation", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Wrench },
};

export default function FarmLandsPage() {
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const filtered = farmLands.filter(
        (l) =>
            l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.location.toLowerCase().includes(search.toLowerCase())
    );

    const totalAreaHa = farmLands.reduce((s, l) => s + l.areaHa, 0);
    const activeCount = farmLands.filter((l) => l.status === "ACTIVE").length;
    const totalSqM = farmLands.reduce((s, l) => s + l.areaSqM, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    Mapping lahan pertanian — data area, lokasi, jenis tanah, dan batch tanam yang aktif di tiap lahan.
                </p>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2 rounded-xl shadow-sm cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Tambah Lahan
                </Button>
            </div>

            {/* Add Land Form */}
            {showForm && (
                <Card className="border-0 shadow-sm border-l-4 border-l-emerald-500 animate-fade-in-up">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Mountain className="h-4 w-4 text-emerald-600" />
                            Tambah Lahan Baru
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Nama Lahan *</Label>
                                <Input placeholder="Misal: Lahan Canggu B" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Lokasi *</Label>
                                <Input placeholder="Misal: Canggu, Lampung" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Luas (m²) *</Label>
                                <Input type="number" placeholder="5000" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Jenis Tanah</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Pilih jenis tanah" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Latosol">Latosol</SelectItem>
                                        <SelectItem value="Andosol">Andosol</SelectItem>
                                        <SelectItem value="Alluvial">Alluvial</SelectItem>
                                        <SelectItem value="Regosol">Regosol</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Sumber Air</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Pilih sumber air" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Irigasi">Irigasi</SelectItem>
                                        <SelectItem value="Tadah Hujan">Tadah Hujan</SelectItem>
                                        <SelectItem value="Sungai">Sungai</SelectItem>
                                        <SelectItem value="Sumur Bor">Sumur Bor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs">Status Awal</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PREPARATION">Preparation</SelectItem>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="RESTING">Resting</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Catatan</Label>
                            <Input placeholder="Catatan tentang lahan..." />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowForm(false)} className="cursor-pointer">Batal</Button>
                            <Button className="cursor-pointer gap-2">
                                <Mountain className="h-4 w-4" />
                                Simpan Lahan
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                            <Mountain className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Lahan</p>
                            <p className="text-xl font-bold">{farmLands.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-lg">
                            <Ruler className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Area</p>
                            <p className="text-xl font-bold">{totalAreaHa.toFixed(1)} Ha</p>
                            <p className="text-[10px] text-muted-foreground">{totalSqM.toLocaleString("id-ID")} m²</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg">
                            <Trees className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Lahan Active</p>
                            <p className="text-xl font-bold">{activeCount}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <Sprout className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Batch Aktif</p>
                            <p className="text-xl font-bold">
                                {farmLands.filter((l) => l.currentBatchId).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search lahan atau lokasi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-card border-0 shadow-sm"
                />
            </div>

            {/* Land Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((land, i) => {
                    const st = statusConfig[land.status];
                    const StatusIcon = st.icon;
                    const linkedBatch = land.currentBatchId
                        ? farmBatches.find((b) => b.id === land.currentBatchId)
                        : null;

                    return (
                        <Card
                            key={land.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all animate-fade-in-up py-0"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <CardContent className="p-5 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Mountain className="h-4 w-4 text-emerald-500" />
                                            <span className="font-bold text-sm">{land.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            {land.location}
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`text-[11px] gap-1 ${st.color}`}>
                                        <StatusIcon className="h-3 w-3" />
                                        {st.label}
                                    </Badge>
                                </div>

                                {/* Area Info */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                                        <p className="text-xs text-muted-foreground">Area</p>
                                        <p className="text-sm font-bold">{land.areaHa} Ha</p>
                                        <p className="text-[9px] text-muted-foreground">{land.areaSqM.toLocaleString("id-ID")} m²</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                                        <p className="text-xs text-muted-foreground">Tanah</p>
                                        <p className="text-[11px] font-semibold">{land.soilType}</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                                        <p className="text-xs text-muted-foreground">Air</p>
                                        <p className="text-[10px] font-semibold">{land.waterSource}</p>
                                    </div>
                                </div>

                                {/* Current Batch */}
                                {linkedBatch ? (
                                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Sprout className="h-4 w-4 text-emerald-600" />
                                                <div>
                                                    <p className="text-xs font-semibold text-emerald-800">
                                                        {linkedBatch.batchCode}
                                                    </p>
                                                    <p className="text-[10px] text-emerald-700">
                                                        {linkedBatch.productName} • HST {linkedBatch.hst}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-[9px] bg-emerald-100 text-emerald-700 border-emerald-300"
                                            >
                                                {linkedBatch.status.replace("_", " ")}
                                            </Badge>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3 text-center">
                                        <p className="text-xs text-muted-foreground">
                                            Tidak ada batch aktif — lahan tersedia untuk penanaman baru
                                        </p>
                                    </div>
                                )}

                                {/* Notes */}
                                <p className="text-[10px] text-muted-foreground italic">
                                    {land.notes}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Info Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/10 dark:to-teal-950/10">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Mountain className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">
                                Cara Pakai Lahan Mapping
                            </p>
                            <p>1. <strong>Tambah Lahan</strong> — tim Farm mendaftarkan lahan baru beserta luasnya</p>
                            <p>2. <strong>Buat Batch Baru</strong> — pilih lahan mana yang akan dipakai untuk penanaman</p>
                            <p>3. <strong>Status "Resting"</strong> — lahan yang sedang diistirahatkan setelah panen</p>
                            <p>4. <strong>Status "Preparation"</strong> — lahan baru yang sedang disiapkan (pembersihan, pupuk dasar)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
