"use client";

import { useState } from "react";
import { useAppStore, type Subject, type Chapter, type Topic } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, BookOpen, ChevronDown, ChevronRight, Trash2, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const statusColors: Record<Topic["status"], string> = {
  completed: "bg-emerald-500",
  pending: "bg-amber-500",
  weak: "bg-red-500",
};

const statusLabels: Record<Topic["status"], string> = { completed: "Completed", pending: "Pending", weak: "Weak" };

export default function PlannerPage() {
  const { subjects, addSubject, deleteSubject, updateTopicStatus } = useAppStore();
  const [open, setOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [chaptersInput, setChaptersInput] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleCreate = () => {
    if (!subjectName.trim()) return;
    const chapters: Chapter[] = chaptersInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((name) => ({ id: crypto.randomUUID(), name, topics: [] }));

    addSubject({ id: crypto.randomUUID(), name: subjectName.trim(), chapters });
    setSubjectName(""); setChaptersInput(""); setOpen(false);
  };

  const toggleExpand = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const [addTopicOpen, setAddTopicOpen] = useState<{ subjectId: string; chapterId: string } | null>(null);
  const [topicName, setTopicName] = useState("");

  const handleAddTopic = () => {
    if (!addTopicOpen || !topicName.trim()) return;
    const { subjectId, chapterId } = addTopicOpen;
    const sub = subjects.find((s) => s.id === subjectId);
    if (!sub) return;
    const ch = sub.chapters.find((c) => c.id === chapterId);
    if (!ch) return;

    const newTopic: Topic = { id: crypto.randomUUID(), name: topicName.trim(), status: "pending" };
    const updatedChapters = sub.chapters.map((c) =>
      c.id === chapterId ? { ...c, topics: [...c.topics, newTopic] } : c
    );

    useAppStore.getState().updateSubject(subjectId, { chapters: updatedChapters });
    setTopicName(""); setAddTopicOpen(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Study Planner</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize subjects, chapters, and topics.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Subject</Button>
      </div>

      {subjects.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground text-sm">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium mb-1">No subjects yet</p>
          <p>Add your first subject to start planning.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {subjects.map((sub) => {
            const allTopics = sub.chapters.flatMap((c) => c.topics);
            const done = allTopics.filter((t) => t.status === "completed").length;
            const weak = allTopics.filter((t) => t.status === "weak").length;
            const pct = allTopics.length > 0 ? Math.round((done / allTopics.length) * 100) : 0;

            return (
              <Card key={sub.id}>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{sub.name}</CardTitle>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{allTopics.length} topics</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> {done}</span>
                      {weak > 0 && <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-red-500" /> {weak} weak</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{pct}%</span>
                    <button onClick={() => deleteSubject(sub.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={pct} className="h-1.5 mb-4" />
                  <div className="space-y-1">
                    {sub.chapters.map((ch) => (
                      <div key={ch.id}>
                        <button onClick={() => toggleExpand(ch.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 text-sm transition-colors">
                          {expanded[ch.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          <span className="font-medium">{ch.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{ch.topics.length} topics</span>
                        </button>
                        {expanded[ch.id] && (
                          <div className="ml-6 space-y-1 mt-1 mb-2">
                            {ch.topics.map((topic) => (
                              <div key={topic.id} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted/30 group">
                                <div className={`h-2 w-2 rounded-full ${statusColors[topic.status]}`} />
                                <span className="text-sm flex-1">{topic.name}</span>
                                <select
                                  value={topic.status}
                                  onChange={(e) => updateTopicStatus(sub.id, ch.id, topic.id, e.target.value as Topic["status"])}
                                  className="text-xs bg-transparent border border-border rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="completed">Completed</option>
                                  <option value="weak">Weak</option>
                                </select>
                              </div>
                            ))}
                            <button onClick={() => setAddTopicOpen({ subjectId: sub.id, chapterId: ch.id })}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              <Plus className="h-3 w-3" /> Add topic
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Subject Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Subject</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Subject Name</Label><Input placeholder="e.g., DBMS" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Chapters (comma separated)</Label><Input placeholder="e.g., Normalization, SQL, Transactions" value={chaptersInput} onChange={(e) => setChaptersInput(e.target.value)} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={handleCreate}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Topic Dialog */}
      <Dialog open={!!addTopicOpen} onOpenChange={() => setAddTopicOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Topic</DialogTitle></DialogHeader>
          <div className="space-y-2"><Label>Topic Name</Label><Input placeholder="e.g., B+ Trees" value={topicName} onChange={(e) => setTopicName(e.target.value)} /></div>
          <DialogFooter><Button variant="outline" onClick={() => setAddTopicOpen(null)}>Cancel</Button><Button onClick={handleAddTopic}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
