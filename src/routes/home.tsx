import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  MapPin, Navigation, ArrowRight, Users,
  Search, ChevronDown, X, SlidersHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRide } from "@/providers/RideProvider";
import { currentLocation, places } from "@/mocks/places";
import { historyService } from "@/services/history.service";
import type { AsyncState, Place, Ride } from "@/models";

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
    <div className="rounded-2xl bg-[#1a2348]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
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
  const { setDraft, draft } = useRide();
  const [, setRecent] = useState<AsyncState<Ride[]>>({ status: "loading" });

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
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-5">
        {/* Header — VAYRIX wordmark instead of profile */}
        <header className="flex items-center justify-between animate-float-up">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
              <Navigation className="h-4 w-4 text-white rotate-45" strokeWidth={2.5} />
              <span className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-50 -z-10" />
            </div>
            <span className="text-[22px] font-black tracking-tight bg-gradient-to-r from-white via-[#d8cbff] to-[#7B5CFF] bg-clip-text text-transparent">
              VAYRIX
            </span>
          </div>

          <button
            onClick={() => navigate({ to: "/option" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/5 flex items-center justify-center"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#B8BED6]" />
          </button>
        </header>

        {/* Main booking card */}
        <section className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 shadow-card animate-float-up [animation-delay:40ms]">
          <h2 className="text-xs uppercase tracking-widest text-[#B8BED6] mb-3">Où allez-vous ?</h2>

          <div className="space-y-2">
            {/* ── Pickup field ── */}
            <div className="relative">
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

              {showPickupList && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20">
                  <PlaceList items={pickupListItems} onSelect={handleSelectPickup} />
                </div>
              )}
            </div>

            {/* Connector line */}
            <div className="flex items-center gap-3 px-3 h-3">
              <div className="flex justify-center w-[10px]">
                <div className="w-px h-3 bg-white/15" />
              </div>
            </div>

            {/* ── Destination field ── */}
            <div className="relative">
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

              {showDestList && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20">
                  <PlaceList items={destListItems} onSelect={handleSelectDestination} />
                </div>
              )}
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => { destRef.current?.focus(); setShowDestList(true); }}
              className="flex-1 h-13 py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2.5 active:scale-[0.98] transition"
            >
              <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              Commander une course
            </button>
            <button
              onClick={() => navigate({ to: "/shared" })}
              aria-label="Partager la course"
              className="h-13 w-13 shrink-0 rounded-2xl bg-[#0A0E27] border border-white/10 text-[#B8BED6] flex items-center justify-center active:scale-[0.96] transition"
            >
              <Users className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}