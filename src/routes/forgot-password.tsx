import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { StatusBar } from "@/components/StatusBar";
import { VayrixLogo } from "@/components/VayrixLogo";
import { Mail, ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset Password — Vayrix" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("code");
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("success");
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full min-h-screen sm:min-h-[860px]">
        <StatusBar />
        <div className="flex-1 px-6 pt-8 pb-8 flex flex-col">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate({ to: "/auth" })}
              className="p-2 -ml-2 hover:bg-white/5 rounded-lg transition"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <span className="text-sm font-medium text-[#B8BED6]">Back</span>
          </div>

          <div className="mt-8 animate-float-up">
            <h1 className="text-3xl font-bold leading-tight">Reset password</h1>
            <p className="mt-2 text-sm text-[#B8BED6]">
              {step === "email" && "Enter your email to receive a recovery code"}
              {step === "code" && "Enter the code sent to your email"}
              {step === "success" && "Your password has been reset"}
            </p>
          </div>

          {step === "email" && (
            <form
              className="mt-6 space-y-3 animate-float-up [animation-delay:120ms]"
              onSubmit={handleEmailSubmit}
            >
              <label className="block">
                <span className="text-[11px] uppercase tracking-wider text-[#B8BED6]">
                  Email
                </span>
                <div className="mt-1.5 h-12 px-3.5 rounded-xl bg-[#141B3D] border border-white/5 flex items-center gap-3 focus-within:border-[#7B5CFF]/60 transition">
                  <Mail className="h-4 w-4 text-[#B8BED6]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm placeholder:text-white/30"
                    placeholder="you@vayrix.com"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow hover:opacity-95 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send recovery code"}
              </button>
            </form>
          )}

          {step === "code" && (
            <form
              className="mt-6 space-y-3 animate-float-up [animation-delay:120ms]"
              onSubmit={handleCodeSubmit}
            >
              <p className="text-sm text-[#B8BED6]">
                A code has been sent to <strong>{email}</strong>
              </p>

              <label className="block">
                <span className="text-[11px] uppercase tracking-wider text-[#B8BED6]">
                  Recovery code
                </span>
                <div className="mt-1.5 h-12 px-3.5 rounded-xl bg-[#141B3D] border border-white/5 flex items-center gap-3 focus-within:border-[#7B5CFF]/60 transition">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-transparent outline-none text-sm placeholder:text-white/30"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow hover:opacity-95 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify code"}
              </button>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-sm text-[#B8BED6] hover:text-white transition"
              >
                Didn't receive a code? Try another email
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="mt-8 flex flex-col items-center text-center animate-float-up [animation-delay:120ms]">
              <div className="w-16 h-16 rounded-full bg-gradient-primary/20 border border-[#7B5CFF]/50 flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-[#7B5CFF]" />
              </div>

              <h2 className="text-xl font-bold">Password reset successful</h2>
              <p className="mt-2 text-sm text-[#B8BED6]">
                You can now sign in with your new password
              </p>

              <button
                onClick={() => navigate({ to: "/auth" })}
                className="w-full mt-8 h-12 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow hover:opacity-95 transition active:scale-[0.99]"
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
