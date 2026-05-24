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
        <div className="rounded-2xl bg-gradient-to-br from-[#1a2348] to-[#141B3D] border border-white/5 p-5 animate-float-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary rounded-full blur-3xl opacity-20" />

          <div className="flex items-start gap-4 relative">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-glow overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {profile ? `${profile.first_name[0]}${profile.last_name[0]}` : "U"}
                  </span>
                )}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                  <Camera className="h-4 w-4 text-white" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="text-lg font-bold bg-transparent border-b border-white/20 outline-none focus:border-[#7B5CFF] flex-1"
                    placeholder={t.auth.firstName}
                  />
                ) : (
                  <p className="text-lg font-bold">
                    {profile ? `${profile.first_name} ${profile.last_name}` : "User"}
                  </p>
                )}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition"
                  >
                    <Edit2 className="h-4 w-4 text-[#7B5CFF]" />
                  </button>
                )}
              </div>

              {isEditing && (
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="text-sm bg-transparent border-b border-white/20 outline-none focus:border-[#7B5CFF] mt-1 w-full"
                  placeholder={t.auth.lastName}
                />
              )}

              <div className="mt-2 flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#B8BED6]" />
                {isEditing ? (
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-xs bg-transparent border-b border-white/20 outline-none focus:border-[#7B5CFF] flex-1"
                    placeholder="+237 6XX XXX XXX"
                  />
                ) : (
                  <p className="text-xs text-[#B8BED6]">
                    {profile?.phone || "+237"}
                  </p>
                )}
              </div>

              <p className="mt-2 text-[10px] uppercase tracking-widest text-gradient-primary font-bold">
                {t.profile.premiumMember}
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 h-10 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-10 rounded-xl bg-gradient-primary text-white font-medium text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {saving ? t.common.loading : t.common.save}
              </button>
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
