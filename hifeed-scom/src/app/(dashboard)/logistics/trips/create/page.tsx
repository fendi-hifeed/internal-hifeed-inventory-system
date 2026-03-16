"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft, Save, Truck, User, DollarSign, Plus, Trash2, Package, MapPin,
    Fuel, AlertTriangle, CheckCircle2, Clock, ShieldCheck, ShieldAlert, Weight,
    Navigation, Calculator,
} from "lucide-react";
import {
    partners, products, vehicles, drivers, vehicleTypeLabels,
    customerLocations, isDriverAvailable, getDriverTodayHours,
    calcPredictiveCost, systemSettings,
} from "@/data/mock-data";
import { useState, useMemo } from "react";

interface TripItem {
    id: string;
    productId: string;
    qty: string;
}

export default function CreateTripPage() {
    const router = useRouter();
    const [customer, setCustomer] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [selectedDriver, setSelectedDriver] = useState("");
    const [tollCost, setTollCost] = useState("100000");
    const [miscCost, setMiscCost] = useState("50000");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<TripItem[]>([
        { id: "1", productId: "", qty: "" },
    ]);

    const customers = partners.filter((p) => p.type === "CUSTOMER");
    const availableVehicles = vehicles.filter((v) => v.status === "AVAILABLE");

    const addItem = () =>
        setItems([...items, { id: Date.now().toString(), productId: "", qty: "" }]);
    const removeItem = (id: string) =>
        setItems(items.filter((i) => i.id !== id));
    const updateItem = (id: string, field: string, value: string) =>
        setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

    // Calculate total weight in tons
    const totalWeightKg = items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0);
    const totalWeightTon = totalWeightKg / 1000;

    // Get selected vehicle details
    const vehicle = vehicles.find((v) => v.id === selectedVehicle);
    const capacityExceeded = vehicle ? totalWeightTon > vehicle.maxCapacityTon : false;

    // Get selected driver availability
    const driverAvailability = selectedDriver ? isDriverAvailable(selectedDriver) : null;
    const driverHours = selectedDriver ? getDriverTodayHours(selectedDriver) : 0;

    // Get customer location
    const customerLoc = customer ? customerLocations.find((cl) => cl.partnerId === customer) : null;

    // Mock distance (would come from Google Maps API)
    const mockDistances: Record<string, { km: number; tollCost: number }> = {
        c1: { km: 1200, tollCost: 350000 },
        c2: { km: 150, tollCost: 100000 },
        c3: { km: 180, tollCost: 120000 },
    };
    const routeInfo = customer ? mockDistances[customer] : null;

    // Predictive cost calculation
    const predictiveCost = useMemo(() => {
        if (!vehicle || !routeInfo || totalWeightTon <= 0) return null;
        return calcPredictiveCost(
            routeInfo.km,
            vehicle.fuelRatioKmPerLiter,
            parseFloat(tollCost) || routeInfo.tollCost,
            parseFloat(miscCost) || 0,
            totalWeightTon,
        );
    }, [vehicle, routeInfo, totalWeightTon, tollCost, miscCost]);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Button
                variant="ghost"
                onClick={() => router.push("/logistics/trips")}
                className="gap-2 -ml-2 text-muted-foreground cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Trips
            </Button>

            {/* Customer + Route */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-rose-500" />
                        Delivery Destination
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Customer *</Label>
                            <Select value={customer} onValueChange={setCustomer}>
                                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                                <SelectContent>
                                    {customers.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>DO Number</Label>
                            <Input value="DO-2026-005" disabled className="bg-muted/30" />
                        </div>
                    </div>

                    {/* Route Info (simulated Map API result) */}
                    {customerLoc && routeInfo && (
                        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Navigation className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-bold text-blue-800">Route Auto-Calculated (via Maps API)</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                    <p className="text-[10px] text-blue-600 uppercase">Destination</p>
                                    <p className="font-medium">{customerLoc.address.substring(0, 30)}...</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-blue-600 uppercase">Coordinates</p>
                                    <p className="font-mono text-xs">{customerLoc.latitude}, {customerLoc.longitude}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-blue-600 uppercase">Distance</p>
                                    <p className="font-bold text-lg text-blue-800">{routeInfo.km} KM</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-blue-600 uppercase">Estimated Toll</p>
                                    <p className="font-medium">Rp {routeInfo.tollCost.toLocaleString("id-ID")}</p>
                                </div>
                            </div>
                            {/* Map Placeholder */}
                            <div className="mt-3 bg-blue-100 rounded-lg h-32 flex items-center justify-center text-blue-500 text-xs border border-blue-200">
                                <MapPin className="h-5 w-5 mr-2" />
                                Peta rute akan ditampilkan di sini (Google Maps API)
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Vehicle Selection + Capacity */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Truck className="h-4 w-4 text-violet-500" />
                        Select Vehicle
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                        <SelectTrigger><SelectValue placeholder="Choose a vehicle" /></SelectTrigger>
                        <SelectContent>
                            {availableVehicles.map((v) => (
                                <SelectItem key={v.id} value={v.id}>
                                    {v.plateNumber} — {vehicleTypeLabels[v.vehicleType]} ({v.maxCapacityTon}T, {v.fuelRatioKmPerLiter} km/L)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {vehicle && (
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                                <p className="text-[10px] text-muted-foreground uppercase">Type</p>
                                <p className="font-bold">{vehicleTypeLabels[vehicle.vehicleType]}</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                                <p className="text-[10px] text-muted-foreground uppercase flex items-center justify-center gap-1"><Weight className="h-3 w-3" />Max Capacity</p>
                                <p className="font-bold">{vehicle.maxCapacityTon} Ton</p>
                            </div>
                            <div className="bg-muted/50 rounded-lg p-3 text-center">
                                <p className="text-[10px] text-muted-foreground uppercase flex items-center justify-center gap-1"><Fuel className="h-3 w-3" />BBM Ratio</p>
                                <p className="font-bold">{vehicle.fuelRatioKmPerLiter} km/L</p>
                            </div>
                        </div>
                    )}

                    {/* Capacity Warning */}
                    {capacityExceeded && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm font-medium">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                            <div>
                                <p className="font-bold">🚫 Kapasitas terlampaui!</p>
                                <p className="text-xs font-normal mt-0.5">
                                    Order {totalWeightTon.toFixed(1)} Ton melebihi kapasitas {vehicleTypeLabels[vehicle!.vehicleType]} (max {vehicle!.maxCapacityTon} Ton).
                                    Gunakan kendaraan lebih besar atau pecah menjadi {Math.ceil(totalWeightTon / vehicle!.maxCapacityTon)} trip.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Driver Selection + Fatigue */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-sky-500" />
                        Assign Driver
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                        <SelectTrigger><SelectValue placeholder="Choose a driver" /></SelectTrigger>
                        <SelectContent>
                            {drivers.map((d) => {
                                const avail = isDriverAvailable(d.id);
                                const hours = getDriverTodayHours(d.id);
                                return (
                                    <SelectItem key={d.id} value={d.id} disabled={!avail.available}>
                                        {d.name} — {d.licenseType.replace("_", " ")} ({hours}h/{d.maxHoursPerDay}h)
                                        {!avail.available && " ⛔"}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>

                    {driverAvailability && (
                        <>
                            {driverAvailability.available ? (
                                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-2.5 text-xs font-medium">
                                    <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                                    <span>✅ Sopir ready — Driving {driverHours}h hari ini, sisa {8 - driverHours} jam tersedia</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg p-2.5 text-xs font-medium">
                                    <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                                    <span>🚫 {driverAvailability.reason}</span>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Delivery Items */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-4 w-4 text-amber-500" />
                        Delivery Items
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={addItem} className="gap-1 cursor-pointer">
                        <Plus className="h-3.5 w-3.5" />
                        Add
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-end gap-3">
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs">Product</Label>
                                <Select value={item.productId} onValueChange={(v) => updateItem(item.id, "productId", v)}>
                                    <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.displayName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-28 space-y-1">
                                <Label className="text-xs">Qty (KG)</Label>
                                <Input type="number" placeholder="0" value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} className="h-9" />
                            </div>
                            {items.length > 1 && (
                                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-9 w-9 p-0 text-destructive cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>
                    ))}
                    {totalWeightKg > 0 && (
                        <div className="flex items-center justify-between pt-2 border-t text-sm">
                            <span className="text-muted-foreground">Total Weight</span>
                            <span className={`font-bold text-lg ${capacityExceeded ? "text-red-600" : ""}`}>
                                {totalWeightTon.toFixed(2)} Ton ({totalWeightKg.toLocaleString("id-ID")} KG)
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Predictive Costing */}
            <Card className={`border-0 shadow-sm ${predictiveCost?.marginWarning ? "ring-2 ring-amber-400" : ""}`}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-emerald-500" />
                        Predictive Costing
                        {predictiveCost?.marginWarning && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px]">
                                ⚠️ Margin Warning
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs flex items-center gap-1">Toll Cost (Rp) — override</Label>
                            <Input type="number" value={tollCost} onChange={(e) => setTollCost(e.target.value)} className="h-9" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs flex items-center gap-1">Misc Cost (Rp) — parkir, muat, dll</Label>
                            <Input type="number" value={miscCost} onChange={(e) => setMiscCost(e.target.value)} className="h-9" />
                        </div>
                    </div>

                    {predictiveCost ? (
                        <div className="space-y-3">
                            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                                {[
                                    { label: "🛣️ Jarak", value: `${predictiveCost.estimatedDistanceKm} KM` },
                                    { label: "⛽ BBM Ratio", value: `${predictiveCost.fuelRatioKmPerLiter} km/L` },
                                    { label: "⛽ Harga BBM", value: `Rp ${predictiveCost.fuelPricePerLiter.toLocaleString("id-ID")}/L` },
                                    { label: "⛽ Estimasi BBM", value: `Rp ${predictiveCost.estimatedFuelCost.toLocaleString("id-ID")}`, bold: true },
                                    { label: "🛣️ Estimasi Tol", value: `Rp ${predictiveCost.estimatedTollCost.toLocaleString("id-ID")}` },
                                    { label: "👷 Uang Saku/Makan", value: `Rp ${predictiveCost.driverDailyAllowance.toLocaleString("id-ID")} × ${predictiveCost.estimatedTripDays} hari` },
                                    { label: "📦 Lain-lain", value: `Rp ${predictiveCost.miscCost.toLocaleString("id-ID")}` },
                                ].map((row, i) => (
                                    <div key={i} className={`flex items-center justify-between text-sm ${row.bold ? "font-medium" : ""}`}>
                                        <span className="text-muted-foreground">{row.label}</span>
                                        <span>{row.value}</span>
                                    </div>
                                ))}
                                <div className="border-t pt-2 mt-2 flex items-center justify-between">
                                    <span className="font-bold text-base">💰 TOTAL</span>
                                    <span className="font-bold text-xl text-primary">Rp {predictiveCost.totalEstimatedCost.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm pt-1">
                                    <span className="text-muted-foreground">Cost per Ton</span>
                                    <span className={`font-bold ${predictiveCost.marginWarning ? "text-amber-600" : "text-emerald-600"}`}>
                                        Rp {predictiveCost.costPerTon.toLocaleString("id-ID")}/ton
                                    </span>
                                </div>
                            </div>

                            {predictiveCost.marginWarning && (
                                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
                                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">⚠️ Biaya pengiriman melebihi {systemSettings.marginThresholdPercent}% dari margin!</p>
                                        <p className="text-xs mt-1">
                                            Cost/ton Rp {predictiveCost.costPerTon.toLocaleString("id-ID")} melebihi threshold
                                            Rp {((systemSettings.sellingPricePerTon * systemSettings.marginThresholdPercent) / 100).toLocaleString("id-ID")}/ton.
                                            Pertimbangkan rute atau armada alternatif.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-muted/30 rounded-lg p-6 text-center text-muted-foreground text-sm">
                            <Calculator className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            Pilih customer, vehicle, dan isi items untuk menghitung estimasi biaya
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                    <Label>Notes</Label>
                    <Textarea placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-2" />
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">Cancel</Button>
                <Button
                    onClick={() => router.push("/logistics/trips")}
                    className="gap-2 cursor-pointer"
                    disabled={capacityExceeded || (driverAvailability !== null && !driverAvailability.available)}
                >
                    <Save className="h-4 w-4" />
                    Create Trip + Generate Master Barcode
                </Button>
            </div>
        </div>
    );
}
