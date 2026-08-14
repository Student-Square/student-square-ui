"use client";

import { useState } from "react";
import {
  useAssignResourceMutation,
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useGetAdminResourcesQuery,
  useUnassignResourceMutation,
  useUpdateResourceMutation,
} from "@/redux/features/comms/commsApi";
import type { ResourceType } from "@/types/comms";
import type { UserRole } from "@/types/auth";
import { Library, Loader2, Plus, Trash2, X } from "lucide-react";

const TYPES: ResourceType[] = ["DOCUMENT", "VIDEO", "LINK", "TRAINING_MODULE"];

const ASSIGNABLE_ROLES: UserRole[] = [
  "MEMBER",
  "COUNSELLOR",
  "MENTOR",
  "MODERATOR",
  "EDITOR",
  "AUTHOR",
  "HR_MANAGER",
  "FINANCE_MANAGER",
];

/**
 * Resource library administration.
 *
 * Counsellor and mentor training modules are ordinary resources assigned to a
 * role and left unpublished — there is no separate "training" screen, because
 * there is no separate model.
 */
export default function AdminResourcesPage() {
  const { data: resources, isLoading } = useGetAdminResourcesQuery();
  const [createResource, { isLoading: creating }] = useCreateResourceMutation();
  const [updateResource] = useUpdateResourceMutation();
  const [deleteResource] = useDeleteResourceMutation();
  const [assignResource] = useAssignResourceMutation();
  const [unassignResource] = useUnassignResourceMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "LINK" as ResourceType,
    url: "",
    category: "",
    published: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (form.title.trim().length < 2) {
      setError("Give it a title.");
      return;
    }
    if (!file && !form.url.trim()) {
      setError("Add a link or upload a file.");
      return;
    }

    await createResource({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
      url: file ? undefined : form.url.trim(),
      category: form.category.trim() || undefined,
      published: form.published,
      file: file ?? undefined,
    })
      .unwrap()
      .then(() => {
        setForm({ ...form, title: "", description: "", url: "" });
        setFile(null);
      })
      .catch(() => null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The member library and staff training modules.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Add a resource
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as ResourceType })
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ").toLowerCase()}
              </option>
            ))}
          </select>
          <input
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://… (or upload a file instead)"
            disabled={file !== null}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
          />
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Category (optional)"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            rows={2}
            className="sm:col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp,video/mp4"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-xs"
          />
          <label className="inline-flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded"
            />
            Published (visible to everyone signed in)
          </label>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={creating}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </button>
        </div>

        {error && <p className="text-xs text-rose-600">{error}</p>}
        <p className="text-[11px] text-muted-foreground">
          Leave a resource unpublished and assign it to a role to make it a
          training module for that role only.
        </p>
      </section>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : !resources?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <Library className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No resources yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {resources.map((resource) => (
            <li
              key={resource.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{resource.title}</p>
                    <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {resource.type.replace("_", " ").toLowerCase()}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                        resource.published
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}
                    >
                      {resource.published ? "Published" : "Assignment only"}
                    </span>
                    {resource.category && (
                      <span className="text-[11px] text-muted-foreground">
                        {resource.category}
                      </span>
                    )}
                  </div>
                  {resource.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      updateResource({
                        id: resource.id,
                        published: !resource.published,
                      })
                    }
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:border-emerald-500/50"
                  >
                    {resource.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteResource(resource.id)}
                    className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-rose-600 hover:border-rose-300"
                    aria-label="Delete resource"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {resource.assignments.map((assignment) => (
                  <span
                    key={assignment.id}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px]"
                  >
                    {assignment.role
                      ? assignment.role.replace("_", " ").toLowerCase()
                      : (assignment.user?.fullName ?? "someone")}
                    <button
                      type="button"
                      onClick={() => unassignResource(assignment.id)}
                      aria-label="Remove assignment"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                <select
                  value=""
                  onChange={(e) => {
                    if (!e.target.value) return;
                    assignResource({
                      id: resource.id,
                      role: e.target.value as UserRole,
                    });
                    e.target.value = "";
                  }}
                  className="rounded-full border border-dashed border-border bg-transparent px-2 py-1 text-[11px]"
                >
                  <option value="">+ assign to a role</option>
                  {ASSIGNABLE_ROLES.filter(
                    (role) => !resource.assignments.some((a) => a.role === role)
                  ).map((role) => (
                    <option key={role} value={role}>
                      {role.replace("_", " ").toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
