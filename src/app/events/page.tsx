import { prisma } from "@/lib/db/client";
import Link from "next/link";
import { EventStatus } from "@prisma/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarSearch } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

async function getPublishedEvents() {
  return prisma.event.findMany({
    where: { status: EventStatus.PUBLISHED, isPublic: true },
    include: {
      organizer: { select: { name: true, username: true } },
      categories: { include: { category: true } },
      _count: { select: { registrations: true } },
    },
    orderBy: { startDate: "asc" },
  });
}

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />
      {/* Hero */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3">
            <CalendarSearch className="text-green-400" size={32} />
            <h1 className="text-white text-3xl font-bold">
              Eventos de Airsoft
            </h1>
          </div>
          <p className="text-zinc-400 mt-2">
            Descobre e inscreve-te nos próximos eventos
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">
              Nenhum evento disponível de momento.
            </p>
            <p className="text-zinc-600 text-sm mt-2">Volta mais tarde!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const isFull = event.currentParticipants >= event.maxParticipants;
              const spotsLeft =
                event.maxParticipants - event.currentParticipants;

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group bg-zinc-900 border border-zinc-800 hover:border-green-700 rounded-2xl overflow-hidden transition-colors"
                >
                  {/* Cover image placeholder */}
                  <div className="h-44 bg-zinc-800 relative overflow-hidden">
                    {event.coverImageUrl ? (
                      <img
                        src={event.coverImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl opacity-30">🎯</span>
                      </div>
                    )}
                    {isFull && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        ESGOTADO
                      </div>
                    )}
                    {event.registrationFee === 0 && !isFull && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        GRÁTIS
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    {/* Categories */}
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      {event.categories.slice(0, 2).map(({ category }) => (
                        <span
                          key={category.id}
                          className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-300"
                          style={
                            category.color
                              ? {
                                backgroundColor: `${category.color}30`,
                                color: category.color,
                              }
                              : {}
                          }
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-white font-semibold text-base leading-tight group-hover:text-green-300 transition-colors">
                      {event.title}
                    </h2>

                    {event.shortDescription && (
                      <p className="text-zinc-500 text-sm mt-1.5 line-clamp-2">
                        {event.shortDescription}
                      </p>
                    )}

                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        <span>📅</span>
                        <span>
                          {format(event.startDate, "d 'de' MMMM yyyy", {
                            locale: pt,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        <span>📍</span>
                        <span>{event.locationCity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 text-xs">
                        <span>👥</span>
                        <span>
                          {isFull
                            ? "Esgotado"
                            : `${spotsLeft} vagas disponíveis`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-white font-bold">
                        {event.registrationFee === 0
                          ? "Gratuito"
                          : `€${event.registrationFee.toFixed(2)}`}
                      </span>
                      <span className="text-green-400 text-sm group-hover:text-green-300 transition-colors">
                        Ver evento →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
