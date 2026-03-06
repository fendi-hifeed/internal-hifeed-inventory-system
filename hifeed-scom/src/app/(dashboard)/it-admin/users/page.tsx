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
    Users,
    Search,
    UserPlus,
    Shield,
    Mail,
    CheckCircle2,
    XCircle,
    Edit,
} from "lucide-react";
import {
    mockUsers,
    roleLabels,
    roleBadgeColors,
    roleAccessMatrix,
    type UserRole,
} from "@/data/mock-data";
import { useState } from "react";

// Simulated user management data (extends mockUsers with active/inactive status)
const managedUsers = mockUsers.map((u) => ({
    ...u,
    isActive: true,
    lastLogin: "2026-03-06",
    domain: u.email.split("@")[1],
}));

// Add an example deactivated user
managedUsers.push({
    id: "u_ex",
    name: "Bambang (Resigned)",
    email: "bambang@hifeed.co",
    role: "OPERATOR" as UserRole,
    isActive: false,
    lastLogin: "2025-11-20",
    domain: "hifeed.co",
});

const allRoles: UserRole[] = [
    "OWNER",
    "FARM_MANAGER",
    "LOGISTICS",
    "FINANCE",
    "OPERATOR",
    "RND",
    "IT_OPS",
];

export default function UserManagementPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [users, setUsers] = useState(managedUsers);

    const filtered = users.filter((u) => {
        const matchSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "ALL" || u.role === roleFilter;
        const matchStatus =
            statusFilter === "ALL" ||
            (statusFilter === "ACTIVE" && u.isActive) ||
            (statusFilter === "INACTIVE" && !u.isActive);
        return matchSearch && matchRole && matchStatus;
    });

    const activeCount = users.filter((u) => u.isActive).length;
    const inactiveCount = users.filter((u) => !u.isActive).length;
    const roleDistribution = allRoles.map((r) => ({
        role: r,
        count: users.filter((u) => u.role === r && u.isActive).length,
    }));

    const handleToggleActive = (userId: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, isActive: !u.isActive } : u
            )
        );
    };

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === userId ? { ...u, role: newRole } : u
            )
        );
        setEditingUserId(null);
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Assign email ke role, aktivasi/deaktivasi user. Login via Google SSO.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                        <p className="text-2xl font-bold">{users.length}</p>
                        <p className="text-xs text-muted-foreground">
                            Total Users
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                        <p className="text-2xl font-bold text-emerald-600">
                            {activeCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Active</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <XCircle className="h-5 w-5 mx-auto mb-1 text-red-400" />
                        <p className="text-2xl font-bold text-red-500">
                            {inactiveCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Inactive
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <Shield className="h-5 w-5 mx-auto mb-1 text-violet-500" />
                        <p className="text-2xl font-bold text-violet-600">
                            {allRoles.length}
                        </p>
                        <p className="text-xs text-muted-foreground">Roles</p>
                    </CardContent>
                </Card>
            </div>

            {/* Role Distribution */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                        Role Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {roleDistribution.map(({ role, count }) => (
                            <div
                                key={role}
                                className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2"
                            >
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] ${roleBadgeColors[role]}`}
                                >
                                    {roleLabels[role]}
                                </Badge>
                                <span className="text-sm font-bold">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters + Add User */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-muted/30 border-0"
                            />
                        </div>
                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="w-full sm:w-44 bg-muted/30 border-0">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roles</SelectItem>
                                {allRoles.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {roleLabels[r]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full sm:w-32 bg-muted/30 border-0">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="gap-2 cursor-pointer">
                            <UserPlus className="h-4 w-4" />
                            Add User
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-semibold">
                                User
                            </TableHead>
                            <TableHead className="font-semibold">
                                Email (Google SSO)
                            </TableHead>
                            <TableHead className="font-semibold">
                                Role
                            </TableHead>
                            <TableHead className="font-semibold">
                                Module Access
                            </TableHead>
                            <TableHead className="font-semibold">
                                Status
                            </TableHead>
                            <TableHead className="font-semibold">
                                Last Login
                            </TableHead>
                            <TableHead className="font-semibold text-center">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((u) => {
                            const access =
                                roleAccessMatrix[u.role].filter(
                                    (a) => a !== "dashboard" && a !== "it_admin"
                                );
                            const isEditing = editingUserId === u.id;

                            return (
                                <TableRow
                                    key={u.id}
                                    className={`hover:bg-muted/20 transition-colors ${!u.isActive ? "opacity-50" : ""}`}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                                {u.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-sm">
                                                {u.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            {u.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {isEditing ? (
                                            <Select
                                                value={u.role}
                                                onValueChange={(v) =>
                                                    handleRoleChange(
                                                        u.id,
                                                        v as UserRole
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-8 w-36">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allRoles.map((r) => (
                                                        <SelectItem
                                                            key={r}
                                                            value={r}
                                                        >
                                                            {roleLabels[r]}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] ${roleBadgeColors[u.role]}`}
                                            >
                                                {roleLabels[u.role]}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {access.map((a) => (
                                                <span
                                                    key={a}
                                                    className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                                >
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] ${u.isActive
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : "bg-red-50 text-red-600 border-red-200"
                                                }`}
                                        >
                                            {u.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {u.lastLogin}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 cursor-pointer"
                                                onClick={() =>
                                                    setEditingUserId(
                                                        isEditing
                                                            ? null
                                                            : u.id
                                                    )
                                                }
                                                title="Change Role"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-7 text-[10px] px-2 cursor-pointer ${u.isActive
                                                        ? "text-red-600 hover:bg-red-50"
                                                        : "text-emerald-600 hover:bg-emerald-50"
                                                    }`}
                                                onClick={() =>
                                                    handleToggleActive(u.id)
                                                }
                                            >
                                                {u.isActive
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* SSO Info */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">
                                Google SSO Authentication
                            </p>
                            <p>
                                • User login menggunakan Google account — tidak ada password management
                            </p>
                            <p>
                                • IT Ops mengatur <strong>email mana → masuk role apa</strong>
                            </p>
                            <p>
                                • Hanya email dengan domain <strong>@hifeed.co</strong> yang diizinkan
                            </p>
                            <p>
                                • User yang di-deactivate tidak bisa login meskipun punya Google account
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
