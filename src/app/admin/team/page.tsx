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
  useAdminListPeopleQuery,
  useAdminCreatePersonMutation,
  useAdminUpdatePersonMutation,
  useAdminDeletePersonMutation,
} from "@/redux/features/content/contentApi";
import type { ApiBoardAssignment, ApiPerson, BoardCategory } from "@/types/content";
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
  UserPlus,
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

const NO_ASSIGNMENTS: ApiBoardAssignment[] = [];
const NO_PEOPLE: ApiPerson[] = [];

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

  // NO_ASSIGNMENTS is hoisted because `= []` in the destructure would be a new
  // array every render, and the sync effect below depends on this identity.
  const { data: allAssignments = NO_ASSIGNMENTS, isLoading, isFetching } =
    useAdminListAssignmentsQuery();
  const [createAssignment, { isLoading: isCreating }] = useAdminCreateAssignmentMutation();
  const [updateAssignment] = useAdminUpdateAssignmentMutation();
  const [deleteAssignment] = useAdminDeleteAssignmentMutation();
  const [reorderAssignments, { isLoading: isReordering }] = useAdminReorderAssignmentsMutation();
  // People are curated here, not mirrored from user accounts.
  const { data: allPeople = NO_PEOPLE } = useAdminListPeopleQuery();
  const [createPerson, { isLoading: isCreatingPerson }] = useAdminCreatePersonMutation();
  const [updatePerson] = useAdminUpdatePersonMutation();
  const [deletePerson] = useAdminDeletePersonMutation();

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
  const [selectedPerson, setSelectedPerson] = useState<ApiPerson | null>(null);
  const [roleLabel, setRoleLabel] = useState("");

  // "Add someone new" — the whole point of the curated directory is that the
  // person need not have an account, so the admin types their details here.
  const [newPersonOpen, setNewPersonOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ fullName: "", email: "", avatarUrl: "", bio: "" });

  // Editing a person's own details (name / photo / bio), as opposed to their
  // role within one section.
  const [editingPerson, setEditingPerson] = useState<ApiPerson | null>(null);
  const [personDraft, setPersonDraft] = useState({ fullName: "", email: "", avatarUrl: "", bio: "" });
  const [isSavingPerson, setIsSavingPerson] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchQ), 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  // Anyone already in *this* section is filtered out, but someone in another
  // section stays selectable — that is how one person holds several roles.
  const assignedPersonIds = new Set(
    allAssignments.filter((a) => a.category === activeCategory).map((a) => a.personId)
  );
  const searchResults =
    debouncedQ.length >= 2
      ? allPeople
          .filter(
            (person) =>
              !assignedPersonIds.has(person.id) &&
              (person.fullName.toLowerCase().includes(debouncedQ.toLowerCase()) ||
                (person.email ?? "").toLowerCase().includes(debouncedQ.toLowerCase()))
          )
          .slice(0, 8)
      : [];

  /* ── Slug editing ── */
  const [editingSlug, setEditingSlug] = useState<{
    assignmentId: string;
    personId: string;
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
    if (!selectedPerson || !roleLabel.trim()) return;
    try {
      await createAssignment({
        personId: selectedPerson.id,
        category: activeCategory,
        roleLabel: roleLabel.trim(),
      }).unwrap();
      const cat = CATEGORIES.find((c) => c.value === activeCategory)?.label;
      toast.success(`${selectedPerson.fullName} added to ${cat}`);
      setAddOpen(false);
      setSelectedPerson(null);
      setRoleLabel("");
      setSearchQ("");
    } catch { /* baseApi toasts */ }
  };

  /** Create a brand-new person and select them, ready to be given a role. */
  const handleCreatePerson = async () => {
    if (!newPerson.fullName.trim()) return;
    try {
      const created = await createPerson({
        fullName: newPerson.fullName.trim(),
        email: newPerson.email.trim() || null,
        avatarUrl: newPerson.avatarUrl.trim() || null,
        bio: newPerson.bio.trim() || null,
      }).unwrap();
      toast.success(`${created.fullName} added to the directory`);
      setSelectedPerson(created);
      setNewPersonOpen(false);
      setNewPerson({ fullName: "", email: "", avatarUrl: "", bio: "" });
      setSearchQ("");
    } catch { /* baseApi toasts */ }
  };

  const handleSavePerson = async () => {
    if (!editingPerson || !personDraft.fullName.trim()) return;
    setIsSavingPerson(true);
    try {
      await updatePerson({
        id: editingPerson.id,
        data: {
          fullName: personDraft.fullName.trim(),
          email: personDraft.email.trim() || null,
          avatarUrl: personDraft.avatarUrl.trim() || null,
          bio: personDraft.bio.trim() || null,
        },
      }).unwrap();
      toast.success("Details updated");
      setEditingPerson(null);
    } catch { /* baseApi toasts */ }
    finally { setIsSavingPerson(false); }
  };

  /** Removes the person everywhere, not just from this section. */
  const handleDeletePerson = async (personId: string, name: string) => {
    try {
      await deletePerson(personId).unwrap();
      toast.success(`${name} removed from every section`);
      setEditingPerson(null);
    } catch { /* baseApi toasts */ }
  };

  const handleSaveSlug = async () => {
    if (!editingSlug) return;
    const slug = editingSlug.value.trim();
    if (!slug) { setSlugError("Slug cannot be empty"); return; }
    setSlugError(null);
    setIsSavingSlug(true);
    try {
      await updatePerson({ id: editingSlug.personId, data: { slug } }).unwrap();
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
    setSelectedPerson(null);
    setNewPersonOpen(false);
  };

  return (
    <div className="max-w-4xl 2xl:max-w-none space-y-6">
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

              {!selectedPerson ? (
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
                      {searchResults.map((person) => (
                        <button
                          key={person.id}
                          type="button"
                          onClick={() => { setSelectedPerson(person); setSearchQ(""); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 text-left transition-colors"
                        >
                          <PersonAvatar person={person} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground truncate">{person.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {person.email ?? `/${person.slug}`}
                            </p>
                          </div>
                          {person.assignments.length > 0 && (
                            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              already in {person.assignments.length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {debouncedQ.length >= 2 && searchResults.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      Nobody found, or every match is already in this group.
                    </p>
                  )}

                  {/* Someone who has never been added before. No account needed. */}
                  {!newPersonOpen ? (
                    <button
                      type="button"
                      onClick={() => {
                        setNewPersonOpen(true);
                        setNewPerson((d) => ({ ...d, fullName: searchQ.trim() }));
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-emerald-500/50 transition-colors"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Add someone new
                    </button>
                  ) : (
                    <div className="space-y-2 rounded-xl border border-border bg-card p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        New person
                      </p>
                      <input
                        type="text"
                        value={newPerson.fullName}
                        onChange={(e) => setNewPerson((d) => ({ ...d, fullName: e.target.value }))}
                        placeholder="Full name (required)"
                        className="field-input"
                        autoFocus
                      />
                      <input
                        type="email"
                        value={newPerson.email}
                        onChange={(e) => setNewPerson((d) => ({ ...d, email: e.target.value }))}
                        placeholder="Email (optional)"
                        className="field-input"
                      />
                      <input
                        type="text"
                        value={newPerson.avatarUrl}
                        onChange={(e) => setNewPerson((d) => ({ ...d, avatarUrl: e.target.value }))}
                        placeholder="Photo URL (optional)"
                        className="field-input"
                      />
                      <textarea
                        value={newPerson.bio}
                        onChange={(e) => setNewPerson((d) => ({ ...d, bio: e.target.value }))}
                        placeholder="Short bio (optional)"
                        rows={3}
                        className="field-input resize-y"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleCreatePerson}
                          disabled={isCreatingPerson || !newPerson.fullName.trim()}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                        >
                          {isCreatingPerson ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          Create
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewPersonOpen(false)}
                          className="px-3 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <PersonAvatar person={selectedPerson} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{selectedPerson.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedPerson.email ?? `/${selectedPerson.slug}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPerson(null)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {selectedPerson && (
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
                    onClick={() => { setAddOpen(false); setSelectedPerson(null); setRoleLabel(""); setSearchQ(""); }}
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
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground truncate">{member.fullName}</p>
                      {/* Name/photo/bio are curated, so they are edited here —
                          not on the person's account. */}
                      <button
                        type="button"
                        onClick={() => {
                          const person = allPeople.find((x) => x.id === member.personId);
                          if (!person) return;
                          setEditingPerson(person);
                          setPersonDraft({
                            fullName: person.fullName,
                            email: person.email ?? "",
                            avatarUrl: person.avatarUrl ?? "",
                            bio: person.bio ?? "",
                          });
                        }}
                        aria-label={`Edit ${member.fullName}'s details`}
                        className="shrink-0 p-0.5 rounded text-muted-foreground/40 hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </div>

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
                            personId: member.personId,
                            value: member.slug || slugify(member.fullName),
                          })
                        }
                        className="group/slug flex items-center gap-1 mt-0.5"
                      >
                        <span className="text-[11px] text-muted-foreground font-mono">
                          /{member.slug || <span className="italic opacity-60">no slug</span>}
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

      {/* Edit person details. Separate from the role editing above: this changes
          who they are everywhere, that changes what they do in one section. */}
      {editingPerson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editingPerson.fullName}`}
          onClick={() => setEditingPerson(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Edit details</h2>
              <button
                onClick={() => setEditingPerson(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {editingPerson.assignments.length > 1 && (
              <p className="text-[11px] text-muted-foreground rounded-lg bg-muted/50 px-2.5 py-2">
                This person appears in {editingPerson.assignments.length} sections. Changes here
                apply to all of them.
              </p>
            )}

            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Full name
              </span>
              <input
                type="text"
                value={personDraft.fullName}
                onChange={(e) => setPersonDraft((d) => ({ ...d, fullName: e.target.value }))}
                className="field-input"
              />
            </label>

            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Email
              </span>
              <input
                type="email"
                value={personDraft.email}
                onChange={(e) => setPersonDraft((d) => ({ ...d, email: e.target.value }))}
                placeholder="Optional"
                className="field-input"
              />
            </label>

            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Photo URL
              </span>
              <input
                type="text"
                value={personDraft.avatarUrl}
                onChange={(e) => setPersonDraft((d) => ({ ...d, avatarUrl: e.target.value }))}
                placeholder="Optional"
                className="field-input"
              />
            </label>

            <label className="block">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                Bio
              </span>
              <textarea
                value={personDraft.bio}
                onChange={(e) => setPersonDraft((d) => ({ ...d, bio: e.target.value }))}
                rows={4}
                placeholder="Shown on their public page"
                className="field-input resize-y"
              />
            </label>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSavePerson}
                disabled={isSavingPerson || !personDraft.fullName.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
              >
                {isSavingPerson ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save
              </button>
              <button
                onClick={() => setEditingPerson(null)}
                className="px-4 py-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePerson(editingPerson.id, editingPerson.fullName)}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete everywhere
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PersonAvatar({ person }: { person: Pick<ApiPerson, "fullName" | "avatarUrl"> }) {
  const initials = getInitials(person.fullName);
  return (
    <div className="h-8 w-8 rounded-lg overflow-hidden bg-muted ring-1 ring-border shrink-0">
      {person.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={person.avatarUrl} alt={person.fullName} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
          {initials}
        </span>
      )}
    </div>
  );
}
