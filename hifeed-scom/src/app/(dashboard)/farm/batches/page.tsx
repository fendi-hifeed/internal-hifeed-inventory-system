"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Search,
    Plus,
    Eye,
    Sprout,
    Calendar,
    MapPin,
    Activity,
} from "lucide-react";
import { farmBatches } from "@/data/mock-data";
import { useState } from "react";

const statusColors: Record<string, string> = {
    SEEDING: "bg-indigo-50 text-indigo-700 border-indigo-200",
    NURSERY: "bg-purple-50 text-purple-700 border-purple-200",
    GROWING: "bg-emerald-50 text-emerald-700 border-emerald-200",
    READY_HARVEST: "bg-amber-50 text-amber-700 border-amber-200",
    HARVESTED: "bg-sky-50 text-sky-700 border-sky-200",
    WRITE_OFF: "bg-red-50 text-red-700 border-red-200",
};

const statusLabels: Record<string, string> = {
    SEEDING: "Seeding",
    NURSERY: "Nursery",
    GROWING: "Growing",
    READY_HARVEST: "Ready Harvest",
    HARVESTED: "Harvested",
    WRITE_OFF: "Write Off",
};

export default function FarmBatchesPage() {
    const [search, setSearch] = useState("");

    const filtered = farmBatches.filter(
        (b) =>
            b.batchCode.toLowerCase().includes(search.toLowerCase()) ||
            b.locationName.toLowerCase().includes(search.toLowerCase()) ||
            b.productName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    Track all farm batches from seeding to harvest
                </p>
                <Button className="gap-2 rounded-xl shadow-sm cursor-pointer">
                    <Plus className="h-4 w-4" />
                    New Batch
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search batch, location, or product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-card border-0 shadow-sm"
                />
            </div>

            {/* Batch Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((batch, i) => {
                    const survivalRate = 100 - batch.mortalityRate;
                    return (
                        <Card
                            key={batch.id}
                            className="border-0 shadow-sm hover:shadow-md transition-all animate-fade-in-up group py-0"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <CardContent className="p-5 space-y-4">
                                {/* Top */}
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Sprout className="h-4 w-4 text-emerald-500" />
                                            <span className="font-bold text-sm">
                                                {batch.batchCode}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {batch.productName}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`${statusColors[batch.status]} text-[11px]`}
                                    >
                                        {statusLabels[batch.status]}
                                    </Badge>
                                </div>

                                {/* Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {batch.locationName}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        Started {batch.startDate} · HST {batch.hst}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                                        <p className="text-xs text-muted-foreground">Initial</p>
                                        <p className="text-sm font-bold">
                                            {batch.initialQty.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                                        <p className="text-xs text-muted-foreground">Current</p>
                                        <p className="text-sm font-bold">
                                            {batch.currentQty.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                                        <p className="text-xs text-muted-foreground">Mortality</p>
                                        <p className="text-sm font-bold text-rose-500">
                                            {batch.mortalityRate}%
                                        </p>
                                    </div>
                                </div>

                                {/* Survival Bar */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            Survival Rate
                                        </span>
                                        <span className="font-semibold text-emerald-600">
                                            {survivalRate.toFixed(1)}%
                                        </span>
                                    </div>
                                    <Progress value={survivalRate} className="h-2" />
                                </div>

                                {/* Action */}
                                <Link href={`/farm/batches/${batch.id}`}>
                                    <Button
                                        variant="ghost"
                                        className="w-full gap-2 text-xs h-8 cursor-pointer"
                                    >
                                        <Eye className="h-3 w-3" />
                                        View Dashboard
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
