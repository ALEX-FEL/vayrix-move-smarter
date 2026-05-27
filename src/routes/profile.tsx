import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Hop as Home, Briefcase, Plus, CreditCard, Bell, Shield, LogOut, ChevronRight, CreditCard as Edit2, Phone, User, Camera, Check } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Vayrix" }] }),
  component: Profile,
});

function Profile() {
  const { t } = useLanguage();
  const { profile, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      first_name: firstName,
      last_name: lastName,
      phone,
    });
    if (!error) {
      setIsEditing(false);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth";
  };

  return (
    <AppShell>
      <div className="px-5 pt-2 pb-6 space-y-5">
        <div className="rounded-3xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-5 animate-float-up relative overflow-hidden">

          {/* Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary rounded-full blur-3xl opacity-20" />

          {/* HEADER */}
          <div className="relative flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">
                {t.profile.title || "Mon Profil"}
              </h2>
              <p className="text-xs text-[#B8BED6] mt-1">
                Gérez vos informations personnelles
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="h-10 px-4 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2 text-sm font-medium hover:bg-white/15 transition"
              >
                <Edit2 className="h-4 w-4 text-[#7B5CFF]" />
                Modifier
              </button>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative flex flex-col items-center text-center">

            <div className="relative">
              <div className="h-24 w-24 rounded-3xl overflow-hidden bg-gradient-primary shadow-glow">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white text-3xl font-bold">
                    {profile
                      ? `${profile.first_name[0]}${profile.last_name[0]}`
                      : "U"}
                  </div>
                )}
              </div>

              {isEditing && (
                <button className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg border-2 border-[#141B3D]">
                  <Camera className="h-4 w-4 text-white" />
                </button>
              )}
            </div>

            <h3 className="mt-4 text-xl font-bold">
              {profile
                ? `${profile.first_name} ${profile.last_name}`
                : "Utilisateur"}
            </h3>

            <p className="mt-1 text-xs uppercase tracking-widest text-gradient-primary font-bold">
              {t.profile.premiumMember}
            </p>
          </div>

          {/* FORM */}
          {isEditing && (
            <div className="mt-6 space-y-4">

              <div>
                <label className="text-xs text-[#B8BED6] mb-2 block">
                  Prénom
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.auth.firstName}
                  className="w-full h-14 px-4 rounded-2xl bg-[#0A0E27]/80 border border-white/10 outline-none focus:border-[#7B5CFF] text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-[#B8BED6] mb-2 block">
                  Nom
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t.auth.lastName}
                  className="w-full h-14 px-4 rounded-2xl bg-[#0A0E27]/80 border border-white/10 outline-none focus:border-[#7B5CFF] text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-[#B8BED6] mb-2 block">
                  Téléphone
                </label>
                <div className="flex items-center h-14 px-4 rounded-2xl bg-[#0A0E27]/80 border border-white/10 focus-within:border-[#7B5CFF]">
                  <Phone className="h-4 w-4 text-[#B8BED6] mr-3" />

                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6XX XXX XXX"
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-12 rounded-2xl border border-white/10 bg-white/5 text-white font-medium text-sm"
                >
                  {t.common.cancel}
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-12 rounded-2xl bg-gradient-primary text-white font-semibold text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {saving ? t.common.loading : t.common.save}
                </button>
              </div>
            </div>
          )}

        </div>

        <section className="animate-float-up [animation-delay:80ms]">
          <h2 className="text-xs uppercase tracking-widest text-[#B8BED6] mb-2">
            {t.profile.savedPlaces}
          </h2>
          <div className="space-y-2">
            <PlaceRow
              icon={<Home className="h-4 w-4" />}
              label={t.profile.home}
              sub="Essos, Yaoundé"
            />
            <PlaceRow
              icon={<Briefcase className="h-4 w-4" />}
              label={t.profile.work}
              sub="Bastos, Yaoundé"
            />
            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-white/15 text-[#B8BED6] text-sm hover:border-[#7B5CFF]/60 hover:text-white transition">
              <Plus className="h-4 w-4" /> {t.profile.addNewPlace}
            </button>
          </div>
        </section>

        <section className="animate-float-up [animation-delay:140ms]">
          <h2 className="text-xs uppercase tracking-widest text-[#B8BED6] mb-2">
            {t.profile.account}
          </h2>
          <div className="rounded-2xl bg-[#141B3D] border border-white/5 divide-y divide-white/5">
            <SettingRow icon={<CreditCard className="h-4 w-4" />} label={t.profile.paymentMethods} />
            <SettingRow icon={<Bell className="h-4 w-4" />} label={t.profile.notifications} />
            <SettingRow icon={<Shield className="h-4 w-4" />} label={t.profile.privacySecurity} />
          </div>
        </section>

        <button
          onClick={handleSignOut}
          className="w-full h-12 rounded-xl bg-[#141B3D] border border-red-500/30 text-red-300 font-semibold text-sm flex items-center justify-center gap-2 animate-float-up [animation-delay:200ms] hover:bg-red-500/10 transition"
        >
          <LogOut className="h-4 w-4" /> {t.profile.signOut}
        </button>
      </div>
    </AppShell>
  );
}

function PlaceRow({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-[#141B3D] border border-white/5 text-left hover:border-[#7B5CFF]/40 transition">
      <div className="h-10 w-10 rounded-xl bg-[#0A0E27] flex items-center justify-center text-[#7B5CFF]">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-[#B8BED6]">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-[#B8BED6]" />
    </button>
  );
}

function SettingRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition">
      <span className="text-[#7B5CFF]">{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      <ChevronRight className="h-4 w-4 text-[#B8BED6]" />
    </button>
  );
}
