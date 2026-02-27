"use client";

import { useRouter } from "next/navigation";
import { Leaf, ArrowRight, Users, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
    mockUsers,
    roleLabels,
    roleBadgeColors,
    roleAccessMatrix,
    type MockUser,
} from "@/data/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Which modules each role can see — for display
const moduleIcons: Record<string, string> = {
    dashboard: "📊",
    procurement: "🛒",
    farm: "🌾",
    inventory: "📦",
    production: "🏭",
    logistics: "🚚",
};

const moduleNames: Record<string, string> = {
    dashboard: "Dashboard",
    procurement: "Procurement",
    farm: "Farm",
    inventory: "Inventory",
    production: "Production",
    logistics: "Logistics",
};

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [showPicker, setShowPicker] = useState(false);
    const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

    const handleGoogleClick = () => {
        setShowPicker(true);
    };

    const handleSelectUser = (user: MockUser) => {
        setSelectedUser(user);
    };

    const handleLogin = () => {
        if (!selectedUser) return;
        login(selectedUser);
        // Redirect to first accessible module
        const access = roleAccessMatrix[selectedUser.role];
        if (access.includes("dashboard")) {
            router.push("/dashboard");
        } else if (access.includes("inventory")) {
            router.push("/inventory/stock");
        } else if (access.includes("logistics")) {
            router.push("/logistics/trips");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            {/* Animated Background Elements */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl animate-pulse [animation-delay:1s]" />
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl animate-pulse [animation-delay:2s]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="relative z-10 mx-4 w-full max-w-md animate-fade-in-up">
                {/* Login Card */}
                {!showPicker ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                        {/* Logo */}
                        <div className="mb-8 flex flex-col items-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 shadow-lg shadow-emerald-500/25">
                                <Leaf className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                Hifeed<span className="text-emerald-400">.co</span>
                            </h1>
                            <p className="mt-1 text-sm text-white/50">
                                Supply Chain & Operations Management
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-xs font-medium text-white/30 uppercase tracking-wider">
                                Sign in to continue
                            </span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Google Sign In Button */}
                        <Button
                            onClick={handleGoogleClick}
                            className="w-full h-12 rounded-xl bg-white text-slate-900 hover:bg-white/90 font-semibold text-sm shadow-lg shadow-white/10 transition-all duration-200 hover:shadow-xl hover:shadow-white/20 cursor-pointer"
                        >
                            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                            <ArrowRight className="ml-auto h-4 w-4" />
                        </Button>

                        <p className="mt-4 text-center text-xs text-white/30">
                            Restricted to{" "}
                            <span className="text-emerald-400/60 font-medium">
                                @hifeed.co
                            </span>{" "}
                            domain
                        </p>
                    </div>
                ) : (
                    /* Account / Role Picker */
                    <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl overflow-hidden">
                        {/* Header */}
                        <div className="p-6 pb-4 border-b border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-white">
                                        Choose Account
                                    </h2>
                                    <p className="text-xs text-white/40 mt-0.5">
                                        Demo mode — scroll to explore all roles
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* User List */}
                        <div className="relative">
                            <div className="p-3 max-h-[420px] overflow-y-auto custom-scrollbar">
                                <div className="space-y-1.5 pb-4">
                                    {mockUsers.map((user) => {
                                        const access = roleAccessMatrix[user.role];
                                        const accessibleModules = Object.entries(access)
                                            .filter(([, v]) => v)
                                            .map(([k]) => k);
                                        const isSelected = selectedUser?.id === user.id;

                                        return (
                                            <button
                                                key={user.id}
                                                onClick={() => handleSelectUser(user)}
                                                className={cn(
                                                    "w-full rounded-xl p-3 text-left transition-all duration-200 group",
                                                    isSelected
                                                        ? "bg-primary/15 border border-primary/40 ring-1 ring-primary/20"
                                                        : "hover:bg-white/5 border border-transparent"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar */}
                                                    <div
                                                        className={cn(
                                                            "flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shrink-0 shadow-lg",
                                                            "bg-indigo-500"
                                                        )}
                                                    >
                                                        {user.name.charAt(0)}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-white truncate">
                                                                {user.name}
                                                            </span>
                                                            {isSelected && (
                                                                <Check className="h-4 w-4 text-primary shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-white/40 truncate">
                                                            {user.email}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <span
                                                                className={cn(
                                                                    "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                                                                    roleBadgeColors[user.role]
                                                                )}
                                                            >
                                                                <Shield className="h-2.5 w-2.5" />
                                                                {roleLabels[user.role]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Access Preview */}
                                                {isSelected && (
                                                    <div className="mt-2.5 ml-[52px] flex flex-wrap gap-1.5">
                                                        {accessibleModules.map((mod) => (
                                                            <span
                                                                key={mod}
                                                                className="inline-flex items-center gap-1 rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/60"
                                                            >
                                                                <span>{moduleIcons[mod]}</span>
                                                                {moduleNames[mod]}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Scroll hint gradient */}
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1b1e36] to-transparent" />
                        </div>

                        {/* Login Button */}
                        <div className="p-4 border-t border-white/10 relative z-10 bg-white/5">
                            <Button
                                onClick={handleLogin}
                                disabled={!selectedUser}
                                className="w-full h-11 rounded-xl font-semibold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {selectedUser ? (
                                    <>
                                        Continue as {selectedUser.name}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                ) : (
                                    "Select an account"
                                )}
                            </Button>
                            <button
                                onClick={() => {
                                    setShowPicker(false);
                                    setSelectedUser(null);
                                }}
                                className="w-full mt-2 text-xs text-white/30 hover:text-white/50 transition-colors py-1"
                            >
                                ← Back to login
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-white/20">
                    © 2026 Hifeed.co — All rights reserved
                </p>
            </div>
        </div>
    );
}
