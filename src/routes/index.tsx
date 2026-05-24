import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { VayrixLogo } from "@/components/VayrixLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vayrix — Move smarter" },
      { name: "description", content: "Vayrix premium ride-hailing app." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/auth" }), 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <PhoneFrame>
      <div className="relative h-full min-h-screen sm:min-h-[860px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 glow-radial opacity-60" />
        <div className="relative animate-float-up flex flex-col items-center gap-6">
          <VayrixLogo size={108} />
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gradient-primary">
              Vayrix
            </h1>
            <p className="mt-2 text-sm text-[#B8BED6] tracking-widest uppercase">
              Move smarter
            </p>
          </div>
        </div>
        <div className="absolute bottom-10 flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse [animation-delay:200ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </PhoneFrame>
  );
}
