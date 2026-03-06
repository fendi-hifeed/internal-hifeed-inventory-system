"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Download,
    FileSpreadsheet,
    FileText,
    Database,
    Calendar,
    Package,
    ShoppingCart,
    Truck,
    Factory,
    Sprout,
    FlaskConical,
    CheckCircle2,
    Clock,
} from "lucide-react";
import { useState } from "react";

interface ExportJob {
    id: string;
    module: string;
    format: string;
    period: string;
    createdAt: string;
    status: "COMPLETED" | "PROCESSING" | "FAILED";
    fileSize?: string;
}

const modules = [
    { value: "procurement", label: "Procurement (PO + GRN)", icon: ShoppingCart },
    { value: "inventory", label: "Inventory & Stock", icon: Package },
    { value: "production", label: "Production (Plan + Result)", icon: Factory },
    { value: "farm", label: "Farm (Batches + Harvest)", icon: Sprout },
    { value: "logistics", label: "Logistics (Trips + POD)", icon: Truck },
    { value: "rnd", label: "R&D (Experiments + Samples)", icon: FlaskConical },
    { value: "all", label: "All Data (Full Backup)", icon: Database },
];

const formats = [
    { value: "xlsx", label: "Excel (.xlsx)", icon: FileSpreadsheet },
    { value: "csv", label: "CSV (.csv)", icon: FileText },
    { value: "json", label: "JSON (.json)", icon: Database },
];

const periods = [
    { value: "this_month", label: "This Month (Mar 2026)" },
    { value: "last_month", label: "Last Month (Feb 2026)" },
    { value: "q1_2026", label: "Q1 2026 (Jan-Mar)" },
    { value: "last_quarter", label: "Q4 2025 (Oct-Dec)" },
    { value: "ytd", label: "Year to Date (2026)" },
    { value: "last_year", label: "Full Year 2025" },
    { value: "all_time", label: "All Time" },
];

const recentExports: ExportJob[] = [
    {
        id: "e1", module: "Procurement (PO + GRN)", format: "xlsx",
        period: "Feb 2026", createdAt: "2026-03-05 14:30", status: "COMPLETED", fileSize: "2.4 MB",
    },
    {
        id: "e2", module: "Inventory & Stock", format: "csv",
        period: "Q1 2026", createdAt: "2026-03-04 10:15", status: "COMPLETED", fileSize: "1.1 MB",
    },
    {
        id: "e3", module: "All Data (Full Backup)", format: "json",
        period: "All Time", createdAt: "2026-03-01 08:00", status: "COMPLETED", fileSize: "15.7 MB",
    },
    {
        id: "e4", module: "Production (Plan + Result)", format: "xlsx",
        period: "Feb 2026", createdAt: "2026-02-28 16:00", status: "COMPLETED", fileSize: "890 KB",
    },
];

export default function DataExportPage() {
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("xlsx");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [exporting, setExporting] = useState(false);
    const [exports, setExports] = useState<ExportJob[]>(recentExports);

    const handleExport = () => {
        if (!selectedModule || !selectedPeriod) return;

        const moduleName = modules.find((m) => m.value === selectedModule)?.label || selectedModule;
        const periodName = periods.find((p) => p.value === selectedPeriod)?.label || selectedPeriod;

        setExporting(true);

        // Simulate export
        const newJob: ExportJob = {
            id: `e${Date.now()}`,
            module: moduleName,
            format: selectedFormat,
            period: periodName,
            createdAt: new Date().toLocaleString("sv-SE").replace(",", ""),
            status: "PROCESSING",
        };

        setExports([newJob, ...exports]);

        setTimeout(() => {
            setExports((prev) =>
                prev.map((e) =>
                    e.id === newJob.id
                        ? { ...e, status: "COMPLETED" as const, fileSize: "1.2 MB" }
                        : e
                )
            );
            setExporting(false);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Export data dari seluruh modul ke format Excel, CSV, atau JSON untuk backup dan reporting.
            </p>

            {/* Export Form */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Download className="h-4 w-4 text-primary" />
                        New Export
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Module</Label>
                            <Select value={selectedModule} onValueChange={setSelectedModule}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select module..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {modules.map((m) => {
                                        const Icon = m.icon;
                                        return (
                                            <SelectItem key={m.value} value={m.value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-3.5 w-3.5" />
                                                    {m.label}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Format</Label>
                            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {formats.map((f) => {
                                        const Icon = f.icon;
                                        return (
                                            <SelectItem key={f.value} value={f.value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-3.5 w-3.5" />
                                                    {f.label}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">Period</Label>
                            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select period..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {periods.map((p) => (
                                        <SelectItem key={p.value} value={p.value}>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {p.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleExport}
                            disabled={!selectedModule || !selectedPeriod || exporting}
                            className="gap-2 cursor-pointer"
                        >
                            {exporting ? (
                                <>
                                    <Clock className="h-4 w-4 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4" />
                                    Export Data
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Export Shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Full Backup (JSON)", icon: Database, color: "text-violet-600 bg-violet-50 border-violet-200 hover:bg-violet-100" },
                    { label: "PO Report (Excel)", icon: ShoppingCart, color: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" },
                    { label: "Stock Report (CSV)", icon: Package, color: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100" },
                    { label: "Production (Excel)", icon: Factory, color: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
                ].map((shortcut) => {
                    const Icon = shortcut.icon;
                    return (
                        <Card
                            key={shortcut.label}
                            className={`border shadow-sm cursor-pointer transition-colors ${shortcut.color}`}
                        >
                            <CardContent className="p-4 flex flex-col items-center gap-2">
                                <Icon className="h-6 w-6" />
                                <p className="text-xs font-semibold text-center">
                                    {shortcut.label}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Exports */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Recent Exports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {exports.map((job) => (
                        <div
                            key={job.id}
                            className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:bg-muted/20 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    {job.format === "xlsx" ? (
                                        <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                                    ) : job.format === "csv" ? (
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    ) : (
                                        <Database className="h-5 w-5 text-violet-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {job.module}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {job.period} • {job.format.toUpperCase()} •{" "}
                                        {job.createdAt}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {job.status === "COMPLETED" ? (
                                    <>
                                        <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            {job.fileSize}
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1 cursor-pointer"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                            Download
                                        </Button>
                                    </>
                                ) : job.status === "PROCESSING" ? (
                                    <Badge className="bg-amber-100 text-amber-700 gap-1">
                                        <Clock className="h-3 w-3 animate-spin" />
                                        Processing...
                                    </Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-700">
                                        Failed
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Info */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Database className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">
                                Tentang Data Export
                            </p>
                            <p>• Export berisi data sesuai periode yang dipilih</p>
                            <p>• <strong>Full Backup</strong> mencakup seluruh data dari semua modul dalam format JSON</p>
                            <p>• Excel dan CSV cocok untuk laporan ke manajemen dan analisis di spreadsheet</p>
                            <p>• Semua export dicatat di <strong>Audit Log</strong></p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
