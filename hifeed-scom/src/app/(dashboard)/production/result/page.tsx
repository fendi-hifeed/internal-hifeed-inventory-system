"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save, Factory, Clock, Users, Package } from "lucide-react";
import { products } from "@/data/mock-data";
import { useState } from "react";

const machines = [
    { id: "M-001", name: "Mixer Pakan #1" },
    { id: "M-002", name: "Grinder #2" },
    { id: "M-003", name: "Packing Line #1" },
];

const shifts = [
    { code: "PAGI", label: "Pagi (07:00 - 15:00)" },
    { code: "SIANG", label: "Siang (15:00 - 23:00)" },
    { code: "MALAM", label: "Malam (23:00 - 07:00)" },
];

export default function ProductionResultPage() {
    const router = useRouter();
    const [machine, setMachine] = useState("");
    const [outputProduct, setOutputProduct] = useState("");
    const [outputQty, setOutputQty] = useState("");
    const [operators, setOperators] = useState("");
    const [shift, setShift] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const duration = startTime && endTime
        ? Math.max(0, (new Date(`2026-01-01T${endTime}`).getTime() - new Date(`2026-01-01T${startTime}`).getTime()) / 3600000)
        : 0;

    const throughput = duration > 0 && parseFloat(outputQty)
        ? (parseFloat(outputQty) / duration).toFixed(0)
        : "0";

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-sm text-muted-foreground">
                Input hasil produksi — qty output, jumlah operator, dan jam shift.
            </p>

            {/* Machine & Output */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Factory className="h-4 w-4 text-primary" />
                        Machine & Output
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Machine</Label>
                            <Select value={machine} onValueChange={setMachine}>
                                <SelectTrigger><SelectValue placeholder="Select machine" /></SelectTrigger>
                                <SelectContent>
                                    {machines.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Output Product</Label>
                            <Select value={outputProduct} onValueChange={setOutputProduct}>
                                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                                <SelectContent>
                                    {products.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-emerald-500" />
                            Output Quantity (Kg)
                        </Label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={outputQty}
                            onChange={(e) => setOutputQty(e.target.value)}
                            className="h-14 text-2xl text-center font-bold"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Time & Shift */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        Time & Shift
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Shift</Label>
                        <Select value={shift} onValueChange={setShift}>
                            <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
                            <SelectContent>
                                {shifts.map((s) => (
                                    <SelectItem key={s.code} value={s.code}>{s.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="h-12" />
                        </div>
                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="h-12" />
                        </div>
                    </div>
                    {duration > 0 && (
                        <div className="bg-primary/5 rounded-lg p-3 text-center">
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="text-2xl font-bold text-primary">{duration.toFixed(1)} <span className="text-sm font-normal">jam</span></p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Operators */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-sky-500" />
                        Operators
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Label>Jumlah Operator / Helper</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={operators}
                        onChange={(e) => setOperators(e.target.value)}
                        className="h-14 text-2xl text-center font-bold mt-2"
                    />
                </CardContent>
            </Card>

            {/* Calculated Metrics */}
            {duration > 0 && parseFloat(outputQty) && (
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-sky-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">📊 Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                <p className="text-xs text-muted-foreground">Throughput</p>
                                <p className="text-2xl font-bold text-primary">{throughput}</p>
                                <p className="text-xs text-muted-foreground">Kg/Jam</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                <p className="text-xs text-muted-foreground">Labor Cost Factor</p>
                                <p className="text-2xl font-bold text-amber-600">
                                    {parseInt(operators) && parseFloat(outputQty)
                                        ? ((parseFloat(outputQty) / parseInt(operators)) / 1000).toFixed(1)
                                        : "0"}
                                </p>
                                <p className="text-xs text-muted-foreground">Ton/Operator</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Button className="w-full h-14 text-base gap-2 rounded-xl shadow-lg cursor-pointer">
                <Save className="h-5 w-5" />
                Submit Production Result
            </Button>
        </div>
    );
}
