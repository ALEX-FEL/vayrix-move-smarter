import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Users, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { sharedService } from "@/services/shared.service";
import type { AsyncState, SharedRide } from "@/models";
import { QueryView } from "@/components/QueryView";

export const Route = createFileRoute("/shared")({
  head: () => ({ meta: [{ title: "Partage de course — Vayrix" }] }),
  component: SharedList,
});

function SharedList() {
  const navigate = useNavigate();
  const [state, setState] = useState<AsyncState<SharedRide[]>>({ status: "loading" });

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

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        {/* <StatusBar /> */}
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Courses partagées</h1>
            <p className="text-xs text-[#B8BED6]">Rejoignez une course et économisez</p>
          </div>
        </div>

        <div className="px-5 flex-1">
          <QueryView state={state} onRetry={load} emptyLabel="Aucune course compatible pour le moment">
            {(rides) => (
              <div className="space-y-2">
                {rides.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => navigate({ to: "/shared/$id", params: { id: r.id } })}
                    className="w-full text-left p-4 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                          {r.requester.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{r.requester.name}</p>
                          <p className="text-[10px] text-[#B8BED6]">Note {r.requester.rating}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" /> -{r.savings} XAF
                      </span>
                    </div>
                    <div>
                      <p className="text-sm">{r.from.name} → {r.to.name}</p>
                      <p className="text-[11px] text-[#B8BED6]">{r.departureAt}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-[11px] text-[#B8BED6] flex items-center gap-1">
                        <Users className="h-3 w-3" /> {r.seatsLeft} places
                      </span>
                      <p className="text-base font-bold tabular-nums">
                        {r.proposedPrice.toLocaleString()} <span className="text-[10px] text-[#B8BED6] font-normal">XAF</span>
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
