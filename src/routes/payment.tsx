import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Banknote, Smartphone, Check, X, Loader2 } from "lucide-react";
import { useRide } from "@/providers/RideProvider";
import { paymentService } from "@/services/payment.service";
import type { PaymentMethodId, PaymentResult } from "@/models";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Paiement — Vayrix" }] }),
  component: Payment,
});

const methods: { id: PaymentMethodId; label: string; subtitle: string; icon: typeof Banknote; color: string }[] = [
  { id: "cash", label: "Espèces", subtitle: "Payez le chauffeur directement", icon: Banknote, color: "from-emerald-400 to-emerald-600" },
  { id: "mtn", label: "MTN Mobile Money", subtitle: "+237 6•• ••• 482", icon: Smartphone, color: "from-yellow-400 to-amber-500" },
  { id: "orange", label: "Orange Money", subtitle: "+237 6•• ••• 113", icon: Smartphone, color: "from-orange-400 to-orange-600" },
];

function Payment() {
  const navigate = useNavigate();
  const { draft } = useRide();
  const [selected, setSelected] = useState<PaymentMethodId>("cash");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const amount = draft.finalPrice || draft.basePrice || 1500;

  const pay = async () => {
    setBusy(true);
    try {
      const r = await paymentService.pay(selected, amount);
      setResult(r);
      if (r.status === "success") toast.success(r.message);
      else toast.error(r.message);
    } finally {
      setBusy(false);
    }
  };

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
          <h1 className="text-lg font-semibold">Paiement</h1>
        </div>

        <div className="px-5 space-y-5 flex-1">
          <div className="rounded-2xl p-6 text-center bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 shadow-card animate-float-up">
            <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Total à payer</p>
            <p className="mt-2 text-5xl font-bold text-gradient-primary tabular-nums">
              {amount.toLocaleString()}
            </p>
            <p className="text-sm text-[#B8BED6]">XAF</p>
            {draft.shared && draft.savings > 0 && (
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                Économie : {draft.savings.toLocaleString()} XAF
              </div>
            )}
          </div>

          <div className="space-y-2 animate-float-up [animation-delay:80ms]">
            <h2 className="text-xs uppercase tracking-widest text-[#B8BED6]">Méthode de paiement</h2>
            {methods.map((m) => {
              const Icon = m.icon;
              const active = selected === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition ${
                    active ? "bg-[#1a2348] border-[#7B5CFF]/60 shadow-glow" : "bg-[#141B3D] border-white/5"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{m.label}</p>
                    <p className="text-xs text-[#B8BED6]">{m.subtitle}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                    active ? "bg-gradient-primary" : "border border-white/20"
                  }`}>
                    {active && <Check className="h-3 w-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          <button
            onClick={pay}
            disabled={busy}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {busy ? "Traitement…" : "Confirmer le paiement"}
          </button>
        </div>

        <Sheet open={!!result} onOpenChange={(open) => !open && setResult(null)}>
          <SheetContent side="bottom" className="bg-[#141B3D] border-white/10 text-white rounded-t-3xl">
            {result && (
              <>
                <SheetHeader>
                  <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-2 ${
                    result.status === "success" ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}>
                    {result.status === "success"
                      ? <Check className="h-8 w-8 text-emerald-300" />
                      : <X className="h-8 w-8 text-red-300" />}
                  </div>
                  <SheetTitle className="text-center text-white">
                    {result.status === "success" ? "Paiement réussi" : "Paiement échoué"}
                  </SheetTitle>
                  <SheetDescription className="text-center text-[#B8BED6]">
                    {result.message}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 rounded-xl bg-[#0A0E27] p-4 space-y-2 text-sm">
                  <Row label="Montant" value={`${result.amount.toLocaleString()} XAF`} />
                  <Row label="Méthode" value={methods.find((m) => m.id === result.method)?.label ?? ""} />
                  <Row label="Référence" value={result.reference} mono />
                </div>
                <div className="mt-5 space-y-2">
                  {result.status === "success" ? (
                    <button
                      onClick={() => navigate({ to: "/completed" })}
                      className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow"
                    >
                      Voir le résumé
                    </button>
                  ) : (
                    <button
                      onClick={() => setResult(null)}
                      className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow"
                    >
                      Réessayer
                    </button>
                  )}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </PhoneFrame>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#B8BED6]">{label}</span>
      <span className={mono ? "font-mono text-xs" : "font-semibold"}>{value}</span>
    </div>
  );
}
