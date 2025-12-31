"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Battery, LineChart, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-blue-500/30">

      {/* Navbar */}
      <header className="px-6 lg:px-10 h-16 flex items-center justify-between fixed w-full top-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/5">
        <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
          <BrandLogo className="w-16 h-16" />
          SelfOS
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#manifesto" className="hover:text-white transition-colors">Manifesto</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 hidden sm:flex">
              Log in
            </Button>
          </Link>
          <Link href="/login">
            <Button className="font-semibold bg-white text-black hover:bg-neutral-200 rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative px-6 lg:px-10 max-w-7xl mx-auto flex flex-col items-center text-center space-y-8 mb-32">

          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none opacity-50 animate-pulse" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-3xl z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v1.0 Public Beta is Live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              The Operating System <br /> for Your Life.
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Understand yourself, predict your energy, and optimize your schedule with an AI Kernel designed to align your digital life with your biology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-center z-10"
          >
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105">
                Initialize Kernel <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm">
              View Demo
            </Button>
          </motion.div>

          {/* App Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-5xl mt-16 rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/20 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-[#0f0f11] p-2 rounded-xl">
              <div className="w-full aspect-[16/10] bg-[#0c0c0e] rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
                {/* Placeholder for actual screenshot or sophisticated UI mockup */}
                <div className="text-center space-y-4">
                  <div className="text-6xl animate-pulse">🌌</div>
                  <p className="text-white/30 font-mono text-sm">Initializing SelfOS Interface...</p>
                </div>

                {/* Floating Widgets Animation */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-10 right-10 w-64 h-40 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 space-y-2"
                >
                  <div className="h-2 w-20 bg-white/10 rounded" />
                  <div className="h-20 w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-white/5">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Life Kernel AI",
                desc: "An intelligent engine that learns your habits and predicts your next best move."
              },
              {
                icon: Battery,
                title: "Energy Prediction",
                desc: "Visualizes your circadian rhythm to schedule tasks when you're most capable."
              },
              {
                icon: Globe, // Was LineChart, wait, prompt asked for "Life Map". LineChart is generic.
                title: "Holistic Life Map",
                desc: "See the connections between your goals, habits, and daily tasks in a force-directed graph."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white/90">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center text-white/30 text-sm">
        <p>© 2025 SelfOS Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
