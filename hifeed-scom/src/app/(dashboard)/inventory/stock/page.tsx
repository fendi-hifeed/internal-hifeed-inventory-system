"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Package, Eye, TrendingUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stockItems } from "@/data/mock-data";
import { useState } from "react";

export default function StockPage() {
    const [search, setSearch] = useState("");

    const filtered = stockItems.filter(
        (s) =>
            s.productName.toLowerCase().includes(search.toLowerCase()) ||
            s.skuCode.toLowerCase().includes(search.toLowerCase())
    );

    const totalValue = stockItems.reduce((s, i) => s + i.totalValue, 0);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                            <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total SKU</p>
                            <p className="text-xl font-bold">{stockItems.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Total Inventory Value
                            </p>
                            <p className="text-xl font-bold">
                                Rp {(totalValue / 1000000).toFixed(0)}M
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <ArrowUpDown className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Last Movement</p>
                            <p className="text-xl font-bold">Today</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search product or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-card border-0 shadow-sm"
                />
            </div>

            {/* Stock Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-semibold">SKU</TableHead>
                            <TableHead className="font-semibold">Product</TableHead>
                            <TableHead className="font-semibold text-right">Stock</TableHead>
                            <TableHead className="font-semibold">UoM</TableHead>
                            <TableHead className="font-semibold text-right">Avg Cost</TableHead>
                            <TableHead className="font-semibold text-right">Total Value</TableHead>
                            <TableHead className="font-semibold">Location</TableHead>
                            <TableHead className="font-semibold text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((stock) => (
                            <TableRow key={stock.id} className="hover:bg-muted/20">
                                <TableCell>
                                    <Badge variant="outline" className="font-mono text-xs">
                                        {stock.skuCode}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium text-sm">
                                    {stock.productName}
                                </TableCell>
                                <TableCell className="text-right font-bold text-sm">
                                    {stock.currentQty.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-sm">{stock.baseUom}</TableCell>
                                <TableCell className="text-right text-sm">
                                    Rp {stock.avgCost.toLocaleString("id-ID")}
                                </TableCell>
                                <TableCell className="text-right font-medium text-sm">
                                    Rp {stock.totalValue.toLocaleString("id-ID")}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {stock.location}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Link href={`/inventory/stock/${stock.id}`}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
