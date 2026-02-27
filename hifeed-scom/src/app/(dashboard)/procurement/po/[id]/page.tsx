"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileText,
    Building,
    Calendar,
    User,
} from "lucide-react";
import { purchaseOrders, goodsReceipts, products } from "@/data/mock-data";

const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    PARTIAL: "bg-amber-50 text-amber-700",
    COMPLETED: "bg-sky-50 text-sky-700",
};

export default function PODetailPage() {
    const params = useParams();
    const router = useRouter();
    const po = purchaseOrders.find((p) => p.id === params.id);
    const relatedGRNs = goodsReceipts.filter((g) => g.poId === po?.id);

    if (!po) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Purchase Order not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button
                variant="ghost"
                onClick={() => router.push("/procurement/po")}
                className="gap-2 -ml-2 text-muted-foreground cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to PO List
            </Button>

            {/* Header Card */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-bold">{po.poNumber}</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Created {po.createdAt}
                            </p>
                        </div>
                        <Badge
                            className={`${statusColors[po.status]} text-sm font-semibold px-4 py-1.5 h-fit`}
                        >
                            {po.status}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Vendor</p>
                                <p className="text-sm font-medium">{po.vendorName}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Items Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead>UoM</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {po.items.map((item) => {
                                const product = products.find(
                                    (p) => p.id === item.productId
                                );
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {item.productName}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {item.qty}
                                        </TableCell>
                                        <TableCell>{item.uom}</TableCell>
                                        <TableCell className="text-right">
                                            Rp {item.unitPrice.toLocaleString("id-ID")}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            Rp {item.totalPrice.toLocaleString("id-ID")}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Separator className="my-3" />
                    <div className="flex flex-col items-end space-y-1 text-sm">
                        <div className="flex gap-8 pt-1">
                            <span className="font-semibold">Grand Total</span>
                            <span className="w-36 text-right text-lg font-bold text-primary">
                                Rp{" "}
                                {(po.totalAmount).toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Related GRNs */}
            {relatedGRNs.length > 0 && (
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Goods Receipts ({relatedGRNs.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {relatedGRNs.map((grn) => (
                            <div
                                key={grn.id}
                                className="rounded-xl border border-border/50 p-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <span className="font-medium text-sm">
                                            {grn.grnNumber}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {grn.receivedDate}
                                    </div>
                                </div>
                                {grn.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between text-sm py-1"
                                    >
                                        <span>{item.productName}</span>
                                        <span>
                                            <span className="text-emerald-600 font-medium">
                                                {item.qtyReceived}
                                            </span>
                                            {item.qtyRejected > 0 && (
                                                <span className="text-destructive ml-2">
                                                    ({item.qtyRejected} rejected)
                                                </span>
                                            )}
                                            <span className="text-muted-foreground ml-1">
                                                {item.uom}
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Actions */}
            {po.status === "DRAFT" && (
                <div className="flex justify-end gap-3">
                    <Button variant="outline" className="cursor-pointer">
                        Edit
                    </Button>
                    <Button className="cursor-pointer">Approve PO</Button>
                </div>
            )}
            {(po.status === "APPROVED" || po.status === "PARTIAL_RECEIVED") && (
                <div className="flex justify-end">
                    <Button
                        onClick={() => router.push("/procurement/grn")}
                        className="cursor-pointer"
                    >
                        Create GRN (Receive Goods)
                    </Button>
                </div>
            )}
        </div>
    );
}
