"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminListEventsQuery,
  useAdminCreateEventMutation,
  useAdminUpdateEventMutation,
  useAdminDeleteEventMutation,
} from "@/redux/features/events/adminEventsApi";
import CoverImageUpload from "@/components/editor/CoverImageUpload";
import Pagination from "@/components/common/Pagination";
import type { EventMode } from "@/types/events";
import {
  Calendar,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

const MODE_OPTIONS: Array<{ value: EventMode; label: string }> = [
  { value: "IN_PERSON", label: "In person" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
];

const PAGE_SIZE = 12;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminEventsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminListEventsQuery({ page, limit: PAGE_SIZE });
  const events = data?.data;
  const totalPages = Math.max(1, Math.ceil((data?.meta?.total ?? 0) / PAGE_SIZE));
  const [createEvent, { isLoading: creating }] = useAdminCreateEventMutation();
  const [updateEvent] = useAdminUpdateEventMutation();
  const [deleteEvent] = useAdminDeleteEventMutation();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<EventMode>("IN_PERSON");
  const [location, setLocation] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [coverImageId, setCoverImageId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const resetForm = () => {
    setTitle(""); setDescription(""); setMode("IN_PERSON"); setLocation("");
    setOnlineUrl(""); setRegistrationUrl(""); setStartsAt(""); setEndsAt("");
    setCoverImageId(""); setCoverImageUrl(""); setShowForm(false);
  };

  const handleCreate = async () => {
    if (!title.trim() || description.trim().length < 10 || !startsAt) {
      toast.error("Title, a description (10+ chars) and a start time are required.");
      return;
    }
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        mode,
        location: location.trim() || undefined,
        onlineUrl: onlineUrl.trim() || undefined,
        registrationUrl: registrationUrl.trim() || undefined,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
        coverImageId: coverImageId || undefined,
      }).unwrap();
      toast.success("Event created");
      resetForm();
    } catch { /* baseApi toasts */ }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      await updateEvent({ id, data: { published: !published } }).unwrap();
      toast.success(!published ? "Published" : "Unpublished");
    } catch { /* baseApi toasts */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await deleteEvent(id).unwrap();
      toast.success("Deleted");
    } catch { /* baseApi toasts */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">Workshops, seminars and community programs.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New event
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 max-w-xl">
          <Field label="Title *">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" />
          </Field>
          <Field label="Description *">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="form-input" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Starts *">
              <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="form-input" />
            </Field>
            <Field label="Ends">
              <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="form-input" />
            </Field>
          </div>
          <Field label="Mode">
            <select value={mode} onChange={(e) => setMode(e.target.value as EventMode)} className="form-input">
              {MODE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          {mode !== "ONLINE" && (
            <Field label="Location">
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dhaka, Bangladesh" className="form-input" />
            </Field>
          )}
          {mode !== "IN_PERSON" && (
            <Field label="Online link">
              <input value={onlineUrl} onChange={(e) => setOnlineUrl(e.target.value)} placeholder="https://meet.google.com/…" className="form-input" />
            </Field>
          )}
          <Field label="Registration link">
            <input value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} placeholder="https://forms.gle/…" className="form-input" />
          </Field>
          <CoverImageUpload
            imageUrl={coverImageUrl || null}
            onUpload={(id, url) => { setCoverImageId(id); setCoverImageUrl(url); }}
            onRemove={() => { setCoverImageId(""); setCoverImageUrl(""); }}
          />
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              disabled={creating}
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Save as draft
            </button>
            <button type="button" onClick={resetForm} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : !events?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Calendar className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No events yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {events.map((event) => (
            <div key={event.id} className="p-4 flex items-start justify-between gap-4 hover:bg-muted/20 transition-colors">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-foreground truncate">{event.title}</p>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                      event.published
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {event.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formatDateTime(event.startsAt)}
                  </span>
                  {event.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {event.location}
                    </span>
                  )}
                  {event.onlineUrl && (
                    <span className="inline-flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Online
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(event.id, event.published)}
                  title={event.published ? "Unpublish" : "Publish"}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  {event.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(event.id)}
                  title="Delete"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />

      <style jsx>{`
        :global(.form-input) {
          display: block; width: 100%; font-size: 0.875rem;
          padding: 0.5rem 0.75rem; border-radius: 0.5rem;
          background: var(--color-background); border: 1px solid var(--color-border);
          color: var(--color-foreground);
        }
        :global(.form-input:focus) {
          outline: none; border-color: rgb(16 185 129 / 0.6);
          box-shadow: 0 0 0 2px rgb(16 185 129 / 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}
