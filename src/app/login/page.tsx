"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth, isConfigured } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Chrome, ArrowRight, Loader2 } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setError(null);
        if (!isConfigured) {
            alert("Firebase is not configured. Please see the prompt to add .env.local keys.");
            return;
        }

        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Google login error:", err);
            if (err.code === 'auth/operation-not-allowed') {
                setError("Google Sign-In is not enabled in the Firebase Console.");
            } else if (err.code === 'auth/popup-closed-by-user') {
                // Ignore this one usually, or show small warning
                setError("Sign-in cancelled.");
            } else {
                setError("Failed to sign in with Google. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isConfigured) {
            alert("Firebase is not configured. Please see the prompt to add .env.local keys.");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (err: any) {
            console.error("Email login error:", err);
            if (err.code === 'auth/operation-not-allowed') {
                setError("Email/Password auth is not enabled in the Firebase Console.");
            } else if (err.code === 'auth/invalid-credential') {
                setError("Invalid email or password.");
            } else {
                setError(err.message || "Failed to sign in.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="z-10 w-full max-w-md px-4"
            >
                <Card className="glass-card border-white/10 dark:border-white/5 shadow-2xl backdrop-blur-xl bg-card/40">
                    <CardHeader className="space-y-1 text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mx-auto w-32 h-32 flex items-center justify-center mb-6"
                        >
                            <BrandLogo className="w-full h-full" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Welcome to SelfOS</CardTitle>
                        <CardDescription>Enter your personal operating system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isConfigured && (
                            <div className="bg-yellow-500/20 border border-yellow-500/50 p-2 rounded text-xs text-yellow-200 text-center mb-2">
                                Warning: Firebase keys missing. Auth disabled.
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 p-2 rounded text-xs text-red-200 text-center mb-2">
                                {error}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full h-11 bg-white/5 hover:bg-white/10 border-white/10 transition-all font-medium"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Chrome className="mr-2 h-4 w-4" />
                            )}
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full opacity-20" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background/0 px-2 text-muted-foreground backdrop-blur-md rounded-md">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/5 border-white/10 focus:border-blue-500/50 transition-all font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-white/5 border-white/10 focus:border-blue-500/50 transition-all font-medium"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 transition-all"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Sign In
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                            Forgot your password?
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
