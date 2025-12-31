"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Sparkles, Bot, Zap, BrainCircuit, Play } from "lucide-react";
import { useState } from "react";

export default function LifeKernelPage() {
    const [query, setQuery] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [kernelSummary, setKernelSummary] = useState<string | null>(null);
    const [kernelRecommendations, setKernelRecommendations] = useState<
        { title: string; detail: string }[]
    >([]);
    const [error, setError] = useState<string | null>(null);

    const handleSimulation = async () => {
        if (!query.trim()) return;

        setIsProcessing(true);
        setError(null);
        setKernelSummary(null);
        setKernelRecommendations([]);

        try {
            const res = await fetch("/api/life-kernel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error || "Kernel request failed");
                return;
            }

            const data: {
                summary?: string;
                recommendations?: { title: string; detail: string }[];
            } = await res.json();

            if (data.summary) {
                setKernelSummary(data.summary);
            }
            if (data.recommendations) {
                setKernelRecommendations(data.recommendations);
            }
        } catch (e) {
            setError("Unable to reach Life Kernel API");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 h-full max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Life Kernel Engine</h1>
                <p className="text-muted-foreground">Direct interface to your Neural Operating System.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                {/* Main AI Interface */}
                <Card className="md:col-span-2 glass-card border-white/10 dark:border-white/5 flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-blue-400" />
                            Neural Interface
                        </CardTitle>
                        <CardDescription>Ask the kernel related to your life data, goals, or schedule.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="flex-1 bg-black/20 rounded-lg p-4 border border-white/5 font-mono text-sm space-y-4 overflow-y-auto min-h-[300px]">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <BrainCircuit className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg rounded-tl-none">
                                    <p>Kernel initialized. All systems nominal. Energy curve at 80% efficiency. Ready for input.</p>
                                </div>
                            </div>

                            {isProcessing && (
                                <div className="flex gap-3 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <BrainCircuit className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg rounded-tl-none">
                                        <div className="flex gap-1 h-2 items-center">
                                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-100" />
                                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/40 text-red-200 text-xs p-3 rounded">
                                    {error}
                                </div>
                            )}

                            {kernelSummary && (
                                <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-2">
                                    <p className="text-sm">{kernelSummary}</p>
                                </div>
                            )}

                            {kernelRecommendations.length > 0 && (
                                <div className="space-y-2">
                                    {kernelRecommendations.map((rec, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs"
                                        >
                                            <span className="font-semibold block mb-1">{rec.title}</span>
                                            <p>{rec.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter command or query (e.g., 'Optimize my afternoon schedule')"
                                className="bg-white/5 border-white/10"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button onClick={handleSimulation} disabled={!query || isProcessing} className="bg-blue-600 hover:bg-blue-700">
                                <Play className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Side Panel */}
                <div className="flex flex-col gap-6">
                    <Card className="glass-card border-white/10 dark:border-white/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                System Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>Memory Context</span>
                                    <span className="text-green-400">98%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[98%] bg-green-500 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>Goal Alignment</span>
                                    <span className="text-blue-400">84%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[84%] bg-blue-500 rounded-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10 dark:border-white/5 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                Active Predictions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs">
                                <span className="text-purple-300 font-semibold block mb-1">High Burnout Risk</span>
                                Detected pattern of 4h+ consecutive Deep Work without breaks scheduled for Thursday.
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs">
                                <span className="text-blue-300 font-semibold block mb-1">Schedule Opportunity</span>
                                Saturday morning block is free. Suggest allocating to "Side Project".
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
