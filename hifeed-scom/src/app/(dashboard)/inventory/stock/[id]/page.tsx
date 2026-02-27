"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package, ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { stockItems, stockLedgerEntries } from "@/data/mock-data";

const txTypeLabels: Record<string, { label: string; color: string; icon: typeof ArrowDownRight }> = {
    IN_GRN: { label: "Goods Receipt", color: "text-emerald-600 bg-emerald-50", icon: ArrowDownRight },
    OUT_PROD: { label: "Production Use", color: "text-rose-600 bg-rose-50", icon: ArrowUpRight },
    IN_HARVEST: { label: "Harvest In", color: "text-sky-600 bg-sky-50", icon: ArrowDownRight },
    OUT_SALES: { label: "Sales Out", color: "text-amber-600 bg-amber-50", icon: ArrowUpRight },
    ADJUSTMENT: { label: "Adjustment", color: "text-purple-600 bg-purple-50", icon: RefreshCw },
};

export default function StockCardPage() {
    const params = useParams();
    const router = useRouter();
    const stock = stockItems.find((s) => s.id === params.id);

    if (!stock) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Stock item not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button
                variant="ghost"
                onClick={() => router.push("/inventory/stock")}
                className="gap-2 -ml-2 text-muted-foreground cursor-pointer"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Stock
            </Button>

            {/* Stock Card Header */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-bold">{stock.productName}</h2>
                            </div>
                            <Badge variant="outline" className="font-mono">{stock.skuCode}</Badge>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-primary">{stock.currentQty.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{stock.baseUom}</p>
                        </div>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Purchase UoM</p>
                            <p className="text-sm font-medium">{stock.purchaseUom}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Conversion Rate</p>
                            <p className="text-sm font-medium">1 {stock.purchaseUom} = {stock.purchaseConversionRate} {stock.baseUom}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Avg Cost</p>
                            <p className="text-sm font-medium">Rp {stock.avgCost.toLocaleString("id-ID")}/{stock.baseUom}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Value</p>
                            <p className="text-sm font-bold text-primary">Rp {stock.totalValue.toLocaleString("id-ID")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stock Ledger */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Stock Ledger (Kartu Stok)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Ref. Doc</TableHead>
                                <TableHead className="text-right">Qty Change</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead>Note</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stockLedgerEntries.map((entry) => {
                                const txType = txTypeLabels[entry.transactionType];
                                const Icon = txType.icon;
                                return (
                                    <TableRow key={entry.id}>
                                        <TableCell className="text-sm">{entry.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${txType.color} text-xs gap-1`}>
                                                <Icon className="h-3 w-3" />
                                                {txType.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm font-mono">{entry.refDoc}</TableCell>
                                        <TableCell className={`text-right font-bold text-sm ${entry.qtyChange > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                            {entry.qtyChange > 0 ? "+" : ""}
                                            {entry.qtyChange.toLocaleString()} {entry.uom}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-sm">
                                            {entry.balanceAfter.toLocaleString()} {entry.uom}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                                            {entry.note}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
