import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  MapPin, ArrowRight, Users, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  X, Menu, Bell, Bike, Car, Sparkles, Clock,
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

// ── Types de véhicule — carrousel manuel affiché directement sur l'accueil ──
// (photos illustratives en attendant les vraies images produit)
const VEHICLE_TYPES = [
  {
    id: "moto" as const,
    label: "Moto",
    desc: "Rapide & économique",
    icon: Bike,
    image: "https://images.unsplash.com/photo-1558980664-10ea9f223d1e?w=300&q=80&auto=format&fit=crop",
  },
  {
    id: "classic" as const,
    label: "Classique",
    desc: "Confort standard",
    icon: Car,
    image: "https://images.unsplash.com/photo-1550355191-aa8a80b41353?w=300&q=80&auto=format&fit=crop",
  },
  {
    id: "premium" as const,
    label: "Premium",
    desc: "Berline haut de gamme",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&q=80&auto=format&fit=crop",
  },
];

// ── Publicités — contenu + images externes, propres au contexte Vayrix/Cameroun ──
const ADS = [
  {
    title: "Mobile Money -10%",
    subtitle: "Payez votre course en Mobile Money et économisez sur chaque trajet cette semaine.",
    cta: "En profiter",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Resto Le Palais — Livraison",
    subtitle: "Commandez votre plat préféré et faites-le livrer par un chauffeur Vayrix en 20 min.",
    cta: "Découvrir",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Sécurit'Route Assurance",
    subtitle: "Une assurance auto pensée pour les chauffeurs Vayrix, souscription en 5 minutes.",
    cta: "En savoir plus",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Marché Frais Supermarché",
    subtitle: "Vos courses de la semaine livrées à domicile, réservez votre créneau via Vayrix.",
    cta: "Réserver",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop",
  },
];

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
  const [recent, setRecent] = useState<AsyncState<Ride[]>>({ status: "loading" });
  // TODO: brancher sur un vrai service de notifications
  const [notificationCount] = useState(2);

  const [selectedVehicle, setSelectedVehicle] = useState(draft.vehicle ?? "classic");
  const [showRecent, setShowRecent] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const adScrollRef = useRef<HTMLDivElement>(null);

  const [destQuery, setDestQuery] = useState("");
  const [showDestList, setShowDestList] = useState(false);

  const destRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    historyService
      .recent(4)
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

  const handleSelectDestination = (to: Place) => {
    setDestQuery(to.name);
    setShowDestList(false);
    // Le point de départ par défaut reste la position GPS actuelle ;
    // le champ dédié au pickup a été retiré de l'accueil (cf. croquis).
    setDraft({ from: draft.from || currentLocation, to, vehicle: selectedVehicle });
    navigate({ to: "/flow/estimate" });
  };

  const destListItems = filteredDest.slice(0, 5).map((p) => ({
    icon: <MapPin className="h-4 w-4 text-[#7B5CFF]" />,
    label: p.name,
    sub: p.subtitle,
    place: p,
  }));

  const scrollAdsBy = (dir: 1 | -1) => {
    const el = adScrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.86;
    el.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
    setAdIndex((i) => Math.min(ADS.length - 1, Math.max(0, i + dir)));
  };

  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-5">
        {/* Header — menu (options/profil) · notifications, logo légèrement en dessous */}
        <header className="relative animate-float-up">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: "/option" })}
              aria-label="Menu et options"
              className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/5 flex items-center justify-center shrink-0"
            >
              <Menu className="h-4 w-4 text-[#B8BED6]" />
            </button>

            <button
              onClick={() => navigate({ to: "/notifications" })}
              aria-label="Notifications"
              className="relative h-10 w-10 rounded-full bg-[#141B3D] border border-white/5 flex items-center justify-center shrink-0"
            >
              <Bell className="h-4 w-4 text-[#B8BED6]" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-[#7B5CFF] text-[9px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(123,92,255,0.6)]">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* Logo centré, légèrement en retrait sous les boutons + arc décoratif */}
          <div className="flex flex-col items-center -mt-1">
            <span className="text-[22px] font-black tracking-[-0.02em] leading-none bg-gradient-to-r from-white via-[#c8b8ff] to-[#7B5CFF] bg-clip-text text-transparent">
              VAYRIX
            </span>
            <svg viewBox="0 0 200 24" className="w-28 h-4 mt-1" preserveAspectRatio="none">
              <path
                d="M2,2 Q100,24 198,2"
                fill="none"
                stroke="url(#arcGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B6BFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#7B5CFF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3B6BFF" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </header>

        {/* Carrousel manuel — choix du type de véhicule, directement sur l'accueil */}
        <section className="animate-float-up [animation-delay:20ms]">
          <div
            className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {VEHICLE_TYPES.map((v) => {
              const Icon = v.icon;
              const active = selectedVehicle === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`snap-start shrink-0 w-[128px] rounded-2xl border overflow-hidden text-left transition ${
                    active ? "border-[#7B5CFF]/70 shadow-glow bg-[#1a2348]" : "border-white/5 bg-[#141B3D]"
                  }`}
                >
                  <div className="h-16 w-full relative">
                    <img src={v.image} alt={v.label} className="h-full w-full object-cover" />
                    <div className="absolute top-1.5 left-1.5 h-6 w-6 rounded-full bg-[#0A0E27]/80 backdrop-blur flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5 text-[#7B5CFF]" />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold">{v.label}</p>
                    <p className="text-[10px] text-[#B8BED6] truncate">{v.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Zone "Course" — titre centré + champ destination */}
        <section className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 shadow-card animate-float-up [animation-delay:40ms]">
          <h2 className="text-center text-sm font-semibold tracking-wide mb-3">Course</h2>

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

          {/* Commander / Partager — même ligne, même taille, répartition équitable */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => { destRef.current?.focus(); setShowDestList(true); }}
              className="h-12 rounded-2xl bg-gradient-primary text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 transition hover:brightness-110 active:scale-[0.98]"
            >
              <ArrowRight className="h-4 w-4" />
              Commander
            </button>
            <button
              onClick={() => navigate({ to: "/shared" })}
              className="h-12 rounded-2xl bg-[#0A0E27] border border-white/10 text-[#B8BED6] font-semibold text-sm flex items-center justify-center gap-2 transition hover:bg-white/5 hover:text-white hover:border-[#7B5CFF]/40 active:scale-[0.98]"
            >
              <Users className="h-4 w-4" />
              Partager
            </button>
          </div>
        </section>

        {/* Trajets récents — accordéon compact, scrollable à partir de 4 */}
        <section className="animate-float-up [animation-delay:60ms]">
          <button
            onClick={() => setShowRecent((s) => !s)}
            className="w-full flex items-center justify-between px-4 h-11 rounded-xl bg-[#141B3D] border border-white/5 text-sm font-semibold"
          >
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#7B5CFF]" />
              Trajets récents
            </span>
            {showRecent ? (
              <ChevronUp className="h-4 w-4 text-[#B8BED6]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#B8BED6]" />
            )}
          </button>

          {showRecent && (
            <div className="mt-2 rounded-xl bg-[#141B3D] border border-white/5 overflow-hidden">
              {recent.status === "success" ? (
                <div className="max-h-[176px] overflow-y-auto divide-y divide-white/5">
                  {recent.data.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDraft({ from: r.from, to: r.to });
                        navigate({ to: "/flow/estimate" });
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-white/5 transition"
                    >
                      <MapPin className="h-3.5 w-3.5 text-[#B8BED6] shrink-0" />
                      <p className="text-xs truncate">
                        {r.from?.name ?? "Départ"} <span className="text-[#B8BED6]">→</span> {r.to?.name ?? "Arrivée"}
                      </p>
                    </button>
                  ))}
                </div>
              ) : recent.status === "empty" ? (
                <p className="px-4 py-3 text-xs text-[#B8BED6]">Aucun trajet récent pour le moment.</p>
              ) : (
                <p className="px-4 py-3 text-xs text-[#B8BED6]">Chargement…</p>
              )}
            </div>
          )}
        </section>

        {/* Publicité défilante — carrousel navigable */}
        <section className="animate-float-up [animation-delay:80ms]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs uppercase tracking-widest text-[#B8BED6]">Publicité</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollAdsBy(-1)}
                aria-label="Publicité précédente"
                className="h-6 w-6 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
              >
                <ChevronLeft className="h-3 w-3 text-[#B8BED6]" />
              </button>
              <button
                onClick={() => scrollAdsBy(1)}
                aria-label="Publicité suivante"
                className="h-6 w-6 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
              >
                <ChevronRight className="h-3 w-3 text-[#B8BED6]" />
              </button>
            </div>
          </div>

          <div
            ref={adScrollRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {ADS.map((ad, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[86%] rounded-2xl bg-[#141B3D] border border-white/5 overflow-hidden"
              >
                <div className="h-28 w-full">
                  <img src={ad.image} alt={ad.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-semibold">{ad.title}</p>
                  <p className="mt-1 text-xs text-[#B8BED6] leading-relaxed">{ad.subtitle}</p>
                  <button className="mt-2 text-xs font-semibold text-[#7B5CFF]">{ad.cta} →</button>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs */}
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {ADS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === adIndex ? "w-4 bg-[#7B5CFF]" : "w-1.5 bg-white/15"
                }`}
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}