"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    QrCode, Search, Truck, Package, Factory, Leaf, TreePine, Eye, MapPin,
    CalendarDays, Weight, ScanLine,
} from "lucide-react";
import { shipmentBarcodes } from "@/data/mock-data";
import { useState } from "react";

export default function ScanPage() {
    const [barcodeInput, setBarcodeInput] = useState("");
    const [scannedBarcode, setScannedBarcode] = useState<typeof shipmentBarcodes[0] | null>(null);
    const [notFound, setNotFound] = useState(false);

    const handleScan = () => {
        const found = shipmentBarcodes.find(
            (b) => b.barcodeId.toLowerCase() === barcodeInput.trim().toLowerCase()
        );
        if (found) {
            setScannedBarcode(found);
            setNotFound(false);
        } else {
            setScannedBarcode(null);
            setNotFound(true);
        }
    };

    const handleQuickSelect = (barcode: typeof shipmentBarcodes[0]) => {
        setBarcodeInput(barcode.barcodeId);
        setScannedBarcode(barcode);
        setNotFound(false);
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Scanner Card */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-lg">
                            <ScanLine className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-xl">Wholesale Traceability Scanner</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Scan atau ketik Master Barcode untuk melihat silsilah lengkap muatan truk
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ketik barcode ID, misal: HF-DO2026-0001"
                                value={barcodeInput}
                                onChange={(e) => setBarcodeInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                                className="pl-9 h-12 text-base font-mono"
                            />
                        </div>
                        <Button onClick={handleScan} className="h-12 px-6 gap-2 cursor-pointer">
                            <Search className="h-4 w-4" />
                            Scan
                        </Button>
                    </div>

                    {/* Quick Select */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground self-center">Quick test:</span>
                        {shipmentBarcodes.map((b) => (
                            <Button
                                key={b.id}
                                variant="outline"
                                size="sm"
                                className="text-xs font-mono cursor-pointer"
                                onClick={() => handleQuickSelect(b)}
                            >
                                {b.barcodeId}
                            </Button>
                        ))}
                    </div>

                    {notFound && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm text-center">
                            ❌ Barcode <span className="font-mono font-bold">{barcodeInput}</span> tidak ditemukan.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Traceability Result */}
            {scannedBarcode && (
                <div className="space-y-4 animate-fade-in-up">
                    {/* Master Barcode Header */}
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-emerald-50">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <QrCode className="h-5 w-5 text-primary" />
                                        <span className="font-mono font-bold text-lg">{scannedBarcode.barcodeId}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{scannedBarcode.doNumber} — {scannedBarcode.customerName}</p>
                                </div>
                                <Badge className="bg-emerald-500 text-white">
                                    <Eye className="h-3 w-3 mr-1" />
                                    Viewed {scannedBarcode.scannedCount}×
                                </Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Weight className="h-3.5 w-3.5" /> {scannedBarcode.totalWeightTon} Ton</span>
                                <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {scannedBarcode.generatedAt}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Detail */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Package className="h-4 w-4 text-blue-500" />
                                Product Detail
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {scannedBarcode.productsSummary.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                                        <span className="text-sm font-medium">{p.productName}</span>
                                        <Badge variant="outline">{p.qty.toLocaleString("id-ID")} {p.uom}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Production Trace */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Factory className="h-4 w-4 text-violet-500" />
                                Production Trace
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {scannedBarcode.productionRuns.map((pr) => (
                                    <div key={pr.id} className="bg-muted/50 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">{pr.number}</span>
                                            <span className="text-xs text-muted-foreground">{pr.date}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{pr.product}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Farm Origin */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Leaf className="h-4 w-4 text-emerald-500" />
                                Farm Origin
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {scannedBarcode.farmBatches.map((fb) => (
                                    <div key={fb.batchId} className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-emerald-800">{fb.batchId}</span>
                                            <Badge variant="outline" className="border-emerald-200 text-emerald-700 text-[10px]">{fb.cropType}</Badge>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-emerald-700">
                                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{fb.landName}</span>
                                            <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />Harvested {fb.harvestDate}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Carbon Impact */}
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <TreePine className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-emerald-100 text-xs uppercase tracking-wide">Carbon Impact</p>
                                    <p className="text-2xl font-bold">{scannedBarcode.carbonImpactTco2e} tCO₂e saved</p>
                                </div>
                            </div>
                            <p className="text-emerald-100 text-sm">
                                Muatan {scannedBarcode.totalWeightTon} ton produk HiFeed ini menyelamatkan {scannedBarcode.carbonImpactTco2e} ton CO₂ equivalent,
                                setara dengan menanam <span className="font-bold text-white">{Math.round(scannedBarcode.carbonImpactTco2e * 45)}</span> pohon 🌳
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
