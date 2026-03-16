"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Truck, Search, Wrench, Fuel, Weight, Plus, Building2, CheckCircle2,
} from "lucide-react";
import { vehicles, vehicleTypeLabels } from "@/data/mock-data";
import { useState } from "react";

const statusConfig: Record<string, { color: string; label: string }> = {
    AVAILABLE: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Available" },
    ON_TRIP: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "On Trip" },
    MAINTENANCE: { color: "bg-red-100 text-red-700 border-red-200", label: "Maintenance" },
};

const typeColors: Record<string, string> = {
    PICKUP: "from-sky-500 to-sky-600",
    ENGKEL: "from-indigo-500 to-indigo-600",
    FUSO: "from-violet-500 to-violet-600",
    TRONTON: "from-amber-500 to-amber-600",
    TRAILER: "from-rose-500 to-rose-600",
};

export default function FleetPage() {
    const [search, setSearch] = useState("");

    const filtered = vehicles.filter(
        (v) =>
            v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
            v.brand.toLowerCase().includes(search.toLowerCase()) ||
            vehicleTypeLabels[v.vehicleType].toLowerCase().includes(search.toLowerCase())
    );

    const available = vehicles.filter((v) => v.status === "AVAILABLE").length;
    const onTrip = vehicles.filter((v) => v.status === "ON_TRIP").length;
    const maintenance = vehicles.filter((v) => v.status === "MAINTENANCE").length;
    const totalCapacity = vehicles.reduce((s, v) => s + v.maxCapacityTon, 0);

    return (
        <div className="space-y-6">
            {/* Summary KPI */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Fleet", value: vehicles.length, icon: Truck, color: "from-primary to-primary/80" },
                    { label: "Available", value: available, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
                    { label: "On Trip", value: onTrip, icon: Truck, color: "from-amber-500 to-amber-600" },
                    { label: "Total Capacity", value: `${totalCapacity} Ton`, icon: Weight, color: "from-violet-500 to-violet-600" },
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
                        placeholder="Search plate, brand, type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-card border-0 shadow-sm"
                    />
                </div>
                <Button className="gap-2 rounded-xl shadow-sm cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Add Vehicle
                </Button>
            </div>

            {/* Vehicle Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((v, i) => {
                    const config = statusConfig[v.status];
                    return (
                        <Card
                            key={v.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all animate-fade-in-up overflow-hidden"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {/* Type strip */}
                            <div className={`h-1.5 bg-gradient-to-r ${typeColors[v.vehicleType]}`} />
                            <CardContent className="p-5 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-primary" />
                                            <span className="font-bold text-base">{v.plateNumber}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{v.brand}</p>
                                    </div>
                                    <Badge variant="outline" className={`${config.color} text-[11px]`}>
                                        {config.label}
                                    </Badge>
                                </div>

                                {/* Specs */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Type</p>
                                        <p className="font-bold text-sm mt-0.5">{vehicleTypeLabels[v.vehicleType]}</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Max Capacity</p>
                                        <p className="font-bold text-sm mt-0.5">{v.maxCapacityTon} Ton</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center justify-center gap-1"><Fuel className="h-3 w-3" />BBM Ratio</p>
                                        <p className="font-bold text-sm mt-0.5">{v.fuelRatioKmPerLiter} km/L</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ownership</p>
                                        <p className="font-bold text-sm mt-0.5 flex items-center justify-center gap-1">
                                            {v.ownership === "OWNED" ? (
                                                <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Owned</>
                                            ) : (
                                                <><Building2 className="h-3 w-3 text-blue-500" /> Vendor</>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {v.vendorName && (
                                    <p className="text-xs text-muted-foreground">Vendor: <span className="font-medium">{v.vendorName}</span></p>
                                )}

                                {v.notes && (
                                    <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">{v.notes}</p>
                                )}

                                {v.status === "MAINTENANCE" && (
                                    <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-lg p-2 text-xs">
                                        <Wrench className="h-3.5 w-3.5" />
                                        In Maintenance — Not Available
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
