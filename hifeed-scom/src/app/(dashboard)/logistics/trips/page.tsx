"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Search,
    Truck,
    MapPin,
    Clock,
    Package,
    User,
    DollarSign,
    CheckCircle2,
    Loader2,
    BoxSelect,
} from "lucide-react";
import { deliveryTrips } from "@/data/mock-data";
import { useState } from "react";

const statusConfig: Record<string, { color: string; icon: typeof Truck; label: string }> = {
    LOADING: { color: "bg-gray-100 text-gray-700 border-gray-200", icon: BoxSelect, label: "Loading" },
    ON_THE_WAY: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Truck, label: "On The Way" },
    DELIVERED: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2, label: "Delivered" },
};

export default function TripsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filtered = deliveryTrips.filter((t) => {
        const matchSearch =
            t.doNumber.toLowerCase().includes(search.toLowerCase()) ||
            t.customerName.toLowerCase().includes(search.toLowerCase()) ||
            t.driverName.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalCost = deliveryTrips.reduce((s, t) => s + t.tripCost, 0);

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Trips", value: deliveryTrips.length, icon: Truck, color: "from-primary to-primary/80" },
                    { label: "Loading", value: deliveryTrips.filter((t) => t.status === "LOADING").length, icon: BoxSelect, color: "from-gray-500 to-gray-600" },
                    { label: "On The Way", value: deliveryTrips.filter((t) => t.status === "ON_THE_WAY").length, icon: Loader2, color: "from-amber-500 to-amber-600" },
                    { label: "Total Cost", value: `Rp ${(totalCost / 1000).toFixed(0)}K`, icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
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
                        placeholder="Search DO, customer, driver..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-card border-0 shadow-sm"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 bg-card border-0 shadow-sm">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="LOADING">Loading</SelectItem>
                        <SelectItem value="ON_THE_WAY">On The Way</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                    </SelectContent>
                </Select>
                <Link href="/logistics/trips/create">
                    <Button className="gap-2 rounded-xl shadow-sm w-full sm:w-auto cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Create Trip
                    </Button>
                </Link>
            </div>

            {/* Trip Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((trip, i) => {
                    const config = statusConfig[trip.status];
                    const StatusIcon = config.icon;
                    return (
                        <Card
                            key={trip.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all animate-fade-in-up py-0"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <CardContent className="p-5 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-primary" />
                                            <span className="font-bold text-sm">{trip.doNumber}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{trip.customerName}</p>
                                    </div>
                                    <Badge variant="outline" className={`${config.color} text-[11px] gap-1`}>
                                        <StatusIcon className="h-3 w-3" />
                                        {config.label}
                                    </Badge>
                                </div>

                                {/* Driver & Vehicle */}
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />{trip.driverName}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Truck className="h-3 w-3" />{trip.vehiclePlate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />Rp {trip.tripCost.toLocaleString("id-ID")}
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                                    {trip.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-1.5">
                                                <Package className="h-3 w-3 text-muted-foreground" />
                                                {item.productName}
                                            </span>
                                            <span className="font-medium">{item.qty} {item.uom}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {trip.createdAt}
                                    </span>
                                    {trip.status === "DELIVERED" && trip.podUrl && (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-[10px]">
                                            POD Uploaded ✓
                                        </Badge>
                                    )}
                                    {trip.status === "ON_THE_WAY" && (
                                        <Link href="/logistics/pod">
                                            <Button variant="outline" size="sm" className="h-7 text-xs cursor-pointer">
                                                Upload POD
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
