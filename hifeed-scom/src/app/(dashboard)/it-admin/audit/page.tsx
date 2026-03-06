"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    Search,
    FileText,
    LogIn,
    ShoppingCart,
    CheckCircle2,
    XCircle,
    Edit,
    Eye,
    Plus,
    UserPlus,
    Settings,
    Clock,
    Activity,
} from "lucide-react";
import { roleBadgeColors, roleLabels, type UserRole } from "@/data/mock-data";
import { useState } from "react";

type AuditAction =
    | "LOGIN"
    | "LOGOUT"
    | "PO_CREATE"
    | "PO_APPROVE"
    | "PO_REJECT"
    | "GRN_CREATE"
    | "ROLE_CHANGE"
    | "USER_DEACTIVATE"
    | "USER_ACTIVATE"
    | "STOCK_UPDATE"
    | "VIEW_PAGE";

interface AuditEntry {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    userRole: UserRole;
    action: AuditAction;
    description: string;
    module: string;
    ipAddress: string;
}

const actionConfig: Record<
    AuditAction,
    { icon: typeof LogIn; color: string; label: string }
> = {
    LOGIN: { icon: LogIn, color: "text-emerald-600 bg-emerald-50", label: "Login" },
    LOGOUT: { icon: LogIn, color: "text-gray-500 bg-gray-50", label: "Logout" },
    PO_CREATE: { icon: Plus, color: "text-blue-600 bg-blue-50", label: "Create PO" },
    PO_APPROVE: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", label: "Approve PO" },
    PO_REJECT: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Reject PO" },
    GRN_CREATE: { icon: ShoppingCart, color: "text-violet-600 bg-violet-50", label: "Create GRN" },
    ROLE_CHANGE: { icon: Edit, color: "text-amber-600 bg-amber-50", label: "Change Role" },
    USER_DEACTIVATE: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Deactivate User" },
    USER_ACTIVATE: { icon: UserPlus, color: "text-emerald-600 bg-emerald-50", label: "Activate User" },
    STOCK_UPDATE: { icon: Settings, color: "text-sky-600 bg-sky-50", label: "Stock Update" },
    VIEW_PAGE: { icon: Eye, color: "text-gray-400 bg-gray-50", label: "View Page" },
};

const mockAuditLog: AuditEntry[] = [
    {
        id: "a1", timestamp: "2026-03-06 19:05:00", userId: "u1", userName: "Ahmad Fauzi", userRole: "OWNER",
        action: "LOGIN", description: "Login via Google SSO", module: "Auth", ipAddress: "103.28.12.45",
    },
    {
        id: "a2", timestamp: "2026-03-06 18:55:00", userId: "u4", userName: "Siti Rahma", userRole: "FINANCE",
        action: "PO_APPROVE", description: "Approved PO-2026-0007 (Rp 3.75M) — L1 Finance", module: "Procurement", ipAddress: "103.28.12.50",
    },
    {
        id: "a3", timestamp: "2026-03-06 18:40:00", userId: "u7", userName: "Rina Peneliti", userRole: "RND",
        action: "PO_CREATE", description: "Created PO-2026-0007 — Lab Nutrisi Unila (Rp 3.75M)", module: "Procurement", ipAddress: "103.28.12.62",
    },
    {
        id: "a4", timestamp: "2026-03-06 18:20:00", userId: "u8", userName: "Fendi IT", userRole: "IT_OPS",
        action: "ROLE_CHANGE", description: "Changed Rina Peneliti role: OPERATOR → RND", module: "IT Admin", ipAddress: "103.28.12.10",
    },
    {
        id: "a5", timestamp: "2026-03-06 17:50:00", userId: "u3", userName: "Budi Setiawan", userRole: "LOGISTICS",
        action: "PO_CREATE", description: "Created PO-2026-0006 — PT. Angkutan Sejahtera (Rp 75M)", module: "Procurement", ipAddress: "103.28.12.55",
    },
    {
        id: "a6", timestamp: "2026-03-06 17:30:00", userId: "u4", userName: "Siti Rahma", userRole: "FINANCE",
        action: "PO_APPROVE", description: "Approved PO-2026-0006 (Rp 75M) — L1 Finance → Waiting Owner L2", module: "Procurement", ipAddress: "103.28.12.50",
    },
    {
        id: "a7", timestamp: "2026-03-06 16:15:00", userId: "u5", userName: "Arif Operator", userRole: "OPERATOR",
        action: "STOCK_UPDATE", description: "Production result P-001: used 500 KG Jagung, 200 KG Kedelai", module: "Production", ipAddress: "103.28.12.70",
    },
    {
        id: "a8", timestamp: "2026-03-06 15:00:00", userId: "u2", userName: "Pak Darmo", userRole: "FARM_MANAGER",
        action: "LOGIN", description: "Login via Google SSO", module: "Auth", ipAddress: "103.28.12.30",
    },
    {
        id: "a9", timestamp: "2026-03-06 14:30:00", userId: "u8", userName: "Fendi IT", userRole: "IT_OPS",
        action: "USER_DEACTIVATE", description: "Deactivated user: Bambang (bambang@hifeed.co)", module: "IT Admin", ipAddress: "103.28.12.10",
    },
    {
        id: "a10", timestamp: "2026-03-06 10:00:00", userId: "u6", userName: "David Mnt", userRole: "FARM_MANAGER",
        action: "PO_CREATE", description: "Created PO-2026-0008 — PT. Bibit Unggul Nusantara (Rp 62M)", module: "Procurement", ipAddress: "103.28.12.33",
    },
    {
        id: "a11", timestamp: "2026-03-05 16:45:00", userId: "u1", userName: "Ahmad Fauzi", userRole: "OWNER",
        action: "PO_APPROVE", description: "Approved PO-2026-0005 (Rp 15.5M) — Final approval", module: "Procurement", ipAddress: "103.28.12.45",
    },
    {
        id: "a12", timestamp: "2026-03-05 09:00:00", userId: "u4", userName: "Siti Rahma", userRole: "FINANCE",
        action: "GRN_CREATE", description: "Created GRN-2026-0003 for PO-2026-0004", module: "Procurement", ipAddress: "103.28.12.50",
    },
];

const allModules = [
    ...new Set(mockAuditLog.map((a) => a.module)),
];
const allActions: AuditAction[] = [
    "LOGIN", "LOGOUT", "PO_CREATE", "PO_APPROVE", "PO_REJECT",
    "GRN_CREATE", "ROLE_CHANGE", "USER_DEACTIVATE", "USER_ACTIVATE", "STOCK_UPDATE",
];

export default function AuditLogPage() {
    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState("ALL");
    const [actionFilter, setActionFilter] = useState("ALL");

    const filtered = mockAuditLog.filter((entry) => {
        const matchSearch =
            entry.userName.toLowerCase().includes(search.toLowerCase()) ||
            entry.description.toLowerCase().includes(search.toLowerCase());
        const matchModule =
            moduleFilter === "ALL" || entry.module === moduleFilter;
        const matchAction =
            actionFilter === "ALL" || entry.action === actionFilter;
        return matchSearch && matchModule && matchAction;
    });

    // Stats
    const todayLogs = mockAuditLog.filter((a) =>
        a.timestamp.startsWith("2026-03-06")
    );
    const loginCount = todayLogs.filter((a) => a.action === "LOGIN").length;
    const approvalCount = todayLogs.filter(
        (a) => a.action === "PO_APPROVE" || a.action === "PO_REJECT"
    ).length;

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Tracking seluruh aktivitas user di sistem HiFeed SCOM.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <Activity className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-2xl font-bold">{todayLogs.length}</p>
                        <p className="text-xs text-muted-foreground">
                            Events Today
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <LogIn className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                        <p className="text-2xl font-bold text-emerald-600">
                            {loginCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Logins Today
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-violet-500" />
                        <p className="text-2xl font-bold text-violet-600">
                            {approvalCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Approvals Today
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <FileText className="h-5 w-5 mx-auto mb-1 text-sky-500" />
                        <p className="text-2xl font-bold text-sky-600">
                            {mockAuditLog.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Total Entries
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search user or activity..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-0"
                            />
                        </div>
                        <Select
                            value={moduleFilter}
                            onValueChange={setModuleFilter}
                        >
                            <SelectTrigger className="w-full sm:w-40 bg-muted/30 border-0">
                                <SelectValue placeholder="Module" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Modules</SelectItem>
                                {allModules.map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={actionFilter}
                            onValueChange={setActionFilter}
                        >
                            <SelectTrigger className="w-full sm:w-40 bg-muted/30 border-0">
                                <SelectValue placeholder="Action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Actions</SelectItem>
                                {allActions.map((a) => (
                                    <SelectItem key={a} value={a}>
                                        {actionConfig[a].label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Log Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-semibold w-[160px]">
                                Timestamp
                            </TableHead>
                            <TableHead className="font-semibold">
                                User
                            </TableHead>
                            <TableHead className="font-semibold">
                                Action
                            </TableHead>
                            <TableHead className="font-semibold">
                                Description
                            </TableHead>
                            <TableHead className="font-semibold">
                                Module
                            </TableHead>
                            <TableHead className="font-semibold">
                                IP
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((entry) => {
                            const config = actionConfig[entry.action];
                            const ActionIcon = config.icon;

                            return (
                                <TableRow
                                    key={entry.id}
                                    className="hover:bg-muted/20 transition-colors"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {entry.timestamp}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                {entry.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">
                                                    {entry.userName}
                                                </span>
                                                <br />
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[8px] px-1 py-0 ${roleBadgeColors[entry.userRole]}`}
                                                >
                                                    {roleLabels[entry.userRole]}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full w-fit ${config.color}`}
                                        >
                                            <ActionIcon className="h-3 w-3" />
                                            {config.label}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm text-muted-foreground max-w-[300px] truncate">
                                            {entry.description}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px]"
                                        >
                                            {entry.module}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-mono">
                                        {entry.ipAddress}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
