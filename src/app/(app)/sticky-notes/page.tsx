"use client";

import { useState } from "react";
import { useAppStore, type StickyNote } from "@/stores/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, StickyNote as StickyIcon, Trash2, ChevronLeft, ChevronRight, LayoutGrid, Layers, Pin, FolderOpen, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const colorStyles: Record<StickyNote["color"], string> = {
  yellow: "bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100",
  blue: "bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 text-blue-900 dark:text-blue-100",
  green: "bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800 text-green-900 dark:text-green-100",
  pink: "bg-pink-100 border-pink-200 dark:bg-pink-900/30 dark:border-pink-800 text-pink-900 dark:text-pink-100",
  purple: "bg-purple-100 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800 text-purple-900 dark:text-purple-100",
};

const colors: StickyNote["color"][] = ["yellow", "blue", "green", "pink", "purple"];

export default function StickyNotesPage() {
  const { stickyNotes, addStickyNote, updateStickyNote, deleteStickyNote, subjects } = useAppStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<StickyNote["color"]>("yellow");
  
  // Organization state
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  
  // View state
  const [view, setView] = useState<"list" | "swipe">("list");
  const [swipeIdx, setSwipeIdx] = useState(0);
  const [filterSubject, setFilterSubject] = useState<string>("all");

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) return;
    addStickyNote({
      id: crypto.randomUUID(), title: title.trim(), content: content.trim(),
      color, subject: selectedSubject || undefined, chapter: selectedChapter || undefined, 
      pinned: false, createdAt: new Date().toISOString(),
    });
    setTitle(""); setContent(""); setSelectedSubject(""); setSelectedChapter(""); setColor("yellow"); setOpen(false);
  };

  const togglePin = (id: string, pinned: boolean) => {
    updateStickyNote(id, { pinned: !pinned });
  };

  // Filter notes
  let filteredNotes = stickyNotes;
  if (filterSubject !== "all") {
    filteredNotes = stickyNotes.filter(n => n.subject === filterSubject);
  }

  // Sort notes (pinned first)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned === b.pinned) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return a.pinned ? -1 : 1;
  });

  // Group by Subject -> Chapter for List View
  const groupedNotes = sortedNotes.reduce((acc, note) => {
    const sub = note.subject || "Uncategorized";
    const ch = note.chapter || "General";
    if (!acc[sub]) acc[sub] = {};
    if (!acc[sub][ch]) acc[sub][ch] = [];
    acc[sub][ch].push(note);
    return acc;
  }, {} as Record<string, Record<string, StickyNote[]>>);

  const activeSubjectData = subjects.find(s => s.name === selectedSubject);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sticky Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your revision cards by subject and chapter.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex border border-border rounded-lg overflow-hidden bg-background">
            <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-muted" : "hover:bg-muted/50"}`} title="List View"><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("swipe")} className={`p-2 transition-colors ${view === "swipe" ? "bg-muted" : "hover:bg-muted/50"}`} title="Swipe View"><Layers className="h-4 w-4" /></button>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Note</Button>
        </div>
      </div>

      {/* Filter Bar */}
      {stickyNotes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Badge 
            variant={filterSubject === "all" ? "default" : "outline"} 
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setFilterSubject("all")}
          >
            All Notes ({stickyNotes.length})
          </Badge>
          {Array.from(new Set(stickyNotes.map(n => n.subject || "Uncategorized"))).map(sub => (
            <Badge 
              key={sub} 
              variant={filterSubject === sub ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => { setFilterSubject(sub); setSwipeIdx(0); }}
            >
              {sub}
            </Badge>
          ))}
        </div>
      )}

      {stickyNotes.length === 0 ? (
        <Card><CardContent className="py-24 text-center text-muted-foreground text-sm flex flex-col items-center">
          <StickyIcon className="h-12 w-12 mb-4 opacity-20" />
          <p className="font-medium text-lg mb-1 text-foreground">No sticky notes yet</p>
          <p>Create flashcards and short notes for quick revision.</p>
          <Button onClick={() => setOpen(true)} variant="outline" className="mt-6 gap-2"><Plus className="h-4 w-4" /> Create First Note</Button>
        </CardContent></Card>
      ) : view === "list" ? (
        <div className="space-y-8">
          {Object.entries(groupedNotes).map(([subjectName, chapters]) => (
            <div key={subjectName} className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
                <FolderOpen className="h-5 w-5 text-primary" /> {subjectName}
              </h2>
              <div className="space-y-6 pl-2 sm:pl-4">
                {Object.entries(chapters).map(([chapterName, notes]) => (
                  <div key={chapterName} className="space-y-3">
                    {chapterName !== "General" && (
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" /> {chapterName}
                      </h3>
                    )}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {notes.map((note) => (
                        <div key={note.id} className={`rounded-xl border p-5 relative group transition-all hover:shadow-md ${colorStyles[note.color]}`}>
                          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => togglePin(note.id, note.pinned || false)} className={`p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 ${note.pinned ? 'opacity-100' : ''}`}>
                              <Pin className={`h-3.5 w-3.5 ${note.pinned ? "fill-current" : ""}`} />
                            </button>
                            <button onClick={() => deleteStickyNote(note.id)} className="p-1.5 rounded-md hover:bg-red-500/20 text-red-600 dark:text-red-400">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {note.pinned && <Pin className="absolute top-4 right-4 h-3.5 w-3.5 fill-current opacity-100 group-hover:opacity-0 transition-opacity" />}
                          <p className="font-semibold text-sm mb-3 pr-8">{note.title}</p>
                          <p className="text-xs leading-relaxed whitespace-pre-wrap opacity-90">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Swipe View (Flashcards) */
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in slide-in-from-bottom-4">
          {sortedNotes.length > 0 ? (
            <>
              <div className={`rounded-2xl border p-10 w-full max-w-lg min-h-[300px] flex flex-col relative shadow-xl transition-all duration-300 ${colorStyles[sortedNotes[swipeIdx]?.color || "yellow"]}`}>
                <div className="flex items-center justify-between mb-6 opacity-60 text-xs font-medium">
                  <span className="flex items-center gap-1.5"><FolderOpen className="h-3.5 w-3.5" /> {sortedNotes[swipeIdx]?.subject || "Uncategorized"}</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {sortedNotes[swipeIdx]?.chapter || "General"}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{sortedNotes[swipeIdx]?.title}</h3>
                <p className="text-base leading-relaxed whitespace-pre-wrap opacity-90 flex-1">{sortedNotes[swipeIdx]?.content}</p>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => togglePin(sortedNotes[swipeIdx].id, sortedNotes[swipeIdx].pinned || false)} className="opacity-50 hover:opacity-100 transition-opacity">
                    <Pin className={`h-5 w-5 ${sortedNotes[swipeIdx]?.pinned ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <Button variant="outline" size="lg" className="rounded-full h-12 w-12 p-0 shadow-sm" onClick={() => setSwipeIdx(Math.max(0, swipeIdx - 1))} disabled={swipeIdx === 0}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <span className="text-sm font-medium bg-muted px-4 py-1.5 rounded-full">{swipeIdx + 1} of {sortedNotes.length}</span>
                <Button variant="outline" size="lg" className="rounded-full h-12 w-12 p-0 shadow-sm" onClick={() => setSwipeIdx(Math.min(sortedNotes.length - 1, swipeIdx + 1))} disabled={swipeIdx === sortedNotes.length - 1}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">No notes found for this filter.</p>
          )}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create Sticky Note</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                {subjects.length > 0 ? (
                  <select 
                    value={selectedSubject} 
                    onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(""); }}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                ) : (
                  <Input placeholder="e.g., DBMS" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} />
                )}
              </div>
              <div className="space-y-2">
                <Label>Chapter</Label>
                {activeSubjectData ? (
                  <select 
                    value={selectedChapter} 
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">-- Select Chapter --</option>
                    {activeSubjectData.chapters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                ) : (
                  <Input placeholder="e.g., Normalization" value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} />
                )}
              </div>
            </div>
            
            <div className="space-y-2"><Label>Title</Label><Input placeholder="e.g., Boyce-Codd Normal Form" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea placeholder="Write your key points here..." rows={5} value={content} onChange={(e) => setContent(e.target.value)} /></div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-3 pt-1">
                {colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border transition-all hover:scale-110 ${colorStyles[c].split(' ')[0]} ${color === c ? "ring-2 ring-primary ring-offset-2 scale-110" : "opacity-70"}`} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={handleCreate}>Save Note</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
