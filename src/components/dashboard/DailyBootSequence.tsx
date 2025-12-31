"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Power, CheckCircle, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { db, isConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

type BootStep = { id: number; label: string; completed: boolean };

const DEFAULT_STEPS: BootStep[] = [];

export function DailyBootSequence() {
  const { user } = useUserStore();
  const [steps, setSteps] = useState<BootStep[]>(DEFAULT_STEPS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("selfos-daily-boot-sequence");
      if (raw) {
        const parsed = JSON.parse(raw) as BootStep[] | undefined;
        if (Array.isArray(parsed) && parsed.length) {
          setSteps(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load daily boot sequence from localStorage:", e);
    }
  }, []);

  // Load saved steps for this user
  useEffect(() => {
    if (!user || !isConfigured) return;
    const load = async () => {
      try {
        const ref = doc(db, "users", user.uid, "widgets", "dailyBootSequence");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as { steps?: BootStep[] };
          if (Array.isArray(data.steps) && data.steps.length) {
            setSteps(data.steps);
          }
        }
      } catch (e) {
        console.warn("Failed to load daily boot sequence:", e);
      }
    };
    load();
  }, [user]);

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  const toggleStep = (id: number) => {
    setSteps((prev) => {
      const next = prev.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step,
      );
      // Mirror to localStorage
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("selfos-daily-boot-sequence", JSON.stringify(next));
        } catch (e) {
          console.warn("Failed to save daily boot sequence to localStorage:", e);
        }
      }
      // Persist asynchronously
      if (user && isConfigured) {
        const ref = doc(db, "users", user.uid, "widgets", "dailyBootSequence");
        setDoc(ref, { steps: next }, { merge: true }).catch((e) => {
          console.warn("Failed to save daily boot sequence:", e);
        });
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="h-full"
    >
      <Card className="glass-card h-full border-white/10 dark:border-white/5 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Power className="w-4 h-4 text-green-400" />
            Daily Boot Sequence
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => toggleStep(step.id)}
            >
              <div className={`transition-colors ${step.completed ? "text-green-600 dark:text-green-500" : "text-muted-foreground group-hover:text-foreground"}`}>
                {step.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              <span className={`text-sm font-medium transition-all ${step.completed ? "text-muted-foreground line-through opacity-70" : "text-muted-foreground group-hover:text-foreground"}`}>
                {step.label}
              </span>
            </motion.div>
          ))}
          <div className="mt-auto pt-4">
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
              <span>SYSTEM INITIALIZING...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
