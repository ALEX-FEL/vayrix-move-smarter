import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#05071a] p-0 sm:p-6">
      <div className="relative w-full max-w-[420px] min-h-screen sm:min-h-[860px] sm:max-h-[860px] sm:rounded-[40px] bg-[#0A0E27] overflow-hidden sm:border sm:border-white/10 sm:shadow-[0_30px_80px_-20px_rgba(123,92,255,0.35)]">
        {children}
      </div>
    </div>
  );
}
