"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/userStore";
import { db, isConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Task = {
    id: string;
    text: string;
    completed: boolean;
    time?: string;
    category?: string;
};

export function TodoPanel() {
    const { user } = useUserStore();
    const [tasks, setTasks] = useState<Task[]>(() => {
        // Prefer localStorage so navigation between pages keeps state
        if (typeof window === "undefined") {
            return [
                { id: "1", text: "Morning Meditation", completed: true, time: "7:00 AM", category: "Health" },
                { id: "2", text: "Deep Work Session", completed: false, time: "9:00 AM", category: "Work" },
                { id: "3", text: "Review Weekly Goals", completed: false, time: "2:00 PM", category: "Planning" },
                { id: "4", text: "Gym & Recovery", completed: false, time: "5:30 PM", category: "Health" },
            ];
        }
        try {
            const raw = window.localStorage.getItem("selfos-todo-panel");
            if (raw) {
                const parsed = JSON.parse(raw) as Task[] | undefined;
                if (Array.isArray(parsed) && parsed.length) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("Failed to load todo panel tasks from localStorage:", e);
        }
        return [
            { id: "1", text: "Morning Meditation", completed: true, time: "7:00 AM", category: "Health" },
            { id: "2", text: "Deep Work Session", completed: false, time: "9:00 AM", category: "Work" },
            { id: "3", text: "Review Weekly Goals", completed: false, time: "2:00 PM", category: "Planning" },
            { id: "4", text: "Gym & Recovery", completed: false, time: "5:30 PM", category: "Health" },
        ];
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newTask, setNewTask] = useState({ text: "", time: "", category: "Work" });

    // Load saved tasks for this user on mount
    useEffect(() => {
        if (!user || !isConfigured) return;
        const load = async () => {
            try {
                const ref = doc(db, "users", user.uid, "widgets", "todoPanel");
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data() as { tasks?: Task[] };
                    if (Array.isArray(data.tasks) && data.tasks.length) {
                        setTasks(data.tasks);
                    }
                }
            } catch (e) {
                console.warn("Failed to load todo panel tasks:", e);
            }
        };
        load();
    }, [user]);

    const persistTasks = (next: Task[]) => {
        // Mirror to localStorage first so navigation keeps state even without Firebase
        if (typeof window !== "undefined") {
            try {
                window.localStorage.setItem("selfos-todo-panel", JSON.stringify(next));
            } catch (e) {
                console.warn("Failed to save todo panel tasks to localStorage:", e);
            }
        }
        if (!user || !isConfigured) return;
        const ref = doc(db, "users", user.uid, "widgets", "todoPanel");
        setDoc(ref, { tasks: next }, { merge: true }).catch((e) => {
            console.warn("Failed to save todo panel tasks:", e);
        });
    };

    const toggleTask = (id: string) => {
        setTasks((prev) => {
            const next = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
            persistTasks(next);
            return next;
        });
    };

    const addTask = () => {
        if (!newTask.text.trim()) return;
        setTasks((prev) => {
            const next = [
                ...prev,
                {
                    id: Date.now().toString(),
                    text: newTask.text,
                    completed: false,
                    time: newTask.time,
                    category: newTask.category,
                },
            ];
            persistTasks(next);
            return next;
        });
        setNewTask({ text: "", time: "", category: "Work" });
        setIsDialogOpen(false);
    };

    return (
        <Card className="glass-card h-full flex flex-col border-border/60 dark:border-white/5">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Today's Protocol
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-white/10">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border/60 dark:border-white/5">
                        <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription>Add a new item to your daily protocol.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="text">Description</Label>
                                <Input
                                    id="text"
                                    value={newTask.text}
                                    onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                                    className="bg-white/5 border-border/40 dark:border-white/5"
                                    placeholder="e.g., Read documentation"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                        id="time"
                                        value={newTask.time}
                                        onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                                        className="bg-white/5 border-border/40 dark:border-white/5"
                                        placeholder="e.g., 10:00 AM"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={newTask.category}
                                        onValueChange={(val) => setNewTask({ ...newTask, category: val })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-border/40 dark:border-white/5">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Work">Work</SelectItem>
                                            <SelectItem value="Health">Health</SelectItem>
                                            <SelectItem value="Planning">Planning</SelectItem>
                                            <SelectItem value="Personal">Personal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={addTask}>Add Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">
                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-3">
                        <AnimatePresence>
                            {tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${task.completed
                                        ? "bg-blue-500/10 border-blue-500/30"
                                        : "bg-white/40 dark:bg-white/5 border-border/40 dark:border-white/5 hover:bg-white/70 dark:hover:bg-white/10"
                                        }`}
                                >
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={() => toggleTask(task.id)}
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                    />
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium transition-all ${task.completed ? "text-muted-foreground line-through decoration-blue-500/50" : "text-foreground"
                                            }`}>
                                            {task.text}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {task.time && (
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{task.time}</span>
                                                </div>
                                            )}
                                            {task.category && (
                                                <div className="text-[10px] bg-white/10 px-1.5 rounded text-muted-foreground">
                                                    {task.category}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/40 dark:border-white/5">
                    {tasks.filter(t => t.completed).length} / {tasks.length} tasks completed
                </div>
            </CardContent>
        </Card>
    );
}
