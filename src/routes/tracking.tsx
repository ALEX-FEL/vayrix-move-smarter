import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { MapBg } from "@/components/MapBg";
import { ArrowLeft, Phone, X, ShieldAlert, ShieldCheck, Radio } from "lucide-react";
import { useSafety } from "@/providers/SafetyProvider";
import { useRide } from "@/providers/RideProvider";
import { rideService } from "@/services/ride.service";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/tracking")({
  head: () => ({ meta: [{ title: "Course en cours — Vayrix" }] }),
  component: Tracking,
});

function Tracking() {
  const navigate = useNavigate();
  const { draft } = useRide();
  const { active, risk, setRisk, setRecording } = useSafety();
  const [eta, setEta] = useState(180);
  const [cancelOpen, setCancelOpen] = useState(false);

  const driver = draft.driver;
  const price = draft.finalPrice || draft.basePrice || 1500;

  useEffect(() => {
    const i = setInterval(() => setEta((e) => (e > 1 ? e - 1 : e)), 1000);
    return () => clearInterval(i);
  }, []);

  // Safety monitoring: simulate risk analysis every ~7s
  useEffect(() => {
    if (!active) return;
    setRecording(true);
    let alive = true;
    const tick = async () => {
      const r = await rideService.simulateProgress();
      if (!alive) return;
      setRisk(r);
      if (r === "medium") toast("Analyse IA : risque modéré", { description: "Comportement du chauffeur normal." });
      if (r === "high") toast.error("Alerte IA : risque élevé détecté", { description: "Restez vigilant." });
    };
    tick();
    const int = setInterval(tick, 7000);
    return () => { alive = false; clearInterval(int); setRecording(false); };
  }, [active, setRisk, setRecording]);

  const mm = String(Math.floor(eta / 60)).padStart(2, "0");
  const ss = String(eta % 60).padStart(2, "0");
  const progress = Math.max(0, Math.min(100, 100 - (eta / 180) * 100));

  const riskStyles = {
    low: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    medium: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    high: "bg-red-500/10 border-red-500/30 text-red-300",
  }[risk];

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
          <div className="px-4 py-2 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 text-center">
            <p className="text-[10px] uppercase tracking-widest text-[#B8BED6]">Arrivée dans</p>
            <p className="text-lg font-bold text-gradient-primary tabular-nums">{mm}:{ss}</p>
          </div>
          <button
            onClick={() => navigate({ to: "/sos" })}
            className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse"
          >
            <ShieldAlert className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Safety banner */}
        {active && (
          <div className={`absolute top-28 left-4 right-4 rounded-xl border p-3 flex items-center gap-2 backdrop-blur ${riskStyles}`}>
            <ShieldCheck className="h-4 w-4" />
            <div className="flex-1">
              <p className="text-xs font-semibold">Sécurité active · Risque {risk === "low" ? "faible" : risk === "medium" ? "moyen" : "élevé"}</p>
              <p className="text-[10px] opacity-80 flex items-center gap-1">
                <Radio className="h-3 w-3" /> Enregistrement + analyse IA en cours
              </p>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 p-5 shadow-card animate-float-up space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
              {driver?.initials ?? "ET"}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{driver?.name ?? "Eric T."} en route</p>
              <p className="text-xs text-[#B8BED6]">{driver?.vehicle ?? "Toyota Yaris"} · {driver?.plate ?? "LT 782 DJ"}</p>
            </div>
            {draft.shared && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                PARTAGÉ
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-[#B8BED6]">
              <span>Progression</span>
              <span className="tabular-nums">{price.toLocaleString()} XAF</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <ActionBtn icon={<Phone className="h-4 w-4" />} label="Appeler" onClick={() => toast("Appel simulé")} />
            <ActionBtn icon={<ShieldAlert className="h-4 w-4" />} label="SOS" onClick={() => navigate({ to: "/sos" })} variant="danger" />
            <ActionBtn icon={<X className="h-4 w-4" />} label="Annuler" onClick={() => setCancelOpen(true)} variant="danger" />
          </div>

          <button
            onClick={() => navigate({ to: "/payment" })}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow active:scale-[0.99] transition"
          >
            Je suis arrivé
          </button>
        </div>

        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogContent className="bg-[#141B3D] border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Annuler la course ?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#B8BED6]">
                Des frais d'annulation peuvent s'appliquer si le chauffeur est proche.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#0A0E27] border-white/10 text-white">Retour</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => { toast("Course annulée"); navigate({ to: "/home" }); }}
                className="bg-red-500 hover:bg-red-600"
              >
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PhoneFrame>
  );
}

function ActionBtn({
  icon, label, variant, onClick,
}: { icon: React.ReactNode; label: string; variant?: "danger"; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 border transition ${
        variant === "danger"
          ? "bg-red-500/10 border-red-500/30 text-red-300"
          : "bg-[#0A0E27] border-white/10 text-white"
      }`}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </button>
  );
}
