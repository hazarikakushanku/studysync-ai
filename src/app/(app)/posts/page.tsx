"use client";

import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";

export default function PostsPage() {
  const { learningPosts, addLearningPost, anonymousId } = useAppStore();
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (!content.trim()) return;
    addLearningPost({
      id: crypto.randomUUID(),
      content: content.trim(),
      authorAnonymousId: anonymousId || "STU-00000",
      createdAt: new Date().toISOString(),
    });
    setContent("");
  };

  const demoPosts = [
    { id: "d1", content: "Learned Binary Search Trees and AVL rotations today. Implementing self-balancing trees was challenging but rewarding.", authorAnonymousId: "STU-49281", createdAt: "2025-05-19T18:00:00Z" },
    { id: "d2", content: "Completed CNN basics — convolution layers, pooling, and built a simple image classifier with 92% accuracy.", authorAnonymousId: "STU-73921", createdAt: "2025-05-19T15:30:00Z" },
    { id: "d3", content: "Solved 5 DSA problems on LeetCode — 2 medium, 3 easy. Getting faster with sliding window pattern.", authorAnonymousId: "STU-55102", createdAt: "2025-05-18T20:00:00Z" },
  ];

  const allPosts = [...learningPosts, ...demoPosts];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Learning Posts</h1>
        <p className="text-sm text-muted-foreground mt-1">Share what you learned today.</p>
      </div>

      {/* Compose */}
      <Card>
        <CardContent className="p-4">
          <Textarea placeholder="What did you learn today?" rows={3} value={content} onChange={(e) => setContent(e.target.value)} className="mb-3" />
          <div className="flex justify-end">
            <Button onClick={handlePost} disabled={!content.trim()} className="gap-2">
              <Send className="h-4 w-4" /> Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      {allPosts.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground text-sm">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No posts yet. Share what you learned today.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {allPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-medium">
                    {post.authorAnonymousId.slice(-2)}
                  </div>
                  <span className="text-xs font-medium">{post.authorAnonymousId}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{post.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
