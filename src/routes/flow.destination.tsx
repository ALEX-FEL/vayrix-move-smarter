import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, MapPin, Search } from "lucide-react";
import { useRide } from "@/providers/RideProvider";
import { places } from "@/mocks/places";
import { useState } from "react";

export const Route = createFileRoute("/flow/destination")({
  head: () => ({ meta: [{ title: "Destination — Vayrix" }] }),
  component: Destination,
});

function Destination() {
  const navigate = useNavigate();
  const { setDraft } = useRide();
  const [q, setQ] = useState("");
  const filtered = places.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  const choose = (p: typeof places[number]) => {
    setDraft({ to: p });
    navigate({ to: "/flow/estimate" });
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        <StatusBar />
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/flow/pickup" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#B8BED6]">Étape 2 / 3</p>
            <h1 className="text-lg font-semibold">Où allez-vous ?</h1>
          </div>
        </div>

        <div className="px-5 space-y-4 flex-1">
          <div className="flex items-center gap-3 h-12 px-3 rounded-xl bg-[#141B3D] border border-white/5">
            <Search className="h-4 w-4 text-[#B8BED6]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher une adresse"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-[#B8BED6] py-10">Aucun lieu trouvé</p>
            ) : (
              filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => choose(p)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#141B3D] border border-white/5 text-left hover:border-[#7B5CFF]/40 transition"
                >
                  <div className="h-9 w-9 rounded-lg bg-[#0A0E27] flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-[#7B5CFF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-[#B8BED6]">{p.subtitle}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
