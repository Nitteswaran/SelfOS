"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, Zap, Clock, Target } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { db, isConfigured } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function InsightsPage() {
    const { user } = useUserStore();
    const [energyData, setEnergyData] = useState([]);
    const [domainDistribution, setDomainDistribution] = useState([]);
    const [metrics, setMetrics] = useState({
        avgEnergy: { value: "--", trend: "", trendUp: true },
        focusHours: { value: "--", trend: "", trendUp: true },
        goalProgress: { value: "--", trend: "", trendUp: true },
        systemEfficiency: { value: "--", trend: "", trendUp: true }
    });

    useEffect(() => {
        if (!user || !isConfigured) return;

        const ref = doc(db, "users", user.uid, "insights", "analytics");
        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                if (data.energyData) setEnergyData(data.energyData);
                if (data.domainDistribution) setDomainDistribution(data.domainDistribution);
                if (data.metrics) setMetrics(data.metrics);
            }
        });

        return () => unsub();
    }, [user]);

    return (
        <div className="flex flex-col gap-6 p-6 h-full w-full max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">System Insights</h1>
                <p className="text-muted-foreground">Analytics and patterns detected in your Life OS.</p>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard title="Avg. Energy" value={metrics.avgEnergy.value} icon={Zap} trend={metrics.avgEnergy.trend} trendUp={metrics.avgEnergy.trendUp} />
                <MetricCard title="Focus Hours" value={metrics.focusHours.value} icon={Clock} trend={metrics.focusHours.trend} trendUp={metrics.focusHours.trendUp} />
                <MetricCard title="Goal Progress" value={metrics.goalProgress.value} icon={Target} trend={metrics.goalProgress.trend} trendUp={metrics.goalProgress.trendUp} />
                <MetricCard title="System Efficiency" value={metrics.systemEfficiency.value} icon={TrendingUp} trend={metrics.systemEfficiency.trend} trendUp={metrics.systemEfficiency.trendUp} />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                <Card className="glass-card border-border/60 dark:border-white/5 flex flex-col">
                    <CardHeader>
                        <CardTitle>Weekly Energy vs Focus</CardTitle>
                        <CardDescription>Correlation between subjective energy and deep work hours.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={energyData}>
                                <defs>
                                    <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
                                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="level" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLevel)" strokeWidth={2} name="Energy Level" />
                                <Area type="monotone" dataKey="focus" stroke="#8b5cf6" fillOpacity={1} fill="rgba(139, 92, 246, 0.1)" strokeWidth={2} name="Focus Hours" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass-card border-border/60 dark:border-white/5 flex flex-col">
                    <CardHeader>
                        <CardTitle>Domain Allocation</CardTitle>
                        <CardDescription>Where your time is actually going versus planned.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={domainDistribution} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.3)" />
                                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(148,163,184,0.15)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e5e7eb' }}
                                />
                                <Bar
                                    dataKey="hours"
                                    fill="#3b82f6"
                                    radius={[0, 4, 4, 0]}
                                    barSize={32}
                                    activeBar={{ fill: '#1d4ed8' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, trendUp }: any) {
    return (
        <Card className="glass-card border-white/10 dark:border-white/5">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className={`text-xs mb-1 ${trendUp ? "text-green-400" : "text-red-400"}`}>
                        {trend}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
