"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Settings,
    Save,
    RotateCcw,
    ShieldCheck,
    Zap,
    DollarSign,
    Clock,
    Globe,
    CheckCircle2,
} from "lucide-react";
import { useState } from "react";

interface SettingGroup {
    id: string;
    title: string;
    icon: typeof Settings;
    settings: SettingItem[];
}

interface SettingItem {
    key: string;
    label: string;
    description: string;
    value: string;
    unit?: string;
    type: "number" | "text" | "percentage";
}

const defaultSettings: SettingGroup[] = [
    {
        id: "approval",
        title: "Approval Rules",
        icon: ShieldCheck,
        settings: [
            {
                key: "po_threshold",
                label: "PO Approval Threshold",
                description: "PO di atas nilai ini memerlukan 2-layer approval (Finance + Owner)",
                value: "50000000",
                unit: "Rp",
                type: "number",
            },
            {
                key: "grn_auto_approve",
                label: "GRN Auto-Approve Max",
                description: "GRN di bawah nilai ini otomatis approved tanpa review",
                value: "5000000",
                unit: "Rp",
                type: "number",
            },
        ],
    },
    {
        id: "electricity",
        title: "Tarif Listrik & Utilitas",
        icon: Zap,
        settings: [
            {
                key: "pln_rate",
                label: "Tarif PLN per KWH",
                description: "Tarif listrik PLN industri untuk kalkulasi biaya mesin produksi",
                value: "1445",
                unit: "Rp/KWH",
                type: "number",
            },
            {
                key: "hp_to_kw",
                label: "Konversi HP → KW",
                description: "Faktor konversi Horse Power ke KiloWatt",
                value: "0.746",
                unit: "×",
                type: "number",
            },
            {
                key: "water_rate",
                label: "Tarif Air per m³",
                description: "Tarif air PDAM untuk kalkulasi biaya produksi",
                value: "5000",
                unit: "Rp/m³",
                type: "number",
            },
        ],
    },
    {
        id: "tax",
        title: "Pajak & Regulasi",
        icon: DollarSign,
        settings: [
            {
                key: "ppn_rate",
                label: "PPN Rate",
                description: "Tarif Pajak Pertambahan Nilai — otomatis dihitung di PO",
                value: "11",
                unit: "%",
                type: "percentage",
            },
            {
                key: "pph_rate",
                label: "PPH 23 Rate",
                description: "Pajak penghasilan pasal 23 untuk jasa",
                value: "2",
                unit: "%",
                type: "percentage",
            },
        ],
    },
    {
        id: "sso",
        title: "Google SSO & Security",
        icon: Globe,
        settings: [
            {
                key: "allowed_domain",
                label: "Allowed Email Domain",
                description: "Hanya email dari domain ini yang boleh login via Google SSO",
                value: "hifeed.co",
                unit: "@",
                type: "text",
            },
            {
                key: "session_timeout",
                label: "Session Timeout",
                description: "Durasi sesi login sebelum auto-logout",
                value: "480",
                unit: "menit",
                type: "number",
            },
        ],
    },
    {
        id: "production",
        title: "Produksi",
        icon: Clock,
        settings: [
            {
                key: "batch_prefix",
                label: "Batch Number Prefix",
                description: "Prefix untuk nomor batch produksi (e.g. PROD-2026-XXXX)",
                value: "PROD",
                unit: "",
                type: "text",
            },
            {
                key: "stock_alert_threshold",
                label: "Stock Alert Threshold",
                description: "Notifikasi jika stok bahan baku di bawah nilai ini",
                value: "500",
                unit: "KG",
                type: "number",
            },
        ],
    },
];

export default function SystemSettingsPage() {
    const [settings, setSettings] = useState<SettingGroup[]>(defaultSettings);
    const [saved, setSaved] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const updateSetting = (groupId: string, key: string, newValue: string) => {
        setSettings((prev) =>
            prev.map((g) =>
                g.id === groupId
                    ? {
                        ...g,
                        settings: g.settings.map((s) =>
                            s.key === key ? { ...s, value: newValue } : s
                        ),
                    }
                    : g
            )
        );
        setHasChanges(true);
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setHasChanges(false);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        setSettings(defaultSettings);
        setHasChanges(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Konfigurasi parameter sistem yang digunakan oleh seluruh modul.
                </p>
                <div className="flex items-center gap-2">
                    {saved && (
                        <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Saved!
                        </Badge>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="gap-1 cursor-pointer"
                        disabled={!hasChanges}
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        className="gap-1 cursor-pointer"
                        disabled={!hasChanges}
                    >
                        <Save className="h-3.5 w-3.5" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {settings.map((group) => {
                const GroupIcon = group.icon;
                return (
                    <Card key={group.id} className="border-0 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <GroupIcon className="h-4 w-4 text-primary" />
                                {group.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {group.settings.map((setting, idx) => (
                                <div key={setting.key}>
                                    {idx > 0 && <Separator className="mb-4" />}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex-1">
                                            <Label className="text-sm font-semibold">
                                                {setting.label}
                                            </Label>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {setting.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 sm:w-56">
                                            {setting.unit && setting.type !== "text" && (
                                                <span className="text-xs text-muted-foreground font-medium min-w-[40px]">
                                                    {setting.unit}
                                                </span>
                                            )}
                                            <Input
                                                type={setting.type === "text" ? "text" : "number"}
                                                value={setting.value}
                                                onChange={(e) =>
                                                    updateSetting(group.id, setting.key, e.target.value)
                                                }
                                                className="h-9 text-right font-mono"
                                            />
                                            {setting.type === "percentage" && (
                                                <span className="text-sm font-bold text-muted-foreground">
                                                    %
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                );
            })}

            {/* Info */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Settings className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground text-sm">
                                Tentang System Settings
                            </p>
                            <p>• Perubahan di sini akan mempengaruhi <strong>seluruh modul</strong> yang menggunakan parameter tersebut</p>
                            <p>• Contoh: mengubah PPN rate akan otomatis update kalkulasi di PO baru</p>
                            <p>• Semua perubahan dicatat di <strong>Audit Log</strong></p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
