"use client";

import { ThreadList } from "@/components/messaging/ThreadList";

export default function PanelMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conversations with your students. Internal notes stay on your side.
        </p>
      </div>

      <ThreadList basePath="/panel/messages" />
    </div>
  );
}
