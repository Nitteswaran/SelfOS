"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock Data for Life Map Nodes
const nodes = [
    { id: "core", x: 50, y: 50, label: "Self Core", type: "core", size: 60 },
    { id: "career", x: 30, y: 30, label: "Career", type: "domain", size: 40 },
    { id: "health", x: 70, y: 30, label: "Health", type: "domain", size: 40 },
    { id: "growth", x: 50, y: 70, label: "Growth", type: "domain", size: 40 },
    { id: "project1", x: 20, y: 20, label: "SelfOS", type: "project", size: 25 },
    { id: "project2", x: 80, y: 20, label: "Marathon", type: "project", size: 25 },
    { id: "habit1", x: 60, y: 80, label: "Reading", type: "habit", size: 20 },
];

const links = [
    { source: "core", target: "career" },
    { source: "core", target: "health" },
    { source: "core", target: "growth" },
    { source: "career", target: "project1" },
    { source: "health", target: "project2" },
    { source: "growth", target: "habit1" },
];

export default function LifeMapPage() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden bg-black/5">
            {/* Interactive Graph Container */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-4xl max-h-[80vh] aspect-square">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                        {/* Links */}
                        {links.map((link, i) => {
                            const source = nodes.find(n => n.id === link.source)!;
                            const target = nodes.find(n => n.id === link.target)!;
                            return (
                                <motion.line
                                    key={i}
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="0.5"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            );
                        })}

                        {/* Nodes */}
                        {nodes.map((node, i) => (
                            <motion.g
                                key={node.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1, type: "spring" }}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className="cursor-pointer"
                            >
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.size / 10}
                                    fill={
                                        node.type === "core" ? "url(#coreGradient)" :
                                            node.type === "domain" ? "rgba(59, 130, 246, 0.5)" :
                                                "rgba(147, 51, 234, 0.4)"
                                    }
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="0.5"
                                    className="transition-all duration-300 hover:stroke-white hover:stroke-1"
                                />
                                {hoveredNode === node.id && (
                                    <text
                                        x={node.x}
                                        y={node.y - (node.size / 10) - 2}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="3"
                                        className="pointer-events-none"
                                    >
                                        {node.label}
                                    </text>
                                )}
                            </motion.g>
                        ))}

                        <defs>
                            <radialGradient id="coreGradient">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <h1 className="text-3xl font-bold tracking-tight">Life Map</h1>
                <p className="text-muted-foreground">Force-directed visualization of your existence.</p>
            </div>

            <div className="absolute bottom-6 right-6 z-10">
                <Card className="glass-card border-white/10 p-4 w-64">
                    <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Legend</h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                            <span>Core Identity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500/50" />
                            <span>Domains</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500/40" />
                            <span>Projects & Habits</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
