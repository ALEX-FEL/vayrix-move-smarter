import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Home, Briefcase, Plus, ShieldAlert, Bell, Shield, LogOut, ChevronRight, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import type { UserProfile } from "@/models";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profil — Vayrix" }] }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  useEffect(() => { userService.get().then(setUser); }, []);

  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-5 flex items-center gap-4 animate-float-up">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-xl font-bold shadow-glow">
            {user?.initials ?? "AK"}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold">{user?.name ?? "…"}</p>
            <p className="text-xs text-[#B8BED6]">{user?.email}</p>
            <p className="text-xs text-[#B8BED6]">{user?.phone}</p>
          </div>
          <Link
            to="/profile/edit"
            className="h-10 w-10 rounded-xl bg-[#0A0E27] border border-white/10 flex items-center justify-center"
          >
            <Pencil className="h-4 w-4 text-[#7B5CFF]" />
          </Link>
        </div>

        <section className="animate-float-up [animation-delay:80ms]">
          <h2 className="text-xs uppercase tracking-widest text-[#B8BED6] mb-2">Lieux enregistrés</h2>
          <div className="space-y-2">
            <PlaceRow icon={<Home className="h-4 w-4" />} label="Domicile" sub="Essos, Yaoundé" />
            <PlaceRow icon={<Briefcase className="h-4 w-4" />} label="Bureau" sub="Bastos, Yaoundé" />
            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-white/15 text-[#B8BED6] text-sm hover:border-[#7B5CFF]/60 hover:text-white transition">
              <Plus className="h-4 w-4" /> Ajouter un lieu
            </button>
          </div>
        </section>

        <section className="animate-float-up [animation-delay:140ms]">
          <h2 className="text-xs uppercase tracking-widest text-[#B8BED6] mb-2">Sécurité</h2>
          <div className="rounded-2xl bg-[#141B3D] border border-white/5 divide-y divide-white/5">
            <SettingLink to="/profile/emergency" icon={<ShieldAlert className="h-4 w-4" />} label="Contacts d'urgence" />
            <SettingLink to="/profile/edit" icon={<Bell className="h-4 w-4" />} label="Notifications" />
            <SettingLink to="/profile/edit" icon={<Shield className="h-4 w-4" />} label="Confidentialité" />
          </div>
        </section>

        <button
          onClick={() => navigate({ to: "/auth" })}
          className="w-full h-12 rounded-xl bg-[#141B3D] border border-red-500/30 text-red-300 font-semibold text-sm flex items-center justify-center gap-2 animate-float-up [animation-delay:200ms]"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>
    </AppShell>
  );
}

function PlaceRow({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-[#141B3D] border border-white/5">
      <div className="h-10 w-10 rounded-xl bg-[#0A0E27] flex items-center justify-center text-[#7B5CFF]">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-[#B8BED6]">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-[#B8BED6]" />
    </div>
  );
}

function SettingLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="w-full flex items-center gap-3 p-4 text-left">
      <span className="text-[#7B5CFF]">{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      <ChevronRight className="h-4 w-4 text-[#B8BED6]" />
    </Link>
  );
}
