import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — Vayrix" }] }),
  component: History,
});

type Trip = {
  from: string;
  to: string;
  price: number;
  date: Date;
  status: "completed" | "cancelled";
  driverName: string;
};

const allRides: Trip[] = [
  { from: "Essos", to: "Nsimalen Airport", price: 1500, date: new Date(), status: "completed", driverName: "Eric T." },
  { from: "Bastos", to: "Akwa", price: 900, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "completed", driverName: "Marie K." },
  { from: "Mvog-Mbi", to: "Marché Central", price: 650, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: "cancelled", driverName: "Paul N." },
  { from: "Omnisport", to: "Bastos", price: 1100, date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), status: "completed", driverName: "Eric T." },
  { from: "Mvan", to: "Centre-ville", price: 850, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), status: "completed", driverName: "Jean M." },
  { from: "Essos", to: "Mvan", price: 700, date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), status: "completed", driverName: "Alex D." },
  { from: "Akwa", to: "Bastos", price: 550, date: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), status: "cancelled", driverName: "Pierre L." },
  { from: "Mvan", to: "Nsimalen Airport", price: 2200, date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), status: "completed", driverName: "Eric T." },
];

type TimeFilter = "today" | "week" | "month" | "year";

function History() {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<TimeFilter>("today");

  const filteredRides = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let startDate: Date;
    switch (filter) {
      case "today":
        startDate = startOfDay;
        break;
      case "week":
        startDate = startOfWeek;
        break;
      case "month":
        startDate = startOfMonth;
        break;
      case "year":
        startDate = startOfYear;
        break;
    }

    return allRides.filter((ride) => ride.date >= startDate);
  }, [filter]);

  const stats = useMemo(() => {
    const completed = filteredRides.filter((r) => r.status === "completed");
    const total = completed.reduce((acc, r) => acc + r.price, 0);
    return { total, trips: filteredRides.length, completed: completed.length };
  }, [filteredRides]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return language === "fr"
        ? `Aujourd'hui · ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
        : `Today · ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (days === 1) {
      return language === "fr"
        ? `Hier · ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
        : `Yesterday · ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (days < 7) {
      return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-5">
        <header className="animate-float-up">
          <h1 className="text-2xl font-bold">{t.history.title}</h1>
          <p className="text-sm text-[#B8BED6]">{t.history.subtitle}</p>
        </header>

        <div className="inline-flex p-1 bg-[#141B3D] rounded-xl animate-float-up [animation-delay:40ms]">
          {(["today", "week", "month", "year"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === f
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-[#B8BED6] hover:text-white"
              }`}
            >
              {t.history[f]}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-5 animate-float-up [animation-delay:60ms]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B8BED6]">
                {t.history.spentThisMonth}
              </p>
              <p className="mt-1 text-3xl font-bold text-gradient-primary tabular-nums">
                {stats.total.toLocaleString()}{" "}
                <span className="text-sm text-white/70">XAF</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#B8BED6]">{t.history.trips}</p>
              <p className="text-2xl font-bold">{stats.trips}</p>
            </div>
          </div>
        </div>

        {filteredRides.length === 0 ? (
          <div className="text-center py-12 animate-float-up [animation-delay:120ms]">
            <Calendar className="h-12 w-12 text-[#B8BED6] mx-auto mb-3 opacity-50" />
            <p className="text-sm text-[#B8BED6]">
              {language === "fr" ? "Aucun trajet pour cette période" : "No trips for this period"}
            </p>
          </div>
        ) : (
          <div className="space-y-2 animate-float-up [animation-delay:120ms]">
            {filteredRides.map((ride, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition text-left"
              >
                <div className="h-12 w-12 rounded-xl bg-[#0A0E27] flex flex-col items-center justify-center gap-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#3B6BFF]" />
                  <div className="h-4 w-px bg-gradient-to-b from-white/30 to-transparent" />
                  <div className="h-2 w-2 rounded-sm bg-[#7B5CFF] rotate-45" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {ride.from} → {ride.to}
                  </p>
                  <p className="text-xs text-[#B8BED6]">{formatDate(ride.date)}</p>
                  <p className="text-[10px] text-[#B8BED6] mt-0.5">{ride.driverName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums">{ride.price.toLocaleString()}</p>
                  <p className="text-[10px] text-[#B8BED6]">XAF</p>
                  <span
                    className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full ${
                      ride.status === "completed"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    {ride.status === "completed" ? t.history.completed : t.history.cancelled}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
