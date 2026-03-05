import Link from "next/link";
import { prisma } from "@/lib/db/client";
import { EventStatus } from "@prisma/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import Navbar from "@/components/layout/Navbar";

async function getStats() {
  const [events, users] = await Promise.all([
    prisma.event.count({ where: { status: EventStatus.PUBLISHED } }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
  ]);
  return { events, users };
}

async function getUpcomingEvents() {
  return prisma.event.findMany({
    where: { status: EventStatus.PUBLISHED, startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
    take: 3,
    include: { categories: { include: { category: true } } },
  });
}

export default async function HomePage() {
  const [stats, upcoming] = await Promise.all([
    getStats(),
    getUpcomingEvents(),
  ]);
  return (
    <>
      <main className="min-h-screen bg-zinc-950">
        {/* Nav */}
        <Navbar />
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-green-950/50 border border-green-800 rounded-full px-4 py-1.5 text-green-400 text-sm mb-6">
            🇵🇹 A plataforma de airsoft em Portugal
          </div>
          <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
            Encontra o teu <span className="text-green-400">próximo evento</span>
            <br />
            de airsoft
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-10">
            Inscreve-te em eventos MilSim, CQB, Speedsoft e muito mais. Tudo num
            só lugar, com pagamento via MB Way.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/events"
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Ver Eventos →
            </Link>
            <Link
              href="/register"
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Criar conta grátis
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-16">
            <div>
              <p className="text-white text-3xl font-bold">{stats.events}+</p>
              <p className="text-zinc-500 text-sm mt-1">Eventos publicados</p>
            </div>
            <div>
              <p className="text-white text-3xl font-bold">{stats.users}+</p>
              <p className="text-zinc-500 text-sm mt-1">Jogadores registados</p>
            </div>
            <div>
              <p className="text-white text-3xl font-bold">🇵🇹</p>
              <p className="text-zinc-500 text-sm mt-1">Portugal inteiro</p>
            </div>
          </div>
        </section>

        {/* Upcoming events */}
        {upcoming.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 pb-20">
            <h2 className="text-white text-2xl font-bold mb-6">
              Próximos Eventos
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group bg-zinc-900 border border-zinc-800 hover:border-green-700 rounded-2xl p-5 transition-colors"
                >
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {event.categories.slice(0, 2).map(({ category }) => (
                      <span
                        key={category.id}
                        className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-white font-semibold group-hover:text-green-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-zinc-500 text-sm mt-2">
                    📅 {format(event.startDate, "d MMM yyyy", { locale: pt })} ·
                    📍 {event.locationCity}
                  </p>
                  <p className="text-green-400 text-sm font-medium mt-3">
                    {event.registrationFee === 0
                      ? "Grátis"
                      : `€${event.registrationFee.toFixed(2)}`}
                  </p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/events"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                Ver todos os eventos →
              </Link>
            </div>
          </section>
        )}

        {/* Features */}
        <section className="border-t border-zinc-800 bg-zinc-900/50">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-white text-2xl font-bold text-center mb-10">
              Tudo o que precisas
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "🎯",
                  title: "Eventos variados",
                  desc: "MilSim, CQB, Speedsoft, Scenario — encontra o teu estilo",
                },
                {
                  icon: "💳",
                  title: "Pagamento MB Way",
                  desc: "Inscreve-te e paga diretamente com MB Way, sem complicações",
                },
                {
                  icon: "🪪",
                  title: "Licença obrigatória",
                  desc: "Todos os utilizadores validam a sua licença de airsoft",
                },
                {
                  icon: "🔒",
                  title: "Tiers de acesso",
                  desc: "Eventos exclusivos para membros premium e avançados",
                },
                {
                  icon: "📱",
                  title: "100% mobile",
                  desc: "Acede a partir do telemóvel em qualquer lado",
                },
                {
                  icon: "⚙️",
                  title: "Para organizadores",
                  desc: "Ferramentas completas para criar e gerir eventos",
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                >
                  <span className="text-3xl mb-3 block">{feat.icon}</span>
                  <h3 className="text-white font-semibold mb-1">{feat.title}</h3>
                  <p className="text-zinc-500 text-sm">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
