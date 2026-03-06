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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    TrendingDown,
    Droplets,
    Bug,
    PackageX,
    Factory,
    HelpCircle,
    Sprout,
    Package,
    AlertTriangle,
    ArrowDown,
} from "lucide-react";
import {
    depreciationLogs,
    depreciationReasonLabels,
    depreciationStageLabels,
    type DepreciationStage,
    type DepreciationReason,
} from "@/data/mock-data";
import { useState, useMemo } from "react";

const reasonIcons: Record<DepreciationReason, typeof Droplets> = {
    MOISTURE_LOSS: Droplets,
    HANDLING_LOSS: PackageX,
    SPOILAGE: Bug,
    PROCESSING_LOSS: Factory,
    MISSING: HelpCircle,
    QUALITY_REJECT: AlertTriangle,
};

const reasonColors: Record<DepreciationReason, string> = {
    MOISTURE_LOSS: "bg-sky-50 text-sky-700 border-sky-200",
    HANDLING_LOSS: "bg-amber-50 text-amber-700 border-amber-200",
    SPOILAGE: "bg-red-50 text-red-700 border-red-200",
    PROCESSING_LOSS: "bg-violet-50 text-violet-700 border-violet-200",
    MISSING: "bg-gray-50 text-gray-700 border-gray-200",
    QUALITY_REJECT: "bg-orange-50 text-orange-700 border-orange-200",
};

const stageIcons: Record<DepreciationStage, typeof Sprout> = {
    FARM: Sprout,
    INVENTORY: Package,
    PRODUCTION: Factory,
};

const stageColors: Record<DepreciationStage, string> = {
    FARM: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INVENTORY: "bg-blue-50 text-blue-700 border-blue-200",
    PRODUCTION: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function DepreciationPage() {
    const [search, setSearch] = useState("");
    const [stageFilter, setStageFilter] = useState("ALL");
    const [reasonFilter, setReasonFilter] = useState("ALL");

    const filtered = depreciationLogs.filter((d) => {
        const matchSearch =
            d.productName.toLowerCase().includes(search.toLowerCase()) ||
            d.reportedBy.toLowerCase().includes(search.toLowerCase()) ||
            d.notes.toLowerCase().includes(search.toLowerCase());
        const matchStage = stageFilter === "ALL" || d.stage === stageFilter;
        const matchReason = reasonFilter === "ALL" || d.reason === reasonFilter;
        return matchSearch && matchStage && matchReason;
    });

    // Stats
    const totalLoss = depreciationLogs.reduce((s, d) => s + d.lossQtyKg, 0);
    const totalInitial = depreciationLogs.reduce(
        (s, d) => s + d.initialQtyKg,
        0
    );
    const avgLossPercent =
        totalInitial > 0
            ? ((totalLoss / totalInitial) * 100).toFixed(1)
            : "0";

    // By stage
    const byStage = useMemo(() => {
        const result: Record<string, { count: number; loss: number }> = {};
        depreciationLogs.forEach((d) => {
            if (!result[d.stage]) result[d.stage] = { count: 0, loss: 0 };
            result[d.stage].count++;
            result[d.stage].loss += d.lossQtyKg;
        });
        return result;
    }, []);

    // By reason
    const byReason = useMemo(() => {
        const result: Record<string, { count: number; loss: number }> = {};
        depreciationLogs.forEach((d) => {
            if (!result[d.reason]) result[d.reason] = { count: 0, loss: 0 };
            result[d.reason].count++;
            result[d.reason].loss += d.lossQtyKg;
        });
        return result;
    }, []);

    const topReason = Object.entries(byReason).sort(
        (a, b) => b[1].loss - a[1].loss
    )[0];

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Tracking penyusutan stok (depreciation) di setiap tahap supply
                chain — dari farm hingga produksi.
            </p>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <TrendingDown className="h-5 w-5 mx-auto mb-1 text-red-500" />
                        <p className="text-xl font-bold text-red-600">
                            {totalLoss.toLocaleString("id-ID")} KG
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Total Loss
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <ArrowDown className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                        <p className="text-xl font-bold text-amber-600">
                            {avgLossPercent}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Avg Shrinkage
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-violet-500" />
                        <p className="text-xl font-bold text-violet-600">
                            {depreciationLogs.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Total Events
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        {topReason && (
                            <>
                                {(() => {
                                    const Icon =
                                        reasonIcons[
                                        topReason[0] as DepreciationReason
                                        ];
                                    return (
                                        <Icon className="h-5 w-5 mx-auto mb-1 text-sky-500" />
                                    );
                                })()}
                                <p className="text-sm font-bold text-sky-600">
                                    {
                                        depreciationReasonLabels[
                                        topReason[0] as DepreciationReason
                                        ]
                                    }
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Top Reason (
                                    {topReason[1].loss.toLocaleString("id-ID")}{" "}
                                    KG)
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Stage Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(["FARM", "INVENTORY", "PRODUCTION"] as DepreciationStage[]).map(
                    (stage) => {
                        const data = byStage[stage] || { count: 0, loss: 0 };
                        const StageIcon = stageIcons[stage];
                        const pct =
                            totalLoss > 0
                                ? ((data.loss / totalLoss) * 100).toFixed(0)
                                : "0";
                        return (
                            <Card
                                key={stage}
                                className="border-0 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${stageColors[stage]}`}
                                        >
                                            <StageIcon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">
                                                {depreciationStageLabels[stage]}
                                            </p>
                                            <p className="text-lg font-bold">
                                                {data.loss.toLocaleString(
                                                    "id-ID"
                                                )}{" "}
                                                KG
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                variant="outline"
                                                className={stageColors[stage]}
                                            >
                                                {pct}%
                                            </Badge>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {data.count} events
                                            </p>
                                        </div>
                                    </div>
                                    {/* Mini bar */}
                                    <div className="mt-2 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${stage === "FARM"
                                                    ? "bg-emerald-500"
                                                    : stage === "INVENTORY"
                                                        ? "bg-blue-500"
                                                        : "bg-purple-500"
                                                }`}
                                            style={{
                                                width: `${Math.min(
                                                    parseInt(pct),
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    }
                )}
            </div>

            {/* Reason Breakdown */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                        Breakdown by Reason
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(byReason)
                            .sort((a, b) => b[1].loss - a[1].loss)
                            .map(([reason, data]) => {
                                const r = reason as DepreciationReason;
                                const Icon = reasonIcons[r];
                                return (
                                    <div
                                        key={reason}
                                        className="flex items-center gap-2 rounded-lg border border-border/50 p-2.5"
                                    >
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${reasonColors[r]}`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-semibold truncate">
                                                {depreciationReasonLabels[r]}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {data.loss.toLocaleString(
                                                    "id-ID"
                                                )}{" "}
                                                KG • {data.count}x
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search product, reporter, notes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-0"
                            />
                        </div>
                        <Select
                            value={stageFilter}
                            onValueChange={setStageFilter}
                        >
                            <SelectTrigger className="w-full sm:w-36 bg-muted/30 border-0">
                                <SelectValue placeholder="Stage" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Stages</SelectItem>
                                {Object.entries(depreciationStageLabels).map(
                                    ([k, v]) => (
                                        <SelectItem key={k} value={k}>
                                            {v}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                        <Select
                            value={reasonFilter}
                            onValueChange={setReasonFilter}
                        >
                            <SelectTrigger className="w-full sm:w-40 bg-muted/30 border-0">
                                <SelectValue placeholder="Reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Reasons</SelectItem>
                                {Object.entries(depreciationReasonLabels).map(
                                    ([k, v]) => (
                                        <SelectItem key={k} value={k}>
                                            {v}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Depreciation Log Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 text-[10px]">
                                <TableHead className="font-semibold">
                                    Date
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Stage
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Reason
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Product
                                </TableHead>
                                <TableHead className="font-semibold text-right">
                                    Initial (KG)
                                </TableHead>
                                <TableHead className="font-semibold text-right">
                                    Loss (KG)
                                </TableHead>
                                <TableHead className="font-semibold text-right">
                                    Loss %
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Reported By
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Notes
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((d) => {
                                const ReasonIcon = reasonIcons[d.reason];
                                return (
                                    <TableRow
                                        key={d.id}
                                        className="hover:bg-muted/20 text-[11px]"
                                    >
                                        <TableCell className="font-mono text-[10px]">
                                            {d.date}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-[9px] ${stageColors[d.stage]}`}
                                            >
                                                {depreciationStageLabels[d.stage]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <ReasonIcon className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-[10px]">
                                                    {
                                                        depreciationReasonLabels[
                                                        d.reason
                                                        ]
                                                    }
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                {d.productName}
                                            </span>
                                            {d.batchRef && (
                                                <p className="text-[9px] text-muted-foreground">
                                                    {d.batchRef}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {d.initialQtyKg.toLocaleString(
                                                "id-ID"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-bold text-red-600">
                                            -{d.lossQtyKg.toLocaleString(
                                                "id-ID"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            <span
                                                className={
                                                    d.lossPercent >= 10
                                                        ? "text-red-600 font-bold"
                                                        : d.lossPercent >= 5
                                                            ? "text-amber-600"
                                                            : "text-muted-foreground"
                                                }
                                            >
                                                {d.lossPercent.toFixed(1)}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-[10px]">
                                            {d.reportedBy}
                                        </TableCell>
                                        <TableCell className="max-w-[200px]">
                                            <p className="text-[10px] text-muted-foreground truncate">
                                                {d.notes}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Info */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-red-50/50 to-amber-50/50 dark:from-red-950/10 dark:to-amber-950/10">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <TrendingDown className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">
                                Tentang Depreciation / Stock Shrinkage
                            </p>
                            <p>
                                • <strong>Moisture Loss</strong> — penurunan
                                berat karena penguapan kadar air
                                (pengeringan/penjemuran)
                            </p>
                            <p>
                                • <strong>Handling Loss</strong> — tercecer atau
                                terbuang saat bongkar muat / pemindahan
                            </p>
                            <p>
                                • <strong>Spoilage</strong> — rusak karena
                                jamur, hama, atau penyimpanan buruk
                            </p>
                            <p>
                                • <strong>Processing Loss</strong> — material
                                tersisa di mesin, sisa produksi tidak layak
                            </p>
                            <p>
                                • <strong>Missing</strong> — hilang, tidak bisa
                                dipertanggungjawabkan
                            </p>
                            <p>
                                • <strong>Quality Reject</strong> — tidak
                                memenuhi standar kualitas, harus dibuang
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
