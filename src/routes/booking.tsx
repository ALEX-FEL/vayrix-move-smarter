import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { MapBg } from "@/components/MapBg";
import { ArrowLeft, Car } from "lucide-react";
import { useRide } from "@/providers/RideProvider";
import { driverService } from "@/services/driver.service";
import { toast } from "sonner";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Recherche — Vayrix" }] }),
  component: Booking,
});

function Booking() {
  const navigate = useNavigate();
  const { draft, setDraft } = useRide();
  const [phase, setPhase] = useState<"searching" | "found" | "error">("searching");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const driver = await driverService.matchDriver(draft.vehicle);
        if (!alive) return;
        setDraft({ driver });
        setPhase("found");
        toast.success("Chauffeur trouvé", { description: `${driver.name} · ${driver.plate}` });
        setTimeout(() => alive && navigate({ to: "/driver-found" }), 1000);
      } catch (e) {
        setPhase("error");
        toast.error((e as Error).message);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PhoneFrame>
      <div className="relative h-full min-h-screen sm:min-h-[860px]">
        <MapBg />
        <StatusBar />

        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="h-10 w-10 rounded-full bg-[#141B3D]/90 backdrop-blur border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="px-3 py-1.5 rounded-full bg-[#141B3D]/90 backdrop-blur border border-white/10 text-xs">
            {draft.from.subtitle} → {draft.to?.name ?? "…"}
          </div>
          <div className="w-10" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-primary blur-2xl opacity-40 animate-pulse" />
            <div className="relative h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
              <Car className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 p-5 shadow-card animate-float-up">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#0A0E27] flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-[#7B5CFF] animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {phase === "searching" && "Recherche d'un chauffeur"}
                {phase === "found" && "Chauffeur trouvé"}
                {phase === "error" && "Erreur"}
              </p>
              <p className="text-xs text-[#B8BED6]">
                {phase === "searching" && "Analyse des chauffeurs à proximité…"}
                {phase === "found" && "Connexion en cours…"}
                {phase === "error" && "Impossible de trouver un chauffeur"}
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-primary animate-[shimmer_1.4s_linear_infinite]"
              style={{ width: phase === "found" ? "100%" : "70%", backgroundSize: "200% 100%" }}
            />
          </div>
          {phase === "error" && (
            <button
              onClick={() => navigate({ to: "/home" })}
              className="mt-4 w-full h-11 rounded-xl bg-[#0A0E27] border border-white/10 text-sm font-semibold"
            >
              Retour
            </button>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
