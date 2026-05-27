import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { VayrixLogo } from "@/components/VayrixLogo";
import { VehicleSelectionModal } from "@/components/VehicleSelectionModal";
import { MapPin, Navigation, Plane, Store, Building2, ArrowRight, Search, Star } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home — Vayrix" }] }),
  component: Home,
});

type VehicleType = "moto" | "standard" | "premium";

const popularPlaces = [
  { nameKey: "airport", name: { fr: "Aéroport Nsimalen", en: "Nsimalen Airport" }, subtitle: { fr: "Yaoundé", en: "Yaoundé" }, icon: Plane },
  { nameKey: "market", name: { fr: "Marché Central", en: "Central Market" }, subtitle: { fr: "Centre-ville", en: "Downtown" }, icon: Store },
  { nameKey: "bastos", name: { fr: "Bastos", en: "Bastos" }, subtitle: { fr: "Quartier diplomatique", en: "Diplomatic district" }, icon: Building2 },
  { nameKey: "mvan", name: { fr: "Mvan", en: "Mvan" }, subtitle: { fr: "Zone commerciale", en: "Commercial area" }, icon: Store },
];

function Home() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { profile } = useAuth();
  const { latitude, longitude, loading: geoLoading, error: geoError } = useGeolocation();
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<typeof popularPlaces>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  useEffect(() => {
    if (destination.length > 0) {
      const filtered = popularPlaces.filter((place) =>
        place.name[language].toLowerCase().includes(destination.toLowerCase()) ||
        place.subtitle[language].toLowerCase().includes(destination.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [destination, language]);

  const handleBookRide = () => {
    if (destination.trim().length > 0) {
      setShowVehicleModal(true);
    }
  };

  const handleVehicleConfirm = (vehicle: VehicleType, price: number) => {
    setShowVehicleModal(false);
    setTimeout(() => {
      navigate({
        to: "/booking",
        search: { destination, vehicle, price },
      });
    }, 100);
  };

  const selectSuggestion = (place: typeof popularPlaces[0]) => {
    setDestination(place.name[language]);
    setShowSuggestions(false);
  };

  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-6">
        <header className="flex items-center justify-between animate-float-up">
          <div className="flex items-center gap-3">
            
            {/* Avatar à gauche */}
            <Link
              to="/profile"
              className="h-12 w-12 rounded-full bg-gradient-to-br from-[#3B6BFF] to-[#7B5CFF] flex items-center justify-center text-white font-bold shadow-glow overflow-hidden border-2 border-white/20"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm">
                  {profile
                    ? `${profile.first_name[0]}${profile.last_name[0]}`
                    : "U"}
                </span>
              )}
            </Link>

            {/* Nom utilisateur */}
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                {profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : "Vayrix User"}
              </h1>
            </div>
          </div>

          {/* Logo à droite */}
          <VayrixLogo size={44} />
        </header>

        <section className="rounded-3xl bg-gradient-to-br from-[#1a2348] via-[#141B3D] to-[#0A0E27] border border-white/5 p-6 shadow-[0_20px_60px_-20px_rgba(59,107,255,0.4)] animate-float-up [animation-delay:60ms]">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t.home.title}</h2>
              <p className="text-xs text-[#B8BED6]">{t.home.whereTo}</p>
            </div>
          </div>

          <div className="relative space-y-3">
            <div className="relative">
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-[#0A0E27]/80 border border-white/10 focus-within:border-[#3B6BFF]/60 transition">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-[#3B6BFF] shadow-[0_0_12px_#3B6BFF]" />
                  {geoLoading && (
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  )}
                </div>
                <input
                  value={latitude && longitude ? `${t.home.currentLocation}` : geoError || t.home.currentLocation}
                  className="flex-1 bg-transparent outline-none text-sm font-medium"
                  readOnly
                />
                <MapPin className="h-5 w-5 text-[#B8BED6]" />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="h-6 w-px bg-gradient-to-b from-[#3B6BFF] to-[#7B5CFF]" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-[#0A0E27]/80 border border-white/10 focus-within:border-[#7B5CFF]/60 transition">
                <div className="h-3 w-3 rounded-sm bg-[#7B5CFF] shadow-[0_0_12px_#7B5CFF] rotate-45" />
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t.home.destination}
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
                />
                <Navigation className="h-5 w-5 text-[#B8BED6]" />
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 rounded-2xl bg-[#141B3D] border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
                  {suggestions.map((place) => {
                    const Icon = place.icon;
                    return (
                      <button
                        key={place.nameKey}
                        onClick={() => selectSuggestion(place)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition"
                      >
                        <div className="h-9 w-9 rounded-lg bg-[#0A0E27] flex items-center justify-center">
                          <Icon className="h-4 w-4 text-[#7B5CFF]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{place.name[language]}</p>
                          <p className="text-xs text-[#B8BED6]">{place.subtitle[language]}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={handleBookRide}
              disabled={!destination.trim()}
              className={`mt-4 w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition transform ${
                destination.trim()
                  ? "bg-gradient-primary text-white shadow-[0_10px_40px_-10px_rgba(59,107,255,0.6)]"
                  : "bg-white/10 text-white/50 cursor-not-allowed"
              }`}
            >
              {t.home.bookRide}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        <section className="animate-float-up [animation-delay:180ms]">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-[#7B5CFF]" />
            <h3 className="text-sm font-semibold">{t.home.suggestions}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popularPlaces.slice(0, 4).map((place) => {
              const Icon = place.icon;
              return (
                <button
                  key={place.nameKey}
                  onClick={() => setDestination(place.name[language])}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition text-left group"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3B6BFF]/20 to-[#7B5CFF]/20 flex items-center justify-center group-hover:from-[#3B6BFF]/40 group-hover:to-[#7B5CFF]/40 transition">
                    <Icon className="h-5 w-5 text-[#7B5CFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{place.name[language]}</p>
                    <p className="text-xs text-[#B8BED6] truncate">{place.subtitle[language]}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <VehicleSelectionModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onConfirm={handleVehicleConfirm}
        distance={7.8}
      />
    </AppShell>
  );
}
