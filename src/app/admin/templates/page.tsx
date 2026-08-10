"use client";

import { useState } from "react";
import {
  useCreateTemplateMutation,
  useGetCommsVariablesQuery,
  useGetTemplatesQuery,
  useUpdateTemplateMutation,
} from "@/redux/features/comms/commsApi";
import { FileCode2, Loader2, Plus } from "lucide-react";

/**
 * Template manager.
 *
 * The variable list is fetched from the server rather than hard-coded here:
 * it is an allow-list with a security meaning (FR-18-005), and a second copy
 * in the UI would eventually disagree with the one that is enforced.
 */
export default function AdminTemplatesPage() {
  const { data: templates, isLoading } = useGetTemplatesQuery();
  const { data: variables } = useGetCommsVariablesQuery();
  const [createTemplate, { isLoading: creating }] = useCreateTemplateMutation();
  const [updateTemplate] = useUpdateTemplateMutation();

  const [form, setForm] = useState({
    key: "",
    name: "",
    subject: "",
    bodyHtml: "",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reusable bodies for announcements and campaigns.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Available variables
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {(variables ?? []).map((variable) => (
            <span
              key={variable.name}
              title={variable.description}
              className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[11px] font-mono"
            >
              {`{{${variable.name}}}`}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Only these can be used. Anything else is refused when you save — no
          template can reference a phone number, address, health answer or
          assessment score.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          New template
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={form.key}
            onChange={(e) =>
              setForm({ ...form, key: e.target.value.toLowerCase().replace(/\s+/g, "-") })
            }
            placeholder="key-like-this"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-emerald-500"
          />
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Human name"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <input
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="Subject line — {{firstName}} works here too"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />

        <textarea
          value={form.bodyHtml}
          onChange={(e) => setForm({ ...form, bodyHtml: e.target.value })}
          rows={8}
          placeholder="<p>Hi {{firstName}},</p>"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-emerald-500"
        />

        <button
          type="button"
          disabled={creating}
          onClick={() =>
            createTemplate(form)
              .unwrap()
              .then(() => setForm({ key: "", name: "", subject: "", bodyHtml: "" }))
              .catch(() => null)
          }
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Save template
        </button>
      </section>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : !templates?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <FileCode2 className="h-8 w-8 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No templates yet.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {templates.map((template) => (
            <li
              key={template.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold">{template.name}</p>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {template.key}
                    </span>
                    {!template.active && (
                      <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {template.subject}
                  </p>
                  {template.variables.length > 0 && (
                    <p className="mt-1 text-[11px] font-mono text-muted-foreground">
                      uses {template.variables.map((v) => `{{${v}}}`).join(" ")}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateTemplate({ id: template.id, active: !template.active })
                  }
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:border-emerald-500/50 shrink-0"
                >
                  {template.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
