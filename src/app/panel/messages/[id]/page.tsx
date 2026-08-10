"use client";

import { use } from "react";
import { ThreadView } from "@/components/messaging/ThreadView";

export default function PanelThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ThreadView threadId={id} backHref="/panel/messages" />;
}
