"use client";

import { useState } from "react";
import { useAppStore, type RoadmapPost } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Map, Bookmark, Clock, User } from "lucide-react";

const categories = ["GATE", "UPSC", "Placements", "AI/ML", "Web Dev", "Startup", "Freelancing", "Other"];

const demoRoadmaps: RoadmapPost[] = [
  { id: "1", title: "How to Crack GATE CS in 6 Months", category: "GATE", strategy: "Focus on core subjects first — DSA, DBMS, OS, TOC. Use previous year papers extensively. Last 2 months for mock tests only.", timeline: "6 months", skills: ["DSA", "DBMS", "OS", "CN"], resources: ["GATE PYQs", "GFG", "NPTEL"], authorId: "", authorAnonymousId: "STU-49281", createdAt: "2025-01-15", bookmarks: 42 },
  { id: "2", title: "Complete AI/ML Roadmap for Beginners", category: "AI/ML", strategy: "Start with Python and math fundamentals. Move to ML with scikit-learn, then deep learning with PyTorch. Build 3-4 projects.", timeline: "8 months", skills: ["Python", "Linear Algebra", "ML", "Deep Learning"], resources: ["Andrew Ng Course", "Fast.ai", "Kaggle"], authorId: "", authorAnonymousId: "STU-73921", createdAt: "2025-02-10", bookmarks: 38 },
  { id: "3", title: "Placement Preparation Strategy", category: "Placements", strategy: "Solve 300+ DSA problems. Prepare CS fundamentals. Practice system design. Mock interviews weekly.", timeline: "4 months", skills: ["DSA", "OS", "DBMS", "System Design"], resources: ["LeetCode", "InterviewBit", "Striver SDE Sheet"], authorId: "", authorAnonymousId: "STU-55102", createdAt: "2025-03-05", bookmarks: 56 },
];

export default function RoadmapsPage() {
  const { roadmapPosts, addRoadmapPost, anonymousId } = useAppStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [strategy, setStrategy] = useState("");
  const [timeline, setTimeline] = useState("");
  const [skills, setSkills] = useState("");
  const [resources, setResources] = useState("");

  const allPosts = [...demoRoadmaps, ...roadmapPosts];

  const handleCreate = () => {
    if (!title.trim() || !strategy.trim()) return;
    addRoadmapPost({
      id: crypto.randomUUID(), title: title.trim(), category, strategy: strategy.trim(),
      timeline: timeline.trim(), skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      resources: resources.split(",").map((s) => s.trim()).filter(Boolean),
      authorId: "", authorAnonymousId: anonymousId || "STU-00000",
      createdAt: new Date().toISOString(), bookmarks: 0,
    });
    setTitle(""); setStrategy(""); setTimeline(""); setSkills(""); setResources("");
    setOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roadmaps</h1>
          <p className="text-sm text-muted-foreground mt-1">Community-shared learning strategies.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Share Roadmap</Button>
      </div>

      <div className="space-y-4">
        {allPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{post.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" /> {post.authorAnonymousId}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {post.timeline}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                  <Bookmark className="h-3.5 w-3.5" /> {post.bookmarks}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{post.strategy}</p>
              <div className="flex flex-wrap gap-1.5">
                {post.skills.map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
              </div>
              {post.resources.length > 0 && (
                <p className="text-xs text-muted-foreground mt-3">Resources: {post.resources.join(", ")}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Share a Roadmap</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input placeholder="e.g., How to crack GATE" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label>Strategy</Label><Textarea placeholder="Describe your approach..." rows={3} value={strategy} onChange={(e) => setStrategy(e.target.value)} /></div>
            <div className="space-y-2"><Label>Timeline</Label><Input placeholder="e.g., 6 months" value={timeline} onChange={(e) => setTimeline(e.target.value)} /></div>
            <div className="space-y-2"><Label>Skills (comma separated)</Label><Input placeholder="DSA, OS, DBMS" value={skills} onChange={(e) => setSkills(e.target.value)} /></div>
            <div className="space-y-2"><Label>Resources (comma separated)</Label><Input placeholder="LeetCode, GFG" value={resources} onChange={(e) => setResources(e.target.value)} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={handleCreate}>Share</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
