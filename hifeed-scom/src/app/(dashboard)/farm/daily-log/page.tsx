"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save, Sprout, Users, Clock, Skull, Wheat } from "lucide-react";
import { farmBatches } from "@/data/mock-data";
import { useState } from "react";

export default function DailyLogPage() {
    const [batchId, setBatchId] = useState("");
    const [mortalityCount, setMortalityCount] = useState("");
    const [manPower, setManPower] = useState("");
    const [laborHours, setLaborHours] = useState("");
    const [feedUsed, setFeedUsed] = useState("");
    const [notes, setNotes] = useState("");

    const activeBatches = farmBatches.filter(
        (b) =>
            b.status !== "HARVESTED" && b.status !== "WRITE_OFF"
    );
    const selectedBatch = farmBatches.find((b) => b.id === batchId);
    const totalHours =
        (parseFloat(manPower) || 0) * (parseFloat(laborHours) || 0);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-sm text-muted-foreground">
                Input data harian untuk batch aktif. Form ini mobile-friendly untuk
                petugas lapangan.
            </p>

            {/* Batch Selection */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-emerald-500" />
                        Select Batch
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={batchId} onValueChange={setBatchId}>
                        <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Pilih batch..." />
                        </SelectTrigger>
                        <SelectContent>
                            {activeBatches.map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                    {b.batchCode} — {b.productName} ({b.locationName})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedBatch && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="bg-muted/50 rounded-lg p-2 text-center">
                                <p className="text-[10px] text-muted-foreground">Current</p>
                                <p className="text-sm font-bold">
                                    {selectedBatch.currentQty.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-2 text-center">
                                <p className="text-[10px] text-muted-foreground">HST</p>
                                <p className="text-sm font-bold">{selectedBatch.hst}</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-2 text-center">
                                <p className="text-[10px] text-muted-foreground">Mortality</p>
                                <p className="text-sm font-bold text-rose-500">
                                    {selectedBatch.mortalityRate}%
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Mortality Input */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Skull className="h-4 w-4 text-rose-500" />
                        Mortality Count
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Label className="text-sm">Jumlah mati hari ini</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={mortalityCount}
                        onChange={(e) => setMortalityCount(e.target.value)}
                        className="h-14 text-2xl text-center font-bold mt-2"
                    />
                </CardContent>
            </Card>

            {/* Man Power */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-sky-500" />
                        Man Power
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Jumlah Pekerja</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={manPower}
                                onChange={(e) => setManPower(e.target.value)}
                                className="h-12 text-xl text-center font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Jam Kerja / Orang</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={laborHours}
                                onChange={(e) => setLaborHours(e.target.value)}
                                className="h-12 text-xl text-center font-bold"
                            />
                        </div>
                    </div>
                    {totalHours > 0 && (
                        <div className="bg-primary/5 rounded-lg p-3 text-center">
                            <p className="text-xs text-muted-foreground">Total Labor Hours</p>
                            <p className="text-2xl font-bold text-primary">
                                {totalHours}
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                    jam
                                </span>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Feed Usage */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Wheat className="h-4 w-4 text-amber-500" />
                        Feed / Input Usage
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Label className="text-sm">Pakan / Input yang digunakan (Kg)</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={feedUsed}
                        onChange={(e) => setFeedUsed(e.target.value)}
                        className="h-12 text-xl text-center font-bold mt-2"
                    />
                </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                    <Label>Catatan Lapangan</Label>
                    <Textarea
                        placeholder="Kondisi cuaca, catatan khusus, dll..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="mt-2 text-base"
                    />
                </CardContent>
            </Card>

            {/* Submit */}
            <Button className="w-full h-14 text-base gap-2 rounded-xl shadow-lg cursor-pointer">
                <Save className="h-5 w-5" />
                Simpan Log Harian
            </Button>
        </div>
    );
}
