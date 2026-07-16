import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import type { UserProfile } from "@/models";

export const Route = createFileRoute("/profile/edit")({
  head: () => ({ meta: [{ title: "Modifier le profil — Vayrix" }] }),
  component: EditProfile,
});

function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { userService.get().then(setUser); }, []);

  if (!user) {
    return (
      <PhoneFrame>
        <div className="p-6 text-sm text-[#B8BED6]">Chargement…</div>
      </PhoneFrame>
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      await userService.update(user);
      toast.success("Profil mis à jour");
      navigate({ to: "/profile" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        {/* <StatusBar /> */}
        <div className="px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="h-10 w-10 rounded-full bg-[#141B3D] border border-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <h1 className="text-lg font-semibold">Modifier le profil</h1>
        </div>

        <div className="flex-1 px-5 space-y-4">
          <div className="flex flex-col items-center gap-2">
            <div className="h-24 w-24 rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl font-bold shadow-glow">
              {user.initials}
            </div>
            <button className="text-xs text-[#7B5CFF]">Changer la photo</button>
          </div>

          <Field label="Nom">
            <input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value, initials: e.target.value.split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase() })}
              className="input-mock"
            />
          </Field>
          <Field label="Téléphone">
            <input value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} className="input-mock" />
          </Field>
          <Field label="Email">
            <input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="input-mock" />
          </Field>
          <Field label="Langue">
            <select
              value={user.language}
              onChange={(e) => setUser({ ...user, language: e.target.value as "fr" | "en" })}
              className="input-mock"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </Field>
        </div>

        <div className="p-5">
          <button
            onClick={save}
            disabled={saving}
            className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
      <style>{`.input-mock { width:100%; height:44px; border-radius:12px; background:#141B3D; border:1px solid rgba(255,255,255,0.05); padding:0 12px; color:white; outline:none; font-size:14px; }`}</style>
    </PhoneFrame>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-[#B8BED6] mb-1">{label}</p>
      {children}
    </div>
  );
}
