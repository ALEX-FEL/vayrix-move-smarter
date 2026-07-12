import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { MapBg } from "@/components/MapBg";
import { ArrowLeft, Star, Phone } from "lucide-react";
import { useRide } from "@/providers/RideProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/driver-found")({
  head: () => ({ meta: [{ title: "Chauffeur — Vayrix" }] }),
  component: DriverFound,
});

function DriverFound() {
  const navigate = useNavigate();
  const { draft } = useRide();
  const driver = draft.driver ?? {
    id: "d1", name: "Eric Tchoumi", initials: "ET", rating: 4.8, trips: 1204,
    plate: "LT 782 DJ", vehicle: "Toyota Yaris", vehicleType: "classic" as const, distanceKm: 0.6,
  };
  const eta = Math.max(2, Math.round(driver.distanceKm * 3));

  return (
    <PhoneFrame>
      <div className="relative h-full min-h-screen sm:min-h-[860px]">
        <MapBg withCar />
        <StatusBar />

        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="h-10 w-10 rounded-full bg-[#141B3D]/90 backdrop-blur border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="px-3 py-1.5 rounded-full bg-gradient-primary text-xs font-medium shadow-glow">
            ETA {eta} min
          </div>
          <div className="w-10" />
        </div>

        <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 p-5 shadow-card animate-float-up">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#B8BED6] uppercase tracking-wider">Votre chauffeur</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              En route
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-glow">
              {driver.initials}
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold">{driver.name}</p>
              <div className="flex items-center gap-1 text-xs text-[#B8BED6]">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-medium">{driver.rating}</span>
                <span>· {driver.trips.toLocaleString()} trajets</span>
              </div>
            </div>
            <button
              onClick={() => toast("Appel simulé", { description: driver.name })}
              className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow"
            >
              <Phone className="h-4 w-4 text-white" />
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#0A0E27] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#B8BED6]">{driver.vehicle}</p>
              <p className="text-sm font-semibold tracking-wide">{driver.plate}</p>
            </div>
            <div className="h-10 px-3 rounded-lg bg-white text-[#0A0E27] font-bold text-sm flex items-center">
              {driver.plate}
            </div>
          </div>

          <button
            onClick={() => navigate({ to: "/tracking" })}
            className="mt-4 w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow active:scale-[0.99] transition"
          >
            Suivre la course
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
