import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Check, X, RefreshCw } from "lucide-react";
import { useRide } from "@/providers/RideProvider";
import { useState } from "react";
import { rideService } from "@/services/ride.service";
import type { NegotiationResult } from "@/models";
import { toast } from "sonner";

export const Route = createFileRoute("/flow/negotiate")({
  head: () => ({ meta: [{ title: "Négociation — Vayrix" }] }),
  component: Negotiate,
});

function Negotiate() {
  const navigate = useNavigate();
  const { draft, setDraft } = useRide();
  const listed = draft.basePrice || 1000;
  const [offer, setOffer] = useState(Math.round((listed * 0.85) / 50) * 50);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);

  const accept = () => {
    setDraft({ finalPrice: listed });
    toast.success("Prix accepté", { description: `${listed.toLocaleString()} XAF` });
    navigate({ to: "/booking" });
  };

  const propose = async () => {
    setBusy(true);
    try {
      const r = await rideService.negotiate(offer, listed);
      setResult(r);
      if (r.status === "accepted") toast.success(r.message);
      else if (r.status === "rejected") toast.error(r.message);
      else toast(r.message);
    } finally {
      setBusy(false);
    }
  };

  const acceptResult = () => {
    if (!result) return;
    setDraft({ finalPrice: result.finalPrice });
    navigate({ to: "/booking" });
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        {/* <StatusBar /> */}
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/flow/estimate" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <h1 className="text-lg font-semibold">Négocier le prix</h1>
        </div>

        <div className="px-5 flex-1 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-5 text-center animate-float-up">
            <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Prix affiché</p>
            <p className="mt-1 text-4xl font-bold text-gradient-primary tabular-nums">
              {listed.toLocaleString()}
            </p>
            <p className="text-xs text-[#B8BED6]">XAF</p>
          </div>

          <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-5 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Votre proposition</p>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="number"
                  value={offer}
                  step={50}
                  onChange={(e) => setOffer(Math.max(0, Number(e.target.value)))}
                  className="flex-1 h-14 rounded-xl bg-[#0A0E27] border border-white/10 px-4 text-2xl font-bold tabular-nums outline-none focus:border-[#7B5CFF]"
                />
                <span className="text-sm text-[#B8BED6]">XAF</span>
              </div>
              <input
                type="range"
                min={Math.round(listed * 0.5)}
                max={listed}
                step={50}
                value={offer}
                onChange={(e) => setOffer(Number(e.target.value))}
                className="mt-3 w-full accent-[#7B5CFF]"
              />
            </div>

            <button
              onClick={propose}
              disabled={busy}
              className="w-full h-12 rounded-xl bg-[#0A0E27] border border-white/10 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
              {busy ? "Envoi…" : "Proposer ce prix"}
            </button>
          </div>

          {result && (
            <div
              className={`rounded-2xl p-4 border animate-float-up ${
                result.status === "accepted"
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : result.status === "rejected"
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-amber-500/10 border-amber-500/30"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.status === "accepted" ? (
                  <Check className="h-4 w-4 text-emerald-300" />
                ) : result.status === "rejected" ? (
                  <X className="h-4 w-4 text-red-300" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-amber-300" />
                )}
                <p className="text-sm font-semibold">
                  {result.status === "accepted" && "Accepté"}
                  {result.status === "rejected" && "Refusé"}
                  {result.status === "counter" && "Contre-proposition"}
                </p>
              </div>
              <p className="mt-1 text-xs text-[#B8BED6]">{result.message}</p>
              {result.status !== "rejected" && (
                <button
                  onClick={acceptResult}
                  className="mt-3 w-full h-11 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow"
                >
                  Continuer à {result.finalPrice.toLocaleString()} XAF
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-5">
          <button
            onClick={accept}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow"
          >
            Accepter {listed.toLocaleString()} XAF
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
