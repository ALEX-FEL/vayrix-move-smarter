import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, ShieldCheck, Clock, ChevronRight, User } from "lucide-react";
import { useSafety } from "@/providers/SafetyProvider";
import { toast } from "sonner";

export const Route = createFileRoute("/option")({
  head: () => ({ meta: [{ title: "Options — Vayrix" }] }),
  component: Options,
});

function Options() {
  const navigate = useNavigate();
  const { active, setActive } = useSafety();

  const toggleSafety = () => {
    const next = !active;
    setActive(next);
    toast(next ? "Mode sécurité activé" : "Mode sécurité désactivé", {
      description: next ? "Enregistrement audio et analyse IA prêts." : "",
    });
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-[100dvh] sm:h-[860px] overflow-hidden">
        {/* <StatusBar /> */}

        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <h1 className="text-lg font-semibold">Options</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4">
          {/* Safety card — full detail, not a compact toggle row */}
          <section
            className={`rounded-2xl border p-5 animate-float-up transition ${
              active
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-[#141B3D] border-white/5"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                  active ? "bg-emerald-500/20 text-emerald-300" : "bg-[#0A0E27] text-[#7B5CFF]"
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Mode sécurité</p>
                <p className="text-xs text-[#B8BED6] mt-0.5 leading-relaxed">
                  {active
                    ? "Actif — enregistrement audio et analyse IA en continu pendant la course."
                    : "Inactif — activez-le avant ou pendant une course pour une protection continue."}
                </p>
              </div>
            </div>

            <button
              onClick={toggleSafety}
              className={`mt-4 w-full h-11 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                active
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-gradient-primary text-white shadow-glow"
              }`}
            >
              {active ? "Désactiver" : "Activer le mode sécurité"}
            </button>
          </section>

          {/* Recent trips — navigates to full history page */}
          <button
            onClick={() => navigate({ to: "/history" })}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition text-left animate-float-up [animation-delay:60ms]"
          >
            <div className="h-11 w-11 rounded-xl bg-[#0A0E27] flex items-center justify-center shrink-0 text-[#7B5CFF]">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Trajets récents</p>
              <p className="text-xs text-[#B8BED6]">Voir l'historique complet et les reçus</p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#B8BED6] shrink-0" />
          </button>

          {/* Profile — kept accessible here since it's no longer in the home header */}
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition text-left animate-float-up [animation-delay:100ms]"
          >
            <div className="h-11 w-11 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shrink-0">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Mon profil</p>
              <p className="text-xs text-[#B8BED6]">Alex K. · voir et modifier</p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#B8BED6] shrink-0" />
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}