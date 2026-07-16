import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Bike, Car, Sparkles, Clock, Bus, Package } from "lucide-react";
import { useRide } from "@/providers/RideProvider";
import { useEffect, useState } from "react";
import { rideService } from "@/services/ride.service";
import type { AsyncState, VehicleOption, VehicleType } from "@/models";
import { QueryView } from "@/components/QueryView";

export const Route = createFileRoute("/flow/estimate")({
  head: () => ({ meta: [{ title: "Estimation — Vayrix" }] }),
  component: Estimate,
});

const icons: Record<VehicleType, typeof Bike> = { moto: Bike, classic: Car, premium: Sparkles, van: Bus, livraison: Package };

function Estimate() {
  const navigate = useNavigate();
  const { draft, setDraft } = useRide();
  const [state, setState] = useState<AsyncState<{ vehicles: VehicleOption[]; base: number; km: number; min: number }>>({
    status: "loading",
  });
  const [selected, setSelected] = useState(draft.vehicle);

  const load = async () => {
    setState({ status: "loading" });
    try {
      if (!draft.to) {
        navigate({ to: "/home" });
        return;
      }
      const fare = await rideService.estimateFare(draft.from, draft.to);
      const vehicles = await rideService.listVehicles(fare.basePrice);
      setState({
        status: "success",
        data: { vehicles, base: fare.basePrice, km: fare.distanceKm, min: fare.durationMin },
      });
    } catch (e) {
      setState({ status: "error", message: (e as Error).message });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        <StatusBar />
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Choix du véhicule</h1>
            {draft.to && (
              <p className="text-xs text-[#B8BED6] truncate max-w-[220px]">
                {draft.from.name} → {draft.to.name}
              </p>
            )}
          </div>
        </div>

        <div className="px-5 flex-1">
          <QueryView state={state} onRetry={load}>
            {({ vehicles, km, min }) => (
              <>
                <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 flex items-center justify-between animate-float-up">
                  <div>
                    <p className="text-xs text-[#B8BED6]">{draft.from.name} → {draft.to?.name}</p>
                    <p className="text-sm font-semibold mt-0.5">{km} km · {min} min</p>
                  </div>
                  <Clock className="h-5 w-5 text-[#7B5CFF]" />
                </div>

                <div className="mt-4 space-y-2">
                  {vehicles.map((v) => {
                    const Icon = icons[v.id];
                    const active = selected === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelected(v.id);
                          setDraft({
                            vehicle: v.id,
                            distanceKm: km,
                            durationMin: min,
                            basePrice: v.price,
                            finalPrice: v.price,
                          });
                        }}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition text-left ${
                          active
                            ? "bg-[#1a2348] border-[#7B5CFF]/60 shadow-glow"
                            : "bg-[#141B3D] border-white/5"
                        }`}
                      >
                        <div className="h-11 w-11 rounded-xl bg-[#0A0E27] flex items-center justify-center">
                          <Icon className="h-5 w-5 text-[#7B5CFF]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{v.label}</p>
                          <p className="text-xs text-[#B8BED6]">{v.description} · {v.eta} min</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold tabular-nums">{v.price.toLocaleString()}</p>
                          <p className="text-[10px] text-[#B8BED6]">XAF</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </QueryView>
        </div>

        <div className="p-5 space-y-2">
          <button
            onClick={() => navigate({ to: "/flow/negotiate" })}
            disabled={state.status !== "success"}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow disabled:opacity-40"
          >
            Continuer
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
