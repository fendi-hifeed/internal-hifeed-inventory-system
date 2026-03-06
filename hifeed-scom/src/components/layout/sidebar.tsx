"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    roleLabels,
    roleBadgeColors,
} from "@/data/mock-data";
import {
    LayoutDashboard,
    ShoppingCart,
    Sprout,
    Package,
    Factory,
    Truck,
    GitBranch,
    ChevronDown,
    Leaf,
    Menu,
    X,
    LogOut,
    Shield,
    FlaskConical,
    Settings2,
    Receipt,
} from "lucide-react";
import { useAuth, AccessKey } from "@/contexts/auth-context";

interface NavGroup {
    label: string;
    icon: React.ElementType;
    basePath: string;
    accessKey: AccessKey;
    items: { label: string; href: string }[];
}

const navGroups: NavGroup[] = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        basePath: "/dashboard",
        accessKey: "dashboard",
        items: [
            { label: "Overview", href: "/dashboard" },
            { label: "Supply Chain", href: "/traceability" },
            { label: "Batch Tracking", href: "/traceability/batch" },
        ],
    },
    {
        label: "Procurement",
        icon: ShoppingCart,
        basePath: "/procurement",
        accessKey: "procurement",
        items: [
            { label: "Purchase Orders", href: "/procurement/po" },
            { label: "Goods Receipt", href: "/procurement/grn" },
        ],
    },
    {
        label: "Farm Management",
        icon: Sprout,
        basePath: "/farm",
        accessKey: "farm",
        items: [
            { label: "Lands / Area", href: "/farm/lands" },
            { label: "Batches", href: "/farm/batches" },
            { label: "Daily Log", href: "/farm/daily-log" },
            { label: "Harvest", href: "/farm/harvest" },
        ],
    },
    {
        label: "Inventory",
        icon: Package,
        basePath: "/inventory",
        accessKey: "inventory",
        items: [
            { label: "Stock", href: "/inventory/stock" },
            { label: "Stock Opname", href: "/inventory/opname" },
            { label: "Barang Keluar", href: "/inventory/movement" },
            { label: "Depreciation", href: "/inventory/depreciation" },
        ],
    },
    {
        label: "Production",
        icon: Factory,
        basePath: "/production",
        accessKey: "production",
        items: [
            { label: "Plan", href: "/production/plan" },
            { label: "Result", href: "/production/result" },
            { label: "Barcode / ID Karung", href: "/production/barcode" },
        ],
    },
    {
        label: "R&D",
        icon: FlaskConical,
        basePath: "/rnd",
        accessKey: "rnd",
        items: [
            { label: "Dashboard R&D", href: "/rnd" },
            { label: "Experiments", href: "/rnd/experiments" },
            { label: "Sample Requests", href: "/rnd/samples" },
        ],
    },
    {
        label: "Logistics",
        icon: Truck,
        basePath: "/logistics",
        accessKey: "logistics",
        items: [
            { label: "Trips", href: "/logistics/trips" },
            { label: "Upload POD", href: "/logistics/pod" },
        ],
    },

    {
        label: "Sales / POS",
        icon: Receipt,
        basePath: "/sales",
        accessKey: "sales" as AccessKey,
        items: [
            { label: "Feed Orders", href: "/sales/feed" },
            { label: "Trading", href: "/sales/trading" },
        ],
    },
    {
        label: "IT Admin",
        icon: Settings2,
        basePath: "/it-admin",
        accessKey: "it_admin" as AccessKey,
        items: [
            { label: "User Management", href: "/it-admin/users" },
            { label: "Product Kodifikasi", href: "/it-admin/kodifikasi" },
            { label: "System Settings", href: "/it-admin/settings" },
            { label: "Audit Log", href: "/it-admin/audit" },
            { label: "Data Export", href: "/it-admin/export" },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, hasAccess } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<string[]>(
        navGroups
            .filter((g) => pathname.startsWith(g.basePath))
            .map((g) => g.label)
    );

    const toggleGroup = (label: string) => {
        setExpandedGroups((prev) =>
            prev.includes(label)
                ? prev.filter((l) => l !== label)
                : [...prev, label]
        );
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    // Filter nav groups based on current user role
    const filteredNavGroups = navGroups.filter((group) =>
        hasAccess(group.accessKey)
    );

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 pt-6 pb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg">
                    <Leaf className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white">
                        HiFeed
                    </h1>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sidebar-foreground/50">
                        SCOM
                    </p>
                </div>
            </div>

            {/* Role Badge */}
            {user && (
                <div className="mx-4 mb-4">
                    <div
                        className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2",
                            roleBadgeColors[user.role]
                        )}
                    >
                        <Shield className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs font-semibold truncate">
                            {roleLabels[user.role]}
                        </span>
                    </div>
                </div>
            )}

            {/* Nav Groups */}
            <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
                {filteredNavGroups.map((group) => {
                    const isActive =
                        pathname.startsWith(group.basePath) ||
                        group.items.some((item) => pathname === item.href);
                    const isExpanded =
                        expandedGroups.includes(group.label) || isActive;
                    const Icon = group.icon;

                    return (
                        <div key={group.label}>
                            <button
                                onClick={() => toggleGroup(group.label)}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-sidebar-accent text-white"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                )}
                            >
                                <Icon className="h-4.5 w-4.5 shrink-0" />
                                <span className="flex-1 text-left">{group.label}</span>
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 shrink-0 transition-transform duration-200",
                                        isExpanded && "rotate-180"
                                    )}
                                />
                            </button>

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-200",
                                    isExpanded
                                        ? "max-h-96 opacity-100"
                                        : "max-h-0 opacity-0"
                                )}
                            >
                                <div className="ml-4 space-y-0.5 border-l border-sidebar-border pl-4 pt-1 pb-1">
                                    {group.items.map((item) => {
                                        const itemActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    "block rounded-md px-3 py-2 text-[13px] transition-all duration-150",
                                                    itemActive
                                                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-sm"
                                                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                                )}
                                            >
                                                {item.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* Footer: User + Logout */}
            <div className="border-t border-sidebar-border px-4 py-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shrink-0",
                            "bg-indigo-500"
                        )}
                    >
                        {user?.name.charAt(0) || "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">
                            {user?.name || "Guest"}
                        </p>
                        <p className="text-[11px] text-sidebar-foreground/50 truncate">
                            {user?.email || ""}
                        </p>
                    </div>
                </div>
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-sidebar-foreground/70 hover:bg-destructive/15 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg lg:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-sidebar transition-transform duration-300 lg:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 text-sidebar-foreground/60 hover:text-sidebar-foreground"
                >
                    <X className="h-5 w-5" />
                </button>
                {sidebarContent}
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 bg-sidebar border-r border-sidebar-border shadow-xl">
                {sidebarContent}
            </aside>
        </>
    );
}
