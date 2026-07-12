import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { useRide } from "@/providers/RideProvider";
import { currentLocation, places } from "@/mocks/places";

export const Route = createFileRoute("/flow/pickup")({
  head: () => ({ meta: [{ title: "Départ — Vayrix" }] }),
  component: Pickup,
});

function Pickup() {
  const navigate = useNavigate();
  const { setDraft, draft } = useRide();

  const choose = (p: typeof currentLocation) => {
    setDraft({ from: p });
    navigate({ to: "/flow/destination" });
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        <StatusBar />
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#B8BED6]">Étape 1 / 3</p>
            <h1 className="text-lg font-semibold">Point de départ</h1>
          </div>
        </div>

        <div className="px-5 space-y-3 flex-1">
          <button
            onClick={() => choose(currentLocation)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-[#7B5CFF]/40 text-left"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Navigation className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{currentLocation.name}</p>
              <p className="text-xs text-[#B8BED6]">{currentLocation.subtitle}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              GPS
            </span>
          </button>

          <div className="flex items-center gap-3 h-12 px-3 rounded-xl bg-[#141B3D] border border-white/5">
            <MapPin className="h-4 w-4 text-[#B8BED6]" />
            <input
              placeholder="Ou saisir une adresse"
              defaultValue={draft.from.name}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40"
            />
          </div>

          <div className="pt-2">
            <p className="text-xs uppercase tracking-widest text-[#B8BED6] mb-2">Récents</p>
            <div className="space-y-2">
              {places.slice(0, 4).map((p) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
