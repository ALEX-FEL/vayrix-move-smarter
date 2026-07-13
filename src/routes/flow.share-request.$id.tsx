import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Check, X, Loader2, Car, ShieldCheck, MapPin, Clock, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { sharedService, type CompatibilityCheck, type ShareRequest } from "@/services/shared.service";
import type { AsyncState, SharedRide } from "@/models";
import { QueryView } from "@/components/QueryView";
import { useRide } from "@/providers/RideProvider";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({
  adresse_depart: z.string().optional(),
  latitude_depart: z.coerce.number().optional(),
  longitude_depart: z.coerce.number().optional(),
  adresse_arrivee: z.string().optional(),
  latitude_arrivee: z.coerce.number().optional(),
  longitude_arrivee: z.coerce.number().optional(),
});

export const Route = createFileRoute("/flow/share-request/$id")({
  head: () => ({ meta: [{ title: "Demande de partage — Vayrix" }] }),
  validateSearch: (s) => searchSchema.parse(s),
  component: ShareRequestPage,
});

type Phase =
  | { kind: "idle" }
  | { kind: "verifying" }
  | { kind: "blocked"; reason: string }
  | { kind: "ready"; check: CompatibilityCheck }
  | { kind: "submitting" }
  | { kind: "waiting_driver"; req: ShareRequest }
  | { kind: "waiting_initial"; req: ShareRequest }
  | { kind: "accepted"; req: ShareRequest }
  | { kind: "rejected"; step: "driver" | "initial" };

function ShareRequestPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { draft, setDraft } = useRide();
  const [state, setState] = useState<AsyncState<SharedRide>>({ status: "loading" });
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  // Pickup / destination transmitted between pages: draft is source of truth,
  // URL search params act as a fallback for direct/reload access.
  const pickupLabel = draft.from?.name ?? search.adresse_depart ?? "—";
  const destLabel = draft.to?.name ?? search.adresse_arrivee ?? "—";

  useEffect(() => {
    (async () => {
      setState({ status: "loading" });
      try {
        const r = await sharedService.getById(id);
        if (!r) return setState({ status: "empty" });
        setState({ status: "success", data: r });
        setPhase({ kind: "verifying" });
        const check = await sharedService.verifyCompatibility(id);
        setPhase(check.ok ? { kind: "ready", check } : { kind: "blocked", reason: check.reason ?? "Non compatible" });
      } catch (e) {
        setState({ status: "error", message: (e as Error).message });
      }
    })();
  }, [id]);

  const submit = async (ride: SharedRide) => {
    setPhase({ kind: "submitting" });
    const req = await sharedService.submitRequest(ride.id);
    toast.success("Votre demande a été envoyée au chauffeur");
    setPhase({ kind: "waiting_driver", req });

    const driverRes = await sharedService.simulateDriverValidation(req.id);
    if (driverRes === "rejected") {
      toast.error("Le chauffeur a refusé la demande");
      setPhase({ kind: "rejected", step: "driver" });
      return;
    }

    if (sharedService.needsInitialClientValidation(ride)) {
      setPhase({ kind: "waiting_initial", req });
      const clientRes = await sharedService.simulateInitialClientValidation(req.id);
      if (clientRes === "rejected") {
        toast.error("Le client initial a refusé la demande");
        setPhase({ kind: "rejected", step: "initial" });
        return;
      }
    }

    toast.success("Votre partage de course est confirmé");
    setPhase({ kind: "accepted", req });

    // Join the standard ride workflow (tracking → payment → history).
    setDraft({
      from: draft.from ?? ride.from,
      to: draft.to ?? ride.to,
      vehicle: ride.vehicle,
      distanceKm: ride.addedDistanceKm,
      durationMin: ride.addedDurationMin,
      basePrice: ride.originalPrice,
      finalPrice: ride.proposedPrice,
      driver: ride.driver,
      shared: true,
      savings: ride.originalPrice - ride.proposedPrice,
    });

    setTimeout(() => navigate({ to: "/tracking" }), 1400);
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-screen sm:min-h-[860px] overflow-x-hidden">
        <StatusBar />
        <div className="px-4 sm:px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/shared" })}
            className="h-10 w-10 shrink-0 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate">Demande de partage</h1>
            <p className="text-xs text-[#B8BED6] truncate">
              {pickupLabel} → {destLabel}
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-5 flex-1 pb-5">
          <QueryView state={state} emptyLabel="Course introuvable">
            {(r) => (
              <div className="space-y-3">
                {/* Driver + vehicle */}
                <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 space-y-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
                      {r.driver.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{r.driver.name}</p>
                      <p className="text-xs text-[#B8BED6] truncate">
                        {r.driver.vehicle} · {r.driver.plate}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A0E27] text-[#B8BED6] shrink-0 flex items-center gap-1">
                      <Car className="h-3 w-3" /> {r.vehicle}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs">
                    <p className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#3B6BFF] shrink-0" />
                      <span className="text-[#B8BED6]">Départ initial :&nbsp;</span>
                      <span className="truncate">{r.from.name}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#7B5CFF] shrink-0" />
                      <span className="text-[#B8BED6]">Destination initiale :&nbsp;</span>
                      <span className="truncate">{r.to.name}</span>
                    </p>
                  </div>
                </div>

                {/* Initial client (only if present in mocks) */}
                {r.initialClient && (
                  <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-[#0A0E27] flex items-center justify-center text-white text-xs font-bold">
                      {r.initialClient.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        Client actuel : {r.initialClient.name}
                      </p>
                      <p className="text-[11px] text-[#B8BED6]">
                        {r.initialClient.alreadyDroppedOff ? "Déjà descendu du véhicule" : "Toujours dans la course"}
                      </p>
                    </div>
                  </div>
                )}

                {/* New participant */}
                <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#B8BED6]">Votre trajet</p>
                  <div className="text-xs space-y-1.5">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 text-[#3B6BFF] shrink-0" />
                      <span className="truncate">{pickupLabel}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 text-[#7B5CFF] shrink-0" />
                      <span className="truncate">{destLabel}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Stat label="Distance ajoutée" value={`+${r.addedDistanceKm} km`} />
                    <Stat label="Impact durée" value={`+${r.addedDurationMin} min`} />
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-4 space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-[#B8BED6]">Calcul du partage</p>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#B8BED6]">Avant partage</span>
                    <span className="tabular-nums">{r.originalPrice.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#B8BED6]">Après partage</span>
                    <span className="tabular-nums font-semibold">{r.newTotalPrice.toLocaleString()} FCFA</span>
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-2">
                    {r.initialClient && (
                      <div className="rounded-xl bg-[#0A0E27] p-3">
                        <p className="text-[11px] text-[#B8BED6]">Client initial</p>
                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="line-through text-[#B8BED6] tabular-nums">
                            {r.originalPrice.toLocaleString()}
                          </span>
                          <span className="tabular-nums font-semibold">
                            {r.initialClientNewPrice.toLocaleString()} FCFA
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-300 flex items-center gap-1 mt-1">
                          <TrendingDown className="h-3 w-3" />
                          Économie : {(r.originalPrice - r.initialClientNewPrice).toLocaleString()} FCFA
                        </p>
                      </div>
                    )}
                    <div className="rounded-xl bg-[#0A0E27] p-3">
                      <p className="text-[11px] text-[#B8BED6]">Vous (nouveau participant)</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-[#B8BED6]">Prix à payer</span>
                        <span className="text-lg font-bold text-gradient-primary tabular-nums">
                          {r.proposedPrice.toLocaleString()} <span className="text-[10px] text-[#B8BED6] font-normal">FCFA</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#B8BED6]">
                    <Clock className="h-3 w-3" /> Récupération dans ~{r.pickupEtaMin} min
                  </div>
                </div>

                {/* Phase panel */}
                <PhasePanel phase={phase} onSubmit={() => submit(r)} onRetry={() => navigate({ to: "/shared" })} />
              </div>
            )}
          </QueryView>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#0A0E27] p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-[#B8BED6]">{label}</p>
      <p className="text-sm font-bold tabular-nums mt-0.5">{value}</p>
    </div>
  );
}

function PhasePanel({
  phase, onSubmit, onRetry,
}: { phase: Phase; onSubmit: () => void; onRetry: () => void }) {
  if (phase.kind === "idle" || phase.kind === "verifying") {
    return (
      <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-[#7B5CFF] shrink-0" />
        <p className="text-xs text-[#B8BED6]">Vérification de compatibilité en cours…</p>
      </div>
    );
  }
  if (phase.kind === "blocked") {
    return (
      <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 flex items-center gap-3">
        <X className="h-5 w-5 text-red-300 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Course non disponible</p>
          <p className="text-[11px] text-[#B8BED6] truncate">{phase.reason}</p>
        </div>
        <button onClick={onRetry} className="h-9 px-3 rounded-lg bg-[#0A0E27] border border-white/10 text-xs shrink-0">
          Retour
        </button>
      </div>
    );
  }
  if (phase.kind === "ready") {
    return (
      <>
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-300 shrink-0" />
          <p className="text-[11px] text-emerald-200">Course active, trajet compatible, partage autorisé.</p>
        </div>
        <button
          onClick={onSubmit}
          className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow"
        >
          Envoyer une demande de partage
        </button>
      </>
    );
  }
  if (phase.kind === "submitting") {
    return <WaitingCard title="Envoi de la demande…" sub="Merci de patienter" />;
  }
  if (phase.kind === "waiting_driver") {
    return <WaitingCard title="En attente de validation du chauffeur" sub="Statut : EN_ATTENTE_CHAUFFEUR" />;
  }
  if (phase.kind === "waiting_initial") {
    return <WaitingCard title="En attente de validation du client actuel" sub="Statut : EN_ATTENTE_CLIENT_INITIAL" />;
  }
  if (phase.kind === "accepted") {
    return (
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-center gap-3">
        <Check className="h-5 w-5 text-emerald-300 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold">Partage confirmé (PARTAGEE)</p>
          <p className="text-[11px] text-[#B8BED6]">Redirection vers le suivi du chauffeur…</p>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 flex items-center gap-3">
      <X className="h-5 w-5 text-red-300 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">Demande refusée</p>
        <p className="text-[11px] text-[#B8BED6]">
          {phase.step === "driver" ? "Le chauffeur a refusé." : "Le client initial a refusé."}
        </p>
      </div>
      <button onClick={onRetry} className="h-9 px-3 rounded-lg bg-[#0A0E27] border border-white/10 text-xs shrink-0">
        Retour
      </button>
    </div>
  );
}

function WaitingCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-4 flex items-center gap-3">
      <Loader2 className="h-5 w-5 animate-spin text-[#7B5CFF] shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate">{title}</p>
        <p className="text-[11px] text-[#B8BED6] truncate">{sub}</p>
      </div>
    </div>
  );
}
