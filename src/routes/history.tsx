import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — Vayrix" }] }),
  component: History,
});

const rides = [
  { from: "Essos", to: "Nsimalen Airport", price: "1,500", date: "Today · 09:24", status: "Completed" },
  { from: "Bastos", to: "Akwa", price: "900", date: "Yesterday · 18:05", status: "Completed" },
  { from: "Mvog-Mbi", to: "Marché Central", price: "650", date: "Mon · 12:42", status: "Cancelled" },
  { from: "Omnisport", to: "Bastos", price: "1,100", date: "Sun · 21:10", status: "Completed" },
] as const;

function History() {
  const total = rides
    .filter((r) => r.status === "Completed")
    .reduce((acc, r) => acc + Number(r.price.replace(",", "")), 0);

  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-5">
        <header className="animate-float-up">
          <h1 className="text-2xl font-bold">Your trips</h1>
          <p className="text-sm text-[#B8BED6]">Recent rides and receipts</p>
        </header>

        <div className="rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-5 animate-float-up [animation-delay:60ms]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Spent this month</p>
              <p className="mt-1 text-3xl font-bold text-gradient-primary tabular-nums">
                {total.toLocaleString()} <span className="text-sm text-white/70">XAF</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#B8BED6]">Trips</p>
              <p className="text-2xl font-bold">{rides.length}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 animate-float-up [animation-delay:120ms]">
          {rides.map((r, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#141B3D] border border-white/5 hover:border-[#7B5CFF]/40 transition text-left"
            >
              <div className="h-11 w-11 rounded-xl bg-[#0A0E27] flex flex-col items-center justify-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3B6BFF]" />
                <span className="h-3 w-px bg-white/15" />
                <span className="h-1.5 w-1.5 rounded-sm bg-[#7B5CFF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {r.from} → {r.to}
                </p>
                <p className="text-xs text-[#B8BED6]">{r.date}</p>
                <span
                  className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full ${
                    r.status === "Completed"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-red-500/15 text-red-300"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums">{r.price}</p>
                <p className="text-[10px] text-[#B8BED6]">XAF</p>
                <ArrowRight className="h-3.5 w-3.5 text-[#B8BED6] ml-auto mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
