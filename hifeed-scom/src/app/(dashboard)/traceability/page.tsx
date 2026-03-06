"use client";

import { useState, useMemo } from "react";
import {
    ShoppingCart,
    PackageCheck,
    Sprout,
    Package,
    Factory,
    Truck,
    ChevronDown,
    ArrowRight,
    ArrowDown,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
    Leaf,
    MapPin,
    TrendingDown,
    TrendingUp,
    Repeat,
    AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    products,
    purchaseOrders,
    goodsReceipts,
    farmBatches,
    harvestResults,
    stockItems,
    stockLedgerEntries,
    productionRuns,
    deliveryTrips,
} from "@/data/mock-data";

// ---- Types ----
interface QuantityFlow {
    qtyIn: number;
    qtyOut: number;
    uomIn: string;
    uomOut: string;
    lossQty: number;
    lossPercent: number;
    lossType: "reject" | "mortality" | "shrinkage" | "conversion" | "yield" | "none";
    lossLabel: string;
    isUnitConversion?: boolean;
    conversionNote?: string;
}

interface TraceNode {
    id: string;
    stage: string;
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    title: string;
    refDoc: string;
    date: string;
    status?: string;
    statusColor?: string;
    details: { label: string; value: string }[];
    quantityFlow?: QuantityFlow;
    children?: TraceNode[];
}

// ---- QuantityFlowBar component ----
function QuantityFlowBar({ flow }: { flow: QuantityFlow }) {
    const survived = flow.qtyIn > 0 ? ((flow.qtyOut / flow.qtyIn) * 100) : 100;
    const survivedClamped = Math.min(Math.max(survived, 0), 200);
    const barWidth = Math.min(survivedClamped, 100);
    const isGain = survived > 100;
    const isConversion = flow.isUnitConversion;

    // Color based on loss type
    const getBarColor = () => {
        if (isConversion) return "bg-sky-500";
        if (isGain) return "bg-emerald-500";
        if (flow.lossPercent <= 2) return "bg-emerald-500";
        if (flow.lossPercent <= 5) return "bg-amber-500";
        if (flow.lossPercent <= 10) return "bg-orange-500";
        return "bg-red-500";
    };

    const getLossIcon = () => {
        if (isConversion) return <Repeat className="h-3 w-3 text-sky-400" />;
        if (isGain) return <TrendingUp className="h-3 w-3 text-emerald-400" />;
        if (flow.lossPercent <= 5) return <TrendingDown className="h-3 w-3 text-amber-400" />;
        return <AlertTriangle className="h-3 w-3 text-red-400" />;
    };

    const getLossBadgeColor = () => {
        if (isConversion) return "bg-sky-500/15 text-sky-400 border-sky-500/30";
        if (isGain) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
        if (flow.lossPercent <= 2) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
        if (flow.lossPercent <= 5) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
        if (flow.lossPercent <= 10) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
        return "bg-red-500/15 text-red-400 border-red-500/30";
    };

    return (
        <div className="mt-3 pt-3 border-t border-border/40">
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    {getLossIcon()}
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Quantity Flow
                    </span>
                </div>
                <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0 ${getLossBadgeColor()}`}>
                    {flow.lossLabel}
                </Badge>
            </div>

            {/* Qty in/out row */}
            <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">In</span>
                    <p className="text-sm font-bold">{flow.qtyIn.toLocaleString("id-ID")} <span className="text-xs font-normal text-muted-foreground">{flow.uomIn}</span></p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                <div className="flex-1 text-right">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Out</span>
                    <p className="text-sm font-bold">{flow.qtyOut.toLocaleString("id-ID")} <span className="text-xs font-normal text-muted-foreground">{flow.uomOut}</span></p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 w-full rounded-full bg-muted/50 overflow-hidden">
                <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${getBarColor()}`}
                    style={{ width: `${barWidth}%` }}
                />
                {/* Loss section */}
                {!isConversion && !isGain && flow.lossPercent > 0 && (
                    <div
                        className="absolute inset-y-0 right-0 rounded-r-full bg-red-500/25"
                        style={{ width: `${100 - barWidth}%` }}
                    />
                )}
            </div>

            {/* Loss details */}
            <div className="flex items-center justify-between mt-1.5">
                <span className={`text-[11px] font-medium ${isConversion ? "text-sky-400" : isGain ? "text-emerald-400" : flow.lossPercent > 5 ? "text-red-400" : "text-muted-foreground"}`}>
                    {isConversion
                        ? `Konversi: ${flow.conversionNote}`
                        : isGain
                            ? `Yield: ${survived.toFixed(1)}%`
                            : flow.lossQty > 0
                                ? `Loss: ${flow.lossQty.toLocaleString("id-ID")} ${flow.uomIn} (${flow.lossPercent.toFixed(1)}%)`
                                : "No loss"}
                </span>
                <span className={`text-[11px] font-bold ${isConversion ? "text-sky-400" : isGain ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {isConversion ? "Unit change" : `${Math.min(barWidth, 100).toFixed(1)}%`}
                </span>
            </div>
        </div>
    );
}

// ---- Pre-built product traces ----
type TraceProduct = {
    id: string;
    name: string;
    displayName: string;
    category: string;
    categoryColor: string;
};

const traceableProducts: TraceProduct[] = [
    { id: "p9", name: "FG_GC", displayName: "FG_GC — Green Concentrate", category: "Finished Goods", categoryColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
    { id: "p1", name: "DM_CPTN1", displayName: "DM_CPTN1 — CP 25%", category: "Raw Material", categoryColor: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
    { id: "p10", name: "FG_PEL_C", displayName: "FG_PEL_C — Pellet Complete", category: "Finished Goods", categoryColor: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    { id: "p2", name: "DM_CFHP1", displayName: "DM_CFHP1 — CF 30%", category: "Raw Material", categoryColor: "bg-green-500/15 text-green-400 border-green-500/30" },
    { id: "p5", name: "DM_CPCF1", displayName: "DM_CPCF1 — CP 15%", category: "Raw Material", categoryColor: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
];

function buildTraceChain(productId: string): TraceNode[] {
    const nodes: TraceNode[] = [];

    // 1. Find Purchase Orders containing this product
    const relatedPOs = purchaseOrders.filter((po) =>
        po.items.some((item) => item.productId === productId)
    );

    for (const po of relatedPOs) {
        const poItem = po.items.find((i) => i.productId === productId);
        const poQty = poItem?.qty || 0;
        const poUom = poItem?.uom || "";

        // Calculate total received & rejected for this PO
        const relatedGRNs = goodsReceipts.filter((grn) => grn.poId === po.id);
        let totalReceived = 0;
        let totalRejected = 0;
        for (const grn of relatedGRNs) {
            const grnItem = grn.items.find((i) => i.productName === poItem?.productName);
            if (grnItem) {
                totalReceived += grnItem.qtyReceived;
                totalRejected += grnItem.qtyRejected;
            }
        }

        const poNode: TraceNode = {
            id: `po-${po.id}`,
            stage: "Procurement",
            icon: ShoppingCart,
            iconColor: "text-blue-400",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/30",
            title: `Purchase Order`,
            refDoc: po.poNumber,
            date: po.createdAt,
            status: po.status,
            statusColor:
                po.status === "COMPLETED"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : po.status === "APPROVED"
                        ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        : po.status === "PARTIAL_RECEIVED"
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : "bg-slate-500/15 text-slate-400 border-slate-500/30",
            details: [
                { label: "Vendor", value: po.vendorName },
                { label: "Item", value: `${poItem?.productName} — ${poItem?.qty} ${poItem?.uom}` },
                { label: "Amount", value: `Rp ${(po.totalAmount).toLocaleString("id-ID")}` },
            ],
            quantityFlow: relatedGRNs.length > 0
                ? {
                    qtyIn: poQty,
                    qtyOut: totalReceived,
                    uomIn: poUom,
                    uomOut: poUom,
                    lossQty: totalRejected,
                    lossPercent: poQty > 0 ? (totalRejected / poQty) * 100 : 0,
                    lossType: "reject",
                    lossLabel: totalRejected > 0 ? `${totalRejected} rejected` : "Fully received",
                }
                : undefined,
            children: [],
        };

        // 2. GRNs
        for (const grn of relatedGRNs) {
            const grnItem = grn.items.find((i) => i.productName === poItem?.productName);
            const grnReceived = grnItem?.qtyReceived || 0;
            const grnRejected = grnItem?.qtyRejected || 0;
            const grnTotal = grnReceived + grnRejected;

            const grnNode: TraceNode = {
                id: `grn-${grn.id}`,
                stage: "Goods Receipt",
                icon: PackageCheck,
                iconColor: "text-teal-400",
                bgColor: "bg-teal-500/10",
                borderColor: "border-teal-500/30",
                title: "Goods Receipt",
                refDoc: grn.grnNumber,
                date: grn.receivedDate,
                status: grnRejected > 0 ? "PARTIAL_REJECT" : "RECEIVED",
                statusColor:
                    grnRejected > 0
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                details: [
                    { label: "Received by", value: grn.receivedBy },
                    ...(grnItem
                        ? [
                            { label: "Qty Received", value: `${grnItem.qtyReceived} ${grnItem.uom}` },
                            ...(grnRejected > 0
                                ? [{ label: "Qty Rejected", value: `${grnRejected} ${grnItem.uom}` }]
                                : []),
                            { label: "Weight", value: `${grnItem.weight.toLocaleString("id-ID")} Kg` },
                        ]
                        : []),
                ],
                quantityFlow: grnItem ? {
                    qtyIn: grnTotal,
                    qtyOut: grnReceived,
                    uomIn: grnItem.uom,
                    uomOut: grnItem.uom,
                    lossQty: grnRejected,
                    lossPercent: grnTotal > 0 ? (grnRejected / grnTotal) * 100 : 0,
                    lossType: "reject",
                    lossLabel: grnRejected > 0 ? `Reject rate: ${(grnTotal > 0 ? (grnRejected / grnTotal) * 100 : 0).toFixed(1)}%` : "100% accepted",
                } : undefined,
                children: [],
            };
            poNode.children!.push(grnNode);

            // 3. Stock movements from GRN
            const relatedLedger = stockLedgerEntries.filter(
                (sl) => sl.transactionType === "IN_GRN" && sl.refDoc === grn.grnNumber
            );
            for (const sl of relatedLedger) {
                const stockNode: TraceNode = {
                    id: `inv-in-${sl.id}`,
                    stage: "Inventory In",
                    icon: Package,
                    iconColor: "text-cyan-400",
                    bgColor: "bg-cyan-500/10",
                    borderColor: "border-cyan-500/30",
                    title: "Stock Movement",
                    refDoc: sl.refDoc,
                    date: sl.date,
                    status: "STOCKED",
                    statusColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                    details: [
                        { label: "Qty In", value: `+${sl.qtyChange.toLocaleString("id-ID")} ${sl.uom}` },
                        { label: "Balance After", value: `${sl.balanceAfter.toLocaleString("id-ID")} ${sl.uom}` },
                        { label: "Note", value: sl.note },
                    ],
                    quantityFlow: {
                        qtyIn: sl.qtyChange,
                        qtyOut: sl.qtyChange,
                        uomIn: sl.uom,
                        uomOut: sl.uom,
                        lossQty: 0,
                        lossPercent: 0,
                        lossType: "none",
                        lossLabel: "Stored in warehouse",
                    },
                };
                grnNode.children!.push(stockNode);
            }
        }

        nodes.push(poNode);
    }

    // 4. Farm batches
    const relatedBatches = farmBatches.filter((fb) => fb.inputProductId === productId);
    for (const batch of relatedBatches) {
        const mortalityQty = batch.initialQty - batch.currentQty;

        const batchNode: TraceNode = {
            id: `farm-${batch.id}`,
            stage: "Farm / Batch",
            icon: Sprout,
            iconColor: "text-green-400",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/30",
            title: "Farm Batch",
            refDoc: batch.batchCode,
            date: batch.startDate,
            status: batch.status,
            statusColor:
                batch.status === "HARVESTED"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : batch.status === "READY_HARVEST"
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : batch.status === "GROWING"
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : "bg-sky-500/15 text-sky-400 border-sky-500/30",
            details: [
                { label: "Location", value: batch.locationName },
                { label: "Product", value: batch.productName },
                { label: "Initial Qty", value: batch.initialQty.toLocaleString("id-ID") },
                { label: "Current Qty", value: batch.currentQty.toLocaleString("id-ID") },
                { label: "HST", value: `${batch.hst} hari` },
                ...(batch.sourcePONumber ? [{ label: "Source PO", value: batch.sourcePONumber }] : []),
            ],
            quantityFlow: {
                qtyIn: batch.initialQty,
                qtyOut: batch.currentQty,
                uomIn: "UNIT",
                uomOut: "UNIT",
                lossQty: mortalityQty,
                lossPercent: batch.mortalityRate,
                lossType: "mortality",
                lossLabel: `Mortality: ${batch.mortalityRate}%`,
            },
            children: [],
        };

        // 5. Harvest results
        const harvests = harvestResults.filter((hr) => hr.batchId === batch.id);
        for (const hr of harvests) {
            const harvestNode: TraceNode = {
                id: `harvest-${hr.id}`,
                stage: "Harvest",
                icon: Leaf,
                iconColor: "text-lime-400",
                bgColor: "bg-lime-500/10",
                borderColor: "border-lime-500/30",
                title: "Harvest Result",
                refDoc: hr.batchCode,
                date: hr.harvestDate,
                status: "HARVESTED",
                statusColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                details: [
                    { label: "Total Weight", value: `${hr.totalWeightKg.toLocaleString("id-ID")} Kg` },
                    { label: "Avg Weight", value: `${hr.sampleAvgWeight} Kg/unit` },
                    { label: "Est. Population", value: hr.estimatedPopulation.toLocaleString("id-ID") },
                    { label: "HPP/Kg", value: `Rp ${hr.hppPerKg.toLocaleString("id-ID")}` },
                    { label: "Harvested by", value: hr.harvestedBy },
                ],
                quantityFlow: {
                    qtyIn: hr.estimatedPopulation,
                    qtyOut: hr.totalWeightKg,
                    uomIn: "EKOR",
                    uomOut: "KG",
                    lossQty: 0,
                    lossPercent: 0,
                    lossType: "conversion",
                    lossLabel: "Unit conversion",
                    isUnitConversion: true,
                    conversionNote: `${hr.estimatedPopulation.toLocaleString("id-ID")} ekor × ${hr.sampleAvgWeight} kg = ${hr.totalWeightKg.toLocaleString("id-ID")} kg`,
                },
            };
            batchNode.children!.push(harvestNode);
        }

        nodes.push(batchNode);
    }

    // 6. Production runs using this product as BOM input
    const relatedProduction = productionRuns.filter((pr) =>
        pr.bomItems.some((b) => b.productId === productId)
    );
    for (const pr of relatedProduction) {
        const bomItem = pr.bomItems.find((b) => b.productId === productId);
        const totalBomKg = pr.bomItems.reduce((sum, b) => {
            if (b.uom === "KG") return sum + b.qty;
            if (b.uom === "LITER") return sum + b.qty; // approximate
            return sum;
        }, 0);

        const prNode: TraceNode = {
            id: `prod-in-${pr.id}`,
            stage: "Production (Input)",
            icon: Factory,
            iconColor: "text-purple-400",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/30",
            title: "Production Run (BOM Input)",
            refDoc: pr.runNumber,
            date: pr.startTime.split(" ")[0],
            status: pr.status,
            statusColor:
                pr.status === "FINISHED"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : pr.status === "IN_PROGRESS"
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : "bg-slate-500/15 text-slate-400 border-slate-500/30",
            details: [
                { label: "Machine", value: pr.machineName },
                { label: "BOM Usage", value: `${bomItem?.qty} ${bomItem?.uom}` },
                { label: "Output", value: `${pr.outputProductName} — ${pr.outputQty} ${pr.outputUom}` },
                { label: "Shift", value: pr.shiftCode },
                { label: "Operators", value: `${pr.operatorCount} orang` },
            ],
            quantityFlow: {
                qtyIn: totalBomKg,
                qtyOut: pr.outputQty,
                uomIn: "KG (BOM Total)",
                uomOut: pr.outputUom,
                lossQty: 0,
                lossPercent: 0,
                lossType: "yield",
                lossLabel: totalBomKg > 0 ? `Yield: ${((pr.outputQty / totalBomKg) * 100).toFixed(1)}%` : "N/A",
                isUnitConversion: totalBomKg !== pr.outputQty,
                conversionNote: `${totalBomKg.toLocaleString("id-ID")} KG input → ${pr.outputQty.toLocaleString("id-ID")} ${pr.outputUom} output`,
            },
        };
        nodes.push(prNode);
    }

    // 7. Production runs producing this product as output
    const outputProduction = productionRuns.filter((pr) => pr.outputProductId === productId);
    for (const pr of outputProduction) {
        const totalBomKg = pr.bomItems.reduce((sum, b) => {
            if (b.uom === "KG") return sum + b.qty;
            if (b.uom === "LITER") return sum + b.qty;
            return sum;
        }, 0);
        const yieldRate = totalBomKg > 0 ? (pr.outputQty / totalBomKg) * 100 : 0;

        const prNode: TraceNode = {
            id: `prod-out-${pr.id}`,
            stage: "Production (Output)",
            icon: Factory,
            iconColor: "text-violet-400",
            bgColor: "bg-violet-500/10",
            borderColor: "border-violet-500/30",
            title: "Production Run (Output)",
            refDoc: pr.runNumber,
            date: pr.startTime.split(" ")[0],
            status: pr.status,
            statusColor:
                pr.status === "FINISHED"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : pr.status === "IN_PROGRESS"
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : "bg-slate-500/15 text-slate-400 border-slate-500/30",
            details: [
                { label: "Machine", value: pr.machineName },
                { label: "Output Qty", value: `${pr.outputQty.toLocaleString("id-ID")} ${pr.outputUom}` },
                { label: "BOM", value: pr.bomItems.map((b) => `${b.name} (${b.qty} ${b.uom})`).join(", ") },
                { label: "Shift", value: pr.shiftCode },
                ...(pr.endTime ? [{ label: "End", value: pr.endTime }] : []),
            ],
            quantityFlow: {
                qtyIn: totalBomKg,
                qtyOut: pr.outputQty,
                uomIn: "KG (BOM Total)",
                uomOut: pr.outputUom,
                lossQty: totalBomKg > pr.outputQty ? totalBomKg - pr.outputQty : 0,
                lossPercent: totalBomKg > pr.outputQty ? ((totalBomKg - pr.outputQty) / totalBomKg) * 100 : 0,
                lossType: "yield",
                lossLabel: `Yield rate: ${yieldRate.toFixed(1)}%`,
                isUnitConversion: false,
                conversionNote: `${totalBomKg.toLocaleString("id-ID")} KG bahan → ${pr.outputQty.toLocaleString("id-ID")} KG output`,
            },
            children: [],
        };

        // Stock ledger
        const prodLedger = stockLedgerEntries.filter((sl) => sl.refDoc === pr.runNumber);
        for (const sl of prodLedger) {
            const slNode: TraceNode = {
                id: `inv-prod-${sl.id}`,
                stage: sl.qtyChange > 0 ? "Inventory In (FG)" : "Inventory Out (Material)",
                icon: Package,
                iconColor: sl.qtyChange > 0 ? "text-emerald-400" : "text-orange-400",
                bgColor: sl.qtyChange > 0 ? "bg-emerald-500/10" : "bg-orange-500/10",
                borderColor: sl.qtyChange > 0 ? "border-emerald-500/30" : "border-orange-500/30",
                title: sl.qtyChange > 0 ? "Stock In (Finished Goods)" : "Stock Out (Material)",
                refDoc: sl.refDoc,
                date: sl.date,
                status: "RECORDED",
                statusColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                details: [
                    { label: "Qty Change", value: `${sl.qtyChange > 0 ? "+" : ""}${sl.qtyChange.toLocaleString("id-ID")} ${sl.uom}` },
                    { label: "Balance After", value: `${sl.balanceAfter.toLocaleString("id-ID")} ${sl.uom}` },
                    { label: "Note", value: sl.note },
                ],
                quantityFlow: {
                    qtyIn: Math.abs(sl.qtyChange),
                    qtyOut: sl.balanceAfter,
                    uomIn: sl.uom,
                    uomOut: sl.uom,
                    lossQty: 0,
                    lossPercent: 0,
                    lossType: "none",
                    lossLabel: sl.qtyChange > 0 ? "Added to stock" : "Used from stock",
                },
            };
            prNode.children!.push(slNode);
        }

        nodes.push(prNode);
    }

    // 8. Delivery trips
    const relatedTrips = deliveryTrips.filter((dt) =>
        dt.items.some((item) => item.productId === productId)
    );
    for (const trip of relatedTrips) {
        const tripItem = trip.items.find((i) => i.productId === productId);
        const tripQty = tripItem?.qty || 0;

        const tripNode: TraceNode = {
            id: `trip-${trip.id}`,
            stage: "Logistics",
            icon: Truck,
            iconColor: "text-rose-400",
            bgColor: "bg-rose-500/10",
            borderColor: "border-rose-500/30",
            title: "Delivery Trip",
            refDoc: trip.doNumber,
            date: trip.createdAt,
            status: trip.status,
            statusColor:
                trip.status === "DELIVERED"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : trip.status === "ON_THE_WAY"
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : "bg-sky-500/15 text-sky-400 border-sky-500/30",
            details: [
                { label: "Customer", value: trip.customerName },
                { label: "Driver", value: trip.driverName },
                { label: "Vehicle", value: trip.vehiclePlate },
                { label: "Item", value: `${tripItem?.productName} — ${tripItem?.qty} ${tripItem?.uom}` },
                { label: "Cost", value: `Rp ${trip.tripCost.toLocaleString("id-ID")}` },
                ...(tripItem?.sourceProductionRunNumber
                    ? [{ label: "From Production", value: tripItem.sourceProductionRunNumber }]
                    : []),
                ...(trip.podUrl ? [{ label: "POD", value: "✓ Uploaded" }] : []),
                ...(trip.deliveredAt ? [{ label: "Delivered", value: trip.deliveredAt }] : []),
            ],
            quantityFlow: {
                qtyIn: tripQty,
                qtyOut: trip.status === "DELIVERED" ? tripQty : 0,
                uomIn: tripItem?.uom || "UNIT",
                uomOut: tripItem?.uom || "UNIT",
                lossQty: 0,
                lossPercent: 0,
                lossType: trip.status === "DELIVERED" ? "none" : "shrinkage",
                lossLabel: trip.status === "DELIVERED" ? "Delivered 100%" : trip.status === "ON_THE_WAY" ? "In transit" : "Loading",
            },
        };
        nodes.push(tripNode);
    }

    return nodes;
}

// ---- Render a single node ----
function TraceNodeCard({ node, isLast, depth = 0 }: { node: TraceNode; isLast: boolean; depth?: number }) {
    const [expanded, setExpanded] = useState(true);
    const Icon = node.icon;
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="relative">
            {!isLast && (
                <div
                    className="absolute left-[19px] top-[44px] bottom-0 w-[2px] bg-gradient-to-b from-border to-transparent"
                    style={{ zIndex: 0 }}
                />
            )}

            <div className="relative flex gap-4">
                <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${node.bgColor} border ${node.borderColor} shadow-sm`}>
                    <Icon className={`h-5 w-5 ${node.iconColor}`} />
                </div>

                <div className="flex-1 pb-6">
                    <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3 pt-4 px-4">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{node.stage}</span>
                                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                                    <span className="font-semibold text-sm">{node.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {node.status && (
                                        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${node.statusColor}`}>
                                            {node.status.replace(/_/g, " ")}
                                        </Badge>
                                    )}
                                    {hasChildren && (
                                        <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground transition-colors">
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-mono font-bold text-primary">{node.refDoc}</span>
                                <span className="text-[11px] text-muted-foreground">{node.date}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5">
                                {node.details.map((d, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">{d.label}</span>
                                        <span className="text-xs font-medium text-foreground/80 truncate" title={d.value}>{d.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Quantity Flow Bar */}
                            {node.quantityFlow && <QuantityFlowBar flow={node.quantityFlow} />}
                        </CardContent>
                    </Card>

                    {hasChildren && expanded && (
                        <div className="mt-3 ml-2 pl-4 border-l-2 border-dashed border-border/50">
                            {node.children!.map((child, ci) => (
                                <TraceNodeCard key={child.id} node={child} isLast={ci === node.children!.length - 1} depth={depth + 1} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ---- Main Page ----
export default function TraceabilityPage() {
    const [selectedProduct, setSelectedProduct] = useState<string>(traceableProducts[0].id);

    const traceChain = useMemo(() => buildTraceChain(selectedProduct), [selectedProduct]);

    const selectedProd = traceableProducts.find((p) => p.id === selectedProduct);

    const stageCount = new Set(traceChain.map((n) => n.stage)).size;

    function countNodes(nodes: TraceNode[]): number {
        let count = 0;
        for (const n of nodes) {
            count++;
            if (n.children) count += countNodes(n.children);
        }
        return count;
    }
    const totalDocs = countNodes(traceChain);

    // Calculate total loss across chain
    function calcTotalLoss(nodes: TraceNode[]): { totalLoss: number; totalIn: number } {
        let totalLoss = 0;
        let totalIn = 0;
        for (const n of nodes) {
            if (n.quantityFlow && n.quantityFlow.lossType !== "conversion" && n.quantityFlow.lossType !== "none" && n.quantityFlow.lossType !== "yield") {
                totalLoss += n.quantityFlow.lossQty;
                totalIn += n.quantityFlow.qtyIn;
            }
            if (n.children) {
                const sub = calcTotalLoss(n.children);
                totalLoss += sub.totalLoss;
                totalIn += sub.totalIn;
            }
        }
        return { totalLoss, totalIn };
    }
    const { totalLoss, totalIn } = calcTotalLoss(traceChain);
    const overallLossPercent = totalIn > 0 ? (totalLoss / totalIn) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Supply Chain Traceability</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Track produk dari hulu (pengadaan) hingga hilir (distribusi) secara end-to-end — termasuk loss & yield
                </p>
            </div>

            {/* Product Picker */}
            <Card className="border border-border/60 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Pilih Produk:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {traceableProducts.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProduct(p.id)}
                                    className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 ${selectedProduct === p.id
                                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                                        : "border-border/60 bg-background hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <span>{p.displayName}</span>
                                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${p.categoryColor}`}>{p.category}</Badge>
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="border border-border/60">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <FileText className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totalDocs}</p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Documents</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/60">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <MapPin className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stageCount}</p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Stages</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/60">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {traceChain.filter((n) => ["COMPLETED", "DELIVERED", "FINISHED", "HARVESTED"].includes(n.status || "")).length}
                            </p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Completed</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/60">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <Clock className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {traceChain.filter((n) => ["IN_PROGRESS", "ON_THE_WAY", "LOADING", "APPROVED", "PARTIAL"].includes(n.status || "")).length}
                            </p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">In Progress</p>
                        </div>
                    </CardContent>
                </Card>
                {/* Overall Loss Card */}
                <Card className={`border ${overallLossPercent > 5 ? "border-red-500/40" : overallLossPercent > 2 ? "border-amber-500/40" : "border-emerald-500/40"}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${overallLossPercent > 5 ? "bg-red-500/10 border-red-500/20" : overallLossPercent > 2 ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"} border`}>
                            <TrendingDown className={`h-5 w-5 ${overallLossPercent > 5 ? "text-red-400" : overallLossPercent > 2 ? "text-amber-400" : "text-emerald-400"}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overallLossPercent.toFixed(1)}%</p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Overall Loss</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline */}
            <Card className="border border-border/60 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-emerald-400" />
                        Trace Timeline — {selectedProd?.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Setiap card menunjukkan quantity flow dengan loss/yield indicator
                    </p>
                </CardHeader>
                <CardContent className="pt-4">
                    {traceChain.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
                            <p className="text-sm text-muted-foreground">Tidak ada data traceability untuk produk ini</p>
                        </div>
                    ) : (
                        <div className="space-y-0">
                            {traceChain.map((node, idx) => (
                                <TraceNodeCard key={node.id} node={node} isLast={idx === traceChain.length - 1} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Legend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-border/60">
                    <CardContent className="p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Stage Legend</p>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Procurement" },
                                { icon: PackageCheck, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", label: "Goods Receipt" },
                                { icon: Sprout, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "Farm / Batch" },
                                { icon: Leaf, color: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-500/20", label: "Harvest" },
                                { icon: Package, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", label: "Inventory" },
                                { icon: Factory, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", label: "Production" },
                                { icon: Truck, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "Logistics" },
                            ].map((item) => {
                                const LegendIcon = item.icon;
                                return (
                                    <div key={item.label} className="flex items-center gap-1.5">
                                        <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${item.bg} border ${item.border}`}>
                                            <LegendIcon className={`h-3 w-3 ${item.color}`} />
                                        </div>
                                        <span className="text-[11px] font-medium text-muted-foreground">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-border/60">
                    <CardContent className="p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Loss Type Legend</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { icon: TrendingDown, color: "text-amber-400", label: "Reject / Mortality", desc: "Qty rusak atau mati" },
                                { icon: TrendingUp, color: "text-emerald-400", label: "Yield Rate", desc: "Input vs output produksi" },
                                { icon: Repeat, color: "text-sky-400", label: "Unit Conversion", desc: "Perubahan satuan (ekor→kg)" },
                                { icon: AlertTriangle, color: "text-red-400", label: "High Loss (>5%)", desc: "Perlu investigasi" },
                            ].map((item) => {
                                const LossIcon = item.icon;
                                return (
                                    <div key={item.label} className="flex items-center gap-2">
                                        <LossIcon className={`h-3.5 w-3.5 ${item.color} shrink-0`} />
                                        <div>
                                            <span className="text-[11px] font-medium text-foreground/80">{item.label}</span>
                                            <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
