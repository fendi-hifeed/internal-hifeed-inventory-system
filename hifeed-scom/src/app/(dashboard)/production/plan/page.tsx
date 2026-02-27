"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Factory, Clock, Users, ChevronRight, Play, CheckCircle2, Calendar as CalIcon } from "lucide-react";
import { productionRuns } from "@/data/mock-data";

const statusStyles: Record<string, { color: string; icon: typeof Play }> = {
    PLANNED: { color: "bg-gray-100 text-gray-700", icon: CalIcon },
    IN_PROGRESS: { color: "bg-amber-100 text-amber-700", icon: Play },
    FINISHED: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
};

export default function ProductionPlanPage() {
    const planned = productionRuns.filter((r) => r.status === "PLANNED");
    const inProgress = productionRuns.filter((r) => r.status === "IN_PROGRESS");
    const finished = productionRuns.filter((r) => r.status === "FINISHED");

    const renderRun = (run: typeof productionRuns[0]) => {
        const style = statusStyles[run.status];
        const Icon = style.icon;
        const duration = run.endTime && run.startTime
            ? `${Math.round(
                (new Date(run.endTime).getTime() - new Date(run.startTime).getTime()) /
                3600000
            )}h`
            : "Ongoing";

        return (
            <Card key={run.id} className="border-0 shadow-sm hover:shadow-md transition-all py-0">
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Factory className="h-4 w-4 text-primary" />
                                <span className="font-bold text-sm">{run.runNumber}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{run.machineName}</p>
                        </div>
                        <Badge className={`${style.color} text-[11px] gap-1`}>
                            <Icon className="h-3 w-3" />
                            {run.status.replace("_", " ")}
                        </Badge>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Output</p>
                        <p className="text-lg font-bold">{run.outputQty.toLocaleString()} {run.outputUom}</p>
                        <p className="text-xs text-muted-foreground">{run.outputProductName}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <Clock className="h-3 w-3 text-muted-foreground mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="text-sm font-semibold">{duration}</p>
                        </div>
                        <div>
                            <Users className="h-3 w-3 text-muted-foreground mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Operators</p>
                            <p className="text-sm font-semibold">{run.operatorCount}</p>
                        </div>
                        <div>
                            <CalIcon className="h-3 w-3 text-muted-foreground mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Shift</p>
                            <p className="text-sm font-semibold">{run.shiftCode}</p>
                        </div>
                    </div>

                    {/* BOM Preview */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">BOM:</p>
                        {run.bomItems.map((bom, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">{bom.name}</span>
                                <span className="font-medium">{bom.qty} {bom.uom}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-8">
            <p className="text-sm text-muted-foreground">
                Production planning & monitoring — track all production runs by status
            </p>

            {/* Kanban-style Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Planned */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                        <h3 className="font-semibold text-sm">Planned ({planned.length})</h3>
                    </div>
                    {planned.map(renderRun)}
                </div>

                {/* In Progress */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                        <h3 className="font-semibold text-sm">In Progress ({inProgress.length})</h3>
                    </div>
                    {inProgress.map(renderRun)}
                </div>

                {/* Finished */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <h3 className="font-semibold text-sm">Finished ({finished.length})</h3>
                    </div>
                    {finished.map(renderRun)}
                </div>
            </div>
        </div>
    );
}
