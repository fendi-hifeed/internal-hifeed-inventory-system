"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Tag,
    Lock,
    Eye,
    EyeOff,
    AlertTriangle,
    CheckCircle2,
    Package,
} from "lucide-react";
import {
    products,
    type Product,
    type ProductCluster,
} from "@/data/mock-data";
import { useState } from "react";

// Category + cluster options
const categories = ["Raw Material", "Medicine", "Finished Goods", "Packaging", "Seed"] as const;
const clusters: { value: ProductCluster; label: string }[] = [
    { value: "RAW_MATERIAL", label: "Raw Material" },
    { value: "ADDITIVE", label: "Additive" },
    { value: "FINISHED_GOOD", label: "Finished Good" },
    { value: "TRADING_GOOD", label: "Trading Good" },
];

const clusterColors: Record<string, string> = {
    RAW_MATERIAL: "bg-amber-100 text-amber-700",
    ADDITIVE: "bg-violet-100 text-violet-700",
    FINISHED_GOOD: "bg-emerald-100 text-emerald-700",
    TRADING_GOOD: "bg-sky-100 text-sky-700",
};

const categoryColors: Record<string, string> = {
    "Raw Material": "bg-amber-50 text-amber-700 border-amber-200",
    Medicine: "bg-violet-50 text-violet-700 border-violet-200",
    "Finished Goods": "bg-emerald-50 text-emerald-700 border-emerald-200",
    Packaging: "bg-sky-50 text-sky-700 border-sky-200",
    Seed: "bg-lime-50 text-lime-700 border-lime-200",
};

// Prefix rules from the kodifikasi system
const PREFIX_RULES = [
    { prefix: "DM_CP", meaning: "Dry Matter — Crude Protein", category: "Raw Material" },
    { prefix: "DM_CF", meaning: "Dry Matter — Crude Fiber", category: "Raw Material" },
    { prefix: "DM_GE", meaning: "Dry Matter — Gross Energy", category: "Raw Material" },
    { prefix: "DM_FA", meaning: "Dry Matter — Feed Additive", category: "Raw Material" },
    { prefix: "ADD_", meaning: "Additive", category: "Medicine" },
    { prefix: "FG_", meaning: "Finished Goods", category: "Finished Goods" },
    { prefix: "PKG_", meaning: "Packaging / Trading", category: "Packaging" },
];

export default function KodifikasiPage() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [clusterFilter, setClusterFilter] = useState("ALL");
    const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
    const [productList, setProductList] = useState<Product[]>([...products]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Product>>({});

    // Simulate adding a product without mapping
    const [showMappingError, setShowMappingError] = useState(false);
    const [unmappedCode, setUnmappedCode] = useState("");

    const filtered = productList.filter((p) => {
        const matchSearch =
            p.internalCode.toLowerCase().includes(search.toLowerCase()) ||
            p.displayName.toLowerCase().includes(search.toLowerCase()) ||
            p.externalCode.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            categoryFilter === "ALL" || p.category === categoryFilter;
        const matchCluster =
            clusterFilter === "ALL" || p.cluster === clusterFilter;
        return matchSearch && matchCategory && matchCluster;
    });

    const toggleSecret = (id: string) =>
        setShowSecret((prev) => ({ ...prev, [id]: !prev[id] }));

    const startEdit = (p: Product) => {
        setEditingId(p.id);
        setEditForm({
            internalCode: p.internalCode,
            externalCode: p.externalCode,
            displayName: p.displayName,
            secretName: p.secretName,
        });
    };

    const saveEdit = (id: string) => {
        setProductList((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, ...editForm } : p
            )
        );
        setEditingId(null);
        setEditForm({});
    };

    const simulateUnmappedAdd = () => {
        setUnmappedCode("DM_NEW_X1");
        setShowMappingError(true);
    };

    // Stats
    const rawCount = productList.filter((p) => p.category === "Raw Material").length;
    const fgCount = productList.filter((p) => p.category === "Finished Goods").length;
    const pkgCount = productList.filter((p) => p.category === "Packaging").length;

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Kelola kodifikasi nama produk internal, eksternal, dan rahasia. Produk baru harus di-mapping di sini sebelum bisa dipakai di modul lain.
            </p>

            {/* Mapping Error Alert (simulation) */}
            {showMappingError && (
                <Card className="border-0 shadow-sm bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-l-4 border-l-red-500">
                    <CardContent className="p-4 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                                ❌ Gagal menambahkan produk: Kodifikasi belum terdaftar
                            </p>
                            <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-1">
                                Kode <code className="bg-red-100 px-1.5 py-0.5 rounded text-red-800 font-mono font-bold">{unmappedCode}</code> belum ada mapping di IT Admin.
                                Hubungi IT Ops untuk menambahkan kodifikasi terlebih dahulu di halaman ini.
                            </p>
                            <p className="text-[11px] text-red-600 mt-2">
                                Modul lain tidak bisa menambah produk jika belum di-mapping oleh IT Admin → Product Kodifikasi.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                            onClick={() => setShowMappingError(false)}
                        >
                            Dismiss
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-2xl font-bold">{productList.length}</p>
                        <p className="text-xs text-muted-foreground">Total Products</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-amber-600">{rawCount}</p>
                        <p className="text-xs text-muted-foreground">Raw Material</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-emerald-600">{fgCount}</p>
                        <p className="text-xs text-muted-foreground">Finished Goods</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-sky-600">{pkgCount}</p>
                        <p className="text-xs text-muted-foreground">Packaging</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-violet-600">{PREFIX_RULES.length}</p>
                        <p className="text-xs text-muted-foreground">Prefix Rules</p>
                    </CardContent>
                </Card>
            </div>

            {/* Prefix Rules Reference */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        Aturan Prefix Kodifikasi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {PREFIX_RULES.map((rule) => (
                            <div
                                key={rule.prefix}
                                className="rounded-lg border border-border/50 p-3 bg-muted/10"
                            >
                                <code className="text-sm font-bold text-primary">
                                    {rule.prefix}*
                                </code>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                    {rule.meaning}
                                </p>
                                <Badge
                                    variant="outline"
                                    className={`text-[9px] mt-1 ${categoryColors[rule.category] || ""}`}
                                >
                                    {rule.category}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search kode, nama, atau deskripsi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-0"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-40 bg-muted/30 border-0">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Categories</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={clusterFilter} onValueChange={setClusterFilter}>
                            <SelectTrigger className="w-full sm:w-40 bg-muted/30 border-0">
                                <SelectValue placeholder="Cluster" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Clusters</SelectItem>
                                {clusters.map((c) => (
                                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button className="gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Add Mapping
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 cursor-pointer text-red-600 border-red-200 hover:bg-red-50"
                            onClick={simulateUnmappedAdd}
                        >
                            <AlertTriangle className="h-4 w-4" />
                            Simulate Unmapped
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-semibold">Internal Code</TableHead>
                            <TableHead className="font-semibold">Display Name</TableHead>
                            <TableHead className="font-semibold">External Code</TableHead>
                            <TableHead className="font-semibold">
                                <div className="flex items-center gap-1">
                                    <Lock className="h-3 w-3" />
                                    Secret Name
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold">Category</TableHead>
                            <TableHead className="font-semibold">Cluster</TableHead>
                            <TableHead className="font-semibold">UoM</TableHead>
                            <TableHead className="font-semibold text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((p) => {
                            const isEditing = editingId === p.id;
                            const isSecretVisible = showSecret[p.id];

                            return (
                                <TableRow key={p.id} className="hover:bg-muted/20 transition-colors">
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                value={editForm.internalCode || ""}
                                                onChange={(e) => setEditForm({ ...editForm, internalCode: e.target.value })}
                                                className="h-8 w-32 font-mono text-xs"
                                            />
                                        ) : (
                                            <code className="text-sm font-bold text-primary font-mono">
                                                {p.internalCode}
                                            </code>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                value={editForm.displayName || ""}
                                                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                                                className="h-8 w-48 text-xs"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium">{p.displayName}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                value={editForm.externalCode || ""}
                                                onChange={(e) => setEditForm({ ...editForm, externalCode: e.target.value })}
                                                className="h-8 w-48 text-xs"
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground max-w-[200px] truncate block">
                                                {p.externalCode}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {isEditing ? (
                                                <Input
                                                    value={editForm.secretName || ""}
                                                    onChange={(e) => setEditForm({ ...editForm, secretName: e.target.value })}
                                                    className="h-8 w-36 text-xs"
                                                />
                                            ) : isSecretVisible ? (
                                                <span className="text-sm text-red-600 font-medium">
                                                    {p.secretName}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    ••••••••
                                                </span>
                                            )}
                                            {!isEditing && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 cursor-pointer"
                                                    onClick={() => toggleSecret(p.id)}
                                                >
                                                    {isSecretVisible ? (
                                                        <EyeOff className="h-3 w-3" />
                                                    ) : (
                                                        <Eye className="h-3 w-3" />
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] ${categoryColors[p.category] || ""}`}
                                        >
                                            {p.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`text-[10px] ${clusterColors[p.cluster] || ""}`}
                                        >
                                            {p.cluster}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono">
                                        {p.defaultUom}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="h-7 text-[10px] gap-1 cursor-pointer"
                                                        onClick={() => saveEdit(p.id)}
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-[10px] cursor-pointer"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 cursor-pointer"
                                                        onClick={() => startEdit(p)}
                                                        title="Edit Kodifikasi"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 cursor-pointer"
                                                        title="Remove Mapping"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* Info */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Lock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">
                                Aturan Kodifikasi Produk
                            </p>
                            <p>
                                • <strong>Internal Code</strong> — Kode yang dipakai di seluruh sistem (contoh: DM_CPTN1)
                            </p>
                            <p>
                                • <strong>External Code</strong> — Deskripsi nutrisi publik, untuk laporan ke investor/pihak luar
                            </p>
                            <p>
                                • <strong>Secret Name</strong> — Nama asli bahan baku, <span className="text-red-500 font-semibold">RAHASIA</span> dan tidak ditampilkan di UI operasional
                            </p>
                            <p>
                                • Produk baru di modul lain akan <strong>GAGAL</strong> jika kodifikasi belum di-mapping oleh IT Admin
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
