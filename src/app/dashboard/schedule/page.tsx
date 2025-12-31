"use client";

import { useEffect, useState } from "react";
import { motion, Reorder } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/lib/store/userStore";
import { db, isConfigured } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ScheduleItem {
    id: string;
    title: string;
    time: string;
    duration: string;
    type: "deep-work" | "meeting" | "habit" | "break";
}

const initialItems: ScheduleItem[] = [
    { id: "1", title: "Morning Routine & Hydration", time: "07:00", duration: "1h", type: "habit" },
    { id: "2", title: "Deep Work: Core Architecture", time: "08:00", duration: "2h", type: "deep-work" },
    { id: "3", title: "Team Sync", time: "10:00", duration: "30m", type: "meeting" },
    { id: "4", title: "Recovery / Walk", time: "10:30", duration: "30m", type: "break" },
    { id: "5", title: "Project: Dashboard Widgets", time: "11:00", duration: "2h", type: "deep-work" },
    { id: "6", title: "Lunch", time: "13:00", duration: "1h", type: "break" },
];

export default function SchedulePage() {
    const { user } = useUserStore();
    const [items, setItems] = useState<ScheduleItem[]>(initialItems);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newBlock, setNewBlock] = useState({ title: "", time: "", duration: "1h", type: "deep-work" });

    // Load saved schedule blocks
    useEffect(() => {
        if (!user || !isConfigured) return;
        const load = async () => {
            try {
                const ref = doc(db, "users", user.uid, "widgets", "schedule");
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data() as { items?: ScheduleItem[] };
                    if (Array.isArray(data.items) && data.items.length) {
                        setItems(data.items);
                    }
                }
            } catch (e) {
                console.warn("Failed to load schedule items:", e);
            }
        };
        load();
    }, [user]);

    const persistItems = (next: ScheduleItem[]) => {
        if (!user || !isConfigured) return;
        const ref = doc(db, "users", user.uid, "widgets", "schedule");
        setDoc(ref, { items: next }, { merge: true }).catch((e) => {
            console.warn("Failed to save schedule items:", e);
        });
    };

    const addBlock = () => {
        if (!newBlock.title) return;
        const item: ScheduleItem = {
            id: Date.now().toString(),
            title: newBlock.title,
            time: newBlock.time,
            duration: newBlock.duration,
            type: newBlock.type as "deep-work" | "meeting" | "habit" | "break"
        };
        setItems((prev) => {
            const next = [...prev, item];
            persistItems(next);
            return next;
        });
        setIsDialogOpen(false);
        setNewBlock({ title: "", time: "", duration: "1h", type: "deep-work" });
    };

    return (
        <div className="flex flex-col gap-6 p-6 h-full max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
                    <p className="text-muted-foreground">Architect your day. Drag to reprioritize.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="border-dashed border-white/20 hover:bg-white/10">
                            <Plus className="w-4 h-4 mr-2" /> Add Block
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/10">
                        <DialogHeader>
                            <DialogTitle>Add Time Block</DialogTitle>
                            <DialogDescription>Schedule a new block of time.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input
                                    value={newBlock.title}
                                    onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                                    className="bg-white/5 border-white/10"
                                    placeholder="Block Name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Time</Label>
                                    <Input
                                        value={newBlock.time}
                                        onChange={(e) => setNewBlock({ ...newBlock, time: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                        placeholder="e.g. 14:00"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Duration</Label>
                                    <Input
                                        value={newBlock.duration}
                                        onChange={(e) => setNewBlock({ ...newBlock, duration: e.target.value })}
                                        className="bg-white/5 border-white/10"
                                        placeholder="e.g. 1h 30m"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <Select
                                    value={newBlock.type}
                                    onValueChange={(val) => setNewBlock({ ...newBlock, type: val })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Block Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="deep-work">Deep Work</SelectItem>
                                        <SelectItem value="meeting">Meeting</SelectItem>
                                        <SelectItem value="habit">Habit</SelectItem>
                                        <SelectItem value="break">Break</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={addBlock}>Add Block</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 h-[600px]">
                {/* Main Timeline Drag Area */}
                <Card className="lg:col-span-3 glass-card border-border/60 dark:border-white/5 flex flex-col overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                            <Clock className="w-4 h-4" /> Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 bg-white/60 dark:bg-black/20 p-4 rounded-lg m-4 mt-0 border border-border/40 dark:border-white/10">
                        <ScrollArea className="h-full pr-4">
                            <Reorder.Group axis="y" onReorder={setItems} values={items} className="space-y-3">
                                {items.map((item) => (
                                    <Item key={item.id} item={item} />
                                ))}
                            </Reorder.Group>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Side Panel: Unscheduled Tasks */}
                <Card className="glass-card border-border/60 dark:border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                            Backlog
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="p-3 bg-white/80 dark:bg-white/5 border border-border/40 dark:border-white/10 rounded-md cursor-grab active:cursor-grabbing hover:bg-white/100 dark:hover:bg-white/10 transition-colors">
                            <span className="text-sm font-medium">Review Q4 Metrics</span>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <span className="bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300">30m</span>
                            </div>
                        </div>
                        <div className="p-3 bg-white/80 dark:bg-white/5 border border-border/40 dark:border-white/10 rounded-md cursor-grab active:cursor-grabbing hover:bg-white/100 dark:hover:bg-white/10 transition-colors">
                            <span className="text-sm font-medium">Read "Atomic Habits"</span>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <span className="bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300">45m</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function Item({ item }: { item: ScheduleItem }) {
    // Color mapping based on type
    const colors = {
        "deep-work": "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
        "meeting": "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20",
        "habit": "bg-green-500/10 border-green-500/20 hover:bg-green-500/20",
        "break": "bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/20",
    };

    return (
        <Reorder.Item value={item} id={item.id} className="relative z-0">
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-4 rounded-lg border ${colors[item.type]} flex items-center gap-4 cursor-grab active:cursor-grabbing transition-colors group select-none`}
            >
                <div className="text-muted-foreground opacity-50 hover:opacity-100 cursor-grab">
                    <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <div className="flex text-xs text-muted-foreground gap-2 mt-1">
                        <span>{item.type.replace("-", " ").toUpperCase()}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                    </div>
                </div>
                <div className="text-sm font-mono text-muted-foreground bg-black/20 px-2 py-1 rounded">
                    {item.time}
                </div>
            </motion.div>
        </Reorder.Item>
    );
}
