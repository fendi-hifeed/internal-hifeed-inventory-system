"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Eye, FileText } from "lucide-react";
import { purchaseOrders } from "@/data/mock-data";
import { useState } from "react";

const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PARTIAL: "bg-amber-50 text-amber-700 border-amber-200",
    COMPLETED: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function PurchaseOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filtered = purchaseOrders.filter((po) => {
        const matchSearch =
            po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
            po.vendorName.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
            statusFilter === "ALL" || po.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm text-muted-foreground">
                        Manage all purchase orders
                    </h3>
                </div>
                <Link href="/procurement/po/create">
                    <Button className="gap-2 rounded-xl shadow-sm cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Create PO
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search PO number or vendor..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-0"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-40 bg-muted/30 border-0">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="PARTIAL">Partial</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-semibold">PO Number</TableHead>
                            <TableHead className="font-semibold">Vendor</TableHead>
                            <TableHead className="font-semibold">Items</TableHead>
                            <TableHead className="font-semibold text-right">
                                Total
                            </TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold text-center">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((po) => (
                            <TableRow
                                key={po.id}
                                className="hover:bg-muted/20 transition-colors"
                            >
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-primary/60" />
                                        <span className="font-medium text-sm">{po.poNumber}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">{po.vendorName}</TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {po.items.length} item(s)
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-medium text-sm">
                                    Rp {po.totalAmount.toLocaleString("id-ID")}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`${statusColors[po.status]} text-xs font-medium`}
                                    >
                                        {po.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {po.createdAt}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Link href={`/procurement/po/${po.id}`}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 cursor-pointer"
                                        >
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
