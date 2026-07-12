import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import type { Place, VehicleType, Driver } from "@/models";
import { currentLocation } from "@/mocks/places";

type RideDraft = {
  from: Place;
  to: Place | null;
  vehicle: VehicleType;
  distanceKm: number;
  durationMin: number;
  basePrice: number;
  finalPrice: number;
  driver: Driver | null;
  shared: boolean;
  savings: number;
};

type RideCtx = {
  draft: RideDraft;
  setDraft: (patch: Partial<RideDraft>) => void;
  reset: () => void;
};

const initial: RideDraft = {
  from: currentLocation,
  to: null,
  vehicle: "classic",
  distanceKm: 0,
  durationMin: 0,
  basePrice: 0,
  finalPrice: 0,
  driver: null,
  shared: false,
  savings: 0,
};

const Ctx = createContext<RideCtx | null>(null);

export function RideProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<RideDraft>(initial);
  const value = useMemo<RideCtx>(() => ({
    draft,
    setDraft: (patch) => setDraftState((prev) => ({ ...prev, ...patch })),
    reset: () => setDraftState(initial),
  }), [draft]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRide() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRide must be used within RideProvider");
  return ctx;
}
