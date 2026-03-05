import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TIER_LABELS } from "@/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const role = (session.user as any).role as string;
  const name = session.user.name ?? "";

  const navItems = [
    { label: "Eventos", href: "/dashboard/user/events", icon: "🗓", roles: ["FREE","BASIC","PREMIUM","ELITE","ORGANIZER","ADMIN"] },
    { label: "Inscrições", href: "/dashboard/user/registrations", icon: "📋", roles: ["FREE","BASIC","PREMIUM","ELITE","ORGANIZER","ADMIN"] },
    { label: "Perfil", href: "/dashboard/user/profile", icon: "👤", roles: ["FREE","BASIC","PREMIUM","ELITE","ORGANIZER","ADMIN"] },
    { label: "Meus Eventos", href: "/dashboard/organizer/events", icon: "🎯", roles: ["ORGANIZER","ADMIN"] },
    { label: "Criar Evento", href: "/dashboard/organizer/events/new", icon: "➕", roles: ["ORGANIZER","ADMIN"] },
    { label: "Admin", href: "/dashboard/admin", icon: "⚙️", roles: ["ADMIN"] },
    { label: "Utilizadores", href: "/dashboard/admin/users", icon: "👥", roles: ["ADMIN"] },
    { label: "Pagamentos", href: "/dashboard/admin/payments", icon: "💳", roles: ["ADMIN"] },
  ].filter((i) => i.roles.includes(role));

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <aside className="hidden md:flex flex-col w-60 bg-zinc-900 border-r border-zinc-800 fixed inset-y-0">
        <div className="p-5 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-white font-bold text-sm">Airsoft Events PT</span>
          </Link>
        </div>
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-bold">
              {name[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{name}</p>
              <p className="text-zinc-500 text-xs">{TIER_LABELS[role] ?? role}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-800">
          <Link href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors text-sm">
            <span>🚪</span>
            <span>Sair</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 md:ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
