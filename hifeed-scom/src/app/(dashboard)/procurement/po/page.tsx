"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Search,
    Eye,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    ShieldCheck,
    Building2,
} from "lucide-react";
import {
    purchaseOrders,
    PO_APPROVAL_THRESHOLD,
    type PurchaseOrder,
    type UserRole,
    roleLabels,
    roleBadgeColors,
} from "@/data/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { useState, useMemo } from "react";

const statusConfig: Record<
    string,
    { color: string; icon: typeof Clock; label: string }
> = {
    DRAFT: { color: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText, label: "Draft" },
    PENDING_APPROVAL: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: "Pending Approval" },
    APPROVED_L1: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: ShieldCheck, label: "Approved L1" },
    APPROVED: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2, label: "Approved" },
    PARTIAL_RECEIVED: { color: "bg-violet-50 text-violet-700 border-violet-200", icon: Clock, label: "Partial" },
    COMPLETED: { color: "bg-sky-50 text-sky-700 border-sky-200", icon: CheckCircle2, label: "Completed" },
    CANCELLED: { color: "bg-gray-50 text-gray-500 border-gray-200", icon: XCircle, label: "Cancelled" },
    REJECTED: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle, label: "Rejected" },
};

const deptColors: Record<string, string> = {
    "Farm Management": "bg-emerald-100 text-emerald-700",
    Finance: "bg-purple-100 text-purple-700",
    Production: "bg-blue-100 text-blue-700",
    Logistics: "bg-sky-100 text-sky-700",
    "R&D": "bg-rose-100 text-rose-700",
    "IT Operations": "bg-cyan-100 text-cyan-700",
    Sales: "bg-orange-100 text-orange-700",
};

// Who can see what
function getVisiblePOs(
    pos: PurchaseOrder[],
    role: UserRole | undefined
): PurchaseOrder[] {
    if (!role) return [];
    // Owner, Finance & IT_OPS see ALL POs (Owner/Finance = approvers, IT_OPS = monitoring)
    if (role === "OWNER" || role === "FINANCE" || role === "IT_OPS") return pos;
    // Everyone else sees only POs from their own role
    return pos.filter((po) => po.createdByRole === role);
}

// Can this role approve?
function canApprove(role: UserRole | undefined): boolean {
    return role === "OWNER" || role === "FINANCE";
}

// Check what pending approvals exist for this role
function getPendingApprovals(
    po: PurchaseOrder,
    role: UserRole | undefined
): { canApproveL1: boolean; canApproveL2: boolean } {
    if (!role) return { canApproveL1: false, canApproveL2: false };
    const l1 = po.approvals.find((a) => a.level === 1);
    const l2 = po.approvals.find((a) => a.level === 2);

    return {
        canApproveL1: role === "FINANCE" && l1?.status === "PENDING",
        canApproveL2:
            role === "OWNER" &&
            l1?.status === "APPROVED" &&
            l2?.status === "PENDING",
    };
}

export default function PurchaseOrdersPage() {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [deptFilter, setDeptFilter] = useState("ALL");

    const isApprover = canApprove(user?.role);
    const canViewAll = user?.role === "OWNER" || user?.role === "FINANCE" || user?.role === "IT_OPS";

    // Filter POs based on role visibility
    const visiblePOs = useMemo(
        () => getVisiblePOs(purchaseOrders, user?.role),
        [user?.role]
    );

    const filtered = visiblePOs.filter((po) => {
        const matchSearch =
            po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
            po.vendorName.toLowerCase().includes(search.toLowerCase()) ||
            po.department.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            statusFilter === "ALL" || po.status === statusFilter;
        const matchDept =
            deptFilter === "ALL" || po.department === deptFilter;
        return matchSearch && matchStatus && matchDept;
    });

    // Stats
    const pendingCount = visiblePOs.filter(
        (po) =>
            po.status === "PENDING_APPROVAL" || po.status === "APPROVED_L1"
    ).length;
    const totalValue = visiblePOs.reduce((s, po) => s + po.totalAmount, 0);
    const departments = [
        ...new Set(visiblePOs.map((po) => po.department)),
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm text-muted-foreground">
                        {isApprover
                            ? "Manage & approve purchase orders dari seluruh departemen"
                            : user?.role === "IT_OPS"
                                ? "Monitoring seluruh purchase orders (read-only)"
                                : `Purchase orders departemen ${user?.role ? roleLabels[user.role] : ""}`}
                    </h3>
                </div>
                <Link href="/procurement/po/create">
                    <Button className="gap-2 rounded-xl shadow-sm cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Create PO
                    </Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">{visiblePOs.length}</p>
                        <p className="text-xs text-muted-foreground">Total PO</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-amber-600">
                            {pendingCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Pending Approval
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">
                            {departments.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Departemen
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-lg font-bold text-emerald-600">
                            {(totalValue / 1_000_000).toFixed(0)}M
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Total Value (Rp)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Approval Alert */}
            {isApprover && pendingCount > 0 && (
                <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-l-4 border-l-amber-500">
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                {pendingCount} PO menunggu approval Anda
                            </p>
                            <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                                {user?.role === "OWNER"
                                    ? "Termasuk PO > Rp 50 Juta yang butuh approval Owner."
                                    : "Review dan approve PO dari seluruh departemen."}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white border-amber-300 text-amber-700 hover:bg-amber-50 cursor-pointer"
                            onClick={() => setStatusFilter("PENDING_APPROVAL")}
                        >
                            Lihat Pending
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search PO number, vendor, dept..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-0"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-44 bg-muted/30 border-0">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                                <SelectItem value="APPROVED_L1">Approved L1</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="PARTIAL_RECEIVED">Partial</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        {canViewAll && (
                            <Select value={deptFilter} onValueChange={setDeptFilter}>
                                <SelectTrigger className="w-full sm:w-44 bg-muted/30 border-0">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Departments</SelectItem>
                                    {departments.map((d) => (
                                        <SelectItem key={d} value={d}>
                                            {d}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-semibold">PO Number</TableHead>
                            <TableHead className="font-semibold">Vendor</TableHead>
                            <TableHead className="font-semibold">Dept.</TableHead>
                            <TableHead className="font-semibold">Items</TableHead>
                            <TableHead className="font-semibold text-right">
                                Total
                            </TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Approval</TableHead>
                            <TableHead className="font-semibold text-center">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((po) => {
                            const status = statusConfig[po.status] || statusConfig.DRAFT;
                            const StatusIcon = status.icon;
                            const pending = getPendingApprovals(po, user?.role);
                            const isOver50M = po.totalAmount > PO_APPROVAL_THRESHOLD;

                            return (
                                <TableRow
                                    key={po.id}
                                    className={`hover:bg-muted/20 transition-colors ${(pending.canApproveL1 || pending.canApproveL2)
                                        ? "bg-amber-50/50 dark:bg-amber-950/10"
                                        : ""
                                        }`}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary/60" />
                                            <div>
                                                <span className="font-medium text-sm">
                                                    {po.poNumber}
                                                </span>
                                                {isOver50M && (
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-1.5 text-[9px] px-1 py-0 bg-red-50 text-red-600 border-red-200"
                                                    >
                                                        &gt;50M
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {po.createdAt}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {po.vendorName}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`text-[10px] font-medium ${deptColors[po.department] || "bg-gray-100"}`}
                                        >
                                            <Building2 className="h-2.5 w-2.5 mr-1" />
                                            {po.department}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {po.items.length} item(s)
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-sm">
                                        Rp {po.totalAmount.toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`${status.color} text-xs font-medium gap-1`}
                                        >
                                            <StatusIcon className="h-3 w-3" />
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {po.approvals.map((a, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${a.status === "APPROVED"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : a.status === "REJECTED"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    title={
                                                        a.approverName
                                                            ? `${a.approverRole}: ${a.approverName}`
                                                            : `${a.approverRole}: Pending`
                                                    }
                                                >
                                                    {a.status === "APPROVED" ? (
                                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                                    ) : a.status === "REJECTED" ? (
                                                        <XCircle className="h-2.5 w-2.5" />
                                                    ) : (
                                                        <Clock className="h-2.5 w-2.5" />
                                                    )}
                                                    L{a.level}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            <Link href={`/procurement/po/${po.id}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 cursor-pointer"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {(pending.canApproveL1 ||
                                                pending.canApproveL2) && (
                                                    <Button
                                                        size="sm"
                                                        className="h-7 text-[11px] gap-1 bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Approve
                                                    </Button>
                                                )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* Approval Rules Info */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">
                                Aturan Approval PO
                            </p>
                            <p>
                                • PO ≤ <strong>Rp 50 Juta</strong>: Cukup 1 layer approval (Finance Admin)
                            </p>
                            <p>
                                • PO &gt; <strong>Rp 50 Juta</strong>: Harus 2 layer approval (Finance Admin <strong>DAN</strong> Owner)
                            </p>
                            <p>
                                • Semua departemen bisa membuat PO, tapi hanya Finance Admin & Owner yang bisa approve
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
