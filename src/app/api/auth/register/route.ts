import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/client";
import { registerSchema } from "@/lib/validations/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const { name, email, username, phone, password, airsoftPermitId } = parsed.data;

    if (await prisma.user.findUnique({ where: { email } }))
      return NextResponse.json({ error: "Email já registado." }, { status: 409 });

    if (await prisma.user.findUnique({ where: { username } }))
      return NextResponse.json({ error: "Username já em uso." }, { status: 409 });

    if (await prisma.user.findUnique({ where: { airsoftPermitId } }))
      return NextResponse.json({ error: "Licença já associada a uma conta." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);

    // Get free tier
    const freeTier = await prisma.tier.findUnique({ where: { role: "FREE" } });

    await prisma.user.create({
      data: {
        name, email, username,
        phone: phone || null,
        passwordHash,
        airsoftPermitId,
        status: "ACTIVE", // Simplified: skip email verification for now
        tierId: freeTier?.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
