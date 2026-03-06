"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Factory,
    Clock,
    Users,
    Play,
    CheckCircle2,
    Calendar as CalIcon,
    Target,
    TrendingUp,
    Save,
    Edit,
    Lock,
} from "lucide-react";
import { productionRuns, products } from "@/data/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { useState, useMemo } from "react";

const statusStyles: Record<string, { color: string; icon: typeof Play }> = {
    PLANNED: { color: "bg-gray-100 text-gray-700", icon: CalIcon },
    IN_PROGRESS: { color: "bg-amber-100 text-amber-700", icon: Play },
    FINISHED: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
};

const fgProducts = products.filter((p) => p.cluster === "FINISHED_GOOD");

// Monthly production targets (KG) — set by Owner
const defaultTargets: Record<string, Record<string, number>> = {
    "Mar 2025": { FG_GC: 4500, FG_PEL_C: 0, FG_PEL_GC: 0, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "Apr 2025": { FG_GC: 4500, FG_PEL_C: 0, FG_PEL_GC: 0, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "May 2025": { FG_GC: 5000, FG_PEL_C: 0, FG_PEL_GC: 0, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "Jun 2025": { FG_GC: 5000, FG_PEL_C: 0, FG_PEL_GC: 0, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "Jul 2025": { FG_GC: 5500, FG_PEL_C: 0, FG_PEL_GC: 0, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "Aug 2025": { FG_GC: 5500, FG_PEL_C: 0, FG_PEL_GC: 0, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "Sep 2025": { FG_GC: 6000, FG_PEL_C: 0, FG_PEL_GC: 0, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "Oct 2025": { FG_GC: 6000, FG_PEL_C: 500, FG_PEL_GC: 0, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "Nov 2025": { FG_GC: 6500, FG_PEL_C: 500, FG_PEL_GC: 0, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "Dec 2025": { FG_GC: 7000, FG_PEL_C: 500, FG_PEL_GC: 500, FG_SIL_MIX: 0, FG_SIL_PUR: 0 },
    "Jan 2026": { FG_GC: 7500, FG_PEL_C: 1000, FG_PEL_GC: 500, FG_SIL_MIX: 500, FG_SIL_PUR: 0 },
    "Feb 2026": { FG_GC: 8000, FG_PEL_C: 1500, FG_PEL_GC: 500, FG_SIL_MIX: 500, FG_SIL_PUR: 500 },
    "Mar 2026": { FG_GC: 8500, FG_PEL_C: 2000, FG_PEL_GC: 500, FG_SIL_MIX: 1000, FG_SIL_PUR: 500 },
};

export default function ProductionPlanPage() {
    const { user } = useAuth();
    const isOwner = user?.role === "OWNER";

    const planned = productionRuns.filter((r) => r.status === "PLANNED");
    const inProgress = productionRuns.filter((r) => r.status === "IN_PROGRESS");
    const finished = productionRuns.filter((r) => r.status === "FINISHED");

    // Current month targets
    const currentMonth = "Mar 2026";
    const [targets, setTargets] = useState(defaultTargets);
    const [editingTarget, setEditingTarget] = useState(false);
    const [editValues, setEditValues] = useState<Record<string, number>>({});

    const currentTargets = targets[currentMonth] || {};

    // Calculate actual output for current month from finished production runs
    const actualOutput = useMemo(() => {
        const result: Record<string, number> = {};
        productionRuns
            .filter((r) => r.status === "FINISHED")
            .forEach((run) => {
                const code = products.find((p) => p.id === run.outputProductId)?.internalCode;
                if (code) {
                    result[code] = (result[code] || 0) + run.outputQty;
                }
            });
        return result;
    }, []);

    const totalTarget = Object.values(currentTargets).reduce((s, v) => s + v, 0);
    const totalActual = Object.values(actualOutput).reduce((s, v) => s + v, 0);
    const overallPercent = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;

    const startEdit = () => {
        setEditValues({ ...currentTargets });
        setEditingTarget(true);
    };

    const saveTargets = () => {
        setTargets((prev) => ({
            ...prev,
            [currentMonth]: editValues,
        }));
        setEditingTarget(false);
    };

    const renderRun = (run: (typeof productionRuns)[0]) => {
        const style = statusStyles[run.status];
        const Icon = style.icon;
        const duration =
            run.endTime && run.startTime
                ? `${Math.round(
                    (new Date(run.endTime).getTime() -
                        new Date(run.startTime).getTime()) /
                    3600000
                )}h`
                : "Ongoing";

        return (
            <Card
                key={run.id}
                className="border-0 shadow-sm hover:shadow-md transition-all py-0"
            >
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Factory className="h-4 w-4 text-primary" />
                                <span className="font-bold text-sm">
                                    {run.runNumber}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {run.machineName}
                            </p>
                        </div>
                        <Badge className={`${style.color} text-[11px] gap-1`}>
                            <Icon className="h-3 w-3" />
                            {run.status.replace("_", " ")}
                        </Badge>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                            Output
                        </p>
                        <p className="text-lg font-bold">
                            {run.outputQty.toLocaleString()} {run.outputUom}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {run.outputProductName}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <Clock className="h-3 w-3 text-muted-foreground mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">
                                Duration
                            </p>
                            <p className="text-sm font-semibold">{duration}</p>
                        </div>
                        <div>
                            <Users className="h-3 w-3 text-muted-foreground mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">
                                Operators
                            </p>
                            <p className="text-sm font-semibold">
                                {run.operatorCount}
                            </p>
                        </div>
                        <div>
                            <CalIcon className="h-3 w-3 text-muted-foreground mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">
                                Shift
                            </p>
                            <p className="text-sm font-semibold">
                                {run.shiftCode}
                            </p>
                        </div>
                    </div>

                    {/* BOM Preview */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                            BOM:
                        </p>
                        {run.bomItems.map((bom, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between text-xs"
                            >
                                <span className="text-muted-foreground">
                                    {bom.name}
                                </span>
                                <span className="font-medium">
                                    {bom.qty} {bom.uom}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-8">
            <p className="text-sm text-muted-foreground">
                Production planning & monitoring — set target bulanan dan track
                production runs.
            </p>

            {/* ===== TARGET SECTION ===== */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Target Produksi — {currentMonth}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {!isOwner && (
                                <Badge
                                    variant="outline"
                                    className="text-[10px] gap-1"
                                >
                                    <Lock className="h-3 w-3" />
                                    Only Owner can edit
                                </Badge>
                            )}
                            {isOwner && !editingTarget && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 cursor-pointer"
                                    onClick={startEdit}
                                >
                                    <Edit className="h-3.5 w-3.5" />
                                    Set Target
                                </Button>
                            )}
                            {isOwner && editingTarget && (
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        className="gap-1 cursor-pointer"
                                        onClick={saveTargets}
                                    >
                                        <Save className="h-3.5 w-3.5" />
                                        Save
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setEditingTarget(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Overall Progress */}
                    <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 p-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">
                                    Overall Progress
                                </span>
                                <span className="text-sm font-bold">
                                    {totalActual.toLocaleString("id-ID")} /{" "}
                                    {totalTarget.toLocaleString("id-ID")} KG
                                </span>
                            </div>
                            <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${overallPercent >= 100
                                            ? "bg-emerald-500"
                                            : overallPercent >= 70
                                                ? "bg-primary"
                                                : overallPercent >= 40
                                                    ? "bg-amber-500"
                                                    : "bg-red-400"
                                        }`}
                                    style={{
                                        width: `${Math.min(overallPercent, 100)}%`,
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3 text-primary" />
                                <span className="text-xs text-muted-foreground">
                                    {overallPercent}% tercapai
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Per-Product Targets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {fgProducts.map((p) => {
                            const target =
                                editingTarget
                                    ? editValues[p.internalCode] ?? 0
                                    : currentTargets[p.internalCode] ?? 0;
                            const actual =
                                actualOutput[p.internalCode] ?? 0;
                            const pct =
                                target > 0
                                    ? Math.round((actual / target) * 100)
                                    : 0;

                            return (
                                <div
                                    key={p.id}
                                    className="rounded-xl border border-border/50 p-3 space-y-2 hover:bg-muted/20 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold">
                                            {p.displayName}
                                        </span>
                                        {target > 0 && !editingTarget && (
                                            <Badge
                                                variant="secondary"
                                                className={`text-[9px] ${pct >= 100
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : pct >= 50
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {pct}%
                                            </Badge>
                                        )}
                                    </div>

                                    {editingTarget ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={
                                                    editValues[
                                                    p.internalCode
                                                    ] ?? 0
                                                }
                                                onChange={(e) =>
                                                    setEditValues(
                                                        (prev) => ({
                                                            ...prev,
                                                            [p.internalCode]:
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 0,
                                                        })
                                                    )
                                                }
                                                className="h-8 text-right font-mono text-sm"
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                KG
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    {actual.toLocaleString(
                                                        "id-ID"
                                                    )}{" "}
                                                    /{" "}
                                                    {target.toLocaleString(
                                                        "id-ID"
                                                    )}{" "}
                                                    KG
                                                </span>
                                            </div>
                                            {target > 0 && (
                                                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${pct >= 100
                                                                ? "bg-emerald-500"
                                                                : pct >= 50
                                                                    ? "bg-primary"
                                                                    : "bg-amber-400"
                                                            }`}
                                                        style={{
                                                            width: `${Math.min(
                                                                pct,
                                                                100
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {target === 0 && (
                                                <p className="text-[10px] text-muted-foreground italic">
                                                    No target set
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* ===== KANBAN-STYLE PRODUCTION RUNS ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Planned */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                        <h3 className="font-semibold text-sm">
                            Planned ({planned.length})
                        </h3>
                    </div>
                    {planned.map(renderRun)}
                </div>

                {/* In Progress */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <h3 className="font-semibold text-sm">
                            In Progress ({inProgress.length})
                        </h3>
                    </div>
                    {inProgress.map(renderRun)}
                </div>

                {/* Finished */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <h3 className="font-semibold text-sm">
                            Finished ({finished.length})
                        </h3>
                    </div>
                    {finished.map(renderRun)}
                </div>
            </div>
        </div>
    );
}
