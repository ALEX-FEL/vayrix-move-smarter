import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { MapBg } from "@/components/MapBg";
import { ArrowLeft, Car } from "lucide-react";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Searching — Vayrix" }] }),
  component: Booking,
});

function Booking() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"searching" | "found">("searching");

  useEffect(() => {
    const t = setTimeout(() => setPhase("found"), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "found") {
      const t = setTimeout(() => navigate({ to: "/driver-found" }), 1200);
      return () => clearTimeout(t);
    }
  }, [phase, navigate]);

  return (
    <PhoneFrame>
      <div className="relative h-full min-h-screen sm:min-h-[860px]">
        <MapBg />
        <StatusBar />

        {/* Top bar */}
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="h-10 w-10 rounded-full bg-[#141B3D]/90 backdrop-blur border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="px-3 py-1.5 rounded-full bg-[#141B3D]/90 backdrop-blur border border-white/10 text-xs">
            Essos → Nsimalen
          </div>
          <div className="w-10" />
        </div>

        {/* Center pulse */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-primary blur-2xl opacity-40 animate-pulse" />
            <div className="relative h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
              <Car className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom sheet */}
        <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 p-5 shadow-card animate-float-up">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#0A0E27] flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-[#7B5CFF] animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {phase === "searching" ? "Looking for nearby drivers" : "Driver found"}
              </p>
              <p className="text-xs text-[#B8BED6]">
                {phase === "searching" ? "Hold tight, this won’t take long" : "Connecting you now…"}
              </p>
            </div>
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-gradient-primary animate-[shimmer_1.4s_linear_infinite]"
              style={{ width: "70%", backgroundSize: "200% 100%" }}
            />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
