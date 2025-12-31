"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LifeKernelInsightsWidget() {
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
                            "Your energy is strictly limited today. Prioritize the deep work session at 9am and delegate the admin tasks."
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3 flex flex-col gap-1 cursor-pointer hover:bg-blue-500/20 transition-colors">
                            <span className="text-xs text-blue-300 font-mono uppercase">Optimized Action</span>
                            <span className="text-sm font-semibold">Reschedule Gym to 6pm</span>
                        </div>
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-md p-3 flex flex-col gap-1 cursor-pointer hover:bg-purple-500/20 transition-colors">
                            <span className="text-xs text-purple-300 font-mono uppercase">Focus Mode</span>
                            <span className="text-sm font-semibold">Enable for 2 hours</span>
                        </div>
                    </div>

                    <Button variant="ghost" className="w-full text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground dark:hover:text-white mt-2">
                        View Full Analysis <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
