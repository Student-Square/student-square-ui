"use client";

import { use } from "react";
import { useAdminGetStoryQuery } from "@/redux/features/stories/adminStoriesApi";
import StoryForm from "../../_components/StoryForm";
import { Loader2 } from "lucide-react";

export default function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: story, isLoading, isError } = useAdminGetStoryQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-20">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading story…
      </div>
    );
  }
  if (isError || !story) {
    return <p className="text-sm text-red-600 py-10">Story not found.</p>;
  }

  return <StoryForm story={story} />;
}
