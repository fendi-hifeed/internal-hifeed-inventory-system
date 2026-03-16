"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Search, Plus, User, Clock, Shield, ShieldAlert, ShieldCheck, AlertTriangle,
    Phone, CalendarDays, Ban, Coffee, CheckCircle2,
} from "lucide-react";
import { drivers, driverLogs, getDriverTodayHours, isDriverAvailable } from "@/data/mock-data";
import { useState } from "react";

const statusConfig: Record<string, { color: string; label: string; icon: typeof User }> = {
    AVAILABLE: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Available", icon: CheckCircle2 },
    ON_TRIP: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "On Trip", icon: Clock },
    REST: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "Rest (Max Hours)", icon: Coffee },
    OFF_DUTY: { color: "bg-gray-100 text-gray-500 border-gray-200", label: "Off Duty", icon: Ban },
};

const licenseLabels: Record<string, string> = {
    SIM_A: "SIM A",
    SIM_B1: "SIM B1",
    SIM_B2: "SIM B2",
};

export default function DriversPage() {
    const [search, setSearch] = useState("");

    const filtered = drivers.filter(
        (d) =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.phone.includes(search)
    );

    const available = drivers.filter((d) => d.status === "AVAILABLE").length;
    const onTrip = drivers.filter((d) => d.status === "ON_TRIP").length;
    const resting = drivers.filter((d) => d.status === "REST").length;

    return (
        <div className="space-y-6">
            {/* KPI Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Drivers", value: drivers.length, icon: User, color: "from-primary to-primary/80" },
                    { label: "Available", value: available, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
                    { label: "On Trip", value: onTrip, icon: Clock, color: "from-amber-500 to-amber-600" },
                    { label: "Resting / Blocked", value: resting, icon: Coffee, color: "from-orange-500 to-orange-600" },
                ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="border-0 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                    <Icon className="h-4.5 w-4.5 text-white" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                                    <p className="text-lg font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search driver name, phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-card border-0 shadow-sm"
                    />
                </div>
                <Button className="gap-2 rounded-xl shadow-sm cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Add Driver
                </Button>
            </div>

            {/* Driver Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((driver, i) => {
                    const config = statusConfig[driver.status];
                    const StatusIcon = config.icon;
                    const availability = isDriverAvailable(driver.id);
                    const hoursToday = getDriverTodayHours(driver.id);
                    const hoursPercent = (hoursToday / driver.maxHoursPerDay) * 100;
                    const todayLogs = driverLogs.filter((l) => l.driverId === driver.id && l.date === "2026-03-16");
                    const isFatigued = hoursToday >= driver.maxHoursPerDay;

                    return (
                        <Card
                            key={driver.id}
                            className={`border-0 shadow-sm hover:shadow-md transition-all animate-fade-in-up ${isFatigued ? "ring-2 ring-orange-300" : ""}`}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <CardContent className="p-5 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isFatigued ? "bg-orange-100" : "bg-primary/10"}`}>
                                            <User className={`h-5 w-5 ${isFatigued ? "text-orange-600" : "text-primary"}`} />
                                        </div>
                                        <div>
                                            <p className="font-bold">{driver.name}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Phone className="h-3 w-3" />{driver.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`${config.color} text-[11px] gap-1`}>
                                        <StatusIcon className="h-3 w-3" />
                                        {config.label}
                                    </Badge>
                                </div>

                                {/* License Info */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center justify-center gap-1"><Shield className="h-3 w-3" />License</p>
                                        <p className="font-bold text-sm mt-0.5">{licenseLabels[driver.licenseType]}</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center justify-center gap-1"><CalendarDays className="h-3 w-3" />Expiry</p>
                                        <p className="font-bold text-sm mt-0.5">{driver.licenseExpiry}</p>
                                    </div>
                                </div>

                                {/* Fatigue Meter */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> Driving Hours Today
                                        </span>
                                        <span className={`font-bold ${isFatigued ? "text-orange-600" : hoursToday >= 6 ? "text-amber-600" : "text-emerald-600"}`}>
                                            {hoursToday} / {driver.maxHoursPerDay} jam
                                        </span>
                                    </div>
                                    <Progress
                                        value={Math.min(hoursPercent, 100)}
                                        className={`h-2.5 ${isFatigued ? "[&>div]:bg-orange-500" : hoursToday >= 6 ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`}
                                    />
                                </div>

                                {/* Fatigue Alert */}
                                {isFatigued && (
                                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg p-2.5 text-xs font-medium">
                                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                        <span>🚫 BLOCKED — Sudah {hoursToday} jam. Tidak bisa ditugaskan hari ini.</span>
                                    </div>
                                )}

                                {!availability.available && !isFatigued && availability.reason && (
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg p-2.5 text-xs">
                                        <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>{availability.reason}</span>
                                    </div>
                                )}

                                {availability.available && (
                                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-2.5 text-xs font-medium">
                                        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>✅ Ready — Sisa {driver.maxHoursPerDay - hoursToday} jam tersedia</span>
                                    </div>
                                )}

                                {/* Today's Logs */}
                                {todayLogs.length > 0 && (
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Log Hari Ini</p>
                                        {todayLogs.map((log) => (
                                            <div key={log.id} className="flex items-center justify-between text-xs bg-muted/30 rounded-md px-2.5 py-1.5">
                                                <span className="text-muted-foreground">{log.startTime} — {log.endTime}</span>
                                                <span className="font-medium">{log.totalHours} jam</span>
                                                {log.tripDO && <Badge variant="outline" className="text-[10px] h-5">{log.tripDO}</Badge>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
