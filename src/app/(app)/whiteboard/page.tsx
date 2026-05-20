"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function WhiteboardPage() {
  return (
    <div className="max-w-full mx-auto space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Whiteboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Draw diagrams, flowcharts, and rough notes.</p>
      </div>
      <Card>
        <CardContent className="p-0 overflow-hidden rounded-xl">
          <div className="h-[calc(100vh-12rem)] w-full">
            <iframe 
              src="https://excalidraw.com" 
              className="w-full h-full border-0"
              title="Excalidraw Whiteboard"
              allow="clipboard-read; clipboard-write; export-image"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
