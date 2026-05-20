"use client";

import { useState } from "react";
import { useAppStore, type StickyNote } from "@/stores/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, StickyNote as StickyIcon, Trash2, ChevronLeft, ChevronRight, LayoutGrid, Layers } from "lucide-react";

const colorStyles: Record<StickyNote["color"], string> = {
  yellow: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
  blue: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
  green: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
  pink: "bg-pink-50 border-pink-200 dark:bg-pink-950/30 dark:border-pink-800",
  purple: "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800",
};

const colors: StickyNote["color"][] = ["yellow", "blue", "green", "pink", "purple"];

export default function StickyNotesPage() {
  const { stickyNotes, addStickyNote, deleteStickyNote } = useAppStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<StickyNote["color"]>("yellow");
  const [subject, setSubject] = useState("");
  const [view, setView] = useState<"grid" | "swipe">("grid");
  const [swipeIdx, setSwipeIdx] = useState(0);

  const handleCreate = () => {
    if (!title.trim()) return;
    addStickyNote({
      id: crypto.randomUUID(), title: title.trim(), content: content.trim(),
      color, subject: subject.trim() || undefined, createdAt: new Date().toISOString(),
    });
    setTitle(""); setContent(""); setSubject(""); setColor("yellow"); setOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sticky Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">{stickyNotes.length} notes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-muted" : "hover:bg-muted/50"}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("swipe")} className={`p-2 ${view === "swipe" ? "bg-muted" : "hover:bg-muted/50"}`}><Layers className="h-4 w-4" /></button>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Note</Button>
        </div>
      </div>

      {stickyNotes.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground text-sm">
          <StickyIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium mb-1">No sticky notes yet</p>
          <p>Create notes for quick revision and formulas.</p>
        </CardContent></Card>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stickyNotes.map((note) => (
            <div key={note.id} className={`rounded-xl border p-5 relative group ${colorStyles[note.color]}`}>
              <button onClick={() => deleteStickyNote(note.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
              <p className="font-medium text-sm mb-2">{note.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
              {note.subject && <p className="text-[10px] text-muted-foreground mt-3 opacity-60">{note.subject}</p>}
            </div>
          ))}
        </div>
      ) : (
        /* Swipe View */
        <div className="flex flex-col items-center">
          {stickyNotes.length > 0 && (
            <>
              <div className={`rounded-xl border p-8 w-full max-w-md min-h-[200px] ${colorStyles[stickyNotes[swipeIdx]?.color || "yellow"]}`}>
                <p className="font-medium mb-3">{stickyNotes[swipeIdx]?.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{stickyNotes[swipeIdx]?.content}</p>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <Button variant="outline" size="icon" onClick={() => setSwipeIdx(Math.max(0, swipeIdx - 1))} disabled={swipeIdx === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">{swipeIdx + 1} / {stickyNotes.length}</span>
                <Button variant="outline" size="icon" onClick={() => setSwipeIdx(Math.min(stickyNotes.length - 1, swipeIdx + 1))} disabled={swipeIdx === stickyNotes.length - 1}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Sticky Note</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input placeholder="e.g., Binary Search" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea placeholder="Write your note..." rows={4} value={content} onChange={(e) => setContent(e.target.value)} /></div>
            <div className="space-y-2"><Label>Subject (optional)</Label><Input placeholder="e.g., DSA" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${colorStyles[c]} ${color === c ? "ring-2 ring-primary ring-offset-2" : ""}`} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={handleCreate}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
