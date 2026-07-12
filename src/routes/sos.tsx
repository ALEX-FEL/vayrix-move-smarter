import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, ShieldAlert, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/sos")({
  head: () => ({ meta: [{ title: "SOS — Vayrix" }] }),
  component: Sos,
});

const steps = [
  "Position GPS partagée",
  "Administration Vayrix alertée",
  "Contacts d'urgence prévenus",
];

function Sos() {
  const navigate = useNavigate();
  const [triggered, setTriggered] = useState(false);
  const [done, setDone] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    if (!triggered) return;
    steps.forEach((_, i) => {
      setTimeout(() => {
        setDone((d) => d.map((v, j) => (j === i ? true : v)));
        if (i === steps.length - 1) {
          toast.success("Alerte SOS envoyée");
        }
      }, 800 * (i + 1));
    });
  }, [triggered]);

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        <StatusBar />
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/tracking" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <h1 className="text-lg font-semibold">Alerte d'urgence</h1>
        </div>

        <div className="flex-1 px-5 flex flex-col items-center justify-center space-y-6">
          {!triggered ? (
            <>
              <button
                onClick={() => setTriggered(true)}
                className="relative h-48 w-48 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_60px_rgba(239,68,68,0.55)] active:scale-95 transition"
              >
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
                <span className="relative">SOS</span>
              </button>
              <p className="text-center text-sm text-[#B8BED6] px-6">
                Maintenez pressé pour déclencher : partage GPS, alerte admin et contacts d'urgence.
              </p>
            </>
          ) : (
            <div className="w-full space-y-3">
              <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-5 flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-red-300" />
                <div>
                  <p className="text-sm font-semibold text-red-200">Alerte activée</p>
                  <p className="text-xs text-[#B8BED6]">Traitement en cours…</p>
                </div>
              </div>
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-3 p-4 rounded-2xl bg-[#141B3D] border border-white/5">
                  {done[i] ? (
                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-emerald-300" />
                    </div>
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-[#7B5CFF]" />
                  )}
                  <p className="text-sm">{s}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5">
          <button
            onClick={() => navigate({ to: "/tracking" })}
            className="w-full h-12 rounded-xl bg-[#141B3D] border border-white/10 text-white text-sm font-semibold"
          >
            Retour à la course
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
