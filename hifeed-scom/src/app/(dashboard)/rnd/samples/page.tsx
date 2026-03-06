"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FlaskConical,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    PackagePlus,
} from "lucide-react";
import { rndSampleRequests, rndBudget } from "@/data/mock-data";

const statusConfig = {
    PENDING: {
        label: "Pending",
        color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
        icon: Clock,
    },
    APPROVED: {
        label: "Approved",
        color: "bg-sky-500/10 text-sky-600 border-sky-500/30",
        icon: CheckCircle2,
    },
    REJECTED: {
        label: "Rejected",
        color: "bg-red-500/10 text-red-600 border-red-500/30",
        icon: XCircle,
    },
    FULFILLED: {
        label: "Fulfilled",
        color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
        icon: CheckCircle2,
    },
};

const materialTypeLabels = {
    RAW_WET: { label: "Raw (Basah)", color: "bg-teal-500/10 text-teal-600" },
    RAW_DRY: { label: "Raw (Kering)", color: "bg-orange-500/10 text-orange-600" },
    FINISHED_GOOD: { label: "Finished Good", color: "bg-indigo-500/10 text-indigo-600" },
};

export default function SamplesPage() {
    const fulfilled = rndSampleRequests.filter((s) => s.status === "FULFILLED");
    const totalConsumedValue = fulfilled.reduce(
        (sum, s) => sum + s.estimatedValue,
        0
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg">
                    <PackagePlus className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Sample Requests
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Permintaan sampel material untuk eksperimen R&D
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                    [
                        { label: "Pending", status: "PENDING" as const, color: "text-amber-600" },
                        { label: "Approved", status: "APPROVED" as const, color: "text-sky-600" },
                        { label: "Fulfilled", status: "FULFILLED" as const, color: "text-emerald-600" },
                        { label: "Rejected", status: "REJECTED" as const, color: "text-red-600" },
                    ] as const
                ).map((item) => (
                    <Card key={item.status} className="border-0 shadow-sm py-0">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold">
                                <span className={item.color}>
                                    {
                                        rndSampleRequests.filter(
                                            (s) => s.status === item.status
                                        ).length
                                    }
                                </span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {item.label}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Budget Usage Summary */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="text-muted-foreground">
                                Total consumed R&D samples:
                            </span>
                            <strong>Rp {(totalConsumedValue / 1000).toFixed(0)}K</strong>
                        </div>
                        <div className="text-muted-foreground">
                            Pagu:{" "}
                            <strong>
                                Rp {(rndBudget.paguAmount / 1000).toFixed(0)}K
                            </strong>{" "}
                            • Sisa:{" "}
                            <strong className="text-emerald-600">
                                Rp {(rndBudget.remaining / 1000).toFixed(0)}K
                            </strong>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sample Cards */}
            <div className="space-y-3">
                {rndSampleRequests.map((sr) => {
                    const statusCfg = statusConfig[sr.status];
                    const StatusIcon = statusCfg.icon;
                    const matType = materialTypeLabels[sr.materialType];

                    return (
                        <Card
                            key={sr.id}
                            className="border-0 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    {/* Status Icon */}
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${statusCfg.color}`}
                                    >
                                        <StatusIcon className="h-5 w-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-xs font-semibold">
                                                {sr.requestNumber}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] px-1.5 py-0 ${statusCfg.color}`}
                                            >
                                                {statusCfg.label}
                                            </Badge>
                                            <Badge
                                                variant="secondary"
                                                className={`text-[10px] ${matType.color}`}
                                            >
                                                {matType.label}
                                            </Badge>
                                        </div>
                                        <h3 className="text-sm font-semibold">
                                            {sr.productName}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            {sr.purpose}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                            <span>
                                                📦 {sr.qtyRequested} {sr.uom}
                                            </span>
                                            <span>
                                                💰 Rp{" "}
                                                {(
                                                    sr.estimatedValue / 1000
                                                ).toFixed(0)}
                                                K
                                            </span>
                                            <span>📅 {sr.createdAt}</span>
                                            {sr.approvedBy && (
                                                <span>
                                                    ✅ {sr.approvedBy}
                                                </span>
                                            )}
                                            {sr.fulfilledAt && (
                                                <span>
                                                    📤 Fulfilled:{" "}
                                                    {sr.fulfilledAt}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
