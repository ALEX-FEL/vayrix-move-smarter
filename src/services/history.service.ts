import type { Ride } from "@/models";
import { rideHistory } from "@/mocks/rides";
import { delay } from "@/lib/async";

export const historyService = {
  async list(): Promise<Ride[]> {
    await delay(500);
    return rideHistory;
  },
  async recent(limit = 3): Promise<Ride[]> {
    await delay(200);
    return rideHistory.slice(0, limit);
  },
};
