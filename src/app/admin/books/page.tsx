import { redirect } from "next/navigation";

/** All Books was retired — FWB stats and ledger live on All FWB. */
export default function AdminBooksRedirect() {
  redirect("/admin/finance");
}
