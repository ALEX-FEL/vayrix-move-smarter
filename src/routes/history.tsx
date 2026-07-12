import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { historyService } from "@/services/history.service";
import type { AsyncState, Ride } from "@/models";
import { QueryView } from "@/components/QueryView";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Historique — Vayrix" }] }),
  component: History,
});

type Tab = "all" | "shared" | "payments";

function History() {
  const [state, setState] = useState<AsyncState<Ride[]>>({ status: "loading" });
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");

  const load = async () => {
    setState({ status: "loading" });
    try {
      const list = await historyService.list();
      setState(list.length ? { status: "success", data: list } : { status: "empty" });
    } catch (e) {
      setState({ status: "error", message: (e as Error).message });
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (state.status !== "success") return null;
    return state.data.filter((r) => {
      if (tab === "shared" && !r.shared) return false;
      if (tab === "payments" && r.status !== "completed") return false;
      if (q && !`${r.from.name} ${r.to.name}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [state, tab, q]);

  const total = filtered?.filter((r) => r.status === "completed")
    .reduce((s, r) => s + (r.finalPrice ?? r.price), 0) ?? 0;

  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-4">
        <header>
          <h1 className="text-2xl font-bold">Vos trajets</h1>
          <p className="text-sm text-[#B8BED6]">Historique et reçus</p>
        </header>

        <div className="rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Total dépensé</p>
            <p className="mt-1 text-3xl font-bold text-gradient-primary tabular-nums">
              {total.toLocaleString()} <span className="text-sm text-white/70">XAF</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#B8BED6]">Trajets</p>
            <p className="text-2xl font-bold">{filtered?.length ?? 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 h-11 px-3 rounded-xl bg-[#141B3D] border border-white/5">
          <Search className="h-4 w-4 text-[#B8BED6]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un trajet"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
          />
        </div>

        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#141B3D] border border-white/5">
          {([
            ["all", "Tous"],
            ["shared", "Partagés"],
            ["payments", "Paiements"],
          ] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`h-9 rounded-lg text-xs font-semibold transition ${
                tab === id ? "bg-gradient-primary text-white shadow-glow" : "text-[#B8BED6]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <QueryView state={state} onRetry={load} emptyLabel="Aucun trajet à afficher">
          {() => (
            <div className="space-y-2">
              {(filtered ?? []).length === 0 ? (
                <p className="text-center text-sm text-[#B8BED6] py-8">Aucun résultat</p>
              ) : (
                filtered!.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-4 rounded-2xl bg-[#141B3D] border border-white/5">
                    <div className="h-11 w-11 rounded-xl bg-[#0A0E27] flex flex-col items-center justify-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3B6BFF]" />
                      <span className="h-3 w-px bg-white/15" />
                      <span className="h-1.5 w-1.5 rounded-sm bg-[#7B5CFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.from.name} → {r.to.name}</p>
                      <p className="text-xs text-[#B8BED6]">{new Date(r.createdAt).toLocaleString()}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          r.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-red-500/15 text-red-300"
                        }`}>
                          {r.status === "completed" ? "Terminée" : "Annulée"}
                        </span>
                        {r.shared && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7B5CFF]/20 text-[#c8b8ff]">
                            Partagée
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold tabular-nums">{(r.finalPrice ?? r.price).toLocaleString()}</p>
                      <p className="text-[10px] text-[#B8BED6]">XAF</p>
                      {r.savings ? (
                        <p className="text-[10px] text-emerald-300">-{r.savings}</p>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </QueryView>
      </div>
    </AppShell>
  );
}
