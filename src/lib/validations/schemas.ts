import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, "Apenas letras minúsculas, números e _"),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(8, "Mínimo 8 caracteres").regex(/[A-Z]/, "Deve ter maiúscula").regex(/[0-9]/, "Deve ter número"),
  confirmPassword: z.string(),
  airsoftPermitId: z.string().min(3, "Licença inválida"),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "Deve aceitar os termos" }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords não coincidem", path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Password obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
