import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Bell, MapPin, Navigation, Plane, Store, Building2, ArrowRight, Clock, Wallet } from "lucide-react";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — Vayrix" }] }),
  component: Home,
});

const suggestions = [
  { name: "Nsimalen Airport", subtitle: "Yaoundé", icon: Plane },
  { name: "Marché Central", subtitle: "Centre-ville", icon: Store },
  { name: "Bastos", subtitle: "Quartier diplomatique", icon: Building2 },
];

function Home() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-5">
        {/* Header */}
        <header className="flex items-center justify-between animate-float-up">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
              AK
            </div>
            <div>
              <p className="text-[11px] text-[#B8BED6] uppercase tracking-wider">Bonjour</p>
              <h1 className="text-lg font-semibold leading-tight">Alex K.</h1>
            </div>
          </div>
          <button className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/5 flex items-center justify-center relative">
            <Bell className="h-4 w-4 text-white" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#7B5CFF]" />
          </button>
        </header>

        {/* Booking card */}
        <section className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 shadow-card animate-float-up [animation-delay:60ms]">
          <h2 className="text-xs uppercase tracking-widest text-[#B8BED6] mb-3">
            Where to?
          </h2>
          <div className="relative space-y-2">
            <div className="flex items-center gap-3 h-12 px-3 rounded-xl bg-[#0A0E27]">
              <div className="h-2.5 w-2.5 rounded-full bg-[#3B6BFF] shadow-[0_0_10px_#3B6BFF]" />
              <input
                defaultValue="Essos, Yaoundé"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <MapPin className="h-4 w-4 text-[#B8BED6]" />
            </div>
            <div className="absolute left-[18px] top-[42px] h-3 w-px bg-white/15" />
            <div className="flex items-center gap-3 h-12 px-3 rounded-xl bg-[#0A0E27]">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#7B5CFF] shadow-[0_0_10px_#7B5CFF]" />
              <input
                placeholder="Where are you going?"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
              />
              <Navigation className="h-4 w-4 text-[#B8BED6]" />
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/booking" })}
            className="mt-4 w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 active:scale-[0.99] transition"
          >
            Book a Ride <ArrowRight className="h-4 w-4" />
          </button>
        </section>


        {/* Suggestions */}
        <section className="space-y-3 animate-float-up [animation-delay:180ms]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Suggestions</h3>
            <button className="text-xs text-[#B8BED6]">See all</button>
          </div>
          <div className="space-y-2">
            {suggestions.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.name}
                  onClick={() => navigate({ to: "/booking" })}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition text-left"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#0A0E27] flex items-center justify-center">
                    <Icon className="h-4 w-4 text-[#7B5CFF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-[#B8BED6]">{s.subtitle}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#B8BED6]" />
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({
  icon, label, value, highlight,
}: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-[#0A0E27]/60 px-2.5 py-2.5">
      <div className="flex items-center gap-1 text-[#B8BED6]">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className={`mt-1 text-sm font-bold ${highlight ? "text-gradient-primary" : "text-white"}`}>{value}</p>
    </div>
  );
}
