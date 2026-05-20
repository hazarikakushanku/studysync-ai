"use client";

import { useState } from "react";
import { useAppStore, type Task } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, CheckCircle2, Circle, Calendar } from "lucide-react";

const categories: Task["category"][] = ["study", "revision", "mock-test", "project", "assignment"];
const priorities: Task["priority"][] = ["low", "medium", "high"];

export default function TodoPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useAppStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [category, setCategory] = useState<Task["category"]>("study");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: desc.trim() || undefined,
      completed: false,
      priority,
      category,
      subject: subject.trim() || undefined,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    });
    setTitle(""); setDesc(""); setSubject(""); setDueDate("");
    setPriority("medium"); setCategory("study");
    setOpen(false);
  };

  const filtered = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    if (categories.includes(filter as Task["category"])) return t.category === filter;
    return true;
  });

  const priorityColor = { low: "bg-blue-500", medium: "bg-amber-500", high: "bg-red-500" };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">To-Do List</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {tasks.filter((t) => !t.completed).length} pending, {tasks.filter((t) => t.completed).length} completed
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          {categories.map((c) => (
            <TabsTrigger key={c} value={c} className="capitalize">{c.replace("-", " ")}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Task List */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
              {filter === "all" ? "No tasks yet. Create your first task." : "No tasks in this category."}
            </div>
          ) : (
            filtered.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group">
                <button onClick={() => toggleTask(task.id)} className="shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40 hover:text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px] capitalize">{task.category.replace("-", " ")}</Badge>
                    <div className={`h-1.5 w-1.5 rounded-full ${priorityColor[task.priority]}`} />
                    {task.dueDate && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {task.dueDate}
                      </span>
                    )}
                    {task.subject && (
                      <span className="text-[10px] text-muted-foreground">{task.subject}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="What do you need to do?" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input placeholder="Additional details" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex gap-2">
                  {priorities.map((p) => (
                    <button key={p} onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 rounded-md text-xs capitalize border transition-colors ${
                        priority === p ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select value={category} onChange={(e) => setCategory(e.target.value as Task["category"])}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                  {categories.map((c) => <option key={c} value={c} className="capitalize">{c.replace("-", " ")}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject (optional)</Label>
                <Input placeholder="e.g., DSA" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Due Date (optional)</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!title.trim()}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
