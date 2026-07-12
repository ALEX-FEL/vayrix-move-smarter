import type { FareEstimate, NegotiationResult, Ride, VehicleOption, VehicleType, Place } from "@/models";
import { delay, pickWeighted, uid } from "@/lib/async";

// Replace bodies with fetch() calls when backend is ready — signatures stay identical.

const BASE_RATE = 120; // XAF per km baseline

export const rideService = {
  async estimateFare(from: Place, to: Place): Promise<FareEstimate> {
    await delay(700);
    // pseudo-distance from lat/lng
    const dx = to.lat - from.lat;
    const dy = to.lng - from.lng;
    const distanceKm = Math.max(1.5, Math.round(Math.sqrt(dx * dx + dy * dy) * 111 * 10) / 10);
    const durationMin = Math.max(5, Math.round(distanceKm * 2.4));
    const basePrice = Math.round((distanceKm * BASE_RATE + 400) / 50) * 50;
    return { distanceKm, durationMin, basePrice };
  },

  async listVehicles(basePrice: number): Promise<VehicleOption[]> {
    await delay(300);
    return [
      { id: "moto", label: "Moto", description: "Rapide et économique", eta: 2, multiplier: 0.55, price: Math.round((basePrice * 0.55) / 50) * 50 },
      { id: "classic", label: "Classique", description: "Confort standard", eta: 4, multiplier: 1, price: basePrice },
      { id: "premium", label: "Premium", description: "Berline haut de gamme", eta: 6, multiplier: 1.7, price: Math.round((basePrice * 1.7) / 50) * 50 },
    ];
  },

  async negotiate(offered: number, listed: number): Promise<NegotiationResult> {
    await delay(1100);
    const ratio = offered / listed;
    if (ratio >= 0.9) {
      return { status: "accepted", finalPrice: offered, message: "Le chauffeur accepte votre prix." };
    }
    if (ratio < 0.7) {
      return { status: "rejected", finalPrice: listed, message: "Prix refusé, offre trop basse." };
    }
    const counter = Math.round(((offered + listed) / 2) / 50) * 50;
    return { status: "counter", finalPrice: counter, message: `Contre-proposition à ${counter} XAF.` };
  },

  async createRide(payload: {
    from: Place; to: Place; vehicle: VehicleType; price: number;
    distanceKm: number; durationMin: number;
  }): Promise<Ride> {
    await delay(500);
    return {
      id: uid("r"),
      ...payload,
      status: "requested",
      createdAt: new Date().toISOString(),
    };
  },

  async simulateProgress(): Promise<"low" | "medium" | "high"> {
    await delay(200);
    return pickWeighted<"low" | "medium" | "high">([
      ["low", 6],
      ["medium", 3],
      ["high", 1],
    ]);
  },
};
