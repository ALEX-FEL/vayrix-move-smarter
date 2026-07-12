import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import type { RiskLevel } from "@/models";

type SafetyCtx = {
  active: boolean;
  risk: RiskLevel;
  recording: boolean;
  setActive: (v: boolean) => void;
  setRisk: (r: RiskLevel) => void;
  setRecording: (v: boolean) => void;
};

const Ctx = createContext<SafetyCtx | null>(null);

export function SafetyProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [risk, setRisk] = useState<RiskLevel>("low");
  const [recording, setRecording] = useState(false);
  const value = useMemo(() => ({ active, risk, recording, setActive, setRisk, setRecording }),
    [active, risk, recording]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSafety() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSafety must be used within SafetyProvider");
  return ctx;
}
