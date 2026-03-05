import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const role = (session.user as any).role as string;

  if (role === "ADMIN") redirect("/dashboard/admin");
  if (role === "ORGANIZER") redirect("/dashboard/organizer/events");
  redirect("/dashboard/user/events");
}
