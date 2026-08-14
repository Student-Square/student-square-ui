"use client";

import { use } from "react";
import { ThreadView } from "@/components/messaging/ThreadView";

export default function MemberThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ThreadView threadId={id} backHref="/dashboard/messages" />;
}
