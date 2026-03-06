"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { roleBadgeColors, roleLabels } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/procurement/po": "Purchase Orders",
    "/procurement/po/create": "Create Purchase Order",
    "/procurement/grn": "Goods Receipt Notes",
    "/procurement/grn/create": "Create Goods Receipt",
    "/farm/batches": "Farm Batches",
    "/farm/daily-log": "Daily Log",
    "/farm/harvest": "Harvest Input",
    "/inventory/stock": "Stock Overview",
    "/inventory/opname": "Stock Opname",
    "/production/plan": "Production Plan",
    "/production/result": "Production Result",
    "/logistics/trips": "Delivery Trips",
    "/logistics/trips/create": "Create Trip",
    "/logistics/pod": "Upload POD",
    "/traceability": "Supply Chain Traceability",
    "/traceability/batch": "Batch Tracking",
};

function getPageTitle(pathname: string): string {
    if (pageTitles[pathname]) return pageTitles[pathname];
    // Dynamic routes
    if (pathname.startsWith("/procurement/po/")) return "Purchase Order Detail";
    if (pathname.startsWith("/farm/batches/")) return "Batch Detail";
    if (pathname.startsWith("/inventory/stock/")) return "Stock Card";
    return "HiFeed SCOM";
}

export function Header() {
    const pathname = usePathname();
    const { user } = useAuth();
    const title = getPageTitle(pathname);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6 lg:px-8">
            {/* Title */}
            <div className="flex-1 pl-12 lg:pl-0">
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center relative w-64">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search..."
                    className="pl-9 bg-muted/50 border-0 h-9 text-sm focus-visible:ring-1"
                />
            </div>

            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <Bell className="h-4.5 w-4.5 text-muted-foreground" />
                <Badge className="absolute -top-0.5 -right-0.5 h-4.5 min-w-[18px] rounded-full px-1 text-[10px] font-bold bg-destructive text-white border-2 border-background">
                    3
                </Badge>
            </button>

            {/* User Info (Desktop) */}
            {user && (
                <div className="hidden lg:flex items-center gap-2.5 pl-2 border-l border-border ml-1">
                    <div className="pl-3 flex items-center gap-2.5">
                        <div
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-md",
                                "bg-indigo-500"
                            )}
                        >
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold leading-tight">
                                {user.name}
                            </span>
                            <span
                                className={cn(
                                    "text-[10px] font-medium leading-tight mt-0.5",
                                    roleBadgeColors[user.role]
                                        .split(" ")
                                        .find((c) => c.startsWith("text-"))
                                )}
                            >
                                {roleLabels[user.role]}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
