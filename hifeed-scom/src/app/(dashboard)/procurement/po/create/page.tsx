"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Trash2,
    ArrowLeft,
    Save,
    ShieldCheck,
    AlertTriangle,
    Building2,
    User,
} from "lucide-react";
import {
    partners,
    products,
    PO_APPROVAL_THRESHOLD,
    roleLabels,
    roleBadgeColors,
} from "@/data/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { useState, useMemo } from "react";

interface LineItem {
    id: string;
    productId: string;
    qty: string;
    unitPrice: string;
}

export default function CreatePOPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [vendor, setVendor] = useState("");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<LineItem[]>([
        { id: "1", productId: "", qty: "", unitPrice: "" },
    ]);

    const addItem = () =>
        setItems([
            ...items,
            {
                id: Date.now().toString(),
                productId: "",
                qty: "",
                unitPrice: "",
            },
        ]);

    const removeItem = (id: string) =>
        setItems(items.filter((i) => i.id !== id));

    const updateItem = (id: string, field: keyof LineItem, value: string) =>
        setItems(
            items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
        );

    const vendors = partners.filter((p) => p.type === "VENDOR");

    const totalAmount = items.reduce((sum, item) => {
        const qty = parseFloat(item.qty) || 0;
        const price = parseFloat(item.unitPrice) || 0;
        return sum + qty * price;
    }, 0);

    const taxAmount = totalAmount * 0.11;
    const grandTotal = totalAmount + taxAmount;

    // Approval level determination
    const isOverThreshold = grandTotal > PO_APPROVAL_THRESHOLD;
    const approvalLevel = isOverThreshold ? 2 : 1;

    // Role info
    const userRole = user?.role;
    const userDept = userRole
        ? {
            OWNER: "Owner",
            FARM_MANAGER: "Farm Management",
            LOGISTICS: "Logistics",
            FINANCE: "Finance",
            OPERATOR: "Production",
            RND: "R&D",
            IT_OPS: "IT Operations",
            SALES: "Sales",
        }[userRole]
        : "Unknown";

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

            {/* Creator Info Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-sky-500/5">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">
                                {user?.name || "Unknown"}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] ${userRole ? roleBadgeColors[userRole] : ""}`}
                                >
                                    {userRole ? roleLabels[userRole] : ""}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] gap-1"
                                >
                                    <Building2 className="h-2.5 w-2.5" />
                                    {userDept}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                            PO ini akan terdaftar sebagai
                        </p>
                        <p className="text-sm font-semibold text-primary">
                            PO Departemen {userDept}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Vendor Selection */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">
                        Vendor Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Vendor *</Label>
                            <Select
                                value={vendor}
                                onValueChange={setVendor}
                            >
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
                            <Input
                                value="PO-2026-0009"
                                disabled
                                className="bg-muted/30"
                            />
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
                    <CardTitle className="text-base">Order Volume</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={addItem}
                        className="gap-1 cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Volume
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map((item, idx) => {
                        const product = products.find(
                            (p) => p.id === item.productId
                        );
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
                                        VOLUME #{idx + 1}
                                    </span>
                                    {items.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                removeItem(item.id)
                                            }
                                            className="h-7 w-7 p-0 text-destructive cursor-pointer"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <Label className="text-xs">
                                            Product
                                        </Label>
                                        <Select
                                            value={item.productId}
                                            onValueChange={(v) =>
                                                updateItem(
                                                    item.id,
                                                    "productId",
                                                    v
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Select product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((p) => (
                                                    <SelectItem
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.displayName} (
                                                        {p.defaultUom})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">
                                            Qty (
                                            {product?.defaultUom || "Unit"})
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={item.qty}
                                            onChange={(e) =>
                                                updateItem(
                                                    item.id,
                                                    "qty",
                                                    e.target.value
                                                )
                                            }
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">
                                            Price / Unit (Rp)
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={item.unitPrice}
                                            onChange={(e) =>
                                                updateItem(
                                                    item.id,
                                                    "unitPrice",
                                                    e.target.value
                                                )
                                            }
                                            className="h-9"
                                        />
                                        {subtotal > 0 && (
                                            <p className="text-[11px] text-primary font-semibold">
                                                = Rp{" "}
                                                {subtotal.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Summary + Approval Preview */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-5 space-y-4">
                    <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center gap-8 text-sm">
                            <span className="text-muted-foreground">
                                Subtotal
                            </span>
                            <span className="font-medium w-44 text-right">
                                Rp {totalAmount.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex items-center gap-8 text-sm">
                            <span className="text-muted-foreground">
                                PPN (11%)
                            </span>
                            <span className="font-medium w-44 text-right">
                                Rp {taxAmount.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="h-px w-64 bg-border my-1" />
                        <div className="flex items-center gap-8">
                            <span className="font-semibold">Grand Total</span>
                            <span className="text-lg font-bold text-primary w-44 text-right">
                                Rp {grandTotal.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>

                    {/* Approval Level Preview */}
                    {grandTotal > 0 && (
                        <div
                            className={`rounded-xl p-4 mt-3 ${isOverThreshold
                                ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                                : "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck
                                    className={`h-4 w-4 ${isOverThreshold ? "text-red-600" : "text-emerald-600"}`}
                                />
                                <span
                                    className={`text-sm font-semibold ${isOverThreshold ? "text-red-800 dark:text-red-300" : "text-emerald-800 dark:text-emerald-300"}`}
                                >
                                    Approval Level: {approvalLevel}-Layer
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                {isOverThreshold ? (
                                    <>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                                            <span className="font-semibold">L1</span>
                                            <span>Treasury</span>
                                        </div>
                                        <span className="text-muted-foreground">
                                            →
                                        </span>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                                            <span className="font-semibold">
                                                L2
                                            </span>
                                            <span>Owner</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                                        <span className="font-semibold">L1</span>
                                        <span>Treasury <strong>atau</strong> Owner</span>
                                    </div>
                                )}
                            </div>
                            {isOverThreshold ? (
                                <p className="text-[11px] text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    PO &gt; Rp 50 Juta memerlukan approval Treasury <strong>DAN</strong> Owner (2 layer).
                                </p>
                            ) : (
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2">
                                    PO ≤ Rp 50 Juta cukup 1 layer — bisa di-approve oleh Treasury <strong>atau</strong> Owner.
                                </p>
                            )}
                        </div>
                    )}
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
