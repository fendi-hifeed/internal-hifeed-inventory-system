"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    ShoppingCart,
    Sprout,
    Truck,
    TrendingUp,
    TrendingDown,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
    Info,
    Activity,
    Users,
    Receipt,
    FlaskConical,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import {
    dashboardStats,
    dashboardAlerts,
    chartDataHarvest,
    chartDataProduction,
    depreciationLogs,
    defaultCarbonConstants,
    calcCarbonMetrics,
    carbonMonthlyData,
} from "@/data/mock-data";
import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/data/mock-data";

// ---------- ROLE-BASED VISIBILITY CONFIG ----------

type StatCardDef = {
    id: string;
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: typeof DollarSign;
    color: string;
    bgLight: string;
    visibleTo: UserRole[];
};

const ALL_ROLES: UserRole[] = ["OWNER", "FARM_MANAGER", "LOGISTICS", "FINANCE", "OPERATOR", "RND", "IT_OPS", "SALES"];
const FULL_VIEW: UserRole[] = ["OWNER", "IT_OPS"];

const allStatCards: StatCardDef[] = [
    {
        id: "inventory_value",
        label: "Total Inventory Value",
        value: `Rp ${(dashboardStats.totalInventoryValue / 1000000).toFixed(0)}M`,
        change: "+12%",
        trend: "up",
        icon: DollarSign,
        color: "from-emerald-500 to-emerald-600",
        bgLight: "bg-emerald-50",
        visibleTo: [...FULL_VIEW, "FINANCE", "SALES"],
    },
    {
        id: "active_batches",
        label: "Active Batches",
        value: dashboardStats.activeBatches.toString(),
        change: "2 ready",
        trend: "up",
        icon: Sprout,
        color: "from-sky-500 to-sky-600",
        bgLight: "bg-sky-50",
        visibleTo: [...FULL_VIEW, "FARM_MANAGER"],
    },
    {
        id: "pending_po",
        label: "Pending PO",
        value: dashboardStats.pendingPO.toString(),
        change: "1 draft",
        trend: "neutral",
        icon: ShoppingCart,
        color: "from-amber-500 to-amber-600",
        bgLight: "bg-amber-50",
        visibleTo: [...FULL_VIEW, "FINANCE", "SALES"],
    },
    {
        id: "active_trips",
        label: "Active Trips",
        value: dashboardStats.activeTrips.toString(),
        change: "1 loading",
        trend: "neutral",
        icon: Truck,
        color: "from-violet-500 to-violet-600",
        bgLight: "bg-violet-50",
        visibleTo: [...FULL_VIEW, "LOGISTICS", "SALES"],
    },
    {
        id: "revenue_month",
        label: "Revenue (Month)",
        value: "Rp 130M",
        change: "+18% vs prev",
        trend: "up",
        icon: Receipt,
        color: "from-teal-500 to-teal-600",
        bgLight: "bg-teal-50",
        visibleTo: [...FULL_VIEW, "FINANCE", "SALES"],
    },
    {
        id: "production_output",
        label: "Production Output",
        value: `${(dashboardStats.productionThisMonth / 1000).toFixed(1)}T`,
        change: "this month",
        trend: "up",
        icon: Package,
        color: "from-indigo-500 to-indigo-600",
        bgLight: "bg-indigo-50",
        visibleTo: [...FULL_VIEW, "OPERATOR"],
    },
    {
        id: "rnd_budget",
        label: "R&D Budget Usage",
        value: "68%",
        change: "of 2% limit",
        trend: "neutral",
        icon: FlaskConical,
        color: "from-rose-500 to-rose-600",
        bgLight: "bg-rose-50",
        visibleTo: [...FULL_VIEW, "FINANCE", "RND"],
    },
    {
        id: "depreciation",
        label: "Depreciation (Month)",
        value: `${depreciationLogs.reduce((s, d) => s + d.lossQtyKg, 0).toLocaleString("id-ID")} KG`,
        change: `${(depreciationLogs.reduce((s, d) => s + d.lossQtyKg, 0) / Math.max(depreciationLogs.reduce((s, d) => s + d.initialQtyKg, 0), 1) * 100).toFixed(1)}% avg loss`,
        trend: "down" as const,
        icon: TrendingDown,
        color: "from-red-500 to-red-600",
        bgLight: "bg-red-50",
        visibleTo: [...FULL_VIEW, "FARM_MANAGER", "OPERATOR"],
    },
];

// Performance metrics
type PerfMetric = {
    id: string;
    label: string;
    value: string;
    icon: typeof Activity;
    status: "good" | "warning";
    visibleTo: UserRole[];
};

const allPerformanceCards: PerfMetric[] = [
    {
        id: "mortality",
        label: "Avg Mortality",
        value: `${dashboardStats.mortalityAvg}%`,
        icon: Activity,
        status: "good",
        visibleTo: [...FULL_VIEW, "FARM_MANAGER", "RND"],
    },
    {
        id: "production_month",
        label: "Production (Month)",
        value: `${(dashboardStats.productionThisMonth / 1000).toFixed(1)}T`,
        icon: Package,
        status: "good",
        visibleTo: [...FULL_VIEW, "OPERATOR"],
    },
    {
        id: "labor",
        label: "Labor Efficiency",
        value: `${dashboardStats.laborEfficiency}%`,
        icon: Users,
        status: "warning",
        visibleTo: [...FULL_VIEW, "FARM_MANAGER", "OPERATOR"],
    },
    {
        id: "cost_trip",
        label: "Avg Cost/Trip",
        value: `Rp ${(dashboardStats.costPerTrip / 1000).toFixed(0)}K`,
        icon: DollarSign,
        status: "good",
        visibleTo: [...FULL_VIEW, "FINANCE", "LOGISTICS", "SALES"],
    },
    {
        id: "gp_margin",
        label: "GP Margin",
        value: "28.5%",
        icon: TrendingUp,
        status: "good",
        visibleTo: [...FULL_VIEW, "FINANCE", "SALES"],
    },
    {
        id: "overdue_inv",
        label: "Overdue Invoices",
        value: "1",
        icon: AlertTriangle,
        status: "warning",
        visibleTo: [...FULL_VIEW, "FINANCE", "SALES"],
    },
];

// Charts visibility
const chartVisibility: Record<string, UserRole[]> = {
    harvest: [...FULL_VIEW, "FARM_MANAGER", "RND"],
    production: [...FULL_VIEW, "OPERATOR"],
};

// Alert module → role mapping
const alertModuleToRoles: Record<string, UserRole[]> = {
    farm: [...FULL_VIEW, "FARM_MANAGER", "RND"],
    procurement: [...FULL_VIEW, "FINANCE", "SALES"],
    inventory: [...FULL_VIEW, "FINANCE", "SALES", "OPERATOR"],
    production: [...FULL_VIEW, "OPERATOR"],
    logistics: [...FULL_VIEW, "LOGISTICS", "SALES"],
    sales: [...FULL_VIEW, "FINANCE", "SALES"],
    rnd: [...FULL_VIEW, "FINANCE", "RND"],
};

// ---------- UTILS ----------
const alertIcons = {
    warning: AlertTriangle,
    danger: AlertTriangle,
    success: CheckCircle2,
    info: Info,
};
const alertColors = {
    warning: "text-amber-500 bg-amber-500/10",
    danger: "text-red-500 bg-red-500/10",
    success: "text-emerald-500 bg-emerald-500/10",
    info: "text-sky-500 bg-sky-500/10",
};

// ---------- COMPONENT ----------
export default function DashboardPage() {
    const { user } = useAuth();
    const role = (user?.role ?? "OWNER") as UserRole;

    // Filter data by role
    const statCards = allStatCards.filter((c) => c.visibleTo.includes(role));
    const performanceCards = allPerformanceCards.filter((c) => c.visibleTo.includes(role));
    const showHarvest = chartVisibility.harvest.includes(role);
    const showProduction = chartVisibility.production.includes(role);

    const filteredAlerts = dashboardAlerts.filter((alert) => {
        const allowed = alertModuleToRoles[alert.module] ?? ALL_ROLES;
        return allowed.includes(role);
    });

    // Determine chart grid — if only 1 chart, full width
    const chartCount = (showHarvest ? 1 : 0) + (showProduction ? 1 : 0);

    return (
        <div className="space-y-6">
            {/* Role Context Banner */}
            {role !== "OWNER" && role !== "IT_OPS" && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-xs text-primary/80">
                        Dashboard menampilkan data yang relevan dengan role <strong>{user?.name}</strong>. Data di luar scope role Anda disembunyikan.
                    </p>
                </div>
            )}

            {/* Stat Cards */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${statCards.length > 4 ? "xl:grid-cols-4" : `xl:grid-cols-${Math.min(statCards.length, 4)}`} gap-4`}>
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={stat.id}
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
                                        <div className="flex items-center gap-1">
                                            {stat.trend === "up" ? (
                                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                            ) : stat.trend === "down" ? (
                                                <TrendingDown className="h-3 w-3 text-red-500" />
                                            ) : null}
                                            <span className="text-xs text-muted-foreground">
                                                {stat.change}
                                            </span>
                                        </div>
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

            {/* Charts Row */}
            {chartCount > 0 && (
                <div className={`grid grid-cols-1 ${chartCount > 1 ? "lg:grid-cols-2" : ""} gap-6`}>
                    {/* Harvest Chart */}
                    {showHarvest && (
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold">
                                    Hasil Panen (Kg)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartDataHarvest}>
                                            <defs>
                                                <linearGradient
                                                    id="harvestGrad"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="oklch(0.696 0.17 162.48)"
                                                        stopOpacity={0.3}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="oklch(0.696 0.17 162.48)"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="oklch(0.9 0 0)"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                width={40}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: "10px",
                                                    border: "none",
                                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                                    fontSize: "12px",
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="panen"
                                                stroke="oklch(0.696 0.17 162.48)"
                                                strokeWidth={2.5}
                                                fill="url(#harvestGrad)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Production Chart */}
                    {showProduction && (
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold">
                                    Produksi vs Target (Kg)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartDataProduction}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="oklch(0.9 0 0)"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                width={40}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: "10px",
                                                    border: "none",
                                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                                    fontSize: "12px",
                                                }}
                                            />
                                            <Bar
                                                dataKey="output"
                                                fill="oklch(0.45 0.18 250)"
                                                radius={[6, 6, 0, 0]}
                                                barSize={20}
                                            />
                                            <Bar
                                                dataKey="target"
                                                fill="oklch(0.88 0.05 250)"
                                                radius={[6, 6, 0, 0]}
                                                barSize={20}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Performance + Alerts Row */}
            <div className={`grid grid-cols-1 ${performanceCards.length > 0 && filteredAlerts.length > 0 ? "lg:grid-cols-3" : ""} gap-6`}>
                {/* Performance KPIs */}
                {performanceCards.length > 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">
                                Key Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {performanceCards.map((metric) => {
                                const Icon = metric.icon;
                                return (
                                    <div
                                        key={metric.id}
                                        className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                            <Icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">
                                                {metric.label}
                                            </p>
                                            <p className="text-lg font-bold">{metric.value}</p>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                metric.status === "good"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }
                                        >
                                            {metric.status === "good" ? "Good" : "Warning"}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                )}

                {/* Carbon Bank Widget */}
                {["OWNER", "IT_OPS", "FINANCE", "RND"].includes(user?.role || "") && (
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-sky-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Sprout className="h-3.5 w-3.5 text-emerald-200" />
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-200">Carbon Bank</span>
                                    </div>
                                    <p className="text-3xl font-black">
                                        {(carbonMonthlyData.reduce((s, d) => s + d.salesTon, 0) * calcCarbonMetrics(defaultCarbonConstants).totalPerTon).toFixed(1)}
                                        <span className="text-sm font-normal ml-1">tCO₂e saved</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-emerald-100">{calcCarbonMetrics(defaultCarbonConstants).totalPerTon} tCO₂e / ton</p>
                                    <a href="/carbon" className="text-[10px] text-emerald-200 hover:text-white underline">View Dashboard →</a>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Alerts */}
                {filteredAlerts.length > 0 && (
                    <Card className={`${performanceCards.length > 0 ? "lg:col-span-2" : ""} border-0 shadow-sm`}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">
                                Recent Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {filteredAlerts.map((alert) => {
                                const Icon = alertIcons[alert.type];
                                return (
                                    <div
                                        key={alert.id}
                                        className="flex items-start gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/30 transition-colors"
                                    >
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${alertColors[alert.type]}`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm leading-relaxed">
                                                {alert.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-xs text-muted-foreground">
                                                    {alert.time}
                                                </p>
                                                <Badge variant="outline" className="text-[9px]">
                                                    {alert.module}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
