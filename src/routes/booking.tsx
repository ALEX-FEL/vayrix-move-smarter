import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { GoogleMap } from "@/components/GoogleMap";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ArrowLeft, Car } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useGeolocation } from "@/hooks/use-geolocation";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Searching — Vayrix" }] }),
  component: Booking,
});

function Booking() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { latitude, longitude } = useGeolocation();
  const [phase, setPhase] = useState<"searching" | "found">("searching");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("found"), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "found") {
      const timer = setTimeout(() => navigate({ to: "/driver-found" }), 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, navigate]);

  return (
    <PhoneFrame>
      <div className="relative h-full min-h-screen sm:min-h-[860px]">
        <GoogleMap
          center={latitude && longitude ? { lat: latitude, lng: longitude } : undefined}
          className="absolute inset-0"
          drivers={
            phase === "searching"
              ? [
                  { position: { lat: 3.848, lng: 11.502 }, name: "Driver 1" },
                  { position: { lat: 3.838, lng: 11.492 }, name: "Driver 2" },
                  { position: { lat: 3.858, lng: 11.512 }, name: "Driver 3" },
                ]
              : [
                  { position: { lat: 3.848, lng: 11.502 }, name: "Eric T." },
                ]
          }
        />

        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#0A0E27]/95 to-transparent pt-2 pb-6 px-4">
          <div className="flex items-center justify-between mb-2">
            {/* <StatusBar /> */}
            {/* <LanguageSelector /> */}
          </div>

          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => navigate({ to: "/home" })}
              className="h-10 w-10 rounded-full bg-[#141B3D]/90 backdrop-blur border border-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>
            <div className="px-3 py-1.5 rounded-full bg-[#141B3D]/90 backdrop-blur border border-white/10 text-xs font-medium">
              Essos → Nsimalen
            </div>
            <div className="w-10" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-primary blur-2xl opacity-40 animate-pulse" />
            <div
              className={`relative h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow ${
                phase === "found" ? "animate-pulse-glow" : ""
              }`}
            >
              <Car className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 p-5 shadow-card animate-float-up">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#0A0E27] flex items-center justify-center">
              {phase === "found" ? (
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-[#7B5CFF] animate-pulse" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {phase === "searching" ? t.booking.searching : t.booking.driverFound}
              </p>
              <p className="text-xs text-[#B8BED6]">
                {phase === "searching" ? t.booking.holdTight : t.booking.connecting}
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                phase === "found" ? "bg-emerald-500" : "bg-gradient-primary animate-[shimmer_1.4s_linear_infinite]"
              }`}
              style={{ width: phase === "found" ? "100%" : "70%", backgroundSize: "200% 100%" }}
            />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
