"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/userStore";
import { db, isConfigured } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function LifeKernelInsightsWidget() {
    const { user } = useUserStore();
    const [insight, setInsight] = useState("Initializing Life Kernel...");
    const [actions, setActions] = useState<{ label: string; action: string; color: string }[]>([]);

    useEffect(() => {
        if (!user || !isConfigured) {
            setInsight("Connect to Life Kernel to see insights.");
            return;
        }

        const ref = doc(db, "users", user.uid, "insights", "dailyKernel");
        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setInsight(data.message || "No insights available for today.");
                setActions(data.actions || []);
            } else {
                setInsight("No insights generated yet. Continue using the app to build your profile.");
            }
        });

        return () => unsub();
    }, [user]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="h-full"
        >
            <Card className="glass-card h-full border-border/60 dark:border-white/5 flex flex-col relative overflow-hidden group">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />

                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        Life Kernel Insights
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 relative z-10">
                    <div className="bg-white/5 dark:bg-white/5 border border-border/60 dark:border-white/10 rounded-lg p-4 backdrop-blur-sm">
                        <p className="text-lg font-medium leading-relaxed text-foreground/90 dark:text-white/90">
                            "{insight}"
                        </p>
                    </div>

                    {actions.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            {actions.map((action, i) => (
                                <div key={i} className={`bg-${action.color}-500/10 border border-${action.color}-500/20 rounded-md p-3 flex flex-col gap-1 cursor-pointer hover:bg-${action.color}-500/20 transition-colors`}>
                                    <span className={`text-xs text-${action.color}-300 font-mono uppercase`}>{action.label}</span>
                                    <span className="text-sm font-semibold">{action.action}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button variant="ghost" className="w-full text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground dark:hover:text-white mt-auto">
                        View Full Analysis <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
