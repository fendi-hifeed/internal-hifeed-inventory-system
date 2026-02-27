"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save, Camera, Upload, Truck, FileCheck } from "lucide-react";
import { deliveryTrips } from "@/data/mock-data";
import { useState } from "react";

export default function UploadPODPage() {
    const [tripId, setTripId] = useState("");
    const [notes, setNotes] = useState("");

    const activeTripsList = deliveryTrips.filter(
        (t) => t.status === "ON_THE_WAY" || t.status === "LOADING"
    );
    const selectedTrip = deliveryTrips.find((t) => t.id === tripId);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-sm text-muted-foreground">
                Upload foto surat jalan dan bukti penerimaan barang sebagai Proof of
                Delivery (POD).
            </p>

            {/* Trip Selection */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        Select Trip
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={tripId} onValueChange={setTripId}>
                        <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Pilih trip..." />
                        </SelectTrigger>
                        <SelectContent>
                            {activeTripsList.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                    {t.doNumber} — {t.driverName} → {t.customerName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {selectedTrip && (
                        <div className="mt-3 bg-muted/50 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Driver</span>
                                <span className="font-medium">{selectedTrip.driverName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Vehicle</span>
                                <span className="font-medium">{selectedTrip.vehiclePlate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Customer</span>
                                <span className="font-medium">{selectedTrip.customerName}</span>
                            </div>
                            <div className="h-px bg-border" />
                            {selectedTrip.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.productName}</span>
                                    <span className="font-medium">
                                        {item.qty} {item.uom}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Photo Upload: Surat Jalan */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-emerald-500" />
                        Foto Surat Jalan (Signed)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                        <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm font-medium">
                            Upload foto surat jalan yang sudah ditandatangani
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 10MB
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 mt-3 cursor-pointer"
                        >
                            <Upload className="h-3.5 w-3.5" />
                            Take Photo / Choose File
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Digital Signature Placeholder */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">TTD Digital Penerima</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-border rounded-xl p-12 text-center bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            📝 Signature pad area
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tap and draw signature here
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                    <Label>Catatan Pengiriman</Label>
                    <Textarea
                        placeholder="Kondisi barang saat diterima, catatan khusus..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="mt-2"
                    />
                </CardContent>
            </Card>

            <Button className="w-full h-14 text-base gap-2 rounded-xl shadow-lg cursor-pointer">
                <Save className="h-5 w-5" />
                Submit POD & Mark as Delivered
            </Button>
        </div>
    );
}
