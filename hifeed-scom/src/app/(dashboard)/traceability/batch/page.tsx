"use client";

import { useState, useMemo } from "react";
import {
    ShoppingCart,
    PackageCheck,
    Sprout,
    Leaf,
    Package,
    Factory,
    Truck,
    ChevronDown,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertTriangle,
    TrendingDown,
    TrendingUp,
    Repeat,
    MapPin,
    Calendar,
    Skull,
    FlaskConical,
    Boxes,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    farmBatches,
    harvestResults,
    purchaseOrders,
    goodsReceipts,
    stockItems,
    stockLedgerEntries,
    productionRuns,
    deliveryTrips,
    dailyLogs,
} from "@/data/mock-data";

// ---- Types ----
type StageStatus = "completed" | "active" | "pending" | "skipped";

interface StageInfo {
    key: string;
    label: string;
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    status: StageStatus;
    details?: { label: string; value: string }[];
    qtyIn?: number;
    qtyOut?: number;
    uom?: string;
    lossQty?: number;
    lossPercent?: number;
    lossLabel?: string;
    lossType?: "reject" | "mortality" | "conversion" | "yield" | "none";
    isUnitConversion?: boolean;
    conversionNote?: string;
}

function getStatusBadge(status: StageStatus) {
    switch (status) {
        case "completed":
            return { label: "SELESAI", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
        case "active":
            return { label: "AKTIF", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
        case "pending":
            return { label: "PENDING", color: "bg-slate-500/15 text-slate-400 border-slate-500/30" };
        case "skipped":
            return { label: "N/A", color: "bg-slate-500/10 text-slate-500 border-slate-500/20" };
    }
}

// ---- Build journey for a specific batch ----
function buildBatchJourney(batchId: string): StageInfo[] {
    const batch = farmBatches.find((b) => b.id === batchId);
    if (!batch) return [];

    const stages: StageInfo[] = [];

    // 1. Purchase Order
    if (batch.sourcePOId) {
        const po = purchaseOrders.find((p) => p.id === batch.sourcePOId);
        if (po) {
            const poItem = po.items.find((i) => i.productId === batch.inputProductId);
            stages.push({
                key: "po",
                label: "Purchase Order",
                icon: ShoppingCart,
                iconColor: "text-blue-400",
                bgColor: "bg-blue-500/10",
                borderColor: "border-blue-500/30",
                status: "completed",
                details: [
                    { label: "No. PO", value: po.poNumber },
                    { label: "Tanggal", value: po.createdAt },
                    { label: "Vendor", value: po.vendorName },
                    { label: "Item", value: `${poItem?.productName} — ${poItem?.qty} ${poItem?.uom}` },
                    { label: "Status PO", value: po.status },
                ],
                qtyIn: poItem?.qty || 0,
                qtyOut: poItem?.qty || 0,
                uom: poItem?.uom || "",
                lossQty: 0,
                lossPercent: 0,
                lossLabel: "Order placed",
                lossType: "none",
            });
        }
    } else {
        stages.push({
            key: "po",
            label: "Purchase Order",
            icon: ShoppingCart,
            iconColor: "text-blue-400",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/30",
            status: "skipped",
            details: [{ label: "Info", value: "Tidak ada data PO terkait" }],
        });
    }

    // 2. Goods Receipt
    if (batch.sourceGRNId) {
        const grn = goodsReceipts.find((g) => g.id === batch.sourceGRNId);
        if (grn) {
            const grnItem = grn.items[0];
            const totalArrive = (grnItem?.qtyReceived || 0) + (grnItem?.qtyRejected || 0);
            stages.push({
                key: "grn",
                label: "Goods Receipt",
                icon: PackageCheck,
                iconColor: "text-teal-400",
                bgColor: "bg-teal-500/10",
                borderColor: "border-teal-500/30",
                status: "completed",
                details: [
                    { label: "No. GRN", value: grn.grnNumber },
                    { label: "Tanggal", value: grn.receivedDate },
                    { label: "Diterima", value: `${grnItem?.qtyReceived} ${grnItem?.uom}` },
                    ...(grnItem?.qtyRejected ? [{ label: "Ditolak", value: `${grnItem.qtyRejected} ${grnItem.uom}` }] : []),
                    { label: "Berat", value: `${grnItem?.weight?.toLocaleString("id-ID")} Kg` },
                    { label: "Received by", value: grn.receivedBy },
                ],
                qtyIn: totalArrive,
                qtyOut: grnItem?.qtyReceived || 0,
                uom: grnItem?.uom || "",
                lossQty: grnItem?.qtyRejected || 0,
                lossPercent: totalArrive > 0 ? ((grnItem?.qtyRejected || 0) / totalArrive) * 100 : 0,
                lossLabel: grnItem?.qtyRejected ? `Reject: ${grnItem.qtyRejected} ${grnItem.uom}` : "100% diterima",
                lossType: (grnItem?.qtyRejected || 0) > 0 ? "reject" : "none",
            });
        }
    } else if (batch.sourcePOId) {
        // Has PO but GRN not yet linked
        const po = purchaseOrders.find((p) => p.id === batch.sourcePOId);
        const relatedGRNs = po ? goodsReceipts.filter((g) => g.poId === po.id) : [];
        if (relatedGRNs.length > 0) {
            const grn = relatedGRNs[0];
            const grnItem = grn.items[0];
            const totalArrive = (grnItem?.qtyReceived || 0) + (grnItem?.qtyRejected || 0);
            stages.push({
                key: "grn",
                label: "Goods Receipt",
                icon: PackageCheck,
                iconColor: "text-teal-400",
                bgColor: "bg-teal-500/10",
                borderColor: "border-teal-500/30",
                status: "completed",
                details: [
                    { label: "No. GRN", value: grn.grnNumber },
                    { label: "Tanggal", value: grn.receivedDate },
                    { label: "Diterima", value: `${grnItem?.qtyReceived} ${grnItem?.uom}` },
                    ...(grnItem?.qtyRejected ? [{ label: "Ditolak", value: `${grnItem.qtyRejected} ${grnItem.uom}` }] : []),
                    { label: "Berat", value: `${grnItem?.weight?.toLocaleString("id-ID")} Kg` },
                ],
                qtyIn: totalArrive,
                qtyOut: grnItem?.qtyReceived || 0,
                uom: grnItem?.uom || "",
                lossQty: grnItem?.qtyRejected || 0,
                lossPercent: totalArrive > 0 ? ((grnItem?.qtyRejected || 0) / totalArrive) * 100 : 0,
                lossLabel: grnItem?.qtyRejected ? `Reject: ${grnItem.qtyRejected}` : "100% diterima",
                lossType: (grnItem?.qtyRejected || 0) > 0 ? "reject" : "none",
            });
        } else {
            stages.push({
                key: "grn",
                label: "Goods Receipt",
                icon: PackageCheck,
                iconColor: "text-teal-400",
                bgColor: "bg-teal-500/10",
                borderColor: "border-teal-500/30",
                status: "pending",
                details: [{ label: "Info", value: "Menunggu penerimaan barang" }],
            });
        }
    } else {
        stages.push({
            key: "grn",
            label: "Goods Receipt",
            icon: PackageCheck,
            iconColor: "text-teal-400",
            bgColor: "bg-teal-500/10",
            borderColor: "border-teal-500/30",
            status: "skipped",
        });
    }

    // 3. Farm / Batch (always present since we're tracking a batch)
    const mortalityQty = batch.initialQty - batch.currentQty;
    const batchCompleted = ["HARVESTED", "WRITE_OFF"].includes(batch.status);
    const batchStageStatus: StageStatus = batchCompleted ? "completed" : "active";

    stages.push({
        key: "farm",
        label: "Farm / Batch",
        icon: Sprout,
        iconColor: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        status: batchStageStatus,
        details: [
            { label: "Batch Code", value: batch.batchCode },
            { label: "Lokasi", value: batch.locationName },
            { label: "Produk", value: batch.productName },
            { label: "Mulai Tanam", value: batch.startDate },
            { label: "HST", value: `${batch.hst} hari` },
            { label: "Status", value: batch.status.replace(/_/g, " ") },
            { label: "Initial Qty", value: batch.initialQty.toLocaleString("id-ID") },
            { label: "Current Qty", value: batch.currentQty.toLocaleString("id-ID") },
        ],
        qtyIn: batch.initialQty,
        qtyOut: batch.currentQty,
        uom: "UNIT",
        lossQty: mortalityQty,
        lossPercent: batch.mortalityRate,
        lossLabel: `Mortality: ${batch.mortalityRate}%`,
        lossType: "mortality",
    });

    // 4. Harvest
    const harvest = harvestResults.find((h) => h.batchId === batch.id);
    if (harvest) {
        stages.push({
            key: "harvest",
            label: "Harvest",
            icon: Leaf,
            iconColor: "text-lime-400",
            bgColor: "bg-lime-500/10",
            borderColor: "border-lime-500/30",
            status: "completed",
            details: [
                { label: "Tanggal Panen", value: harvest.harvestDate },
                { label: "Total Berat", value: `${harvest.totalWeightKg.toLocaleString("id-ID")} Kg` },
                { label: "Avg Weight", value: `${harvest.sampleAvgWeight} Kg/unit` },
                { label: "Est. Populasi", value: harvest.estimatedPopulation.toLocaleString("id-ID") },
                { label: "HPP/Kg", value: `Rp ${harvest.hppPerKg.toLocaleString("id-ID")}` },
                { label: "Tim Panen", value: harvest.harvestedBy },
            ],
            qtyIn: harvest.estimatedPopulation,
            qtyOut: harvest.totalWeightKg,
            uom: "KG",
            lossQty: 0,
            lossPercent: 0,
            lossLabel: "Unit conversion",
            lossType: "conversion",
            isUnitConversion: true,
            conversionNote: `${harvest.estimatedPopulation.toLocaleString("id-ID")} ekor × ${harvest.sampleAvgWeight} kg = ${harvest.totalWeightKg.toLocaleString("id-ID")} kg`,
        });
    } else {
        stages.push({
            key: "harvest",
            label: "Harvest",
            icon: Leaf,
            iconColor: "text-lime-400",
            bgColor: "bg-lime-500/10",
            borderColor: "border-lime-500/30",
            status: batchCompleted ? "skipped" : "pending",
            details: [{ label: "Info", value: batchCompleted ? "Batch di-write off" : `Menunggu panen (HST: ${batch.hst} hari)` }],
        });
    }

    // 5. Production (from harvest output product)
    if (harvest?.outputProductId) {
        const prods = productionRuns.filter((pr) =>
            pr.bomItems.some((b) => b.productId === harvest.outputProductId)
        );
        if (prods.length > 0) {
            const pr = prods[0];
            const bomItem = pr.bomItems.find((b) => b.productId === harvest.outputProductId);
            const totalBomKg = pr.bomItems.reduce((sum, b) => (b.uom === "KG" || b.uom === "LITER") ? sum + b.qty : sum, 0);
            const yieldRate = totalBomKg > 0 ? (pr.outputQty / totalBomKg) * 100 : 0;

            stages.push({
                key: "production",
                label: "Production",
                icon: Factory,
                iconColor: "text-purple-400",
                bgColor: "bg-purple-500/10",
                borderColor: "border-purple-500/30",
                status: pr.status === "FINISHED" ? "completed" : pr.status === "IN_PROGRESS" ? "active" : "pending",
                details: [
                    { label: "Run Number", value: pr.runNumber },
                    { label: "Machine", value: pr.machineName },
                    { label: "BOM Usage", value: `${bomItem?.qty} ${bomItem?.uom}` },
                    { label: "Output", value: `${pr.outputProductName} — ${pr.outputQty} ${pr.outputUom}` },
                    { label: "Shift", value: pr.shiftCode },
                    { label: "Status", value: pr.status },
                ],
                qtyIn: totalBomKg,
                qtyOut: pr.outputQty,
                uom: pr.outputUom,
                lossQty: totalBomKg > pr.outputQty ? totalBomKg - pr.outputQty : 0,
                lossPercent: 0,
                lossLabel: `Yield: ${yieldRate.toFixed(1)}%`,
                lossType: "yield",
                conversionNote: `${totalBomKg.toLocaleString("id-ID")} KG input → ${pr.outputQty.toLocaleString("id-ID")} ${pr.outputUom} output`,
            });
        } else {
            stages.push({
                key: "production",
                label: "Production",
                icon: Factory,
                iconColor: "text-purple-400",
                bgColor: "bg-purple-500/10",
                borderColor: "border-purple-500/30",
                status: "pending",
                details: [{ label: "Info", value: "Belum masuk produksi" }],
            });
        }
    } else {
        stages.push({
            key: "production",
            label: "Production",
            icon: Factory,
            iconColor: "text-purple-400",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/30",
            status: harvest ? "pending" : "pending",
            details: [{ label: "Info", value: "Menunggu hasil panen" }],
        });
    }

    // 6. Delivery
    const outputProductId = harvest?.outputProductId;
    if (outputProductId) {
        const trips = deliveryTrips.filter((dt) =>
            dt.items.some((i) => i.productId === outputProductId)
        );
        if (trips.length > 0) {
            const trip = trips[0];
            const tripItem = trip.items.find((i) => i.productId === outputProductId);
            stages.push({
                key: "delivery",
                label: "Delivery",
                icon: Truck,
                iconColor: "text-rose-400",
                bgColor: "bg-rose-500/10",
                borderColor: "border-rose-500/30",
                status: trip.status === "DELIVERED" ? "completed" : "active",
                details: [
                    { label: "No. DO", value: trip.doNumber },
                    { label: "Customer", value: trip.customerName },
                    { label: "Driver", value: trip.driverName },
                    { label: "Kendaraan", value: trip.vehiclePlate },
                    { label: "Item", value: `${tripItem?.productName} — ${tripItem?.qty} ${tripItem?.uom}` },
                    { label: "Status", value: trip.status.replace(/_/g, " ") },
                    ...(trip.deliveredAt ? [{ label: "Delivered", value: trip.deliveredAt }] : []),
                ],
                qtyIn: tripItem?.qty || 0,
                qtyOut: trip.status === "DELIVERED" ? (tripItem?.qty || 0) : 0,
                uom: tripItem?.uom || "",
                lossQty: 0,
                lossPercent: 0,
                lossLabel: trip.status === "DELIVERED" ? "Delivered 100%" : trip.status === "ON_THE_WAY" ? "In transit" : "Loading",
                lossType: "none",
            });
        } else {
            stages.push({
                key: "delivery",
                label: "Delivery",
                icon: Truck,
                iconColor: "text-rose-400",
                bgColor: "bg-rose-500/10",
                borderColor: "border-rose-500/30",
                status: "pending",
                details: [{ label: "Info", value: "Belum ada pengiriman" }],
            });
        }
    } else {
        stages.push({
            key: "delivery",
            label: "Delivery",
            icon: Truck,
            iconColor: "text-rose-400",
            bgColor: "bg-rose-500/10",
            borderColor: "border-rose-500/30",
            status: "pending",
            details: [{ label: "Info", value: "Menunggu produksi selesai" }],
        });
    }

    return stages;
}

// ---- Progress Stepper ----
function ProgressStepper({ stages }: { stages: StageInfo[] }) {
    return (
        <div className="flex items-center w-full overflow-x-auto pb-2">
            {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isLast = idx === stages.length - 1;

                const dotClass = stage.status === "completed"
                    ? "bg-emerald-500 border-emerald-400 shadow-emerald-500/30 shadow-md"
                    : stage.status === "active"
                        ? "bg-amber-500 border-amber-400 shadow-amber-500/30 shadow-md animate-pulse"
                        : "bg-muted border-border/60";

                const lineClass = stage.status === "completed"
                    ? "bg-emerald-500/70"
                    : stage.status === "active"
                        ? "bg-gradient-to-r from-emerald-500/70 to-amber-500/50"
                        : "bg-border/40";

                return (
                    <div key={stage.key} className="flex items-center flex-1 min-w-[100px]">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all ${dotClass}`}>
                                {stage.status === "completed" ? (
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                ) : (
                                    <Icon className={`h-5 w-5 ${stage.status === "active" ? "text-white" : "text-muted-foreground/50"}`} />
                                )}
                            </div>
                            <span className={`text-[10px] font-semibold text-center whitespace-nowrap ${stage.status === "active" ? "text-amber-400" : stage.status === "completed" ? "text-emerald-400" : "text-muted-foreground/50"}`}>
                                {stage.label}
                            </span>
                        </div>
                        {!isLast && (
                            <div className={`flex-1 h-[3px] mx-2 rounded-full ${lineClass}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ---- Stage Detail Card ----
function StageDetailCard({ stage, isActive }: { stage: StageInfo; isActive: boolean }) {
    const [expanded, setExpanded] = useState(isActive);
    const Icon = stage.icon;
    const badge = getStatusBadge(stage.status);

    const hasQuantityFlow = stage.qtyIn !== undefined && stage.qtyOut !== undefined && stage.status !== "pending" && stage.status !== "skipped";

    const barPercent = hasQuantityFlow && stage.qtyIn! > 0
        ? Math.min((stage.qtyOut! / stage.qtyIn!) * 100, 100)
        : 100;

    const getBarColor = () => {
        if (stage.isUnitConversion) return "bg-sky-500";
        if (stage.lossType === "yield") return "bg-violet-500";
        if (!stage.lossPercent || stage.lossPercent <= 2) return "bg-emerald-500";
        if (stage.lossPercent <= 5) return "bg-amber-500";
        return "bg-red-500";
    };

    const getLossIconEl = () => {
        if (stage.isUnitConversion) return <Repeat className="h-3 w-3 text-sky-400" />;
        if (stage.lossType === "yield") return <TrendingUp className="h-3 w-3 text-violet-400" />;
        if (!stage.lossPercent || stage.lossPercent <= 2) return <CheckCircle2 className="h-3 w-3 text-emerald-400" />;
        if (stage.lossPercent <= 5) return <TrendingDown className="h-3 w-3 text-amber-400" />;
        return <AlertTriangle className="h-3 w-3 text-red-400" />;
    };

    return (
        <Card className={`border transition-all duration-200 ${isActive ? "border-amber-500/40 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/20" : "border-border/60 shadow-sm"}`}>
            <CardHeader className="pb-2 pt-3 px-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stage.bgColor} border ${stage.borderColor}`}>
                            <Icon className={`h-4 w-4 ${stage.iconColor}`} />
                        </div>
                        <span className="text-sm font-semibold">{stage.label}</span>
                        {isActive && (
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0 ${badge.color}`}>
                            {badge.label}
                        </Badge>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
                    </div>
                </div>
            </CardHeader>

            {expanded && (
                <CardContent className="px-4 pb-4 pt-0">
                    {/* Details grid */}
                    {stage.details && stage.details.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 mb-3">
                            {stage.details.map((d, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">{d.label}</span>
                                    <span className="text-xs font-medium text-foreground/80">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quantity flow */}
                    {hasQuantityFlow && (
                        <div className="pt-3 border-t border-border/40">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                    {getLossIconEl()}
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Quantity Flow
                                    </span>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold px-2 py-0">
                                    {stage.lossLabel}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex-1">
                                    <span className="text-[10px] text-muted-foreground uppercase">In</span>
                                    <p className="text-sm font-bold">{stage.qtyIn!.toLocaleString("id-ID")} <span className="text-xs font-normal text-muted-foreground">{stage.isUnitConversion ? "EKOR" : stage.uom}</span></p>
                                </div>
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                                <div className="flex-1 text-right">
                                    <span className="text-[10px] text-muted-foreground uppercase">Out</span>
                                    <p className="text-sm font-bold">{stage.qtyOut!.toLocaleString("id-ID")} <span className="text-xs font-normal text-muted-foreground">{stage.uom}</span></p>
                                </div>
                            </div>

                            <div className="relative h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                                <div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${getBarColor()}`} style={{ width: `${barPercent}%` }} />
                                {stage.lossType !== "conversion" && stage.lossType !== "yield" && (stage.lossPercent || 0) > 0 && (
                                    <div className="absolute inset-y-0 right-0 rounded-r-full bg-red-500/25" style={{ width: `${100 - barPercent}%` }} />
                                )}
                            </div>

                            {stage.isUnitConversion && stage.conversionNote && (
                                <p className="text-[11px] text-sky-400 mt-1.5 flex items-center gap-1">
                                    <Repeat className="h-3 w-3" /> {stage.conversionNote}
                                </p>
                            )}
                            {stage.lossType === "yield" && stage.conversionNote && (
                                <p className="text-[11px] text-violet-400 mt-1.5 flex items-center gap-1">
                                    <FlaskConical className="h-3 w-3" /> {stage.conversionNote}
                                </p>
                            )}
                            {stage.lossType === "mortality" && (stage.lossQty || 0) > 0 && (
                                <p className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1">
                                    <Skull className="h-3 w-3" /> Loss: {stage.lossQty?.toLocaleString("id-ID")} unit ({stage.lossPercent?.toFixed(1)}%)
                                </p>
                            )}
                            {stage.lossType === "reject" && (stage.lossQty || 0) > 0 && (
                                <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Rejected: {stage.lossQty?.toLocaleString("id-ID")} unit ({stage.lossPercent?.toFixed(1)}%)
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

// ---- Quantity Waterfall ----
function QuantityWaterfall({ stages }: { stages: StageInfo[] }) {
    const dataPoints = stages
        .filter((s) => s.status !== "pending" && s.status !== "skipped" && s.qtyOut !== undefined)
        .map((s) => ({
            label: s.label,
            qtyIn: s.qtyIn || 0,
            qtyOut: s.qtyOut || 0,
            uom: s.uom || "",
            loss: s.lossQty || 0,
            lossPercent: s.lossPercent || 0,
            lossType: s.lossType || "none",
            isConversion: s.isUnitConversion || false,
        }));

    if (dataPoints.length === 0) return null;

    const maxQty = Math.max(...dataPoints.flatMap((d) => [d.qtyIn, d.qtyOut]));

    return (
        <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-indigo-400" />
                    Quantity Waterfall
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">Perubahan kuantitas dari stage ke stage</p>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="space-y-3">
                    {dataPoints.map((dp, idx) => {
                        const barIn = maxQty > 0 ? (dp.qtyIn / maxQty) * 100 : 0;
                        const barOut = maxQty > 0 ? (dp.qtyOut / maxQty) * 100 : 0;
                        const barColor = dp.isConversion ? "bg-sky-500" : dp.lossType === "yield" ? "bg-violet-500" : dp.loss > 0 ? "bg-amber-500" : "bg-emerald-500";
                        const lossBarColor = dp.lossPercent > 5 ? "bg-red-500/40" : "bg-amber-500/30";

                        return (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] font-semibold text-muted-foreground">{dp.label}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] text-muted-foreground">
                                            {dp.qtyIn.toLocaleString("id-ID")} → {dp.qtyOut.toLocaleString("id-ID")} {dp.uom}
                                        </span>
                                        {dp.loss > 0 && !dp.isConversion && (
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-red-500/10 text-red-400 border-red-500/20">
                                                -{dp.loss.toLocaleString("id-ID")}
                                            </Badge>
                                        )}
                                        {dp.isConversion && (
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-sky-500/10 text-sky-400 border-sky-500/20">
                                                convert
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="relative h-5 w-full rounded bg-muted/30 overflow-hidden">
                                    <div className={`absolute inset-y-0 left-0 rounded ${barColor} transition-all`} style={{ width: `${barOut}%` }} />
                                    {dp.loss > 0 && !dp.isConversion && (
                                        <div className={`absolute inset-y-0 rounded-r ${lossBarColor}`} style={{ left: `${barOut}%`, width: `${barIn - barOut}%` }} />
                                    )}
                                    <div className="absolute inset-0 flex items-center px-2">
                                        <span className="text-[10px] font-bold text-white drop-shadow-md">
                                            {dp.qtyOut.toLocaleString("id-ID")} {dp.uom}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// ---- Main Page ----
export default function BatchTrackingPage() {
    const [selectedBatchId, setSelectedBatchId] = useState<string>(farmBatches[0].id);

    const journey = useMemo(() => buildBatchJourney(selectedBatchId), [selectedBatchId]);

    const selectedBatch = farmBatches.find((b) => b.id === selectedBatchId)!;

    // Find the current active stage index
    const activeIdx = journey.findIndex((s) => s.status === "active");
    const completedCount = journey.filter((s) => s.status === "completed").length;
    const progress = journey.length > 0 ? Math.round((completedCount / journey.length) * 100) : 0;

    // Recent daily logs for this batch
    const recentLogs = dailyLogs.filter((dl) => dl.batchId === selectedBatchId).slice(0, 3);

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "HARVESTED": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
            case "READY_HARVEST": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
            case "GROWING": return "bg-green-500/15 text-green-400 border-green-500/30";
            case "SEEDING": return "bg-sky-500/15 text-sky-400 border-sky-500/30";
            case "NURSERY": return "bg-violet-500/15 text-violet-400 border-violet-500/30";
            default: return "bg-slate-500/15 text-slate-400 border-slate-500/30";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Batch Tracking</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Lacak perjalanan setiap batch dari hulu (pembelian) hingga hilir (pengiriman)
                </p>
            </div>

            {/* Batch Picker */}
            <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <Sprout className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-medium">Pilih Batch:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {farmBatches.map((batch) => (
                                <button
                                    key={batch.id}
                                    onClick={() => setSelectedBatchId(batch.id)}
                                    className={`group flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all duration-200 ${selectedBatchId === batch.id
                                            ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20"
                                            : "border-border/60 bg-background hover:border-primary/40 hover:bg-primary/5"
                                        }`}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className={`text-xs font-mono font-bold ${selectedBatchId === batch.id ? "text-primary" : "text-foreground"}`}>
                                            {batch.batchCode}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground">{batch.productName}</span>
                                        <span className="text-[10px] text-muted-foreground/70">{batch.locationName}</span>
                                    </div>
                                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 shrink-0 ${getStatusBadgeColor(batch.status)}`}>
                                        {batch.status.replace(/_/g, " ")}
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Batch Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Card className="border border-border/60">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20">
                            <Sprout className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs font-mono font-bold">{selectedBatch.batchCode}</p>
                            <p className="text-[10px] text-muted-foreground">{selectedBatch.productName}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/60">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Calendar className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">{selectedBatch.hst} hari</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">HST</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className={`border ${selectedBatch.mortalityRate > 5 ? "border-red-500/40" : "border-border/60"}`}>
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${selectedBatch.mortalityRate > 5 ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"}`}>
                            <Skull className={`h-4 w-4 ${selectedBatch.mortalityRate > 5 ? "text-red-400" : "text-amber-400"}`} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">{selectedBatch.mortalityRate}%</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Mortality</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/60">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                            <MapPin className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium truncate max-w-[120px]" title={selectedBatch.locationName}>{selectedBatch.locationName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lokasi</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-emerald-500/30">
                    <CardContent className="p-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">{progress}%</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Progress</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Stepper */}
            <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Progress Pipeline</CardTitle>
                    <p className="text-[11px] text-muted-foreground">Status batch di setiap tahap supply chain</p>
                </CardHeader>
                <CardContent className="pt-2">
                    <ProgressStepper stages={journey} />
                </CardContent>
            </Card>

            {/* Stage Details + Waterfall */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Detail per Stage</h3>
                    {journey.map((stage, idx) => (
                        <StageDetailCard key={stage.key} stage={stage} isActive={idx === activeIdx} />
                    ))}
                </div>

                <div className="space-y-4">
                    {/* Waterfall */}
                    <QuantityWaterfall stages={journey} />

                    {/* Recent Daily Logs */}
                    {recentLogs.length > 0 && (
                        <Card className="border border-border/60 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-400" />
                                    Daily Log Terbaru
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    {recentLogs.map((log) => (
                                        <div key={log.id} className="rounded-lg border border-border/40 p-3">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-mono font-bold text-primary">{log.logDate}</span>
                                                {log.mortalityCount > 0 && (
                                                    <Badge variant="outline" className="text-[9px] px-1.5 bg-red-500/10 text-red-400 border-red-500/20">
                                                        <Skull className="h-2.5 w-2.5 mr-1" /> {log.mortalityCount} mati
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <div>
                                                    <span className="text-[9px] text-muted-foreground uppercase">Tenaga Kerja</span>
                                                    <p className="text-[11px] font-medium">{log.manPowerCount} orang ({log.totalLaborHours} jam)</p>
                                                </div>
                                                {log.feedUsedKg > 0 && (
                                                    <div>
                                                        <span className="text-[9px] text-muted-foreground uppercase">Pakan</span>
                                                        <p className="text-[11px] font-medium">{log.feedUsedKg} Kg</p>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mt-1.5 italic">&quot;{log.notes}&quot; — {log.loggedBy}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
