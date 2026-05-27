import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { GoogleMap } from "@/components/GoogleMap";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ArrowLeft, Phone, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useGeolocation } from "@/hooks/use-geolocation";

export const Route = createFileRoute("/tracking")({
  head: () => ({ meta: [{ title: "Tracking — Vayrix" }] }),
  component: Tracking,
});

function Tracking() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { latitude, longitude } = useGeolocation();
  const [eta, setEta] = useState(180);
  const [driverPosition, setDriverPosition] = useState({ lat: 3.848, lng: 11.502 });

  const driverInfo = {
    name: "Eric T.",
    phone: "+237699123456",
    vehicle: "Toyota Yaris",
    plate: "LT 782 DJ",
  };

  // Simulate driver moving towards user
  useEffect(() => {
    if (!latitude || !longitude) return;

    const moveInterval = setInterval(() => {
      setDriverPosition((prev) => {
        const latDiff = (latitude - prev.lat) * 0.05;
        const lngDiff = (longitude - prev.lng) * 0.05;
        return {
          lat: prev.lat + latDiff,
          lng: prev.lng + lngDiff,
        };
      });
    }, 1000);

    return () => clearInterval(moveInterval);
  }, [latitude, longitude]);

  useEffect(() => {
    const i = setInterval(() => setEta((e) => (e > 1 ? e - 1 : 0)), 1000);
    return () => clearInterval(i);
  }, []);

  const mm = String(Math.floor(eta / 60)).padStart(2, "0");
  const ss = String(eta % 60).padStart(2, "0");

  const handleCall = () => {
    window.location.href = `tel:${driverInfo.phone}`;
  };

  const handleCancel = () => {
    navigate({ to: "/home" });
  };

  return (
    <PhoneFrame>
      <div className="relative h-full min-h-screen sm:min-h-[860px]">
        <GoogleMap
          center={latitude && longitude ? { lat: latitude, lng: longitude } : undefined}
          origin={driverPosition}
          destination={
            latitude && longitude ? { lat: latitude, lng: longitude } : undefined
          }
          showRoute={latitude !== null && longitude !== null}
          markers={
            latitude && longitude
              ? [
                  {
                    position: { lat: latitude, lng: longitude },
                    title: t.tracking.pickup,
                  },
                ]
              : []
          }
          drivers={[{ position: driverPosition, name: driverInfo.name }]}
          className="absolute inset-0"
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
            <div className="px-4 py-2 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 text-center">
              <p className="text-[10px] uppercase tracking-widest text-[#B8BED6]">
                {t.tracking.arrivingIn}
              </p>
              <p className="text-lg font-bold text-gradient-primary tabular-nums">
                {mm}:{ss}
              </p>
            </div>
            <div className="h-10 w-10" />
          </div>
        </div>

        <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 p-5 shadow-card animate-float-up space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
              ET
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {driverInfo.name} {t.tracking.onTheWay.toLowerCase()}
              </p>
              <p className="text-xs text-[#B8BED6]">
                {driverInfo.vehicle} · {driverInfo.plate}
              </p>
            </div>
          </div>

          <div className="relative pl-5">
            <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gradient-to-b from-[#3B6BFF] via-white/15 to-[#7B5CFF]" />
            <Row
              dotClass="bg-[#3B6BFF] shadow-[0_0_10px_#3B6BFF]"
              title={driverInfo.name}
              subtitle={t.tracking.pickup}
            />
            <div className="h-3" />
            <Row
              dotClass="bg-[#7B5CFF] shadow-[0_0_10px_#7B5CFF]"
              title={t.tracking.destination}
              subtitle={`${t.tracking.destination} · 7.8 ${t.tracking.distance}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCall}
              className="h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition bg-[#0A0E27] border-white/10 text-white hover:bg-[#3B6BFF]/20"
            >
              <Phone className="h-4 w-4" />
              <span className="text-[10px]">{t.tracking.call}</span>
            </button>
            <button
              onClick={handleCancel}
              className="h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
            >
              <X className="h-4 w-4" />
              <span className="text-[10px]">{t.tracking.cancel}</span>
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Row({ dotClass, title, subtitle }: { dotClass: string; title: string; subtitle: string }) {
  return (
    <div className="relative flex items-start gap-3">
      <span className={`absolute -left-[18px] top-1.5 h-3 w-3 rounded-full ${dotClass}`} />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-[#B8BED6]">{subtitle}</p>
      </div>
    </div>
  );
}
