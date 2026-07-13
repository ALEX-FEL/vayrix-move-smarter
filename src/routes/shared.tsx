import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Users, TrendingDown, Car, Clock, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { sharedService } from "@/services/shared.service";
import type { AsyncState, SharedRide } from "@/models";
import { QueryView } from "@/components/QueryView";
import { useRide } from "@/providers/RideProvider";

export const Route = createFileRoute("/shared")({
  head: () => ({ meta: [{ title: "Partage de course — Vayrix" }] }),
  component: SharedList,
});

function SharedList() {
  const navigate = useNavigate();
  const { draft } = useRide();
  const [state, setState] = useState<AsyncState<SharedRide[]>>({ status: "loading" });

  // Guard: user must have set pickup + destination first.
  useEffect(() => {
    if (!draft.from || !draft.to) {
      throw redirect({ to: "/home" });
    }
  }, [draft.from, draft.to]);

  const load = async () => {
    setState({ status: "loading" });
    try {
      const list = await sharedService.search();
      setState(list.length ? { status: "success", data: list } : { status: "empty" });
    } catch (e) {
      setState({ status: "error", message: (e as Error).message });
    }
  };

  useEffect(() => { load(); }, []);

  const openDetail = (r: SharedRide) => {
    navigate({
      to: "/flow/share-request/$id",
      params: { id: r.id },
      search: {
        adresse_depart: draft.from?.name,
        latitude_depart: draft.from?.lat,
        longitude_depart: draft.from?.lng,
        adresse_arrivee: draft.to?.name,
        latitude_arrivee: draft.to?.lat,
        longitude_arrivee: draft.to?.lng,
      },
    });
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen sm:min-h-[860px] overflow-x-hidden">
        <StatusBar />
        <div className="px-4 sm:px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="h-10 w-10 shrink-0 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate">Courses compatibles</h1>
            <p className="text-xs text-[#B8BED6] truncate">
              {draft.from?.name} → {draft.to?.name}
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-5 flex-1 pb-5">
          <QueryView state={state} onRetry={load} emptyLabel="Aucune course disponible dans votre zone">
            {(rides) => (
              <div className="space-y-2">
                {rides.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => openDetail(r)}
                    className="w-full text-left p-4 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                          {r.driver.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{r.driver.name}</p>
                          <p className="text-[11px] text-[#B8BED6] truncate flex items-center gap-1">
                            <Car className="h-3 w-3 shrink-0" /> {r.driver.vehicle}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1 shrink-0">
                        <TrendingDown className="h-3 w-3" /> -{r.savings.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="flex items-start gap-2 min-w-0">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3B6BFF] shrink-0" />
                        <span className="truncate">{r.from.name}</span>
                      </p>
                      <p className="flex items-start gap-2 min-w-0">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7B5CFF] shrink-0" />
                        <span className="truncate">{r.to.name}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#B8BED6]">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" /> à {r.distanceFromUserKm} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> ~{r.pickupEtaMin} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {r.seatsLeft} place{r.seatsLeft > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[11px] text-[#B8BED6]">Prix partage</span>
                      <p className="text-base font-bold tabular-nums">
                        {r.proposedPrice.toLocaleString()} <span className="text-[10px] text-[#B8BED6] font-normal">FCFA</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </QueryView>
        </div>
      </div>
    </PhoneFrame>
  );
}
