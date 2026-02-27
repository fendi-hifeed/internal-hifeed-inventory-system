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
import { Save, ClipboardCheck, Plus, Trash2, AlertTriangle } from "lucide-react";
import { stockItems } from "@/data/mock-data";
import { useState } from "react";

interface OpnameItem {
    id: string;
    stockId: string;
    purchaseQty: string;
    purchaseUom: string;
    remainderQty: string;
    baseUom: string;
}

export default function StockOpnamePage() {
    const [items, setItems] = useState<OpnameItem[]>([
        { id: "1", stockId: "", purchaseQty: "", purchaseUom: "", remainderQty: "", baseUom: "" },
    ]);

    const addItem = () =>
        setItems([
            ...items,
            { id: Date.now().toString(), stockId: "", purchaseQty: "", purchaseUom: "", remainderQty: "", baseUom: "" },
        ]);

    const removeItem = (id: string) =>
        setItems(items.filter((i) => i.id !== id));

    const updateItem = (id: string, field: string, value: string) => {
        setItems(
            items.map((i) => {
                if (i.id !== id) return i;
                const updated = { ...i, [field]: value };
                if (field === "stockId") {
                    const stock = stockItems.find((s) => s.id === value);
                    if (stock) {
                        updated.purchaseUom = stock.purchaseUom;
                        updated.baseUom = stock.baseUom;
                    }
                }
                return updated;
            })
        );
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-sm text-muted-foreground">
                Input stok fisik dengan konversi multi-unit otomatis.
            </p>

            <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-primary" />
                        Stock Opname Items
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={addItem} className="gap-1 cursor-pointer">
                        <Plus className="h-3.5 w-3.5" />
                        Add Item
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map((item, idx) => {
                        const stock = stockItems.find((s) => s.id === item.stockId);
                        const purchaseTotal = stock
                            ? (parseFloat(item.purchaseQty) || 0) * stock.purchaseConversionRate
                            : 0;
                        const remainderTotal = parseFloat(item.remainderQty) || 0;
                        const physicalTotal = purchaseTotal + remainderTotal;
                        const systemQty = stock?.currentQty || 0;
                        const variance = physicalTotal - systemQty;

                        return (
                            <div key={item.id} className="rounded-xl border border-border/50 p-4 bg-muted/20 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        ITEM #{idx + 1}
                                    </span>
                                    {items.length > 1 && (
                                        <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-7 w-7 p-0 text-destructive cursor-pointer">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Product</Label>
                                    <Select value={item.stockId} onValueChange={(v) => updateItem(item.id, "stockId", v)}>
                                        <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                                        <SelectContent>
                                            {stockItems.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.productName} (System: {s.currentQty.toLocaleString()} {s.baseUom})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {stock && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">
                                                    Full Units ({stock.purchaseUom})
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={item.purchaseQty}
                                                    onChange={(e) => updateItem(item.id, "purchaseQty", e.target.value)}
                                                    className="h-12 text-xl text-center font-bold"
                                                />
                                                {purchaseTotal > 0 && (
                                                    <p className="text-[11px] text-emerald-600 text-center">
                                                        = {purchaseTotal.toLocaleString()} {stock.baseUom}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">
                                                    Remainder ({stock.baseUom})
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={item.remainderQty}
                                                    onChange={(e) => updateItem(item.id, "remainderQty", e.target.value)}
                                                    className="h-12 text-xl text-center font-bold"
                                                />
                                            </div>
                                        </div>

                                        {physicalTotal > 0 && (
                                            <div className="bg-white rounded-lg p-3 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Physical Count</span>
                                                    <span className="font-bold">{physicalTotal.toLocaleString()} {stock.baseUom}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">System Count</span>
                                                    <span className="font-medium">{systemQty.toLocaleString()} {stock.baseUom}</span>
                                                </div>
                                                <div className="h-px bg-border" />
                                                <div className="flex justify-between text-sm items-center">
                                                    <span className="font-semibold flex items-center gap-1">
                                                        {variance !== 0 && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                                                        Variance
                                                    </span>
                                                    <span className={`font-bold ${variance === 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                                        {variance > 0 ? "+" : ""}{variance.toLocaleString()} {stock.baseUom}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Reason */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                    <Label>Alasan Variance (jika ada)</Label>
                    <Textarea
                        placeholder="Jelaskan penyebab perbedaan stok..."
                        rows={3}
                        className="mt-2"
                    />
                </CardContent>
            </Card>

            <Button className="w-full h-14 text-base gap-2 rounded-xl shadow-lg cursor-pointer">
                <Save className="h-5 w-5" />
                Submit Stock Opname
            </Button>
        </div>
    );
}
