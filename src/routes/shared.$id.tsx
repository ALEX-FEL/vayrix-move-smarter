import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Check, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { sharedService } from "@/services/shared.service";
import type { AsyncState, SharedRide } from "@/models";
import { QueryView } from "@/components/QueryView";
import { useRide } from "@/providers/RideProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/shared/$id")({
  head: () => ({ meta: [{ title: "Détail course partagée — Vayrix" }] }),
  component: SharedDetail,
});

function SharedDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { setDraft } = useRide();
  const [state, setState] = useState<AsyncState<SharedRide>>({ status: "loading" });
  const [phase, setPhase] = useState<"idle" | "pending" | "accepted" | "rejected">("idle");

  useEffect(() => {
    (async () => {
      try {
        const r = await sharedService.getById(id);
        setState(r ? { status: "success", data: r } : { status: "empty" });
      } catch (e) {
        setState({ status: "error", message: (e as Error).message });
      }
    })();
  }, [id]);

  const requestJoin = async (r: SharedRide) => {
    setPhase("pending");
    const result = await sharedService.requestJoin(r.id);
    setPhase(result);
    if (result === "accepted") {
      setDraft({
        from: r.from,
        to: r.to,
        vehicle: "classic",
        basePrice: r.originalPrice,
        finalPrice: r.proposedPrice,
        shared: true,
        savings: r.savings,
      });
      toast.success("Demande acceptée", { description: "Vous rejoignez la course." });
      setTimeout(() => navigate({ to: "/booking" }), 1200);
    } else {
      toast.error("Demande refusée par le passager principal.");
    }
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        {/* <StatusBar /> */}
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/shared" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <h1 className="text-lg font-semibold">Détail</h1>
        </div>

        <div className="px-5 flex-1">
          <QueryView state={state} emptyLabel="Course introuvable">
            {(r) => (
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
                      {r.requester.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{r.requester.name}</p>
                      <p className="text-xs text-[#B8BED6]">Note {r.requester.rating} · Départ {r.departureAt}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-sm">{r.from.name} → {r.to.name}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#B8BED6]">Prix initial</p>
                      <p className="text-sm line-through text-[#B8BED6] tabular-nums">
                        {r.originalPrice.toLocaleString()} XAF
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#B8BED6]">Prix proposé</p>
                      <p className="text-2xl font-bold text-gradient-primary tabular-nums">
                        {r.proposedPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-xs text-emerald-300">
                      Économie estimée : {r.savings.toLocaleString()} XAF
                    </p>
                  </div>
                </div>

                {phase === "idle" && (
                  <button
                    onClick={() => requestJoin(r)}
                    className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow"
                  >
                    Demander à rejoindre
                  </button>
                )}
                {phase === "pending" && (
                  <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-5 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-[#7B5CFF]" />
                    <div>
                      <p className="text-sm font-semibold">En attente de validation</p>
                      <p className="text-xs text-[#B8BED6]">Le passager principal examine votre demande.</p>
                    </div>
                  </div>
                )}
                {phase === "accepted" && (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="text-sm font-semibold">Acceptée</p>
                      <p className="text-xs text-[#B8BED6]">Redirection…</p>
                    </div>
                  </div>
                )}
                {phase === "rejected" && (
                  <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-5 flex items-center gap-3">
                    <X className="h-5 w-5 text-red-300" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Refusée</p>
                      <p className="text-xs text-[#B8BED6]">Essayez une autre course.</p>
                    </div>
                    <button
                      onClick={() => navigate({ to: "/shared" })}
                      className="h-9 px-3 rounded-lg bg-[#0A0E27] border border-white/10 text-xs"
                    >
                      Retour
                    </button>
                  </div>
                )}
              </div>
            )}
          </QueryView>
        </div>
      </div>
    </PhoneFrame>
  );
}
