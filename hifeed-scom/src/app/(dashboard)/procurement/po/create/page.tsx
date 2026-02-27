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
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { partners, products } from "@/data/mock-data";
import { useState } from "react";

interface LineItem {
    id: string;
    productId: string;
    qty: string;
    unitPrice: string;
}

export default function CreatePOPage() {
    const router = useRouter();
    const [vendor, setVendor] = useState("");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<LineItem[]>([
        { id: "1", productId: "", qty: "", unitPrice: "" },
    ]);

    const addItem = () =>
        setItems([
            ...items,
            { id: Date.now().toString(), productId: "", qty: "", unitPrice: "" },
        ]);

    const removeItem = (id: string) =>
        setItems(items.filter((i) => i.id !== id));

    const updateItem = (id: string, field: keyof LineItem, value: string) =>
        setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

    const vendors = partners.filter((p) => p.type === "VENDOR");

    const totalAmount = items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        const qty = parseFloat(item.qty) || 0;
        const price = parseFloat(item.unitPrice) || 0;
        return sum + qty * price;
    }, 0);

    const taxAmount = totalAmount * 0.11;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => router.push("/procurement/po")}
                className="gap-2 -ml-2 text-muted-foreground cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to PO List
            </Button>

            {/* Vendor Selection */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Vendor Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Vendor *</Label>
                            <Select value={vendor} onValueChange={setVendor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendors.map((v) => (
                                        <SelectItem key={v.id} value={v.id}>
                                            {v.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>PO Number</Label>
                            <Input value="PO-2026-0006" disabled className="bg-muted/30" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                            placeholder="Additional notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Line Items */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Order Items</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={addItem}
                        className="gap-1 cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Item
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map((item, idx) => {
                        const product = products.find((p) => p.id === item.productId);
                        const subtotal =
                            (parseFloat(item.qty) || 0) *
                            (parseFloat(item.unitPrice) || 0);
                        return (
                            <div
                                key={item.id}
                                className="rounded-xl border border-border/50 p-4 space-y-3 bg-muted/20"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        ITEM #{idx + 1}
                                    </span>
                                    {items.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeItem(item.id)}
                                            className="h-7 w-7 p-0 text-destructive cursor-pointer"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <Label className="text-xs">Product</Label>
                                        <Select
                                            value={item.productId}
                                            onValueChange={(v) =>
                                                updateItem(item.id, "productId", v)
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Select product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.name} ({p.defaultUom})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">
                                            Qty ({product?.defaultUom || "Unit"})
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={item.qty}
                                            onChange={(e) =>
                                                updateItem(item.id, "qty", e.target.value)
                                            }
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Price / Unit (Rp)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={item.unitPrice}
                                            onChange={(e) =>
                                                updateItem(item.id, "unitPrice", e.target.value)
                                            }
                                            className="h-9"
                                        />
                                        {subtotal > 0 && (
                                            <p className="text-[11px] text-primary font-semibold">
                                                = Rp {subtotal.toLocaleString("id-ID")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                    <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center gap-8 text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium w-40 text-right">
                                Rp {totalAmount.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex items-center gap-8 text-sm">
                            <span className="text-muted-foreground">PPN (11%)</span>
                            <span className="font-medium w-40 text-right">
                                Rp {taxAmount.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="h-px w-60 bg-border my-1" />
                        <div className="flex items-center gap-8">
                            <span className="font-semibold">Grand Total</span>
                            <span className="text-lg font-bold text-primary w-40 text-right">
                                Rp {(totalAmount + taxAmount).toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={() => router.push("/procurement/po")}
                    className="cursor-pointer"
                >
                    Cancel
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => router.push("/procurement/po")}
                    className="cursor-pointer"
                >
                    Save as Draft
                </Button>
                <Button
                    onClick={() => router.push("/procurement/po")}
                    className="gap-2 cursor-pointer"
                >
                    <Save className="h-4 w-4" />
                    Submit for Approval
                </Button>
            </div>
        </div>
    );
}
