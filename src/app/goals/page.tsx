"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, Microscope, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const initialGoals = [
    {
        id: 1,
        title: "Launch SelfOS V1",
        category: "Career",
        progress: 75,
        status: "In Progress",
        icon: Rocket
    },
    {
        id: 2,
        title: "Marathon Training",
        category: "Health",
        progress: 30,
        status: "Active",
        icon: Target
    },
    {
        id: 3,
        title: "Deep Learning Research",
        category: "Learning",
        progress: 10,
        status: "Planning",
        icon: Microscope
    }
];

export default function GoalsPage() {
    const [goals, setGoals] = useState(initialGoals);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: "", category: "Career", status: "Planning", progress: 0 });

    const handleAddGoal = () => {
        if (!newGoal.title) return;

        const goal = {
            id: Date.now(),
            title: newGoal.title,
            category: newGoal.category,
            status: newGoal.status,
            progress: Number(newGoal.progress),
            icon: newGoal.category === "Health" ? Target : newGoal.category === "Learning" ? Microscope : Rocket
        };

        setGoals([...goals, goal]);
        setIsDialogOpen(false);
        setNewGoal({ title: "", category: "Career", status: "Planning", progress: 0 });
    };

    return (
        <div className="flex flex-col gap-6 p-6 h-full max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Goal Compiler</h1>
                    <p className="text-muted-foreground">Compile your visions into executable reality.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Plus className="w-4 h-4 mr-2" /> New Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/10">
                        <DialogHeader>
                            <DialogTitle>Compile New Goal</DialogTitle>
                            <DialogDescription>Define the parameters of your new objective.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Goal Title</Label>
                                <Input
                                    id="title"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    className="bg-white/5 border-white/10"
                                    placeholder="e.g., Run a Marathon"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Category</Label>
                                <Select
                                    value={newGoal.category}
                                    onValueChange={(val) => setNewGoal({ ...newGoal, category: val })}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Career">Career</SelectItem>
                                        <SelectItem value="Health">Health</SelectItem>
                                        <SelectItem value="Learning">Learning</SelectItem>
                                        <SelectItem value="Personal">Personal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="progress">Initial Progress (%)</Label>
                                <Input
                                    id="progress"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={newGoal.progress}
                                    onChange={(e) => setNewGoal({ ...newGoal, progress: parseInt(e.target.value) || 0 })}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddGoal}>Compile Goal</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal, index) => (
                    <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="glass-card border-white/10 dark:border-white/5 h-[200px] flex flex-col hover:border-white/20 transition-colors cursor-pointer group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />

                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <goal.icon className="w-6 h-6 text-white/80" />
                                    </div>
                                    <span className="text-xs font-mono uppercase bg-white/5 px-2 py-1 rounded text-muted-foreground">{goal.status}</span>
                                </div>
                                <CardTitle className="mt-4">{goal.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{goal.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${goal.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
