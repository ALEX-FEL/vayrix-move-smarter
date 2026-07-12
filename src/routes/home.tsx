import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Bell, MapPin, Navigation, ArrowRight, Users, ShieldCheck, User as UserIcon, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useSafety } from "@/providers/SafetyProvider";
import { useRide } from "@/providers/RideProvider";
import { currentLocation, places } from "@/mocks/places";
import { historyService } from "@/services/history.service";
import type { AsyncState, Ride } from "@/models";
import { QueryView } from "@/components/QueryView";
import { toast } from "sonner";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Accueil — Vayrix" }] }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { active, setActive } = useSafety();
  const { setDraft } = useRide();
  const [recent, setRecent] = useState<AsyncState<Ride[]>>({ status: "loading" });

  useEffect(() => {
    historyService.recent(3).then((list) =>
      setRecent(list.length ? { status: "success", data: list } : { status: "empty" }),
    ).catch((e: Error) => setRecent({ status: "error", message: e.message }));
  }, []);

  const quickBook = (to?: (typeof places)[number]) => {
    setDraft({ from: currentLocation, to: to ?? null });
    navigate({ to: to ? "/flow/estimate" : "/flow/pickup" });
  };

  const toggleSafety = () => {
    const next = !active;
    setActive(next);
    toast(next ? "Mode sécurité activé" : "Mode sécurité désactivé", {
      description: next ? "Enregistrement audio et analyse IA prêts." : "",
    });
  };

  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-5">
        <header className="flex items-center justify-between animate-float-up">
          <Link to="/profile" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
              AK
            </div>
            <div>
              <p className="text-[11px] text-[#B8BED6] uppercase tracking-wider">Bonjour</p>
              <h1 className="text-lg font-semibold leading-tight">Alex K.</h1>
            </div>
          </Link>
          <button className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/5 flex items-center justify-center relative">
            <Bell className="h-4 w-4 text-white" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#7B5CFF]" />
          </button>
        </header>

        {/* Safety toggle */}
        <button
          onClick={toggleSafety}
          className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition text-left animate-float-up [animation-delay:40ms] ${
            active
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-[#141B3D] border-white/5"
          }`}
        >
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
            active ? "bg-emerald-500/20 text-emerald-300" : "bg-[#0A0E27] text-[#7B5CFF]"
          }`}>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Mode sécurité</p>
            <p className="text-xs text-[#B8BED6]">
              {active ? "Actif — protection continue pendant la course" : "Inactif — activez avant ou pendant la course"}
            </p>
          </div>
          <div className={`h-6 w-11 rounded-full p-0.5 transition ${active ? "bg-emerald-500" : "bg-white/10"}`}>
            <div className={`h-5 w-5 rounded-full bg-white transition ${active ? "translate-x-5" : ""}`} />
          </div>
        </button>

        {/* Booking card */}
        <section className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 shadow-card animate-float-up [animation-delay:60ms]">
          <h2 className="text-xs uppercase tracking-widest text-[#B8BED6] mb-3">Où allez-vous ?</h2>
          <div className="relative space-y-2">
            <div className="flex items-center gap-3 h-12 px-3 rounded-xl bg-[#0A0E27]">
              <div className="h-2.5 w-2.5 rounded-full bg-[#3B6BFF] shadow-[0_0_10px_#3B6BFF]" />
              <input
                defaultValue={currentLocation.subtitle}
                readOnly
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <MapPin className="h-4 w-4 text-[#B8BED6]" />
            </div>
            <div className="absolute left-[18px] top-[42px] h-3 w-px bg-white/15" />
            <button
              onClick={() => quickBook()}
              className="w-full flex items-center gap-3 h-12 px-3 rounded-xl bg-[#0A0E27] text-left"
            >
              <div className="h-2.5 w-2.5 rounded-sm bg-[#7B5CFF] shadow-[0_0_10px_#7B5CFF]" />
              <span className="flex-1 text-sm text-white/60">Où allez-vous ?</span>
              <Navigation className="h-4 w-4 text-[#B8BED6]" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => quickBook()}
              className="h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              Commander <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate({ to: "/shared" })}
              className="h-12 rounded-xl bg-[#0A0E27] border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4" /> Partager
            </button>
          </div>
        </section>

        {/* Suggestions */}
        <section className="space-y-3 animate-float-up [animation-delay:120ms]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Destinations rapides</h3>
          </div>
          <div className="space-y-2">
            {places.slice(0, 3).map((s) => (
              <button
                key={s.id}
                onClick={() => quickBook(s)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition text-left"
              >
                <div className="h-10 w-10 rounded-xl bg-[#0A0E27] flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-[#7B5CFF]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-[#B8BED6]">{s.subtitle}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#B8BED6]" />
              </button>
            ))}
          </div>
        </section>

        {/* Recent history */}
        <section className="space-y-3 animate-float-up [animation-delay:180ms]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Trajets récents</h3>
            <Link to="/history" className="text-xs text-[#B8BED6]">Voir tout</Link>
          </div>
          <QueryView state={recent} emptyLabel="Pas encore de trajet">
            {(list) => (
              <div className="space-y-2">
                {list.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#141B3D] border border-white/5">
                    <div className="h-9 w-9 rounded-lg bg-[#0A0E27] flex items-center justify-center">
                      <Clock className="h-4 w-4 text-[#7B5CFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.from.name} → {r.to.name}</p>
                      <p className="text-[11px] text-[#B8BED6]">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm font-bold tabular-nums">{(r.finalPrice ?? r.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </QueryView>
        </section>

        <button
          onClick={() => navigate({ to: "/profile" })}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-[#141B3D] border border-white/5 text-left"
        >
          <div className="h-10 w-10 rounded-xl bg-[#0A0E27] flex items-center justify-center text-[#7B5CFF]">
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Mon profil</p>
            <p className="text-xs text-[#B8BED6]">Contacts d'urgence, préférences</p>
          </div>
          <ArrowRight className="h-4 w-4 text-[#B8BED6]" />
        </button>
      </div>
    </AppShell>
  );
}
