"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    Sprout,
    MapPin,
    Calendar,
    Users,
    Clock,
    Activity,
    Skull,
    Scale,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { farmBatches, dailyLogs } from "@/data/mock-data";

// Mock mortality trend data
const mortalityTrend = [
    { day: "Feb 14", count: 15 },
    { day: "Feb 15", count: 18 },
    { day: "Feb 16", count: 10 },
    { day: "Feb 17", count: 14 },
    { day: "Feb 18", count: 8 },
    { day: "Feb 19", count: 12 },
];

export default function BatchDetailPage() {
    const params = useParams();
    const router = useRouter();
    const batch = farmBatches.find((b) => b.id === params.id);
    const logs = dailyLogs.filter((l) => l.batchId === params.id);

    if (!batch) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Batch not found</p>
            </div>
        );
    }

    const survivalRate = 100 - batch.mortalityRate;
    const totalDead = batch.initialQty - batch.currentQty;
    const totalLaborHours = logs.reduce((s, l) => s + l.totalLaborHours, 0);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Button
                variant="ghost"
                onClick={() => router.push("/farm/batches")}
                className="gap-2 -ml-2 text-muted-foreground cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Batches
            </Button>

            {/* Header Card */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Sprout className="h-5 w-5 text-emerald-600" />
                                <h2 className="text-xl font-bold">{batch.batchCode}</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">{batch.productName}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{batch.locationName}</span>
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Started {batch.startDate}</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />HST {batch.hst} days</span>
                            </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 text-sm h-fit px-4 py-1.5">
                            {batch.status.replace("_", " ")}
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Initial Population", value: batch.initialQty.toLocaleString(), icon: Sprout, color: "text-emerald-600" },
                    { label: "Current Population", value: batch.currentQty.toLocaleString(), icon: Activity, color: "text-sky-600" },
                    { label: "Total Mortality", value: totalDead.toLocaleString(), icon: Skull, color: "text-rose-500" },
                    { label: "Labor Hours", value: `${totalLaborHours}h`, icon: Users, color: "text-amber-500" },
                ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <Card key={metric.label} className="border-0 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                    <Icon className={`h-5 w-5 ${metric.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                                    <p className="text-lg font-bold">{metric.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Survival + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Survival Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center py-6">
                            <div className="relative inline-flex items-center justify-center">
                                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        className="text-muted/50"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                    <path
                                        className="text-emerald-500"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeDasharray={`${survivalRate}, 100`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute">
                                    <p className="text-2xl font-bold">{survivalRate.toFixed(1)}%</p>
                                    <p className="text-xs text-muted-foreground">survival</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Mortality Rate</span>
                            <span className="font-semibold text-rose-500">{batch.mortalityRate}%</span>
                        </div>
                        <Progress value={survivalRate} className="h-2" />
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Mortality Trend (Daily)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mortalityTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                                    <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }} />
                                    <Line type="monotone" dataKey="count" stroke="oklch(0.645 0.246 16.439)" strokeWidth={2.5} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Logs Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-sm">Recent Daily Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Mortality</TableHead>
                                <TableHead className="text-right">Workers</TableHead>
                                <TableHead className="text-right">Hours</TableHead>
                                <TableHead className="text-right">Feed (Kg)</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Logged By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium text-sm">{log.logDate}</TableCell>
                                    <TableCell className="text-right text-rose-500 font-medium">{log.mortalityCount}</TableCell>
                                    <TableCell className="text-right">{log.manPowerCount}</TableCell>
                                    <TableCell className="text-right">{log.totalLaborHours}h</TableCell>
                                    <TableCell className="text-right">{log.feedUsedKg || "-"}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{log.notes}</TableCell>
                                    <TableCell className="text-sm">{log.loggedBy}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
