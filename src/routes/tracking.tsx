import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { MapBg } from "@/components/MapBg";
import { ArrowLeft, Phone, X, Share2 } from "lucide-react";

export const Route = createFileRoute("/tracking")({
  head: () => ({ meta: [{ title: "Tracking — Vayrix" }] }),
  component: Tracking,
});

function Tracking() {
  const navigate = useNavigate();
  const [eta, setEta] = useState(180);

  useEffect(() => {
    const i = setInterval(() => setEta((e) => (e > 1 ? e - 1 : e)), 1000);
    return () => clearInterval(i);
  }, []);

  const mm = String(Math.floor(eta / 60)).padStart(2, "0");
  const ss = String(eta % 60).padStart(2, "0");

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
            <p className="text-[10px] uppercase tracking-widest text-[#B8BED6]">Arriving in</p>
            <p className="text-lg font-bold text-gradient-primary tabular-nums">{mm}:{ss}</p>
          </div>
          <button className="h-10 w-10 rounded-full bg-[#141B3D]/90 backdrop-blur border border-white/10 flex items-center justify-center">
            <Share2 className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#141B3D]/95 backdrop-blur border border-white/10 p-5 shadow-card animate-float-up space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
              ET
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Eric T. is on the way</p>
              <p className="text-xs text-[#B8BED6]">Toyota Yaris · LT 782 DJ</p>
            </div>
          </div>

          <div className="relative pl-5">
            <div className="absolute left-1.5 top-1 bottom-1 w-px bg-white/15" />
            <Row dotClass="bg-[#3B6BFF]" title="Essos, Yaoundé" subtitle="Pickup" />
            <div className="h-3" />
            <Row dotClass="bg-[#7B5CFF]" title="Nsimalen Airport" subtitle="Destination · 7.8 km" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <ActionBtn icon={<Phone className="h-4 w-4" />} label="Call" />
            <ActionBtn icon={<Share2 className="h-4 w-4" />} label="Share" />
            <ActionBtn
              icon={<X className="h-4 w-4" />}
              label="Cancel"
              variant="danger"
              onClick={() => navigate({ to: "/home" })}
            />
          </div>

          <button
            onClick={() => navigate({ to: "/payment" })}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow active:scale-[0.99] transition"
          >
            I've arrived
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Row({ dotClass, title, subtitle }: { dotClass: string; title: string; subtitle: string }) {
  return (
    <div className="relative flex items-start gap-3">
      <span className={`absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full ${dotClass}`} />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-[#B8BED6]">{subtitle}</p>
      </div>
    </div>
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
