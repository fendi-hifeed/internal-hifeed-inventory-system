"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Beaker,
    TestTube,
    Calendar,
    User,
    Paperclip,
    Sparkles,
    ArrowLeft,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import {
    rndExperiments,
    rndSampleRequests,
    rndTestResults,
} from "@/data/mock-data";
import { useState } from "react";
import Link from "next/link";

const statusColors = {
    PLANNED: "bg-slate-500/10 text-slate-600 border-slate-500/30",
    IN_PROGRESS: "bg-sky-500/10 text-sky-600 border-sky-500/30",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/30",
};

const statusDots = {
    PLANNED: "bg-slate-400",
    IN_PROGRESS: "bg-sky-500 animate-pulse",
    COMPLETED: "bg-emerald-500",
    CANCELLED: "bg-red-500",
};

const testTypeColors = {
    NUTRITIONAL: "bg-violet-500/10 text-violet-600",
    PALATABILITY: "bg-amber-500/10 text-amber-600",
    SHELF_LIFE: "bg-cyan-500/10 text-cyan-600",
    FIELD_TRIAL: "bg-emerald-500/10 text-emerald-600",
};

export default function ExperimentsPage() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg">
                    <Beaker className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Experiments
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Daftar eksperimen R&D — klik untuk lihat detail
                    </p>
                </div>
            </div>

            {/* Experiment Cards */}
            <div className="space-y-4">
                {rndExperiments.map((exp) => {
                    const isExpanded = expandedId === exp.id;
                    const testResults = rndTestResults.filter(
                        (t) => t.experimentId === exp.id
                    );
                    const linkedSamples = rndSampleRequests.filter((s) =>
                        exp.sampleRequestIds.includes(s.id)
                    );
                    const passCount = testResults.filter((t) => t.passFail).length;
                    const failCount = testResults.length - passCount;

                    return (
                        <Card
                            key={exp.id}
                            className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <button
                                onClick={() =>
                                    setExpandedId(
                                        isExpanded ? null : exp.id
                                    )
                                }
                                className="w-full text-left"
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Status dot + vertical line */}
                                        <div className="flex flex-col items-center gap-1 pt-1">
                                            <div
                                                className={`h-3 w-3 rounded-full ${statusDots[exp.status]}`}
                                            />
                                            <div className="w-px flex-1 bg-border/50" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {exp.experimentCode}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] px-1.5 py-0 ${statusColors[exp.status]}`}
                                                >
                                                    {exp.status.replace("_", " ")}
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold text-sm">
                                                {exp.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                                                {exp.objective}
                                            </p>
                                            {/* Meta */}
                                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {exp.startDate}
                                                    {exp.endDate &&
                                                        ` → ${exp.endDate}`}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {exp.leadResearcher}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TestTube className="h-3 w-3" />
                                                    {testResults.length} tests
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Paperclip className="h-3 w-3" />
                                                    {exp.attachmentCount} files
                                                </span>
                                            </div>
                                        </div>

                                        {/* Pass/Fail Summary */}
                                        {testResults.length > 0 && (
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-emerald-600">
                                                        {passCount}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        pass
                                                    </div>
                                                </div>
                                                <div className="text-muted-foreground text-sm">
                                                    /
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-red-500">
                                                        {failCount}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        fail
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </button>

                            {/* Expanded Detail */}
                            {isExpanded && (
                                <div className="border-t border-border/30 bg-muted/20 p-5 space-y-4 animate-fade-in-up">
                                    {/* Findings */}
                                    {exp.findings && (
                                        <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                                    Findings
                                                </span>
                                            </div>
                                            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                                                {exp.findings}
                                            </p>
                                        </div>
                                    )}

                                    {/* Linked Samples */}
                                    {linkedSamples.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                                                Linked Samples
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {linkedSamples.map((s) => (
                                                    <Badge
                                                        key={s.id}
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {s.requestNumber} —{" "}
                                                        {s.productName} ({s.qtyRequested}{" "}
                                                        {s.uom})
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Test Results */}
                                    {testResults.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
                                                Test Results
                                            </h4>
                                            <div className="rounded-lg border border-border/50 overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-muted/50">
                                                            <th className="text-left p-2.5 text-xs font-semibold text-muted-foreground">
                                                                Parameter
                                                            </th>
                                                            <th className="text-left p-2.5 text-xs font-semibold text-muted-foreground">
                                                                Type
                                                            </th>
                                                            <th className="text-right p-2.5 text-xs font-semibold text-muted-foreground">
                                                                Result
                                                            </th>
                                                            <th className="text-right p-2.5 text-xs font-semibold text-muted-foreground">
                                                                Benchmark
                                                            </th>
                                                            <th className="text-center p-2.5 text-xs font-semibold text-muted-foreground">
                                                                ✓/✗
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {testResults.map(
                                                            (tr) => (
                                                                <tr
                                                                    key={tr.id}
                                                                    className="border-t border-border/30"
                                                                >
                                                                    <td className="p-2.5 text-sm font-medium">
                                                                        {tr.parameter}
                                                                        {tr.notes && (
                                                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                                                {tr.notes}
                                                                            </p>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-2.5">
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className={`text-[10px] ${testTypeColors[tr.testType]}`}
                                                                        >
                                                                            {tr.testType.replace(
                                                                                "_",
                                                                                " "
                                                                            )}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="p-2.5 text-right font-mono font-semibold">
                                                                        {tr.value}{" "}
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {tr.unit}
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-2.5 text-right font-mono text-muted-foreground">
                                                                        {tr.benchmark}{" "}
                                                                        <span className="text-xs">
                                                                            {tr.unit}
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-2.5 text-center">
                                                                        {tr.passFail ? (
                                                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                                                                        ) : (
                                                                            <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
