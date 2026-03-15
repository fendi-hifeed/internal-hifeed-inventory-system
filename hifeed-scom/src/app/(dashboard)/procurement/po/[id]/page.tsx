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
    Building2,
    User,
    ShieldCheck,
    XCircle,
    AlertTriangle,
} from "lucide-react";
import {
    purchaseOrders,
    goodsReceipts,
    products,
    mockUsers,
    roleLabels,
    roleBadgeColors,
    PO_APPROVAL_THRESHOLD,
} from "@/data/mock-data";
import { useAuth } from "@/contexts/auth-context";

const statusConfig: Record<string, { color: string; label: string }> = {
    DRAFT: { color: "bg-gray-100 text-gray-700", label: "Draft" },
    PENDING_APPROVAL: { color: "bg-amber-50 text-amber-700", label: "Pending Approval" },
    APPROVED_L1: { color: "bg-blue-50 text-blue-700", label: "Approved L1 (Waiting Owner)" },
    APPROVED: { color: "bg-emerald-50 text-emerald-700", label: "Approved" },
    PARTIAL_RECEIVED: { color: "bg-violet-50 text-violet-700", label: "Partial Received" },
    COMPLETED: { color: "bg-sky-50 text-sky-700", label: "Completed" },
    CANCELLED: { color: "bg-gray-50 text-gray-500", label: "Cancelled" },
    REJECTED: { color: "bg-red-50 text-red-700", label: "Rejected" },
};

export default function PODetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const po = purchaseOrders.find((p) => p.id === params.id);
    const relatedGRNs = goodsReceipts.filter((g) => g.poId === po?.id);

    if (!po) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">
                    Purchase Order not found
                </p>
            </div>
        );
    }

    const status = statusConfig[po.status] || statusConfig.DRAFT;
    const creator = mockUsers.find((u) => u.id === po.createdByUserId);
    const isOverThreshold = po.totalAmount > PO_APPROVAL_THRESHOLD;

    // Check if current user can approve
    const isUnderThreshold = po.totalAmount <= PO_APPROVAL_THRESHOLD;
    const canApproveL1 =
        (user?.role === "FINANCE" || (user?.role === "OWNER" && isUnderThreshold)) &&
        po.approvals.find((a) => a.level === 1)?.status === "PENDING";
    const canApproveL2 =
        user?.role === "OWNER" &&
        po.approvals.find((a) => a.level === 1)?.status === "APPROVED" &&
        po.approvals.find((a) => a.level === 2)?.status === "PENDING";

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
                                <h2 className="text-xl font-bold">
                                    {po.poNumber}
                                </h2>
                                {isOverThreshold && (
                                    <Badge
                                        variant="outline"
                                        className="bg-red-50 text-red-600 border-red-200 text-xs"
                                    >
                                        &gt;50M • 2-Layer Approval
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Created {po.createdAt}
                            </p>
                        </div>
                        <Badge
                            className={`${status.color} text-sm font-semibold px-4 py-1.5 h-fit`}
                        >
                            {status.label}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Vendor
                                </p>
                                <p className="text-sm font-medium">
                                    {po.vendorName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Department
                                </p>
                                <p className="text-sm font-medium">
                                    {po.department}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Created By
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-medium">
                                        {creator?.name || "Unknown"}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={`text-[9px] px-1 py-0 ${po.createdByRole ? roleBadgeColors[po.createdByRole] : ""}`}
                                    >
                                        {po.createdByRole ? roleLabels[po.createdByRole] : ""}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                    {po.notes && (
                        <div className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">
                                Notes:{" "}
                            </span>
                            {po.notes}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Approval Status */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Approval Workflow
                        <Badge variant="secondary" className="text-xs ml-2">
                            {po.approvalLevel}-Layer
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        {po.approvals.map((approval, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div
                                    className={`rounded-xl border p-4 flex-1 min-w-[180px] ${approval.status === "APPROVED"
                                            ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20"
                                            : approval.status === "REJECTED"
                                                ? "border-red-200 bg-red-50 dark:bg-red-950/20"
                                                : "border-amber-200 bg-amber-50 dark:bg-amber-950/20"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        {approval.status === "APPROVED" ? (
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        ) : approval.status === "REJECTED" ? (
                                            <XCircle className="h-4 w-4 text-red-600" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-amber-600" />
                                        )}
                                        <span className="text-xs font-bold">
                                            Level {approval.level}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold">
                                        {approval.approverRole === "FINANCE"
                                            ? "Finance Admin"
                                            : "Owner"}
                                    </p>
                                    {approval.approverName ? (
                                        <p className="text-xs text-muted-foreground">
                                            {approval.approverName} •{" "}
                                            {approval.approvedAt}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-amber-600">
                                            Menunggu approval...
                                        </p>
                                    )}
                                </div>
                                {idx < po.approvals.length - 1 && (
                                    <span className="text-muted-foreground text-lg">
                                        →
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Approve/Reject Actions */}
                    {(canApproveL1 || canApproveL2) && (
                        <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                    PO ini menunggu approval Anda
                                    {canApproveL2 && " (Level 2 - Owner)"}
                                    {canApproveL1 && " (Level 1 - Finance)"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 cursor-pointer">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50 gap-2 cursor-pointer"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    )}
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
                                <TableHead className="text-right">
                                    Qty
                                </TableHead>
                                <TableHead>UoM</TableHead>
                                <TableHead className="text-right">
                                    Unit Price
                                </TableHead>
                                <TableHead className="text-right">
                                    Subtotal
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {po.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <p className="text-sm font-medium">
                                            {item.productName}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {item.qty.toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell>{item.uom}</TableCell>
                                    <TableCell className="text-right">
                                        Rp{" "}
                                        {item.unitPrice.toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        Rp{" "}
                                        {item.totalPrice.toLocaleString(
                                            "id-ID"
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Separator className="my-3" />
                    <div className="flex flex-col items-end space-y-1 text-sm">
                        <div className="flex gap-8 pt-1">
                            <span className="font-semibold">Grand Total</span>
                            <span className="w-36 text-right text-lg font-bold text-primary">
                                Rp {po.totalAmount.toLocaleString("id-ID")}
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
                    <Button className="cursor-pointer">
                        Submit for Approval
                    </Button>
                </div>
            )}
            {(po.status === "APPROVED" ||
                po.status === "PARTIAL_RECEIVED") && (
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
