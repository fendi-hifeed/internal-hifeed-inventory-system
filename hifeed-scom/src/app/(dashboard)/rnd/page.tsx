"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FlaskConical,
    Beaker,
    FileSearch,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    ChevronRight,
    Sparkles,
    Target,
    DollarSign,
    Activity,
    ArrowRight,
    Microscope,
    TestTube,
} from "lucide-react";
import {
    rndBudget,
    rndSampleRequests,
    rndExperiments,
    rndTestResults,
} from "@/data/mock-data";

const statusColors = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    APPROVED: "bg-sky-500/10 text-sky-600 border-sky-500/30",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/30",
    FULFILLED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

const experimentStatusColors = {
    PLANNED: "bg-slate-500/10 text-slate-600 border-slate-500/30",
    IN_PROGRESS: "bg-sky-500/10 text-sky-600 border-sky-500/30",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/30",
};

const materialTypeLabels = {
    RAW_WET: "Raw Material (Basah)",
    RAW_DRY: "Raw Material (Kering)",
    FINISHED_GOOD: "Finished Good",
};

const testTypeColors = {
    NUTRITIONAL: "bg-violet-500/10 text-violet-600",
    PALATABILITY: "bg-amber-500/10 text-amber-600",
    SHELF_LIFE: "bg-cyan-500/10 text-cyan-600",
    FIELD_TRIAL: "bg-emerald-500/10 text-emerald-600",
};

export default function RndDashboardPage() {
    const [selectedExpId, setSelectedExpId] = useState<string | null>(null);

    const stats = useMemo(() => {
        const activeExperiments = rndExperiments.filter(
            (e) => e.status === "IN_PROGRESS"
        ).length;
        const pendingSamples = rndSampleRequests.filter(
            (s) => s.status === "PENDING"
        ).length;
        const totalTests = rndTestResults.length;
        const passRate =
            totalTests > 0
                ? Math.round(
                    (rndTestResults.filter((t) => t.passFail).length /
                        totalTests) *
                    100
                )
                : 0;
        return { activeExperiments, pendingSamples, totalTests, passRate };
    }, []);

    const selectedExp = selectedExpId
        ? rndExperiments.find((e) => e.id === selectedExpId)
        : null;
    const selectedTestResults = selectedExpId
        ? rndTestResults.filter((t) => t.experimentId === selectedExpId)
        : [];

    const budgetUsage = rndBudget.usagePercent;
    const budgetStatus =
        budgetUsage >= 100 ? "over" : budgetUsage >= 70 ? "warning" : "good";
    const budgetBarColor =
        budgetStatus === "over"
            ? "bg-red-500"
            : budgetStatus === "warning"
                ? "bg-amber-500"
                : "bg-emerald-500";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg">
                    <FlaskConical className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        R&D Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Research & Development — Experiments, Samples, Test Results
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    {
                        label: "Active Experiments",
                        value: stats.activeExperiments.toString(),
                        icon: Beaker,
                        color: "from-sky-500 to-sky-600",
                        change: `${rndExperiments.filter((e) => e.status === "COMPLETED").length} completed`,
                    },
                    {
                        label: "Pending Samples",
                        value: stats.pendingSamples.toString(),
                        icon: Clock,
                        color: "from-amber-500 to-amber-600",
                        change: `${rndSampleRequests.filter((s) => s.status === "FULFILLED").length} fulfilled`,
                    },
                    {
                        label: "Test Results",
                        value: stats.totalTests.toString(),
                        icon: Microscope,
                        color: "from-violet-500 to-violet-600",
                        change: `${stats.passRate}% pass rate`,
                    },
                    {
                        label: "Budget Usage",
                        value: `${budgetUsage.toFixed(1)}%`,
                        icon: DollarSign,
                        color:
                            budgetStatus === "over"
                                ? "from-red-500 to-red-600"
                                : budgetStatus === "warning"
                                    ? "from-amber-500 to-amber-600"
                                    : "from-emerald-500 to-emerald-600",
                        change: `Rp ${(rndBudget.remaining / 1000).toFixed(0)}K remaining`,
                    },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={stat.label}
                            className="animate-fade-in-up border-0 shadow-sm hover:shadow-md transition-shadow py-0"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl font-bold tracking-tight">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.change}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                                    >
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Budget Bar */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-rose-500" />
                        Pagu R&D Budget (Max 2% dari Inventory)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                Consumed: <strong className="text-foreground">Rp {(rndBudget.consumed / 1000).toFixed(0)}K</strong>
                            </span>
                            <span className="text-muted-foreground">
                                Pagu: <strong className="text-foreground">Rp {(rndBudget.paguAmount / 1000).toFixed(0)}K</strong>
                            </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full ${budgetBarColor} rounded-full transition-all duration-700 ease-out`}
                                style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            {budgetStatus === "good" && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-0">
                                    🟢 Under 70%
                                </Badge>
                            )}
                            {budgetStatus === "warning" && (
                                <Badge className="bg-amber-100 text-amber-700 border-0">
                                    🟡 70-100% — Mendekati limit
                                </Badge>
                            )}
                            {budgetStatus === "over" && (
                                <Badge className="bg-red-100 text-red-700 border-0">
                                    🔴 Over limit — Butuh approval Owner
                                </Badge>
                            )}
                            <span className="text-muted-foreground ml-auto">
                                Sisa: Rp {(rndBudget.remaining / 1000).toFixed(0)}K
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Experiments + Details */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Experiments List */}
                <Card className="lg:col-span-2 border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Beaker className="h-4 w-4 text-sky-500" />
                            Experiments
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {rndExperiments.map((exp) => (
                            <button
                                key={exp.id}
                                onClick={() => setSelectedExpId(exp.id)}
                                className={`w-full text-left rounded-xl p-3.5 transition-all duration-200 border ${selectedExpId === exp.id
                                        ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                                        : "border-border/50 hover:bg-muted/50"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/10 to-violet-500/10 shrink-0">
                                        <TestTube className="h-4 w-4 text-sky-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {exp.experimentCode}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] px-1.5 py-0 ${experimentStatusColors[exp.status]}`}
                                            >
                                                {exp.status.replace("_", " ")}
                                            </Badge>
                                        </div>
                                        <p className="text-sm font-medium truncate">
                                            {exp.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {exp.startDate}
                                            {exp.endDate && ` → ${exp.endDate}`}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                </div>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Experiment Detail + Test Results */}
                <Card className="lg:col-span-3 border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <FileSearch className="h-4 w-4 text-violet-500" />
                            {selectedExp
                                ? `${selectedExp.experimentCode} — Test Results`
                                : "Select an experiment"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedExp ? (
                            <div className="space-y-4">
                                {/* Experiment Info */}
                                <div className="rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 border border-border/50">
                                    <h3 className="font-semibold text-sm mb-1">
                                        {selectedExp.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {selectedExp.objective}
                                    </p>
                                    {selectedExp.findings && (
                                        <div className="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                                    Findings
                                                </span>
                                            </div>
                                            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                                                {selectedExp.findings}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Test Results Table */}
                                {selectedTestResults.length > 0 ? (
                                    <div className="rounded-xl border border-border/50 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-muted/50">
                                                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                                                        Parameter
                                                    </th>
                                                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                                                        Type
                                                    </th>
                                                    <th className="text-right p-3 text-xs font-semibold text-muted-foreground">
                                                        Result
                                                    </th>
                                                    <th className="text-right p-3 text-xs font-semibold text-muted-foreground">
                                                        Benchmark
                                                    </th>
                                                    <th className="text-center p-3 text-xs font-semibold text-muted-foreground">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedTestResults.map(
                                                    (result) => (
                                                        <tr
                                                            key={result.id}
                                                            className="border-t border-border/30 hover:bg-muted/30 transition-colors"
                                                        >
                                                            <td className="p-3">
                                                                <div>
                                                                    <span className="font-medium text-sm">
                                                                        {result.parameter}
                                                                    </span>
                                                                    {result.notes && (
                                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                                            {result.notes}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="p-3">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className={`text-[10px] ${testTypeColors[result.testType]}`}
                                                                >
                                                                    {result.testType.replace("_", " ")}
                                                                </Badge>
                                                            </td>
                                                            <td className="p-3 text-right font-mono text-sm font-semibold">
                                                                {result.value}
                                                                <span className="text-muted-foreground text-xs ml-1">
                                                                    {result.unit}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 text-right font-mono text-sm text-muted-foreground">
                                                                {result.benchmark}
                                                                <span className="text-xs ml-1">
                                                                    {result.unit}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                {result.passFail ? (
                                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                                                                ) : (
                                                                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-sm text-muted-foreground">
                                        Belum ada test results untuk eksperimen ini.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <FlaskConical className="h-12 w-12 mb-3 opacity-20" />
                                <p className="text-sm">
                                    Pilih eksperimen di sebelah kiri untuk melihat detail & test results.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Sample Requests — Recent */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-rose-500" />
                            Recent Sample Requests
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-border/50 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/50">
                                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                                        Request #
                                    </th>
                                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                                        Material
                                    </th>
                                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                                        Tipe
                                    </th>
                                    <th className="text-right p-3 text-xs font-semibold text-muted-foreground">
                                        Volume
                                    </th>
                                    <th className="text-right p-3 text-xs font-semibold text-muted-foreground">
                                        Est. Value
                                    </th>
                                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                                        Purpose
                                    </th>
                                    <th className="text-center p-3 text-xs font-semibold text-muted-foreground">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rndSampleRequests.map((sr) => (
                                    <tr
                                        key={sr.id}
                                        className="border-t border-border/30 hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="p-3 font-mono text-xs font-semibold">
                                            {sr.requestNumber}
                                        </td>
                                        <td className="p-3 text-sm font-medium">
                                            {sr.productName}
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="secondary" className="text-[10px]">
                                                {materialTypeLabels[sr.materialType]}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right font-mono">
                                            {sr.qtyRequested} {sr.uom}
                                        </td>
                                        <td className="p-3 text-right font-mono text-muted-foreground">
                                            Rp {(sr.estimatedValue / 1000).toFixed(0)}K
                                        </td>
                                        <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate">
                                            {sr.purpose}
                                        </td>
                                        <td className="p-3 text-center">
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] ${statusColors[sr.status]}`}
                                            >
                                                {sr.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
