import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Banknote, Smartphone, Check } from "lucide-react";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Payment — Vayrix" }] }),
  component: Payment,
});

const methods = [
  { id: "cash", label: "Cash", subtitle: "Pay driver directly", icon: Banknote, color: "from-emerald-400 to-emerald-600" },
  { id: "mtn", label: "MTN Mobile Money", subtitle: "+237 6•• ••• 482", icon: Smartphone, color: "from-yellow-400 to-amber-500" },
  { id: "orange", label: "Orange Money", subtitle: "+237 6•• ••• 113", icon: Smartphone, color: "from-orange-400 to-orange-600" },
];

function Payment() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("cash");
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
          <h1 className="text-lg font-semibold">Payment</h1>
        </div>

        <div className="px-5 space-y-5 flex-1">
          {/* Total */}
          <div className="rounded-2xl p-6 text-center bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 shadow-card animate-float-up">
            <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Total to pay</p>
            <p className="mt-2 text-5xl font-bold text-gradient-primary tabular-nums">
              1,500
            </p>
            <p className="text-sm text-[#B8BED6]">XAF</p>

            <div className="mt-5 grid grid-cols-3 gap-3 text-left">
              <Detail label="Fare" value="1,350" />
              <Detail label="Service" value="100" />
              <Detail label="Tax" value="50" />
            </div>
          </div>

          {/* Methods */}
          <div className="space-y-2 animate-float-up [animation-delay:80ms]">
            <h2 className="text-xs uppercase tracking-widest text-[#B8BED6]">Payment method</h2>
            {methods.map((m) => {
              const Icon = m.icon;
              const active = selected === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition ${
                    active
                      ? "bg-[#1a2348] border-[#7B5CFF]/60 shadow-glow"
                      : "bg-[#141B3D] border-white/5"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{m.label}</p>
                    <p className="text-xs text-[#B8BED6]">{m.subtitle}</p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      active ? "bg-gradient-primary" : "border border-white/20"
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          <button
            onClick={() => navigate({ to: "/completed" })}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow active:scale-[0.99] transition"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#0A0E27]/60 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-[#B8BED6]">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
