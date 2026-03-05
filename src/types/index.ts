import { UserRole } from "@prisma/client";

export const TIER_HIERARCHY: Record<string, number> = {
  FREE: 0, BASIC: 1, PREMIUM: 2, ELITE: 3, ORGANIZER: 4, ADMIN: 5,
};

export const TIER_LABELS: Record<string, string> = {
  FREE: "Gratuito", BASIC: "Basic", PREMIUM: "Pro",
  ELITE: "Elite", ORGANIZER: "Organizador", ADMIN: "Administrador",
};

export const TIER_COLORS: Record<string, string> = {
  FREE: "#71717a", BASIC: "#3b82f6", PREMIUM: "#22c55e",
  ELITE: "#f59e0b", ORGANIZER: "#a855f7", ADMIN: "#ef4444",
};

export function canAccessTier(userRole: string, requiredRole: string): boolean {
  return (TIER_HIERARCHY[userRole] ?? 0) >= (TIER_HIERARCHY[requiredRole] ?? 0);
}
