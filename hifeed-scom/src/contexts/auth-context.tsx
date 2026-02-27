"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type MockUser, roleAccessMatrix } from "@/data/mock-data";

export type AccessKey = "dashboard" | "procurement" | "farm" | "inventory" | "production" | "logistics" | "traceability";

interface AuthContextType {
    user: MockUser | null;
    login: (user: MockUser) => void;
    logout: () => void;
    hasAccess: (module: AccessKey) => boolean;
    getAccess: () => AccessKey[] | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<MockUser | null>(null);

    // Hydrate from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("scom_user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem("scom_user");
            }
        }
    }, []);

    const login = (u: MockUser) => {
        setUser(u);
        localStorage.setItem("scom_user", JSON.stringify(u));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("scom_user");
    };

    const hasAccess = (module: AccessKey): boolean => {
        if (!user) return false;
        const accessArr = roleAccessMatrix[user.role] as AccessKey[];
        return accessArr?.includes(module) ?? false;
    };

    const getAccess = (): AccessKey[] | null => {
        if (!user) return null;
        return (roleAccessMatrix[user.role] as AccessKey[]) ?? null;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasAccess, getAccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (ctx === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
