import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Bell, MapPin, Navigation, ArrowRight, Users, ShieldCheck,
  User as UserIcon, Clock, Search, ChevronDown, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSafety } from "@/providers/SafetyProvider";
import { useRide } from "@/providers/RideProvider";
import { currentLocation, places } from "@/mocks/places";
import { historyService } from "@/services/history.service";
import type { AsyncState, Place, Ride } from "@/models";
import { QueryView } from "@/components/QueryView";
import { toast } from "sonner";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Accueil — Vayrix" }] }),
  component: Home,
});

function PlaceList({
  items,
  onSelect,
  header,
}: {
  items: { icon: React.ReactNode; label: string; sub: string; badge?: React.ReactNode; place: Place }[];
  onSelect: (p: Place) => void;
  header?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#1a2348] border border-white/10 overflow-hidden">
      {header}
      {items.map((item, i) => (
        <button
          key={i}
          onMouseDown={(e) => { e.preventDefault(); onSelect(item.place); }}
          className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 active:bg-white/10 text-left transition ${
            i > 0 || header ? "border-t border-white/5" : ""
          }`}
        >
          <div className="h-9 w-9 rounded-xl bg-[#0A0E27] flex items-center justify-center shrink-0">
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.label}</p>
            <p className="text-xs text-[#B8BED6] truncate">{item.sub}</p>
          </div>
          {item.badge}
        </button>
      ))}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const { active, setActive } = useSafety();
  const { setDraft, draft } = useRide();
  const [recent, setRecent] = useState<AsyncState<Ride[]>>({ status: "loading" });

  const [destQuery, setDestQuery] = useState("");
  const [showDestList, setShowDestList] = useState(false);
  const [pickupQuery, setPickupQuery] = useState(currentLocation.subtitle);
  const [showPickupList, setShowPickupList] = useState(false);

  const destRef = useRef<HTMLInputElement>(null);
  const pickupRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    historyService
      .recent(3)
      .then((list) =>
        setRecent(list.length ? { status: "success", data: list } : { status: "empty" }),
      )
      .catch((e: Error) => setRecent({ status: "error", message: e.message }));
  }, []);

  const filteredDest = destQuery.length > 0
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(destQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(destQuery.toLowerCase()),
      )
    : places;

  const filteredPickup = pickupQuery.length > 0
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(pickupQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(pickupQuery.toLowerCase()),
      )
    : places;

  const handleSelectDestination = (to: Place) => {
    setDestQuery(to.name);
    setShowDestList(false);
    setDraft({ from: draft.from || currentLocation, to });
    navigate({ to: "/flow/estimate" });
  };

  const handleSelectPickup = (p: Place) => {
    setPickupQuery(p === currentLocation ? currentLocation.subtitle : p.name);
    setDraft({ from: p });
    setShowPickupList(false);
  };

  const toggleSafety = () => {
    const next = !active;
    setActive(next);
    toast(next ? "Mode sécurité activé" : "Mode sécurité désactivé", {
      description: next ? "Enregistrement audio et analyse IA prêts." : "",
    });
  };

  const pickupListItems = [
    {
      icon: <Navigation className="h-4 w-4 text-[#3B6BFF]" />,
      label: "Position actuelle",
      sub: currentLocation.subtitle,
      badge: (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 shrink-0">
          GPS
        </span>
      ),
      place: currentLocation,
    },
    ...filteredPickup.slice(0, 4).map((p) => ({
      icon: <MapPin className="h-4 w-4 text-[#B8BED6]" />,
      label: p.name,
      sub: p.subtitle,
      place: p,
    })),
  ];

  const destListItems = filteredDest.slice(0, 5).map((p) => ({
    icon: <MapPin className="h-4 w-4 text-[#7B5CFF]" />,
    label: p.name,
    sub: p.subtitle,
    place: p,
  }));

  return (
      <div className="px-5 pt-2 pb-6 space-y-5">
        {/* Header */}
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
          className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition text-left animate-float-up [animation-delay:80ms] ${
            active
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-[#141B3D] border-white/5"
          }`}
        >
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              active ? "bg-emerald-500/20 text-emerald-300" : "bg-[#0A0E27] text-[#7B5CFF]"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Mode sécurité</p>
            <p className="text-xs text-[#B8BED6]">
              {active
                ? "Actif — protection continue pendant la course"
                : "Inactif — activez avant ou pendant la course"}
            </p>
          </div>
          <div className={`h-6 w-11 rounded-full p-0.5 transition ${active ? "bg-emerald-500" : "bg-white/10"}`}>
            <div className={`h-5 w-5 rounded-full bg-white transition ${active ? "translate-x-5" : ""}`} />
          </div>
        </button>

        {/* Main booking card */}
        <section className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 shadow-card animate-float-up [animation-delay:40ms]">
          <h2 className="text-xs uppercase tracking-widest text-[#B8BED6] mb-3">Où allez-vous ?</h2>

          <div className="space-y-2">
            {/* ── Pickup field ── */}
            <div
              className={`flex items-center gap-3 h-12 px-3 rounded-xl bg-[#0A0E27] border transition ${
                showPickupList ? "border-[#3B6BFF]/60" : "border-transparent"
              }`}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-[#3B6BFF] shadow-[0_0_10px_#3B6BFF] shrink-0" />
              <input
                ref={pickupRef}
                value={pickupQuery}
                onChange={(e) => { setPickupQuery(e.target.value); setShowPickupList(true); }}
                onFocus={() => setShowPickupList(true)}
                onBlur={() => setTimeout(() => setShowPickupList(false), 150)}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40 truncate"
                placeholder="Point de départ"
              />
              {showPickupList ? (
                <button onMouseDown={(e) => { e.preventDefault(); setShowPickupList(false); }}>
                  <X className="h-3.5 w-3.5 text-[#B8BED6]" />
                </button>
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-[#B8BED6] shrink-0" />
              )}
            </div>

            {/* Pickup list — inline in flow */}
            {showPickupList && (
              <PlaceList items={pickupListItems} onSelect={handleSelectPickup} />
            )}

            {/* Connector line — only visible when no list open */}
            {!showPickupList && !showDestList && (
              <div className="flex items-center gap-3 px-3 h-3">
                <div className="flex justify-center w-[10px]">
                  <div className="w-px h-3 bg-white/15" />
                </div>
              </div>
            )}

            {/* ── Destination field ── */}
            <div
              className={`flex items-center gap-3 h-12 px-3 rounded-xl bg-[#0A0E27] border transition ${
                showDestList ? "border-[#7B5CFF]/60" : "border-transparent"
              }`}
            >
              <Search className="h-4 w-4 text-[#B8BED6] shrink-0" />
              <input
                ref={destRef}
                value={destQuery}
                onChange={(e) => { setDestQuery(e.target.value); setShowDestList(true); }}
                onFocus={() => setShowDestList(true)}
                onBlur={() => setTimeout(() => setShowDestList(false), 150)}
                placeholder="Entrez votre destination"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
              />
              {destQuery.length > 0 && (
                <button onMouseDown={(e) => { e.preventDefault(); setDestQuery(""); destRef.current?.focus(); }}>
                  <X className="h-3.5 w-3.5 text-[#B8BED6]" />
                </button>
              )}
            </div>

            {/* Destination list — inline in flow */}
            {showDestList && (
              <PlaceList items={destListItems} onSelect={handleSelectDestination} />
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => { destRef.current?.focus(); setShowDestList(true); }}
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

        {/* Recent history */}
        <section className="space-y-3 animate-float-up [animation-delay:180ms]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Trajets récents</h3>
          </div>
          <QueryView state={recent} emptyLabel="Pas encore de trajet">
            {(list) => (
              <div className="space-y-2">
                {list.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectDestination(r.to)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition text-left"
                  >
                    <div className="h-9 w-9 rounded-lg bg-[#0A0E27] flex items-center justify-center">
                      <Clock className="h-4 w-4 text-[#7B5CFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {r.from.name} → {r.to.name}
                      </p>
                      <p className="text-[11px] text-[#B8BED6]">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm font-bold tabular-nums">
                      {(r.finalPrice ?? r.price).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </QueryView>
        </section>

      </div>
    </AppShell>
  );
}
