"use client";

import { motion } from "framer-motion";
import { EnergyCurveWidget } from "@/components/dashboard/EnergyCurveWidget";
import { LifeKernelInsightsWidget } from "@/components/dashboard/LifeKernelInsightsWidget";
import { TodoPanel } from "@/components/dashboard/TodoPanel";
import { DailyBootSequence } from "@/components/dashboard/DailyBootSequence";

export default function DashboardPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 h-full">
            {/* Top Row: Energy Curve (2/3) + Daily Boot (1/3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px]">
                <EnergyCurveWidget />
                <DailyBootSequence />
            </div>

            {/* Bottom Row: Insights (1/3) + Todo Panel (2/3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-[400px]">
                <LifeKernelInsightsWidget />
                <div className="col-span-1 md:col-span-2 h-full">
                    <TodoPanel />
                </div>
            </div>
        </div>
    );
}
