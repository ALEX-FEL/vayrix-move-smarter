import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/rating")({
  head: () => ({ meta: [{ title: "Évaluation — Vayrix" }] }),
  component: Rating,
});

function Rating() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tip, setTip] = useState<number | null>(null);

  const submit = () => {
    toast.success("Merci pour votre évaluation");
    navigate({ to: "/home" });
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        {/* <StatusBar /> */}
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/home" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <h1 className="text-lg font-semibold">Évaluer le chauffeur</h1>
        </div>

        <div className="flex-1 px-5 space-y-5">
          <div className="rounded-2xl bg-[#141B3D] border border-white/5 p-5 text-center animate-float-up">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow">
              ET
            </div>
            <p className="mt-3 text-sm font-semibold">Eric T.</p>
            <p className="text-xs text-[#B8BED6]">Toyota Yaris · LT 782 DJ</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} className="active:scale-110 transition">
                  <Star
                    className={`h-10 w-10 ${
                      n <= rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Commentaire</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Laissez un mot au chauffeur (optionnel)"
              rows={3}
              className="w-full rounded-xl bg-[#141B3D] border border-white/5 p-3 text-sm outline-none focus:border-[#7B5CFF] placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#B8BED6]">Pourboire</p>
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
                  {v === 0 ? "Non" : `+${v}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5">
          <button
            onClick={submit}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow"
          >
            Envoyer
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
