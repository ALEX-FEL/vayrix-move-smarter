import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { GoogleMap } from "@/components/GoogleMap";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ArrowLeft, Star, Phone, MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useGeolocation } from "@/hooks/use-geolocation";

export const Route = createFileRoute("/driver-found")({
  head: () => ({ meta: [{ title: "Driver — Vayrix" }] }),
  component: DriverFound,
});

function DriverFound() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { latitude, longitude } = useGeolocation();

  return (
    <PhoneFrame>
      <div className="relative h-full min-h-screen sm:min-h-[860px]">
        <GoogleMap
          center={latitude && longitude ? { lat: latitude, lng: longitude } : undefined}
          className="absolute inset-0"
          drivers={[
            { position: { lat: 3.848, lng: 11.502 }, name: "Eric T." },
          ]}
        />

        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0A0E27]/95 to-transparent pt-2 pb-6 px-4">
          {/* <div className="flex items-center justify-between mb-2">
            <StatusBar />
            <LanguageSelector />
          </div> */}

          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => navigate({ to: "/home" })}
              className="h-10 w-10 rounded-full bg-[#141B3D]/90 backdrop-blur border border-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>
            <div className="px-4 py-2 rounded-2xl bg-gradient-primary text-xs font-semibold shadow-glow">
              {t.driver.eta} 3 {t.driver.minutes}
            </div>
            <div className="w-10" />
          </div>
        </div>

        <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 p-5 shadow-card animate-float-up">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#B8BED6] uppercase tracking-wider">
              {t.driver.yourDriver}
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
              {t.tracking.onTheWay}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-glow">
              ET
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold">{t.driver.driverName}</p>
              <div className="flex items-center gap-1 text-xs text-[#B8BED6]">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-medium">4.8</span>
                <span>· 1,204 {t.driver.trips}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="h-10 w-10 rounded-xl bg-[#0A0E27] border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
                <MessageCircle className="h-4 w-4 text-white" />
              </button>
              <button className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow hover:opacity-90 transition">
                <Phone className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#0A0E27] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#B8BED6]">Toyota Yaris</p>
              <p className="text-sm font-semibold tracking-wide">LT 782 DJ</p>
            </div>
            <div className="h-12 px-4 rounded-xl bg-white text-[#0A0E27] font-bold text-sm flex items-center shadow-lg">
              LT 782 DJ
            </div>
          </div>

          <button
            onClick={() => navigate({ to: "/tracking" })}
            className="mt-4 w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow active:scale-[0.99] transition"
          >
            {language === "fr" ? "Suivre le trajet" : "Track Ride"}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
