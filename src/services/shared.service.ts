import type { SharedRide, ShareRequestStatus } from "@/models";
import { sharedRides } from "@/mocks/shared-rides";
import { delay, pickWeighted, uid } from "@/lib/async";

export type CompatibilityCheck = {
  active: boolean;
  sharingAllowed: boolean;
  compatible: boolean;
  notCompleted: boolean;
  ok: boolean;
  reason?: string;
};

export type ShareRequest = {
  id: string;
  courseId: string;
  status: ShareRequestStatus;
  createdAt: string;
};

// In-memory store — replace with API layer later.
const requestsStore = new Map<string, ShareRequest>();

export const sharedService = {
  async search(): Promise<SharedRide[]> {
    await delay(900);
    return sharedRides;
  },

  async getById(id: string): Promise<SharedRide | null> {
    await delay(200);
    return sharedRides.find((r) => r.id === id) ?? null;
  },

  async verifyCompatibility(id: string): Promise<CompatibilityCheck> {
    await delay(500);
    const r = sharedRides.find((x) => x.id === id);
    if (!r) {
      return {
        active: false, sharingAllowed: false, compatible: false, notCompleted: false,
        ok: false, reason: "Course introuvable",
      };
    }
    const active = r.status === "active" || r.status === "started";
    const notCompleted = r.status !== "completed" && r.status !== "cancelled";
    const compatible = r.addedDistanceKm <= 3 && r.seatsLeft > 0;
    const ok = active && r.sharingAllowed && compatible && notCompleted;
    return {
      active,
      sharingAllowed: r.sharingAllowed,
      compatible,
      notCompleted,
      ok,
      reason: !ok
        ? !active
          ? "La course n'est plus active"
          : !r.sharingAllowed
            ? "Le partage n'est pas autorisé"
            : !compatible
              ? "Trajet non compatible"
              : "Course déjà terminée"
        : undefined,
    };
  },

  async submitRequest(courseId: string): Promise<ShareRequest> {
    await delay(700);
    const req: ShareRequest = {
      id: uid("req"),
      courseId,
      status: "EN_ATTENTE_CHAUFFEUR",
      createdAt: new Date().toISOString(),
    };
    requestsStore.set(req.id, req);
    return req;
  },

  async simulateDriverValidation(requestId: string): Promise<"accepted" | "rejected"> {
    await delay(2200);
    const res = pickWeighted<"accepted" | "rejected">([["accepted", 3], ["rejected", 1]]);
    const req = requestsStore.get(requestId);
    if (req) req.status = res === "rejected" ? "REFUSEE" : "EN_ATTENTE_CLIENT_INITIAL";
    return res;
  },

  async simulateInitialClientValidation(requestId: string): Promise<"accepted" | "rejected"> {
    await delay(2000);
    const res = pickWeighted<"accepted" | "rejected">([["accepted", 4], ["rejected", 1]]);
    const req = requestsStore.get(requestId);
    if (req) req.status = res === "rejected" ? "REFUSEE" : "PARTAGEE";
    return res;
  },

  needsInitialClientValidation(ride: SharedRide): boolean {
    return ride.status === "started" && !!ride.initialClient && !ride.initialClient.alreadyDroppedOff;
  },

  // Legacy — kept so existing callers still compile.
  async requestJoin(_id: string): Promise<"accepted" | "rejected"> {
    await delay(1500);
    return pickWeighted<"accepted" | "rejected">([["accepted", 3], ["rejected", 1]]);
  },
};
