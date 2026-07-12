import type { SharedRide } from "@/models";
import { sharedRides } from "@/mocks/shared-rides";
import { delay, pickWeighted } from "@/lib/async";

export const sharedService = {
  async search(): Promise<SharedRide[]> {
    await delay(900);
    return sharedRides;
  },

  async getById(id: string): Promise<SharedRide | null> {
    await delay(200);
    return sharedRides.find((r) => r.id === id) ?? null;
  },

  async requestJoin(_id: string): Promise<"accepted" | "rejected"> {
    await delay(2200);
    return pickWeighted<"accepted" | "rejected">([
      ["accepted", 3],
      ["rejected", 1],
    ]);
  },
};
