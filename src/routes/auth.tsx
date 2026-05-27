import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { VayrixLogo } from "@/components/VayrixLogo";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Vayrix" }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        <StatusBar />
        <div className="flex-1 px-6 pt-8 pb-8 flex flex-col">
          <div className="flex items-center gap-3 animate-float-up">
            <VayrixLogo size={48} />
            <div>
              <h2 className="text-xl font-bold text-gradient-primary">Vayrix</h2>
              <p className="text-xs text-[#B8BED6]">Move smarter</p>
            </div>
          </div>

          <div className="mt-10 animate-float-up [animation-delay:80ms]">
            <h1 className="text-3xl font-bold leading-tight">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-2 text-sm text-[#B8BED6]">
              {mode === "login"
                ? "Sign in to continue your journey"
                : "Join thousands moving smarter"}
            </p>
          </div>

          <div className="mt-4 inline-flex p-1 bg-[#141B3D] rounded-xl self-start">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === m
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "text-[#B8BED6]"
                }`}
              >
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          <form
            className="mt-6 space-y-3 animate-float-up [animation-delay:120ms]"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/home" });
            }}
          >
            <Field icon={<Mail className="h-4 w-4" />} label="Email">
              <input
                type="email"
                defaultValue="alex@vayrix.com"
                className="w-full bg-transparent outline-none text-sm placeholder:text-white/30"
                placeholder="you@vayrix.com"
              />
            </Field>
            <Field icon={<Lock className="h-4 w-4" />} label="Password">
              <input
                type={showPw ? "text" : "password"}
                defaultValue="••••••••••"
                className="w-full bg-transparent outline-none text-sm placeholder:text-white/30"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="text-[#B8BED6]"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </Field>

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-[#B8BED6] hover:text-white">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow hover:opacity-95 transition active:scale-[0.99]"
            >
              Continue
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#B8BED6]">
            <span className="flex-1 h-px bg-white/10" />
            Or
            <span className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={() => navigate({ to: "/home" })}
            className="w-full h-12 rounded-xl bg-[#141B3D] border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-3 hover:bg-[#1a2348] transition"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-auto pt-6 text-center text-xs text-[#B8BED6]">
            By continuing you accept our{" "}
            <Link to="/auth" className="text-white underline-offset-2 hover:underline">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-[#B8BED6]">
        {label}
      </span>
      <div className="mt-1.5 h-12 px-3.5 rounded-xl bg-[#141B3D] border border-white/5 flex items-center gap-3 focus-within:border-[#7B5CFF]/60 transition">
        <span className="text-[#B8BED6]">{icon}</span>
        {children}
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 16.3 4.5 9.7 8.8 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13-5l-6-5.1c-2 1.4-4.4 2.2-7 2.2-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.2 16.2 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6 5.1c-.4.4 6.7-4.9 6.7-14.5 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
