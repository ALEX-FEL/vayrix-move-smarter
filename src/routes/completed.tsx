import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { Check, MapPin, Clock, Route as RouteIcon } from "lucide-react";
import { useRide } from "@/providers/RideProvider";

export const Route = createFileRoute("/completed")({
  head: () => ({ meta: [{ title: "Course terminée — Vayrix" }] }),
  component: Completed,
});

function Completed() {
  const navigate = useNavigate();
  const { draft, reset } = useRide();
  const price = draft.finalPrice || draft.basePrice || 1500;

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        <StatusBar />
        <div className="flex-1 px-5 py-6 space-y-6">
          <div className="text-center animate-float-up">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">Course terminée</h1>
            <p className="mt-1 text-sm text-[#B8BED6]">Merci d'avoir choisi Vayrix</p>
          </div>

          <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-5 space-y-4 animate-float-up [animation-delay:80ms]">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#7B5CFF]" />
              <div className="flex-1">
                <p className="text-xs text-[#B8BED6]">Trajet</p>
                <p className="text-sm font-medium">{draft.from.name} → {draft.to?.name ?? "Destination"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat icon={<RouteIcon className="h-3.5 w-3.5" />} label="Distance" value={`${draft.distanceKm || 0} km`} />
              <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Durée" value={`${draft.durationMin || 0} min`} />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-5 text-center animate-float-up [animation-delay:140ms]">
            <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Prix final</p>
            <p className="mt-1 text-4xl font-bold text-gradient-primary tabular-nums">
              {price.toLocaleString()}
            </p>
            <p className="text-xs text-[#B8BED6]">XAF</p>
            {draft.shared && draft.savings > 0 && (
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                Économie réalisée : {draft.savings.toLocaleString()} XAF
              </div>
            )}
          </div>
        </div>

        <div className="p-5 space-y-2">
          <button
            onClick={() => navigate({ to: "/rating" })}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow"
          >
            Évaluer le chauffeur
          </button>
          <button
            onClick={() => { reset(); navigate({ to: "/home" }); }}
            className="w-full h-12 rounded-xl bg-[#141B3D] border border-white/10 text-white text-sm font-semibold"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#0A0E27] p-3">
      <div className="flex items-center gap-1 text-[#B8BED6]">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}
