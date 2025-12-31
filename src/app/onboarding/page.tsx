"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/lib/store/userStore";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useUserStore();

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                onboardingCompleted: true,
                displayName: name,
                createdAt: new Date(),
                preferences: {
                    theme: "system",
                },
                // We can add more fields here later (goals, lifestyle)
            });
            // Update local store? AuthProvider should fetch it on next reload or we can force update.
            router.push("/dashboard");
        } catch (error) {
            console.error("Onboarding error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-lg glass-card">
                <CardHeader>
                    <CardTitle>Welcome to SelfOS</CardTitle>
                    <CardDescription>Let's set up your profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="onboarding-form" onSubmit={handleComplete} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">What should we call you?</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        {/* Future: Add steps for Goals, Sleep patterns, etc. */}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" form="onboarding-form" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Initialize Kernel
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
