"use client";

/**
 * Floating "Edit this page" affordance — shown only to admins/editors when
 * they're browsing a public page that has an editable counterpart.
 *
 * Drop into any page that maps 1:1 to an editable slug:
 *   <EditPageButton slug="about-mission-vision" />
 *
 * Renders nothing for unauthenticated visitors and non-editor roles, so it's
 * safe to leave on every public page.
 */

import Link from "next/link";
import { useSelector } from "react-redux";
import { Pencil } from "lucide-react";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "@/redux/features/auth/authSlice";
import type { EditablePageSlug } from "@/types/content";

const EDITOR_ROLES = new Set(["SYSTEM_ADMIN", "SUPER_ADMIN", "ADMIN", "EDITOR"]);

export default function EditPageButton({ slug }: { slug: EditablePageSlug }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  if (!isAuthenticated || !role || !EDITOR_ROLES.has(role)) return null;

  return (
    <Link
      href={`/admin/pages/${slug}`}
      title="Open this page in the admin editor"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-600/40 hover:bg-emerald-700 hover:gap-2.5 transition-all"
    >
      <Pencil className="h-4 w-4" />
      Edit page
    </Link>
  );
}
