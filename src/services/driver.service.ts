import type { Driver, VehicleType } from "@/models";
import { drivers } from "@/mocks/drivers";
import { delay } from "@/lib/async";

export const driverService = {
  async findNearby(vehicle: VehicleType): Promise<Driver[]> {
    await delay(900);
    return drivers.filter((d) => d.vehicleType === vehicle || vehicle === "classic");
  },

  async matchDriver(vehicle: VehicleType): Promise<Driver> {
    await delay(1800);
    const candidates = drivers.filter((d) => d.vehicleType === vehicle);
    const pool = candidates.length ? candidates : drivers;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  async getById(id: string): Promise<Driver | null> {
    await delay(150);
    return drivers.find((d) => d.id === id) ?? null;
  },
};
