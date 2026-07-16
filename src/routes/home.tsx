import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  MapPin, ArrowRight, Users, Search, ChevronDown, ChevronUp,
  X, Menu, Bell, Clock,
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
// (photos placeholder génériques en attendant les vraies photos des véhicules)
// Toutes les cartes partagent exactement les mêmes dimensions, pas d'icône ni de description.
const VEHICLE_TYPES = [
  { id: "moto" as const, label: "Moto", image: "https://images.unsplash.com/photo-1558980664-10ea9f223d1e?w=300&q=80&auto=format&fit=crop" },
  { id: "classic" as const, label: "Classique", image: "https://images.unsplash.com/photo-1550355191-aa8a80b41353?w=300&q=80&auto=format&fit=crop" },
  { id: "premium" as const, label: "Premium", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&q=80&auto=format&fit=crop" },
  { id: "van" as const, label: "Van", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&q=80&auto=format&fit=crop" },
  { id: "livraison" as const, label: "Livraison", image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300&q=80&auto=format&fit=crop" },
];

// ── Publicités — contenu + images externes, propres au contexte Vayrix/Cameroun ──
const ADS = [
  {
    title: "Mobile Money -10%",
    subtitle: "Payez votre course en Mobile Money et économisez sur chaque trajet cette semaine.",
    cta: "En profiter",
    link: "https://www.google.com/search?q=Mobile+Money+Cameroon",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Resto Le Palais — Livraison",
    subtitle: "Commandez votre plat préféré et faites-le livrer par un chauffeur Vayrix en 20 min.",
    cta: "Découvrir",
    link: "https://www.google.com/search?q=Resto+Le+Palais",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Sécurit'Route Assurance",
    subtitle: "Une assurance auto pensée pour les chauffeurs Vayrix, souscription en 5 minutes.",
    cta: "En savoir plus",
    link: "https://www.google.com/search?q=assurance+auto+Cameroon",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
  },
  {
    title: "Marché Frais Supermarché",
    subtitle: "Vos courses de la semaine livrées à domicile, réservez votre créneau via Vayrix.",
    cta: "Réserver",
    link: "https://www.google.com/search?q=Marché+Frais+Supermarché",
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

  const [selectedVehicle, setSelectedVehicle] = useState<typeof VEHICLE_TYPES[number]["id"]>(
    (draft.vehicle as typeof VEHICLE_TYPES[number]["id"]) ?? "classic",
  );
  // Titre dynamique basé sur le véhicule sélectionné
  const selectedVehicleLabel = VEHICLE_TYPES.find((v) => v.id === selectedVehicle)?.label ?? "";
  const vehicleScrollRef = useRef<HTMLDivElement | null>(null);
  const [vehicleIndex, setVehicleIndex] = useState(() =>
    Math.max(0, VEHICLE_TYPES.findIndex((v) => v.id === selectedVehicle)),
  );
  const carouselItems = [...VEHICLE_TYPES, ...VEHICLE_TYPES, ...VEHICLE_TYPES];

  const centerVehicle = (index: number, behavior: ScrollBehavior = "smooth") => {
    const el = vehicleScrollRef.current;
    if (!el) return;

    const firstChild = el.children[0] as HTMLElement | undefined;
    const cardWidth = (firstChild?.getBoundingClientRect().width ?? 100) + 12;
    const targetDisplayIndex = VEHICLE_TYPES.length + index;
    const child = el.children[targetDisplayIndex] as HTMLElement | undefined;

    if (!child) return;

    const left = Math.max(0, child.offsetLeft - (el.clientWidth - child.clientWidth) / 2);
    el.scrollTo({ left: left + cardWidth * 0.2, behavior });
  };

  useEffect(() => {
    centerVehicle(vehicleIndex, "auto");
  }, [vehicleIndex]);

  const handleVehicleScroll = () => {
    const el = vehicleScrollRef.current;
    if (!el) return;

    const firstChild = el.children[0] as HTMLElement | undefined;
    const cardWidth = (firstChild?.getBoundingClientRect().width ?? 100) + 12;
    const groupWidth = cardWidth * VEHICLE_TYPES.length;
    const threshold = Math.max(80, groupWidth * 0.35);

    if (el.scrollLeft < threshold) {
      el.scrollTo({ left: el.scrollLeft + groupWidth, behavior: "auto" });
      return;
    }

    if (el.scrollLeft + el.clientWidth > el.scrollWidth - threshold) {
      el.scrollTo({ left: el.scrollLeft - groupWidth, behavior: "auto" });
      return;
    }

    const center = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;
    const children = Array.from(el.children) as HTMLElement[];
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    const nextRealIndex = closestIdx % VEHICLE_TYPES.length;
    const id = VEHICLE_TYPES[nextRealIndex]?.id;
    if (id && id !== selectedVehicle) {
      setSelectedVehicle(id);
      setVehicleIndex(nextRealIndex);
    }
  };

  const handleVehicleSelect = (id: typeof VEHICLE_TYPES[number]["id"], index: number) => {
    setSelectedVehicle(id);
    setVehicleIndex(index);
    centerVehicle(index, "smooth");
  };
  const [showRecent, setShowRecent] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const adScrollRef = useRef<HTMLDivElement>(null);
  const adIndexRef = useRef(0);
  const adItems = [...ADS, ...ADS];
  const activeAdIndex = adIndex % ADS.length;

  // Suit la position du scroll natif pour mettre à jour les points d'indicateur
  // (les flèches de navigation ont été retirées, seul le swipe manuel reste).
  const handleAdsScroll = () => {
    const el = adScrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / adItems.length;
    const nextIndex = Math.round(el.scrollLeft / cardWidth);
    adIndexRef.current = nextIndex;
    setAdIndex(nextIndex);
  };

  useEffect(() => {
    const el = adScrollRef.current;
    if (!el) return;

    const interval = window.setInterval(() => {
      const firstChild = el.children[0] as HTMLElement | undefined;
      const cardWidth = firstChild?.getBoundingClientRect().width ?? 230;
      adIndexRef.current = (adIndexRef.current + 1) % adItems.length;
      setAdIndex(adIndexRef.current);

      const targetLeft = adIndexRef.current * cardWidth;
      el.scrollTo({ left: targetLeft, behavior: "smooth" });

      if (adIndexRef.current === ADS.length) {
        window.setTimeout(() => {
          el.scrollTo({ left: 0, behavior: "auto" });
          adIndexRef.current = 0;
          setAdIndex(0);
        }, 350);
      }
    }, 4000);

    return () => window.clearInterval(interval);
  }, [adItems.length]);

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

  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-5 w-full overflow-x-hidden">
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
          <div className="flex flex-col items-center mt-1">
            <span
              className="text-[22px] font-black tracking-[-0.02em] leading-none text-white sm:bg-gradient-to-r sm:from-white sm:via-[#c8b8ff] sm:to-[#7B5CFF] sm:bg-clip-text sm:text-transparent"
            >
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
            ref={vehicleScrollRef}
            onScroll={handleVehicleScroll}
            className="flex gap-3 overflow-x-auto px-1 py-3 snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing overscroll-x-contain scroll-smooth"
            style={{ scrollbarWidth: "none", touchAction: "pan-x", scrollPadding: "0 1rem" }}
          >
            {carouselItems.map((v, i) => {
              const realIndex = i % VEHICLE_TYPES.length;
              const item = VEHICLE_TYPES[realIndex];
              const active = vehicleIndex === realIndex;
              return (
                // <button
                //   key={v.id}
                //   onClick={() => setSelectedVehicle(v.id)}
                //   className={`snap-start shrink-0 w-[100px] h-[92px] rounded-2xl border overflow-hidden text-left transition select-none ${
                //     active ? "border-[#7B5CFF]/70 shadow-glow bg-[#1a2348]" : "border-white/5 bg-[#141B3D]"
                //   }`}
                // >
                //   <img
                //     src={v.image}
                //     alt={v.label}
                //     draggable={false}
                //     className="h-[60px] w-full object-cover"
                //   />
                //   {/* <p className="h-8 flex items-center justify-center text-xs font-semibold px-1 truncate">
                //     {v.label}
                //   </p> */}
                // </button>
                <button
                  key={`${item.id}-${i}`}
                  onClick={() => handleVehicleSelect(item.id, realIndex)}
                  className={`snap-start shrink-0 w-[100px] rounded-2xl border overflow-hidden text-left transform-gpu transition-all duration-300 will-change-transform select-none ${
                    active
                      ? "border-[#7B5CFF]/80 bg-[#1a2348] scale-110 -translate-y-2 z-20 shadow-[0_14px_30px_-10px_rgba(123,92,255,0.6)] ring-2 ring-[#7B5CFF]/40"
                      : "border-white/5 bg-[#141B3D] scale-90 opacity-70"
                  }`}
                >
                  <div className="aspect-[3/2] w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.label}
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Zone "Course" — titre centré + champ destination */}
        <section className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 shadow-card animate-float-up [animation-delay:40ms]">
          <h2 className="text-center text-sm font-semibold tracking-wide mb-3">
            {selectedVehicleLabel ? `${selectedVehicleLabel}` : "Course"}
          </h2>

          <div>
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

            {/* En flux normal (plus en position absolute) : la liste pousse les
                éléments suivants vers le bas au lieu de les recouvrir. */}
            {showDestList && (
              <div className="mt-2">
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

        {/* Publicité — format compact, texte disposé directement sur l'image, sans flèches */}
        <section className="animate-float-up [animation-delay:80ms]">
          <h3 className="text-xs uppercase tracking-widest text-[#B8BED6] mb-2">Publicité</h3>

          <div
            ref={adScrollRef}
            onScroll={handleAdsScroll}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing overscroll-x-contain pb-1"
            style={{ scrollbarWidth: "none", touchAction: "pan-x" }}
          >
            {adItems.map((ad, i) => (
              <a
                key={`${ad.title}-${i}`}
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative snap-start shrink-0 w-[230px] h-[126px] rounded-[22px] overflow-hidden border border-white/10 bg-[#0A0E27] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-sm font-semibold text-white leading-tight line-clamp-2">{ad.title}</p>
                  <p className="mt-2 text-[15px] text-white/80 leading-snug line-clamp-2">{ad.subtitle}</p>
                  <span className="mt-2 inline-flex items-center justify-center rounded-full bg-white/90 px-3.5 py-2 text-[11px] font-semibold text-[#0A0E27] shadow-lg backdrop-blur transition group-hover:bg-white group-active:scale-[0.98]">
                    {ad.cta}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Indicateurs — suivent le scroll manuel */}
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {ADS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeAdIndex ? "w-4 bg-[#7B5CFF]" : "w-1.5 bg-white/15"
                }`}
              />
            ))}
          </div>
        </section>

        {/*
          Espace réservé pour que la barre de navigation flottante (gérée par AppShell,
          non fournie) puisse se superposer en position fixed/sticky par-dessus la zone
          publicité sans en masquer le contenu utile. Ajuste pb-* selon la hauteur réelle
          de la nav une fois AppShell.tsx partagé.
        */}
        <div className="h-20" />
      </div>
    </AppShell>
  );
}