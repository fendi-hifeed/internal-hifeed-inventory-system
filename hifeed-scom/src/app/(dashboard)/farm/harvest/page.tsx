"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Save, Scale, Camera, Upload, Calculator, Sprout } from "lucide-react";
import { farmBatches } from "@/data/mock-data";
import { useState } from "react";

export default function HarvestPage() {
    const [batchId, setBatchId] = useState("");
    const [totalWeight, setTotalWeight] = useState("");
    const [sampleCount, setSampleCount] = useState("");
    const [sampleWeight, setSampleWeight] = useState("");

    const readyBatches = farmBatches.filter(
        (b) => b.status === "READY_HARVEST" || b.status === "GROWING"
    );
    const selectedBatch = farmBatches.find((b) => b.id === batchId);

    const avgWeight =
        parseFloat(sampleWeight) && parseFloat(sampleCount)
            ? parseFloat(sampleWeight) / parseFloat(sampleCount)
            : 0;
    const estimatedPop =
        avgWeight > 0 && parseFloat(totalWeight)
            ? Math.round(parseFloat(totalWeight) / avgWeight)
            : 0;
    const mortalityRate =
        selectedBatch && estimatedPop
            ? (
                ((selectedBatch.initialQty - estimatedPop) /
                    selectedBatch.initialQty) *
                100
            ).toFixed(1)
            : "0";

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-sm text-muted-foreground">
                Input hasil panen dengan metode sampling untuk menghitung estimasi populasi dan rate kematian.
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
                            <SelectValue placeholder="Pilih batch untuk panen..." />
                        </SelectTrigger>
                        <SelectContent>
                            {readyBatches.map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                    {b.batchCode} — {b.productName} (Pop: {b.currentQty.toLocaleString()})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Total Weight */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Scale className="h-4 w-4 text-sky-500" />
                        Total Berat Panen
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Label className="text-sm">Berat Total Panen (Kg) — dari timbangan truk</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={totalWeight}
                        onChange={(e) => setTotalWeight(e.target.value)}
                        className="h-14 text-2xl text-center font-bold mt-2"
                    />
                </CardContent>
            </Card>

            {/* Sampling Input */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-amber-500" />
                        Sampling Data
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Jumlah Sample</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 10"
                                value={sampleCount}
                                onChange={(e) => setSampleCount(e.target.value)}
                                className="h-12 text-xl text-center font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Berat Total Sample (Kg)</Label>
                            <Input
                                type="number"
                                placeholder="e.g. 20"
                                value={sampleWeight}
                                onChange={(e) => setSampleWeight(e.target.value)}
                                className="h-12 text-xl text-center font-bold"
                            />
                        </div>
                    </div>

                    {avgWeight > 0 && (
                        <div className="bg-primary/5 rounded-xl p-4 text-center">
                            <p className="text-xs text-muted-foreground">
                                Average Weight per Unit
                            </p>
                            <p className="text-2xl font-bold text-primary">
                                {avgWeight.toFixed(2)}{" "}
                                <span className="text-sm font-normal text-muted-foreground">
                                    Kg
                                </span>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Calculated Results */}
            {estimatedPop > 0 && selectedBatch && (
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-sky-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            📊 Calculation Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                <p className="text-xs text-muted-foreground">
                                    Estimated Population
                                </p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {estimatedPop.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                <p className="text-xs text-muted-foreground">
                                    Final Mortality Rate
                                </p>
                                <p className="text-2xl font-bold text-rose-500">
                                    {mortalityRate}%
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                            <p className="text-xs text-muted-foreground mb-1">
                                Formula
                            </p>
                            <p className="text-sm font-mono text-muted-foreground">
                                Est. Population = {totalWeight} Kg ÷ {avgWeight.toFixed(2)} Kg ={" "}
                                <span className="text-primary font-bold">
                                    {estimatedPop.toLocaleString()}
                                </span>
                            </p>
                            <p className="text-sm font-mono text-muted-foreground mt-1">
                                Mortality = ({selectedBatch.initialQty.toLocaleString()} -{" "}
                                {estimatedPop.toLocaleString()}) ÷{" "}
                                {selectedBatch.initialQty.toLocaleString()} ={" "}
                                <span className="text-rose-500 font-bold">{mortalityRate}%</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Photo Upload */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Foto Surat Timbang</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                        <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium">Upload foto surat timbang</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                        <Button variant="outline" size="sm" className="gap-2 mt-3 cursor-pointer">
                            <Upload className="h-3.5 w-3.5" />
                            Choose File
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Submit */}
            <Button className="w-full h-14 text-base gap-2 rounded-xl shadow-lg cursor-pointer">
                <Save className="h-5 w-5" />
                Submit Harvest Result
            </Button>
        </div>
    );
}
