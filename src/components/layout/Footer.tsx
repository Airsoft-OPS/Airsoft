import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { EventStatus } from "@prisma/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default function Navbar() {
  return (
    <footer className="border-t border-zinc-800 px-4 py-8 text-center text-zinc-600 text-sm">
      © 2026 Airsoft OPS · Para a comunidade airsoft
    </footer>
  );
}
