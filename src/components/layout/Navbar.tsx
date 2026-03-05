import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { Crosshair } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b border-zinc-800 px-4 py-4 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Crosshair className="text-green-400" />
          <span className="text-white font-bold">Airsoft OPS</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/events" className="text-zinc-400 hover:text-white text-sm transition-colors">Eventos</Link>
          <Link href="/pricing" className="text-zinc-400 hover:text-white text-sm transition-colors">Planos</Link>
          {session?.user ? (
            <Link href="/dashboard" className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <AuthModal defaultTab="login" trigger={
                <button className="text-zinc-400 hover:text-white text-sm transition-colors">Entrar</button>
              } />
              <AuthModal defaultTab="register" trigger={
                <button className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">Registar</button>
              } />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
