import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/db/client";
import { Check, X, Shield, Star, Zap, Crown } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield size={16} />, Star: <Star size={16} />,
  Zap: <Zap size={16} />, Crown: <Crown size={16} />,
};

export default async function PricingPage() {
  const tiers = await prisma.tier.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950">
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
          <h1 className="text-white text-4xl font-bold mb-4">Escolhe o teu plano</h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">Começa gratuitamente e evolui conforme a tua dedicação.</p>
        </section>
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiers.map((tier) => {
              const isPopular = tier.role === "PREMIUM";
              const features = [
                { text: "Eventos públicos", included: true },
                { text: tier.maxMonthlyRegistrations === -1 ? "Inscrições ilimitadas" : `${tier.maxMonthlyRegistrations} inscrições/mês`, included: true },
                { text: tier.maxMonthlyReviews === 0 ? "Sem reviews" : tier.maxMonthlyReviews === -1 ? "Reviews ilimitadas" : `${tier.maxMonthlyReviews} reviews/mês`, included: tier.maxMonthlyReviews !== 0 },
                { text: "Badge no perfil", included: tier.hasBadge },
                { text: "Perfil destacado", included: tier.isProfileHighlighted },
                { text: "Eventos exclusivos", included: tier.canAccessExclusiveEvents },
              ];
              return (
                <div key={tier.id} className={`relative flex flex-col bg-zinc-900 rounded-2xl p-6 border-2 transition-transform hover:-translate-y-1 duration-200 ${isPopular ? "border-green-500" : "border-zinc-700"}`}>
                  {isPopular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2"><span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Mais popular</span></div>}
                  <div className="mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: `${tier.color}25`, color: tier.color }}>
                      {iconMap[tier.badgeIcon]} {tier.name}
                    </div>
                    <div className="flex items-end gap-1 mb-1">
                      {tier.price === 0 ? <span className="text-white text-3xl font-bold">Grátis</span> : <><span className="text-white text-3xl font-bold">€{tier.price.toFixed(2)}</span><span className="text-zinc-500 text-sm mb-1">/mês</span></>}
                    </div>
                    <p className="text-zinc-500 text-sm">{tier.description}</p>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5">
                        {f.included ? <Check size={15} className="text-green-400 mt-0.5 shrink-0" /> : <X size={15} className="text-zinc-700 mt-0.5 shrink-0" />}
                        <span className={`text-sm ${f.included ? "text-zinc-300" : "text-zinc-600"}`}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-2.5 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: tier.price === 0 ? "#3f3f46" : tier.color }}>
                    {tier.price === 0 ? "Começar grátis" : `Subscrever ${tier.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
