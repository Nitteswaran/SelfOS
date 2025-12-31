"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

const data = [
    { time: "6am", energy: 30 },
    { time: "9am", energy: 80 },
    { time: "12pm", energy: 60 },
    { time: "3pm", energy: 90 },
    { time: "6pm", energy: 50 },
    { time: "9pm", energy: 20 },
];

export function EnergyCurveWidget() {
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
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
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
