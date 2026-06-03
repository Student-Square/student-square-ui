"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useAdminListAssignmentsQuery,
  useAdminCreateAssignmentMutation,
  useAdminUpdateAssignmentMutation,
  useAdminDeleteAssignmentMutation,
  useAdminReorderAssignmentsMutation,
} from "@/redux/features/content/contentApi";
import {
  useAdminListUsersQuery,
  useAdminUpdateUserMutation,
} from "@/redux/features/users/usersApi";
import type { ApiBoardAssignment, BoardCategory } from "@/types/content";
import type { AdminUser } from "@/types/users";
import {
  BriefcaseBusiness,
  Check,
  GripVertical,
  Lightbulb,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

const CATEGORIES: Array<{ value: BoardCategory; label: string; icon: React.ReactNode }> = [
  { value: "BOARD", label: "Board of Trustees", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  { value: "ADVISORY", label: "Advisory Board", icon: <Lightbulb className="h-3.5 w-3.5" /> },
  { value: "LEADERSHIP", label: "Leadership Team", icon: <Users className="h-3.5 w-3.5" /> },
  { value: "MANAGEMENT", label: "Management Team", icon: <BriefcaseBusiness className="h-3.5 w-3.5" /> },
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TeamPage() {
  const [activeCategory, setActiveCategory] = useState<BoardCategory>("BOARD");

  const { data: allAssignments = [], isLoading, isFetching } =
    useAdminListAssignmentsQuery();
  const [createAssignment, { isLoading: isCreating }] = useAdminCreateAssignmentMutation();
  const [updateAssignment] = useAdminUpdateAssignmentMutation();
  const [deleteAssignment] = useAdminDeleteAssignmentMutation();
  const [reorderAssignments, { isLoading: isReordering }] = useAdminReorderAssignmentsMutation();
  const [updateUser] = useAdminUpdateUserMutation();

  /* ── Local items for current tab (mirrors server, enables DnD) ── */
  const [localItems, setLocalItems] = useState<ApiBoardAssignment[]>([]);
  const isDraggingRef = useRef(false);
  const dragIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (isDraggingRef.current) return;
    setLocalItems(
      allAssignments
        .filter((a) => a.category === activeCategory)
        .sort((a, b) => a.order - b.order)
    );
  }, [allAssignments, activeCategory]);

  /* ── Add member panel ── */
  const [addOpen, setAddOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [roleLabel, setRoleLabel] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchQ), 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  const { data: userSearch } = useAdminListUsersQuery(
    debouncedQ.length >= 2 ? { q: debouncedQ, limit: 8 } : undefined,
    { skip: debouncedQ.length < 2 }
  );

  const assignedUserIds = new Set(
    allAssignments.filter((a) => a.category === activeCategory).map((a) => a.userId)
  );
  const searchResults = (userSearch?.data ?? []).filter(
    (u) => !assignedUserIds.has(u.id)
  );

  /* ── Slug editing ── */
  const [editingSlug, setEditingSlug] = useState<{
    assignmentId: string;
    userId: string;
    value: string;
  } | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isSavingSlug, setIsSavingSlug] = useState(false);

  /* ── Role label editing ── */
  const [editingRole, setEditingRole] = useState<{ id: string; value: string } | null>(null);
  const [isSavingRole, setIsSavingRole] = useState(false);

  /* ── Delete confirm ── */
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ── Drag & Drop ── */
  const handleDragStart = (index: number) => {
    isDraggingRef.current = true;
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    const next = [...localItems];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    dragIndexRef.current = index;
    setLocalItems(next);
  };

  const handleDrop = async () => {
    isDraggingRef.current = false;
    dragIndexRef.current = null;
    const items = localItems.map((a, i) => ({ id: a.id, order: i + 1 }));
    try {
      await reorderAssignments({ category: activeCategory, items }).unwrap();
    } catch {
      setLocalItems(
        allAssignments
          .filter((a) => a.category === activeCategory)
          .sort((a, b) => a.order - b.order)
      );
    }
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    dragIndexRef.current = null;
  };

  /* ── Handlers ── */
  const handleAddMember = async () => {
    if (!selectedUser || !roleLabel.trim()) return;
    try {
      await createAssignment({
        userId: selectedUser.id,
        category: activeCategory,
        roleLabel: roleLabel.trim(),
      }).unwrap();
      const cat = CATEGORIES.find((c) => c.value === activeCategory)?.label;
      toast.success(`${selectedUser.fullName} added to ${cat}`);
      setAddOpen(false);
      setSelectedUser(null);
      setRoleLabel("");
      setSearchQ("");
    } catch { /* baseApi toasts */ }
  };

  const handleSaveSlug = async () => {
    if (!editingSlug) return;
    const slug = editingSlug.value.trim();
    if (!slug) { setSlugError("Slug cannot be empty"); return; }
    setSlugError(null);
    setIsSavingSlug(true);
    try {
      await updateUser({ id: editingSlug.userId, data: { slug } }).unwrap();
      toast.success("Slug updated");
      setEditingSlug(null);
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to save slug";
      setSlugError(msg);
    } finally {
      setIsSavingSlug(false);
    }
  };

  const handleSaveRole = async () => {
    if (!editingRole) return;
    const val = editingRole.value.trim();
    if (!val) return;
    setIsSavingRole(true);
    try {
      await updateAssignment({ id: editingRole.id, data: { roleLabel: val } }).unwrap();
      toast.success("Role updated");
      setEditingRole(null);
    } catch { /* baseApi toasts */ }
    finally { setIsSavingRole(false); }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await updateAssignment({ id, data: { isActive: !current } }).unwrap();
    } catch { /* baseApi toasts */ }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteAssignment(id).unwrap();
      toast.success("Member removed");
      setConfirmDelete(null);
    } catch { /* baseApi toasts */ }
    finally { setIsDeleting(false); }
  };

  const switchTab = (cat: BoardCategory) => {
    setActiveCategory(cat);
    setAddOpen(false);
    setConfirmDelete(null);
    setEditingSlug(null);
    setEditingRole(null);
  };

  return (
    <div className="max-w-4xl 2xl:max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage board members, advisors, and leadership. Drag rows to reorder.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 rounded-xl bg-muted/50 border border-border p-1 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => switchTab(cat.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-1 justify-center ${
              activeCategory === cat.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.icon}
            <span className="hidden sm:inline">{cat.label}</span>
            <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-16">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              {localItems.length} member{localItems.length !== 1 ? "s" : ""}
              {isFetching && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </span>
            <button
              onClick={() => setAddOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-3 w-3" /> Add Member
            </button>
          </div>

          {/* Add member panel */}
          {addOpen && (
            <div className="border-b border-border bg-muted/30 p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Add to {CATEGORIES.find((c) => c.value === activeCategory)?.label}
              </p>

              {!selectedUser ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                      placeholder="Search by name or email…"
                      className="field-input pl-8"
                      autoFocus
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="rounded-xl border border-border bg-card divide-y divide-border max-h-52 overflow-y-auto">
                      {searchResults.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => { setSelectedUser(u); setSearchQ(""); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 text-left transition-colors"
                        >
                          <UserAvatar user={u} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{u.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {debouncedQ.length >= 2 && searchResults.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No users found, or all matches are already in this group.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <UserAvatar user={selectedUser} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{selectedUser.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {selectedUser && (
                <div className="flex gap-2 items-end">
                  <label className="flex-1 block">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                      Role Label
                    </span>
                    <input
                      type="text"
                      value={roleLabel}
                      onChange={(e) => setRoleLabel(e.target.value)}
                      placeholder="e.g. Chairperson, Head of Design…"
                      className="field-input"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddMember(); }}
                    />
                  </label>
                  <button
                    onClick={handleAddMember}
                    disabled={isCreating || !roleLabel.trim()}
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-[9px] rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                  >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Add
                  </button>
                  <button
                    onClick={() => { setAddOpen(false); setSelectedUser(null); setRoleLabel(""); setSearchQ(""); }}
                    className="shrink-0 p-2 rounded-xl border border-border hover:bg-muted transition-colors"
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Member list */}
          {localItems.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-14">
              No members in this category yet.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {localItems.map((member, index) => (
                <div
                  key={member.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  className="flex flex-col md:flex-row md:items-center gap-3 px-4 py-4 md:py-3 hover:bg-muted/20 transition-colors group select-none"
                >
                  {/* Top row - Mobile layout */}
                  <div className="flex items-center gap-3 md:flex-1 md:min-w-0">
                    {/* Drag handle - Desktop only */}
                    <div className="hidden md:flex cursor-grab active:cursor-grabbing shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                      <GripVertical className="h-4 w-4" />
                    </div>

                    {/* Order badge - Desktop only */}
                    <span className="hidden md:block shrink-0 text-[10px] font-bold text-muted-foreground/50 w-4 text-center">
                      {index + 1}
                    </span>

                    {/* Avatar */}
                    <div className="shrink-0 h-9 w-9 rounded-lg overflow-hidden bg-muted ring-1 ring-border">
                      {member.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.avatarUrl} alt={member.fullName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                          {getInitials(member.fullName)}
                        </span>
                      )}
                    </div>

                    {/* Name + slug */}
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{member.fullName}</p>

                    {editingSlug?.assignmentId === member.id ? (
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground shrink-0 font-mono">/</span>
                          <input
                            type="text"
                            value={editingSlug.value}
                            onChange={(e) => {
                              setEditingSlug({ ...editingSlug, value: e.target.value.toLowerCase().replace(/\s+/g, "-") });
                              setSlugError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveSlug();
                              if (e.key === "Escape") { setEditingSlug(null); setSlugError(null); }
                            }}
                            className="slug-input"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveSlug}
                            disabled={isSavingSlug}
                            className="p-0.5 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 disabled:opacity-50"
                          >
                            {isSavingSlug ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                          </button>
                          <button
                            onClick={() => { setEditingSlug(null); setSlugError(null); }}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        {slugError && <p className="text-[11px] text-red-500 font-medium">{slugError}</p>}
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setEditingSlug({
                            assignmentId: member.id,
                            userId: member.userId,
                            value: member.slug ?? slugify(member.fullName),
                          })
                        }
                        className="group/slug flex items-center gap-1 mt-0.5"
                      >
                        <span className="text-[11px] text-muted-foreground font-mono">
                          /{member.slug ?? <span className="italic opacity-60">no slug</span>}
                        </span>
                        <Pencil className="h-2.5 w-2.5 opacity-0 group-hover/slug:opacity-60 transition-opacity text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  </div>

                  {/* Controls row - Mobile/Desktop layout */}
                  <div className="flex items-center gap-2 md:gap-3 md:shrink-0 flex-wrap md:flex-nowrap">
                    {/* Role label */}
                    <div className="flex-1 md:flex-none md:w-36 lg:w-44">
                      {editingRole?.id === member.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingRole.value}
                            onChange={(e) => setEditingRole({ ...editingRole, value: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRole();
                              if (e.key === "Escape") setEditingRole(null);
                            }}
                            className="field-input text-xs !py-1"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveRole}
                            disabled={isSavingRole}
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 disabled:opacity-50 shrink-0"
                          >
                            {isSavingRole ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                          </button>
                          <button onClick={() => setEditingRole(null)} className="p-1 rounded text-muted-foreground hover:text-foreground shrink-0">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingRole({ id: member.id, value: member.roleLabel })}
                          className="group/role flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-muted transition-colors w-full text-left"
                        >
                          <span className="text-xs text-foreground truncate flex-1">{member.roleLabel}</span>
                          <Pencil className="h-2.5 w-2.5 opacity-0 group-hover/role:opacity-60 transition-opacity text-muted-foreground shrink-0" />
                        </button>
                      )}
                    </div>

                    {/* Active toggle */}
                    <button
                      onClick={() => handleToggleActive(member.id, member.isActive)}
                      aria-label={member.isActive ? "Deactivate" : "Activate"}
                      title={member.isActive ? "Visible on site" : "Hidden from site"}
                      className={`shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        member.isActive ? "bg-emerald-500" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          member.isActive ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>

                    {/* Delete */}
                    {confirmDelete === member.id ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDelete(member.id)}
                          disabled={isDeleting}
                          className="px-2 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 disabled:opacity-60 transition-colors"
                        >
                          {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(member.id)}
                        className="shrink-0 p-1.5 rounded-lg text-muted-foreground/0 group-hover:text-muted-foreground/50 hover:!text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        aria-label="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isReordering && (
            <div className="flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground border-t border-border bg-muted/20">
              <Loader2 className="h-3 w-3 animate-spin" /> Saving order…
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        :global(.field-input) {
          display: block; width: 100%; font-size: 0.875rem;
          padding: 0.5rem 0.75rem; border-radius: 0.625rem;
          background: var(--color-background); border: 1px solid var(--color-border);
          color: var(--color-foreground); transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.field-input:focus) {
          outline: none; border-color: rgb(16 185 129 / 0.7);
          box-shadow: 0 0 0 3px rgb(16 185 129 / 0.12);
        }
        :global(.slug-input) {
          font-size: 0.72rem; padding: 0.1rem 0.35rem; border-radius: 0.375rem;
          background: var(--color-background); border: 1px solid var(--color-border);
          color: var(--color-foreground); font-family: ui-monospace, monospace;
          width: 100%; transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.slug-input:focus) {
          outline: none; border-color: rgb(16 185 129 / 0.7);
          box-shadow: 0 0 0 2px rgb(16 185 129 / 0.12);
        }
      `}</style>
    </div>
  );
}

function UserAvatar({ user }: { user: Pick<AdminUser, "fullName" | "profile"> }) {
  const initials = getInitials(user.fullName);
  return (
    <div className="h-8 w-8 rounded-lg overflow-hidden bg-muted ring-1 ring-border shrink-0">
      {user.profile?.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.profile.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
          {initials}
        </span>
      )}
    </div>
  );
}
