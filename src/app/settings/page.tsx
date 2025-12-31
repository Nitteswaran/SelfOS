"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Palette, Loader2 } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { auth, db, isConfigured } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function SettingsPage() {
    const { user, userData, loading, setUserData } = useUserStore();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [productNotifications, setProductNotifications] = useState(true);
    const [notifSaving, setNotifSaving] = useState(false);
    const [notifMessage, setNotifMessage] = useState<string | null>(null);
    const [notifError, setNotifError] = useState<string | null>(null);
    const [securityMessage, setSecurityMessage] = useState<string | null>(null);
    const [securityError, setSecurityError] = useState<string | null>(null);

    type UserPreferences = {
        preferences?: {
            notifications?: {
                email?: boolean;
                product?: boolean;
            };
            theme?: "dark" | "light";
        };
    };

    useEffect(() => {
        if (!user) return;

        const displayName =
            (typeof userData?.displayName === "string" && userData.displayName) ||
            user.displayName ||
            "";
        setName(displayName);
        setEmail(user.email || "");

        const prefs = (userData as UserPreferences | null)?.preferences;
        if (prefs) {
            const notif = prefs.notifications;
            if (notif) {
                if (typeof notif.email === "boolean") {
                    setEmailNotifications(notif.email);
                }
                if (typeof notif.product === "boolean") {
                    setProductNotifications(notif.product);
                }
            }
            if (prefs.theme === "dark" || prefs.theme === "light") {
                setTheme(prefs.theme);
            }
        }
    }, [user, userData]);

    // Initialise theme from localStorage or system preference
    useEffect(() => {
        if (typeof window === "undefined") return;
        let initial: "dark" | "light" = "dark";
        const stored = window.localStorage.getItem("selfos-theme");
        if (stored === "dark" || stored === "light") {
            initial = stored;
        } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            initial = "dark";
        } else {
            initial = "light";
        }
        setTheme(initial);
        if (typeof document !== "undefined") {
            const root = document.documentElement;
            if (initial === "dark") root.classList.add("dark");
            else root.classList.remove("dark");
        }
    }, []);

    const applyTheme = (mode: "dark" | "light") => {
        setTheme(mode);
        if (typeof document !== "undefined") {
            const root = document.documentElement;
            if (mode === "dark") root.classList.add("dark");
            else root.classList.remove("dark");
        }
        if (typeof window !== "undefined") {
            window.localStorage.setItem("selfos-theme", mode);
        }
        // Also persist theme preference for the user if possible
        if (user && isConfigured) {
            const ref = doc(db, "users", user.uid);
            setDoc(
                ref,
                {
                    preferences: {
                        theme: mode,
                    },
                },
                { merge: true },
            ).catch((err) => {
                console.error("Error persisting theme preference:", err);
            });
        }
    };

    const handleSave = async () => {
        setMessage(null);
        setError(null);

        if (!isConfigured) {
            setError("Firebase is not configured. Unable to save settings.");
            return;
        }

        if (!user) {
            setError("You must be signed in to update settings.");
            return;
        }

        setSaving(true);
        try {
            // Optimistic update
            setUserData({ ...userData, displayName: name });

            const ref = doc(db, "users", user.uid);
            // Upsert minimal profile fields
            await setDoc(
                ref,
                {
                    displayName: name,
                    email: email || user.email,
                },
                { merge: true },
            );
            setMessage("Profile updated.");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
            // Revert changes if needed, but for now we keep it simple as failure is rare
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setNotifMessage(null);
        setNotifError(null);

        if (!isConfigured) {
            setNotifError("Firebase is not configured. Unable to save notification settings.");
            return;
        }

        if (!user) {
            setNotifError("You must be signed in to update notifications.");
            return;
        }

        setNotifSaving(true);
        try {
            const ref = doc(db, "users", user.uid);
            await setDoc(
                ref,
                {
                    preferences: {
                        notifications: {
                            email: emailNotifications,
                            product: productNotifications,
                        },
                    },
                },
                { merge: true },
            );
            setNotifMessage("Notification settings updated.");
        } catch (err) {
            console.error("Error updating notifications:", err);
            setNotifError("Failed to update notifications. Please try again.");
        } finally {
            setNotifSaving(false);
        }
    };

    const handleSignOut = async () => {
        setSecurityMessage(null);
        setSecurityError(null);
        try {
            await signOut(auth);
            setSecurityMessage("Signed out successfully.");
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        } catch (err) {
            console.error("Error signing out:", err);
            setSecurityError("Failed to sign out. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account and system preferences.</p>
            </div>

            {!isConfigured && (
                <div className="bg-yellow-500/10 border border-yellow-500/40 text-yellow-100 text-xs p-2 rounded">
                    Firebase is not fully configured. Some settings may not persist.
                </div>
            )}

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
                    <TabsTrigger value="account" className="data-[state=active]:bg-white/10">
                        <User className="w-4 h-4 mr-2" /> Account
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="data-[state=active]:bg-white/10">
                        <Palette className="w-4 h-4 mr-2" /> Appearance
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10">
                        <Bell className="w-4 h-4 mr-2" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-white/10">
                        <Shield className="w-4 h-4 mr-2" /> Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-4 py-4">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {loading && (
                                <div className="flex items-center text-xs text-muted-foreground gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Loading profile...</span>
                                </div>
                            )}
                            {message && (
                                <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/40 rounded px-2 py-1">
                                    {message}
                                </div>
                            )}
                            {error && (
                                <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded px-2 py-1">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    className="bg-white/5 border-white/10"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!user || saving}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    className="bg-white/5 border-white/10"
                                    value={email}
                                    disabled
                                />
                            </div>
                            <Button onClick={handleSave} disabled={!user || saving}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4 py-4">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle>Theme</CardTitle>
                            <CardDescription>Customize the look and feel of SelfOS.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Dark Mode</Label>
                                    <p className="text-xs text-muted-foreground">Toggle between dark and light appearance.</p>
                                </div>
                                <Switch
                                    checked={theme === "dark"}
                                    onCheckedChange={(checked) => applyTheme(checked ? "dark" : "light")}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Reduced Motion</Label>
                                    <p className="text-xs text-muted-foreground">Minimize animations for performance.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4 py-4">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Control how SelfOS keeps you informed.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {notifMessage && (
                                <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/40 rounded px-2 py-1">
                                    {notifMessage}
                                </div>
                            )}
                            {notifError && (
                                <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded px-2 py-1">
                                    {notifError}
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email notifications</Label>
                                    <p className="text-xs text-muted-foreground">Receive important updates and weekly summaries.</p>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onCheckedChange={(checked) => setEmailNotifications(checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Product updates</Label>
                                    <p className="text-xs text-muted-foreground">Be notified when we ship major new capabilities.</p>
                                </div>
                                <Switch
                                    checked={productNotifications}
                                    onCheckedChange={(checked) => setProductNotifications(checked)}
                                />
                            </div>
                            <Button onClick={handleSaveNotifications} disabled={!user || notifSaving}>
                                {notifSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Notification Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4 py-4">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {securityMessage && (
                                <div className="text-xs text-green-300 bg-green-500/10 border border-green-500/40 rounded px-2 py-1">
                                    {securityMessage}
                                </div>
                            )}
                            {securityError && (
                                <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded px-2 py-1">
                                    {securityError}
                                </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                                Signed in as <span className="font-mono">{email || user?.email || ""}</span>
                            </div>
                            <Button variant="outline" onClick={handleSignOut} disabled={!user}>
                                Sign out
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
