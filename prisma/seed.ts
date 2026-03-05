import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  // Tiers
  const tierData = [
    { role: UserRole.FREE,    name: "Free",  description: "Para explorar a plataforma", price: 0,     color: "#71717a", badgeIcon: "Shield", order: 0, canAccessExclusiveEvents: false, maxMonthlyRegistrations: 3,  maxMonthlyReviews: 0,  hasBadge: false, isProfileHighlighted: false },
    { role: UserRole.BASIC,   name: "Basic", description: "Para jogadores que querem mais", price: 3.99, color: "#3b82f6", badgeIcon: "Star",   order: 1, canAccessExclusiveEvents: true,  maxMonthlyRegistrations: 10, maxMonthlyReviews: 5,  hasBadge: true,  isProfileHighlighted: false },
    { role: UserRole.PREMIUM, name: "Pro",   description: "Para jogadores sérios", price: 7.99, color: "#22c55e", badgeIcon: "Zap",    order: 2, canAccessExclusiveEvents: true,  maxMonthlyRegistrations: -1, maxMonthlyReviews: 20, hasBadge: true,  isProfileHighlighted: true  },
    { role: UserRole.ELITE,   name: "Elite", description: "Para os melhores jogadores", price: 14.99, color: "#f59e0b", badgeIcon: "Crown",  order: 3, canAccessExclusiveEvents: true,  maxMonthlyRegistrations: -1, maxMonthlyReviews: -1, hasBadge: true,  isProfileHighlighted: true  },
  ];

  for (const t of tierData) {
    await prisma.tier.upsert({ where: { role: t.role }, update: {}, create: t });
  }
  console.log("✅ Tiers criados");

  // Users
  const hash = (pw: string) => bcrypt.hash(pw, 12);

  await prisma.user.upsert({
    where: { email: "admin@airsoft.pt" }, update: {},
    create: { email: "admin@airsoft.pt", name: "Admin", username: "admin", passwordHash: await hash("Admin@123!"), role: UserRole.ADMIN, status: UserStatus.ACTIVE, airsoftPermitId: "ADMIN-001", permitVerified: true, emailVerified: new Date() },
  });

  await prisma.user.upsert({
    where: { email: "org@airsoft.pt" }, update: {},
    create: { email: "org@airsoft.pt", name: "João Org", username: "joao_org", passwordHash: await hash("Org@123!"), role: UserRole.ORGANIZER, status: UserStatus.ACTIVE, airsoftPermitId: "ORG-001", permitVerified: true, emailVerified: new Date() },
  });

  await prisma.user.upsert({
    where: { email: "player@airsoft.pt" }, update: {},
    create: { email: "player@airsoft.pt", name: "Pedro Player", username: "pedro", passwordHash: await hash("Player@123!"), role: UserRole.FREE, status: UserStatus.ACTIVE, airsoftPermitId: "FED-001", permitVerified: true, emailVerified: new Date() },
  });

  console.log("✅ Utilizadores criados");
  console.log("   admin@airsoft.pt     / Admin@123!");
  console.log("   org@airsoft.pt       / Org@123!");
  console.log("   player@airsoft.pt    / Player@123!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
