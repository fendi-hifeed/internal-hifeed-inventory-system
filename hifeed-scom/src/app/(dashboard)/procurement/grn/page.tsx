"use client";

import { useRouter } from "next/navigation";
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
import { ArrowLeft, Upload, Camera, Save, Plus, Trash2 } from "lucide-react";
import { purchaseOrders } from "@/data/mock-data";
import { useState } from "react";

interface ReceiptItem {
    id: string;
    productName: string;
    qtyOrdered: number;
    uom: string;
    qtyReceived: string;
    qtyRejected: string;
    weight: string;
}

export default function GRNCreatePage() {
    const router = useRouter();
    const [selectedPO, setSelectedPO] = useState("");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<ReceiptItem[]>([]);

    const activePOs = purchaseOrders.filter(
        (po) => po.status === "APPROVED" || po.status === "PARTIAL_RECEIVED"
    );

    const handlePOSelect = (poId: string) => {
        setSelectedPO(poId);
        const po = purchaseOrders.find((p) => p.id === poId);
        if (po) {
            setItems(
                po.items.map((item) => ({
                    id: item.id,
                    productName: item.productName,
                    qtyOrdered: item.qty,
                    uom: item.uom,
                    qtyReceived: "",
                    qtyRejected: "0",
                    weight: "",
                }))
            );
        }
    };

    const updateItem = (id: string, field: string, value: string) => {
        setItems(
            items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button
                variant="ghost"
                onClick={() => router.push("/procurement/po")}
                className="gap-2 -ml-2 text-muted-foreground cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>

            {/* PO Selection */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Reference PO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Purchase Order *</Label>
                            <Select value={selectedPO} onValueChange={handlePOSelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select PO to receive" />
                                </SelectTrigger>
                                <SelectContent>
                                    {activePOs.map((po) => (
                                        <SelectItem key={po.id} value={po.id}>
                                            {po.poNumber} - {po.vendorName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Received By</Label>
                            <Input value="Budi Santoso" className="bg-muted/30" readOnly />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Received Items */}
            {items.length > 0 && (
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Receive Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-border/50 p-4 bg-muted/20"
                            >
                                <div className="mb-3">
                                    <p className="font-medium text-sm">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Ordered: {item.qtyOrdered} {item.uom}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Qty Received *</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={item.qtyReceived}
                                            onChange={(e) =>
                                                updateItem(item.id, "qtyReceived", e.target.value)
                                            }
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Qty Rejected</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={item.qtyRejected}
                                            onChange={(e) =>
                                                updateItem(item.id, "qtyRejected", e.target.value)
                                            }
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Weight (Kg)</Label>
                                        <Input
                                            type="number"
                                            placeholder="Manual weight"
                                            value={item.weight}
                                            onChange={(e) =>
                                                updateItem(item.id, "weight", e.target.value)
                                            }
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Photo Upload */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">
                        Weighing Proof (Required)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Camera className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    Upload foto angka timbangan
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Click to upload or drag & drop. PNG, JPG up to 10MB
                                </p>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2 mt-2 cursor-pointer">
                                <Upload className="h-3.5 w-3.5" />
                                Choose File
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                    <Label>Notes</Label>
                    <Textarea
                        placeholder="Notes about this receipt (e.g. condition, issues)..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="mt-2"
                    />
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
                    Cancel
                </Button>
                <Button
                    onClick={() => router.push("/procurement/po")}
                    className="gap-2 cursor-pointer"
                >
                    <Save className="h-4 w-4" />
                    Submit GRN
                </Button>
            </div>
        </div>
    );
}
