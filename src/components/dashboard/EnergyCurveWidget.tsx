"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store/userStore";
import { db, isConfigured } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

// Baseline human circadian rhythm (approximate)
const baselineData = [
    { time: "6am", energy: 40 },
    { time: "9am", energy: 85 },
    { time: "12pm", energy: 70 },
    { time: "3pm", energy: 60 },
    { time: "6pm", energy: 75 },
    { time: "9pm", energy: 30 },
];

export function EnergyCurveWidget() {
    const { user } = useUserStore();
    const [data, setData] = useState(baselineData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !isConfigured) {
            setLoading(false);
            return;
        }

        const ref = doc(db, "users", user.uid, "insights", "energyCurve");
        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const fetched = snap.data().data;
                if (Array.isArray(fetched) && fetched.length > 0) {
                    setData(fetched);
                }
            } else {
                // Initialize with baseline if empty
                // We use setDoc (merge: true) to avoid overwriting if something else writes simultaneously, 
                // but mostly to establish the initial state for the user.
                // However, avoid setting if we don't want to force write on read. 
                // Better: Just show baseline client-side if no remote data.
                setData(baselineData);
            }
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2 h-full"
        >
            <Card className="glass-card h-full border-border/60 dark:border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 pointer-events-none" />
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-500" : "bg-blue-500 animate-pulse"}`} />
                        Predicted Energy Levels
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    backdropFilter: 'blur(4px)',
                                    color: '#e5e7eb',
                                }}
                                itemStyle={{ color: '#e5e7eb' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="energy"
                                stroke="url(#colorEnergy)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorEnergy)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
}
