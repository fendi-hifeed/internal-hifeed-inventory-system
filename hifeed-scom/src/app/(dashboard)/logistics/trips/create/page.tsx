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
import { ArrowLeft, Save, Truck, User, DollarSign, Plus, Trash2, Package } from "lucide-react";
import { partners, products } from "@/data/mock-data";
import { useState } from "react";

interface TripItem {
    id: string;
    productId: string;
    qty: string;
}

export default function CreateTripPage() {
    const router = useRouter();
    const [customer, setCustomer] = useState("");
    const [driver, setDriver] = useState("");
    const [plate, setPlate] = useState("");
    const [tripCost, setTripCost] = useState("");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<TripItem[]>([
        { id: "1", productId: "", qty: "" },
    ]);

    const customers = partners.filter((p) => p.type === "CUSTOMER");

    const addItem = () =>
        setItems([...items, { id: Date.now().toString(), productId: "", qty: "" }]);
    const removeItem = (id: string) =>
        setItems(items.filter((i) => i.id !== id));
    const updateItem = (id: string, field: string, value: string) =>
        setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button
                variant="ghost"
                onClick={() => router.push("/logistics/trips")}
                className="gap-2 -ml-2 text-muted-foreground cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Trips
            </Button>

            {/* Customer */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Delivery Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Customer *</Label>
                        <Select value={customer} onValueChange={setCustomer}>
                            <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                            <SelectContent>
                                {customers.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>DO Number</Label>
                        <Input value="DO-2026-005" disabled className="bg-muted/30" />
                    </div>
                </CardContent>
            </Card>

            {/* Driver */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-sky-500" />
                        Assign Driver
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Driver Name *</Label>
                            <Input placeholder="Nama supir" value={driver} onChange={(e) => setDriver(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Vehicle Plate *</Label>
                            <Input placeholder="e.g. L 1234 AB" value={plate} onChange={(e) => setPlate(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                            Trip Cost (Rp)
                        </Label>
                        <Input
                            type="number"
                            placeholder="Biaya bensin, tol, uang makan"
                            value={tripCost}
                            onChange={(e) => setTripCost(e.target.value)}
                            className="h-12 text-lg font-bold"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Items */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-4 w-4 text-amber-500" />
                        Delivery Items
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={addItem} className="gap-1 cursor-pointer">
                        <Plus className="h-3.5 w-3.5" />
                        Add
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={item.id} className="flex items-end gap-3">
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs">Product</Label>
                                <Select value={item.productId} onValueChange={(v) => updateItem(item.id, "productId", v)}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.displayName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-24 space-y-1">
                                <Label className="text-xs">Qty</Label>
                                <Input type="number" placeholder="0" value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} className="h-9" />
                            </div>
                            {items.length > 1 && (
                                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-9 w-9 p-0 text-destructive cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                    <Label>Notes</Label>
                    <Textarea placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-2" />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">Cancel</Button>
                <Button onClick={() => router.push("/logistics/trips")} className="gap-2 cursor-pointer">
                    <Save className="h-4 w-4" />
                    Create Trip
                </Button>
            </div>
        </div>
    );
}
