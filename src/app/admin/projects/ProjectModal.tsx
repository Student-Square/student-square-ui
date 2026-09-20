"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ImagePlus, Loader2, Save, Trash2, X } from "lucide-react";
import {
  useAddCampaignImageMutation,
  useCreateDonationCampaignMutation,
  useRemoveCampaignImageMutation,
  useGetAdminCampaignQuery,
  useUpdateDonationCampaignMutation,
} from "@/redux/features/campaigns/adminCampaignsApi";
import { useAdminUploadMediaMutation } from "@/redux/features/blogs/adminBlogsApi";

/**
 * Create or edit a donation project.
 *
 * The API has had POST /admin/campaigns and PATCH /admin/campaigns/:id since
 * the module was written; nothing on the client called them, so projects could
 * only be seeded or changed in psql. This is that missing half.
 */

const FIELD =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

const LABEL = "block text-xs font-semibold text-muted-foreground";

/** Money stays a string all the way to the API — it is never a float here. */
const cleanAmount = (value: string) => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export default function ProjectModal({
  campaignId,
  onClose,
}: {
  /** Absent for a new project. */
  campaignId?: string;
  onClose: () => void;
}) {
  const editing = Boolean(campaignId);
  const { data: existing, isLoading: loadingExisting } = useGetAdminCampaignQuery(
    campaignId as string,
    { skip: !campaignId }
  );
  const [create, { isLoading: creating }] = useCreateDonationCampaignMutation();
  const [update, { isLoading: updating }] = useUpdateDonationCampaignMutation();
  const [uploadImage, { isLoading: uploading }] = useAdminUploadMediaMutation();
  const [addGalleryImage, { isLoading: addingImage }] = useAddCampaignImageMutation();
  const [removeGalleryImage] = useRemoveCampaignImageMutation();
  const saving = creating || updating;

  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryBn, setSummaryBn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [currency, setCurrency] = useState("BDT");
  const [order, setOrder] = useState("0");
  /** The id is what the API stores; the url is only so the form can show it. */
  const [coverImageId, setCoverImageId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fills the form once the record arrives; a new project starts blank.
  useEffect(() => {
    if (!existing) return;
    setTitle(existing.title);
    setTitleBn(existing.titleBn ?? "");
    setSummary(existing.summary);
    setSummaryBn(existing.summaryBn ?? "");
    setDescription(existing.description);
    setDescriptionBn(existing.descriptionBn ?? "");
    setGoalAmount(existing.goalAmount ?? "");
    setCurrency(existing.currency);
    setOrder(String(existing.order ?? 0));
    setCoverImageId(existing.coverImage?.id ?? "");
    setCoverImageUrl(existing.coverImage?.url ?? "");
  }, [existing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Title is required.");
    if (!summary.trim()) return setError("Summary is required.");
    if (!description.trim()) return setError("Description is required.");
    if (goalAmount.trim() && !/^\d+(\.\d{1,2})?$/.test(goalAmount.trim())) {
      return setError("Goal must be a number with up to two decimal places.");
    }

    const message = (err: unknown) =>
      (err as { data?: { message?: string } })?.data?.message ?? "Save failed";

    try {
      if (editing) {
        // PATCH is nullable where the column is, so a cleared box clears the
        // column rather than being silently dropped.
        await update({
          id: campaignId as string,
          title: title.trim(),
          titleBn: titleBn.trim() || null,
          summary: summary.trim(),
          summaryBn: summaryBn.trim() || null,
          description: description.trim(),
          descriptionBn: descriptionBn.trim() || null,
          goalAmount: cleanAmount(goalAmount),
          currency,
          order: Number(order) || 0,
          coverImageId: coverImageId || null,
        }).unwrap();
        toast.success("Project updated");
      } else {
        // POST is `.strict()` and rejects nulls, so empty optionals are omitted.
        await create({
          title: title.trim(),
          summary: summary.trim(),
          description: description.trim(),
          currency,
          ...(titleBn.trim() ? { titleBn: titleBn.trim() } : {}),
          ...(summaryBn.trim() ? { summaryBn: summaryBn.trim() } : {}),
          ...(descriptionBn.trim() ? { descriptionBn: descriptionBn.trim() } : {}),
          ...(goalAmount.trim() ? { goalAmount: goalAmount.trim() } : {}),
          ...(coverImageId ? { coverImageId } : {}),
          ...(Number(order) ? { order: Number(order) } : {}),
        }).unwrap();
        // The column defaults to ACTIVE, so this is live the moment it saves.
        toast.success("Project created and live — deactivate it if you are not ready");
      }
      onClose();
    } catch (err) {
      setError(message(err));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-label={editing ? "Edit project" : "New project"}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {editing ? "Edit project" : "New project"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {editing
                ? "Changes show on the public project page straight away."
                : "It goes live as soon as you save — deactivate it from the list if you are not ready to take gifts."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loadingExisting ? (
          <div className="flex items-center gap-2 px-5 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading project…
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={LABEL}>
                Title <span className="text-red-600">*</span>
                <input
                  className={`${FIELD} mt-1`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Relief 2026"
                />
              </label>
              <label className={LABEL}>
                Title (Bangla)
                <input
                  className={`${FIELD} mt-1`}
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="শিরোনাম"
                />
              </label>
            </div>

            <label className={LABEL}>
              Summary <span className="text-red-600">*</span>
              <input
                className={`${FIELD} mt-1`}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="One line for the project card"
              />
            </label>
            <label className={LABEL}>
              Summary (Bangla)
              <input
                className={`${FIELD} mt-1`}
                value={summaryBn}
                onChange={(e) => setSummaryBn(e.target.value)}
              />
            </label>

            <label className={LABEL}>
              Description <span className="text-red-600">*</span>
              <textarea
                rows={4}
                className={`${FIELD} mt-1 resize-y`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="The full text on the project page. Blank lines separate paragraphs."
              />
            </label>
            <label className={LABEL}>
              Description (Bangla)
              <textarea
                rows={3}
                className={`${FIELD} mt-1 resize-y`}
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-4">
              <label className={`${LABEL} sm:col-span-2`}>
                Goal amount
                <input
                  className={`${FIELD} mt-1`}
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="e.g. 500000"
                  inputMode="decimal"
                />
              </label>
              <label className={LABEL}>
                Currency
                <select
                  className={`${FIELD} mt-1`}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <label className={LABEL}>
                Display order
                <input
                  type="number"
                  className={`${FIELD} mt-1`}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
                <span className="mt-1 block font-normal text-[11px] text-muted-foreground">
                  Lower shows first on the public page.
                </span>
              </label>

              <div className={`${LABEL} sm:col-span-3`}>
                Cover image
                <div className="mt-1 flex items-center gap-3">
                  {coverImageUrl ? (
                    <span className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      <Image
                        src={coverImageUrl}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span className="flex h-16 w-28 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-[11px] font-normal text-muted-foreground">
                      None
                    </span>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
                      {uploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                      {coverImageUrl ? "Replace" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append("file", file);
                          try {
                            const result = await uploadImage(formData).unwrap();
                            setCoverImageId(result.id);
                            setCoverImageUrl(result.url);
                          } catch {
                            /* baseApi toasts the failure */
                          } finally {
                            // Let the same file be chosen again after a failure.
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                    {coverImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageId("");
                          setCoverImageUrl("");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery. Only on an existing project: each image is attached by
                its own request, so there has to be something to attach it to. */}
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Project images
              </p>
              {editing ? (
                <>
                  <p className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                    Shown on the public project page, in the order added.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(existing?.images ?? []).map((row) => (
                      <span
                        key={row.id}
                        className="group relative h-20 w-28 overflow-hidden rounded-lg border border-border bg-muted"
                      >
                        <Image
                          src={row.image.url}
                          alt={row.caption ?? row.image.alt ?? ""}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          aria-label="Remove image"
                          onClick={async () => {
                            try {
                              await removeGalleryImage({
                                id: campaignId as string,
                                imageId: row.id,
                              }).unwrap();
                            } catch {
                              /* baseApi toasts the failure */
                            }
                          }}
                          className="absolute right-1 top-1 rounded-md bg-background/90 p-1 text-muted-foreground opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}

                    <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-[11px] font-normal text-muted-foreground transition-colors hover:border-emerald-500/60 hover:text-emerald-600">
                      {uploading || addingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImagePlus className="h-4 w-4" />
                      )}
                      Add images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files ?? []);
                          // Sequential, not parallel: the order they are
                          // attached in is the order they appear in.
                          for (const file of files) {
                            const formData = new FormData();
                            formData.append("file", file);
                            try {
                              const asset = await uploadImage(formData).unwrap();
                              await addGalleryImage({
                                id: campaignId as string,
                                imageId: asset.id,
                              }).unwrap();
                            } catch {
                              /* baseApi toasts; keep going with the rest */
                            }
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </>
              ) : (
                <p className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                  Save the project first, then reopen it to add gallery images.
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || loadingExisting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {editing ? "Save changes" : "Create project"}
          </button>
        </div>
      </form>
    </div>
  );
}
