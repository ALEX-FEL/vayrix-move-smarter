import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { Star, Check } from "lucide-react";

export const Route = createFileRoute("/completed")({
  head: () => ({ meta: [{ title: "Trip completed — Vayrix" }] }),
  component: Completed,
});

function Completed() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState<number | null>(null);

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        <StatusBar />
        <div className="flex-1 px-5 py-6 space-y-6">
          <div className="text-center animate-float-up">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">Trip completed</h1>
            <p className="mt-1 text-sm text-[#B8BED6]">Hope you enjoyed your ride with Eric</p>
          </div>

          <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-5 animate-float-up [animation-delay:80ms]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
                ET
              </div>
              <div>
                <p className="text-sm font-semibold">Eric T.</p>
                <p className="text-xs text-[#B8BED6]">Toyota Yaris · LT 782 DJ</p>
              </div>
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-[#B8BED6] text-center">
              Rate your driver
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} className="transition active:scale-110">
                  <Star
                    className={`h-9 w-9 ${
                      n <= rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 animate-float-up [animation-delay:140ms]">
            <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Add a tip</p>
            <div className="grid grid-cols-4 gap-2">
              {[0, 200, 500, 1000].map((v) => (
                <button
                  key={v}
                  onClick={() => setTip(v)}
                  className={`h-12 rounded-xl text-sm font-semibold border transition ${
                    tip === v
                      ? "bg-gradient-primary border-transparent text-white shadow-glow"
                      : "bg-[#141B3D] border-white/5 text-[#B8BED6]"
                  }`}
                >
                  {v === 0 ? "No tip" : `+${v}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5">
          <button
            onClick={() => navigate({ to: "/history" })}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow active:scale-[0.99] transition"
          >
            Submit
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
