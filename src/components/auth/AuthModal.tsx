"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, loginSchema, RegisterInput, LoginInput } from "@/lib/validations/schemas";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type Tab = "login" | "register";

export default function AuthModal({ defaultTab = "login", trigger }: { defaultTab?: Tab; trigger: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const switchTab = (t: Tab) => { setTab(t); setError(null); setSuccess(null); };

  const onLogin = async (data: LoginInput) => {
    setLoading(true); setError(null);
    const result = await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Email ou password incorretos."); return; }
    setOpen(false);
    router.push("/dashboard");
    router.refresh();
  };

  const onRegister = async (data: RegisterInput) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Erro ao criar conta."); return; }
      setSuccess("Conta criada! Podes entrar agora.");
      switchTab("login");
      registerForm.reset();
    } catch { setError("Erro de rede."); }
    finally { setLoading(false); }
  };

  const inp = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-zinc-600";
  const lbl = "block text-zinc-400 text-sm mb-1.5";

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { setOpen(o); setError(null); setSuccess(null); }}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <Dialog.Title className="sr-only">Autenticação</Dialog.Title>
          <Dialog.Close className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </Dialog.Close>

          <div className="text-center mb-6">
            <span className="text-2xl">🎯</span>
            <span className="text-white font-bold text-lg ml-2">Airsoft Events PT</span>
          </div>

          <div className="flex bg-zinc-800 rounded-xl p-1 mb-5">
            {(["login", "register"] as Tab[]).map((t) => (
              <button key={t} onClick={() => switchTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                {t === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {error && <div className="mb-4 p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-300 text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-950/50 border border-green-800 rounded-lg text-green-300 text-sm">✅ {success}</div>}

          {tab === "login" && (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className={lbl}>Email</label>
                <input {...loginForm.register("email")} type="email" className={inp} placeholder="joao@email.com" />
                {loginForm.formState.errors.email && <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className={lbl}>Password</label>
                <input {...loginForm.register("password")} type="password" className={inp} placeholder="••••••••" />
                {loginForm.formState.errors.password && <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.password.message}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                {loading ? "A entrar..." : "Entrar"}
              </button>
              <p className="text-center text-zinc-500 text-xs">
                Não tens conta?{" "}
                <button type="button" onClick={() => switchTab("register")} className="text-green-400 hover:underline">Cria uma agora</button>
              </p>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Nome *</label>
                  <input {...registerForm.register("name")} className={inp} placeholder="João Silva" />
                  {registerForm.formState.errors.name && <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.name.message}</p>}
                </div>
                <div>
                  <label className={lbl}>Username *</label>
                  <input {...registerForm.register("username")} className={inp} placeholder="joao_silva" />
                  {registerForm.formState.errors.username && <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.username.message}</p>}
                </div>
              </div>
              <div>
                <label className={lbl}>Email *</label>
                <input {...registerForm.register("email")} type="email" className={inp} placeholder="joao@email.com" />
                {registerForm.formState.errors.email && <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className={lbl}>Nº Licença de Airsoft *</label>
                <input {...registerForm.register("airsoftPermitId")} className={`${inp} font-mono`} placeholder="FED-12345" />
                {registerForm.formState.errors.airsoftPermitId && <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.airsoftPermitId.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Password *</label>
                  <input {...registerForm.register("password")} type="password" className={inp} placeholder="••••••••" />
                  {registerForm.formState.errors.password && <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.password.message}</p>}
                </div>
                <div>
                  <label className={lbl}>Confirmar *</label>
                  <input {...registerForm.register("confirmPassword")} type="password" className={inp} placeholder="••••••••" />
                  {registerForm.formState.errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input {...registerForm.register("acceptTerms")} type="checkbox" id="terms" className="mt-0.5 w-4 h-4 accent-green-500" />
                <label htmlFor="terms" className="text-zinc-400 text-xs">Aceito os Termos e Condições</label>
              </div>
              {registerForm.formState.errors.acceptTerms && <p className="text-red-400 text-xs">{registerForm.formState.errors.acceptTerms.message}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                {loading ? "A criar conta..." : "Criar conta"}
              </button>
              <p className="text-center text-zinc-500 text-xs">
                Já tens conta?{" "}
                <button type="button" onClick={() => switchTab("login")} className="text-green-400 hover:underline">Entra aqui</button>
              </p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
