"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    DollarSign,
    Clock,
    AlertTriangle,
    TrendingDown,
    CheckCircle2,
    Bell,
    MessageCircle,
    Mail,
    Search,
    CalendarClock,
    Users,
} from "lucide-react";
import { useState, useMemo } from "react";

// ===== AR Mock Data =====
interface ARRecord {
    id: string;
    customerId: string;
    customerName: string;
    customerArea: string;
    phone: string;
    email: string;
    invoiceNo: string;
    orderId: string;
    invoiceDate: string;
    dueDate: string;
    amount: number;
    paidAmount: number;
    outstanding: number;
    daysOverdue: number;
    status: "CURRENT" | "OVERDUE_30" | "OVERDUE_60" | "OVERDUE_90" | "PAID";
    autoReminder: boolean;
    lastReminderDate?: string;
    reminderChannel: ("WA" | "EMAIL")[];
}

const mockAR: ARRecord[] = [
    {
        id: "ar1", customerId: "c1", customerName: "Karya Langit Bumi Permaculture", customerArea: "Lampung Selatan",
        phone: "08381796000", email: "admin@karyalangit.co", invoiceNo: "INV-2026-001", orderId: "ORD-2026-001",
        invoiceDate: "2026-02-10", dueDate: "2026-03-12", amount: 22500000, paidAmount: 22500000, outstanding: 0,
        daysOverdue: 0, status: "PAID", autoReminder: false, reminderChannel: ["WA"],
    },
    {
        id: "ar2", customerId: "c4", customerName: "Peternakan Sejahtera", customerArea: "Lampung Timur",
        phone: "08191234567", email: "finance@sejahtera.co", invoiceNo: "INV-2026-004", orderId: "ORD-2026-004",
        invoiceDate: "2026-02-25", dueDate: "2026-03-11", amount: 7600000, paidAmount: 0, outstanding: 7600000,
        daysOverdue: 4, status: "OVERDUE_30", autoReminder: true, lastReminderDate: "2026-03-12", reminderChannel: ["WA", "EMAIL"],
    },
    {
        id: "ar3", customerId: "c2", customerName: "Metro Customer", customerArea: "Metro",
        phone: "08527909000", email: "metro@customer.co", invoiceNo: "INV-2026-006", orderId: "ORD-2026-006",
        invoiceDate: "2026-01-10", dueDate: "2026-02-09", amount: 15000000, paidAmount: 7500000, outstanding: 7500000,
        daysOverdue: 34, status: "OVERDUE_60", autoReminder: true, lastReminderDate: "2026-03-10", reminderChannel: ["WA"],
    },
    {
        id: "ar4", customerId: "c5", customerName: "CV Agri Mandiri", customerArea: "Tanggamus",
        phone: "085678901234", email: "finance@agrimandiri.co", invoiceNo: "INV-2025-048", orderId: "ORD-2025-048",
        invoiceDate: "2025-12-01", dueDate: "2025-12-31", amount: 28000000, paidAmount: 0, outstanding: 28000000,
        daysOverdue: 74, status: "OVERDUE_90", autoReminder: true, lastReminderDate: "2026-03-08", reminderChannel: ["WA", "EMAIL"],
    },
    {
        id: "ar5", customerId: "c3", customerName: "Bandung Customer", customerArea: "Bandung",
        phone: "08123456789", email: "finance@bandungcust.co", invoiceNo: "INV-2026-007", orderId: "ORD-2026-003",
        invoiceDate: "2026-03-10", dueDate: "2026-04-09", amount: 48000000, paidAmount: 0, outstanding: 48000000,
        daysOverdue: 0, status: "CURRENT", autoReminder: true, reminderChannel: ["EMAIL"],
    },
    {
        id: "ar6", customerId: "c6", customerName: "Koperasi Ternak Makmur", customerArea: "Pringsewu",
        phone: "082112345678", email: "koperasi@ternakmakmur.co", invoiceNo: "INV-2026-008", orderId: "ORD-2026-005",
        invoiceDate: "2026-03-05", dueDate: "2026-04-04", amount: 36000000, paidAmount: 0, outstanding: 36000000,
        daysOverdue: 0, status: "CURRENT", autoReminder: false, reminderChannel: ["WA"],
    },
];

const agingConfig = {
    CURRENT: { label: "Current (0-30)", color: "bg-emerald-50 text-emerald-700 border-emerald-200", textColor: "text-emerald-600" },
    OVERDUE_30: { label: "31-60 hari", color: "bg-amber-50 text-amber-700 border-amber-200", textColor: "text-amber-600" },
    OVERDUE_60: { label: "61-90 hari", color: "bg-orange-50 text-orange-700 border-orange-200", textColor: "text-orange-600" },
    OVERDUE_90: { label: ">90 hari", color: "bg-red-50 text-red-700 border-red-200", textColor: "text-red-600" },
    PAID: { label: "Lunas", color: "bg-sky-50 text-sky-700 border-sky-200", textColor: "text-sky-600" },
};

const reminderSchedule = [
    { label: "H-3 sebelum jatuh tempo", type: "Friendly Reminder", template: "Halo {customer}, ini pengingat bahwa invoice {invoice} sejumlah Rp {amount} akan jatuh tempo pada {due_date}. Mohon segera diproses ya. Terima kasih! 🙏" },
    { label: "H+0 hari jatuh tempo", type: "Due Today", template: "Halo {customer}, invoice {invoice} sejumlah Rp {amount} jatuh tempo HARI INI ({due_date}). Mohon segera melakukan pembayaran. Terima kasih!" },
    { label: "H+7 overdue", type: "First Follow-up", template: "Halo {customer}, kami informasikan bahwa invoice {invoice} sejumlah Rp {amount} telah lewat jatuh tempo 7 hari. Mohon segera diproses untuk kelancaran kerja sama. 🙏" },
    { label: "H+14 overdue", type: "Escalation", template: "Yth. {customer}, invoice {invoice} Rp {amount} sudah overdue 14 hari (jatuh tempo: {due_date}). Kami perlu konfirmasi rencana pembayaran Anda secepatnya. Terima kasih." },
];

export default function ARDashboardPage() {
    const [search, setSearch] = useState("");

    const unpaidRecords = mockAR.filter(r => r.status !== "PAID");
    const totalAR = unpaidRecords.reduce((s, r) => s + r.outstanding, 0);
    const overdueAmount = unpaidRecords.filter(r => r.daysOverdue > 0).reduce((s, r) => s + r.outstanding, 0);
    const avgDaysOverdue = unpaidRecords.filter(r => r.daysOverdue > 0).length > 0
        ? unpaidRecords.filter(r => r.daysOverdue > 0).reduce((s, r) => s + r.daysOverdue, 0) / unpaidRecords.filter(r => r.daysOverdue > 0).length
        : 0;
    const collectionRate = mockAR.length > 0
        ? (mockAR.filter(r => r.status === "PAID").length / mockAR.length) * 100
        : 0;

    const agingBuckets = useMemo(() => {
        const buckets: Record<string, { count: number; amount: number }> = {
            CURRENT: { count: 0, amount: 0 },
            OVERDUE_30: { count: 0, amount: 0 },
            OVERDUE_60: { count: 0, amount: 0 },
            OVERDUE_90: { count: 0, amount: 0 },
        };
        unpaidRecords.forEach(r => {
            if (r.daysOverdue <= 0) buckets.CURRENT = { count: buckets.CURRENT.count + 1, amount: buckets.CURRENT.amount + r.outstanding };
            else if (r.daysOverdue <= 30) buckets.OVERDUE_30 = { count: buckets.OVERDUE_30.count + 1, amount: buckets.OVERDUE_30.amount + r.outstanding };
            else if (r.daysOverdue <= 60) buckets.OVERDUE_60 = { count: buckets.OVERDUE_60.count + 1, amount: buckets.OVERDUE_60.amount + r.outstanding };
            else buckets.OVERDUE_90 = { count: buckets.OVERDUE_90.count + 1, amount: buckets.OVERDUE_90.amount + r.outstanding };
        });
        return buckets;
    }, []);

    const filtered = mockAR.filter(r =>
        r.customerName.toLowerCase().includes(search.toLowerCase()) ||
        r.invoiceNo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Account Receivable</h1>
                    <p className="text-sm text-muted-foreground">Dashboard piutang dan penagihan otomatis</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total AR</p>
                            <p className="text-lg font-bold">Rp {(totalAR / 1_000_000).toFixed(0)}M</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Overdue Amount</p>
                            <p className="text-lg font-bold text-red-600">Rp {(overdueAmount / 1_000_000).toFixed(0)}M</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Avg Days Overdue</p>
                            <p className="text-lg font-bold">{avgDaysOverdue.toFixed(0)} hari</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Collection Rate</p>
                            <p className="text-lg font-bold text-emerald-600">{collectionRate.toFixed(0)}%</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Aging Breakdown */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        Aging Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-3">
                        {(["CURRENT", "OVERDUE_30", "OVERDUE_60", "OVERDUE_90"] as const).map(bucket => {
                            const cfg = agingConfig[bucket];
                            const data = agingBuckets[bucket];
                            const pct = totalAR > 0 ? (data.amount / totalAR) * 100 : 0;
                            return (
                                <div key={bucket} className={`rounded-xl p-4 border ${cfg.color}`}>
                                    <p className="text-[11px] font-semibold">{cfg.label}</p>
                                    <p className="text-lg font-bold mt-1">Rp {(data.amount / 1_000_000).toFixed(0)}M</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px]">{data.count} invoice</span>
                                        <span className="text-[10px] font-bold">{pct.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-white/50 mt-2 overflow-hidden">
                                        <div className="h-full rounded-full bg-current opacity-40" style={{ width: `${Math.min(pct, 100)}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Auto-Reminder Schedule */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-950/10 dark:to-indigo-950/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Bell className="h-4 w-4 text-violet-500" />
                        Auto-Reminder Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {reminderSchedule.map((rs, i) => (
                            <div key={i} className="rounded-lg bg-white/80 dark:bg-background/50 border p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[9px] bg-violet-100 text-violet-700 border-violet-200">
                                        {rs.label}
                                    </Badge>
                                </div>
                                <p className="text-[10px] font-semibold">{rs.type}</p>
                                <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                                    &ldquo;{rs.template.substring(0, 100)}...&rdquo;
                                </p>
                                <div className="flex gap-1">
                                    <Badge variant="secondary" className="text-[8px] gap-1"><MessageCircle className="h-2.5 w-2.5" />WA</Badge>
                                    <Badge variant="secondary" className="text-[8px] gap-1"><Mail className="h-2.5 w-2.5" />Email</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customer or invoice..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-0 shadow-sm" />
            </div>

            {/* AR Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 text-[10px]">
                                <TableHead className="font-semibold">Invoice</TableHead>
                                <TableHead className="font-semibold">Customer</TableHead>
                                <TableHead className="font-semibold">Aging</TableHead>
                                <TableHead className="font-semibold text-right">Amount</TableHead>
                                <TableHead className="font-semibold text-right">Paid</TableHead>
                                <TableHead className="font-semibold text-right">Outstanding</TableHead>
                                <TableHead className="font-semibold">Due Date</TableHead>
                                <TableHead className="font-semibold text-right">Days OD</TableHead>
                                <TableHead className="font-semibold text-center">Reminder</TableHead>
                                <TableHead className="font-semibold">Channel</TableHead>
                                <TableHead className="font-semibold">Last Sent</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(r => {
                                const cfg = agingConfig[r.status];
                                return (
                                    <TableRow key={r.id} className={`hover:bg-muted/20 text-[11px] ${r.daysOverdue > 60 ? "bg-red-50/30" : ""}`}>
                                        <TableCell className="font-mono text-[10px] font-medium">{r.invoiceNo}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">{r.customerName}</span>
                                            <p className="text-[9px] text-muted-foreground">{r.customerArea} • {r.phone}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[9px] ${cfg.color}`}>{cfg.label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">Rp {(r.amount / 1_000_000).toFixed(1)}M</TableCell>
                                        <TableCell className="text-right font-mono text-emerald-600">
                                            {r.paidAmount > 0 ? `Rp ${(r.paidAmount / 1_000_000).toFixed(1)}M` : "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold">
                                            <span className={r.outstanding > 0 ? "text-red-600" : "text-emerald-600"}>
                                                {r.outstanding > 0 ? `Rp ${(r.outstanding / 1_000_000).toFixed(1)}M` : "Lunas ✅"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[10px]">{r.dueDate}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {r.daysOverdue > 0 ? (
                                                <span className={`font-bold ${r.daysOverdue > 60 ? "text-red-600" : r.daysOverdue > 30 ? "text-orange-600" : "text-amber-600"}`}>
                                                    {r.daysOverdue}d
                                                </span>
                                            ) : r.status === "PAID" ? "-" : (
                                                <span className="text-emerald-600">On time</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {r.status !== "PAID" && (
                                                <div className="flex items-center justify-center gap-1">
                                                    <Badge variant={r.autoReminder ? "default" : "outline"} className={`text-[8px] ${r.autoReminder ? "bg-violet-500" : ""}`}>
                                                        {r.autoReminder ? "Auto" : "Manual"}
                                                    </Badge>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {r.reminderChannel.includes("WA") && (
                                                    <Badge variant="secondary" className="text-[8px] gap-0.5 px-1"><MessageCircle className="h-2.5 w-2.5" />WA</Badge>
                                                )}
                                                {r.reminderChannel.includes("EMAIL") && (
                                                    <Badge variant="secondary" className="text-[8px] gap-0.5 px-1"><Mail className="h-2.5 w-2.5" />Email</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[10px] text-muted-foreground">{r.lastReminderDate || "-"}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
