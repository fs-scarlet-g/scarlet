import { requireGoogleAdmin } from "@/app/lib/google-admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireGoogleAdmin("/admin/");
  return children;
}
