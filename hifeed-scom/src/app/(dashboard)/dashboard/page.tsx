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
    AlertTriangle,
    CheckCircle2,
    Info,
    Activity,
    DollarSign,
    Users,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
} from "recharts";
import {
    dashboardStats,
    dashboardAlerts,
    chartDataHarvest,
    chartDataProduction,
} from "@/data/mock-data";

const statCards = [
    {
        label: "Total Inventory Value",
        value: `Rp ${(dashboardStats.totalInventoryValue / 1000000).toFixed(0)}M`,
        change: "+12%",
        trend: "up" as const,
        icon: DollarSign,
        color: "from-emerald-500 to-emerald-600",
        bgLight: "bg-emerald-50",
    },
    {
        label: "Active Batches",
        value: dashboardStats.activeBatches.toString(),
        change: "2 ready",
        trend: "up" as const,
        icon: Sprout,
        color: "from-sky-500 to-sky-600",
        bgLight: "bg-sky-50",
    },
    {
        label: "Pending PO",
        value: dashboardStats.pendingPO.toString(),
        change: "1 draft",
        trend: "neutral" as "up" | "down" | "neutral",
        icon: ShoppingCart,
        color: "from-amber-500 to-amber-600",
        bgLight: "bg-amber-50",
    },
    {
        label: "Active Trips",
        value: dashboardStats.activeTrips.toString(),
        change: "1 loading",
        trend: "neutral" as "up" | "down" | "neutral",
        icon: Truck,
        color: "from-violet-500 to-violet-600",
        bgLight: "bg-violet-50",
    },
];

const performanceCards = [
    {
        label: "Avg Mortality",
        value: `${dashboardStats.mortalityAvg}%`,
        icon: Activity,
        status: "good" as const,
    },
    {
        label: "Production (Month)",
        value: `${(dashboardStats.productionThisMonth / 1000).toFixed(1)}T`,
        icon: Package,
        status: "good" as const,
    },
    {
        label: "Labor Efficiency",
        value: `${dashboardStats.laborEfficiency}%`,
        icon: Users,
        status: "warning" as const,
    },
    {
        label: "Avg Cost/Trip",
        value: `Rp ${(dashboardStats.costPerTrip / 1000).toFixed(0)}K`,
        icon: DollarSign,
        status: "good" as const,
    },
];

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

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((stat, i) => {
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Harvest Chart */}
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

                {/* Production Chart */}
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
            </div>

            {/* Performance + Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance KPIs */}
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
                                    key={metric.label}
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

                {/* Alerts */}
                <Card className="lg:col-span-2 border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">
                            Recent Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {dashboardAlerts.map((alert) => {
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
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {alert.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
