import type { Ride } from "@/models";
import { places, currentLocation } from "./places";

export const rideHistory: Ride[] = [
  {
    id: "r1", from: currentLocation, to: places[0], vehicle: "classic",
    price: 1500, finalPrice: 1500, distanceKm: 17.4, durationMin: 32,
    status: "completed", driverId: "d1", createdAt: "2026-07-12T09:24:00Z",
  },
  {
    id: "r2", from: places[2], to: places[3], vehicle: "classic",
    price: 900, finalPrice: 900, distanceKm: 4.2, durationMin: 12,
    status: "completed", driverId: "d2", createdAt: "2026-07-11T18:05:00Z",
  },
  {
    id: "r3", from: places[5], to: places[1], vehicle: "moto",
    price: 650, distanceKm: 3.1, durationMin: 9,
    status: "cancelled", createdAt: "2026-07-08T12:42:00Z",
  },
  {
    id: "r4", from: places[4], to: places[2], vehicle: "classic",
    price: 1100, finalPrice: 900, distanceKm: 5.6, durationMin: 15,
    status: "completed", driverId: "d1", createdAt: "2026-07-07T21:10:00Z",
    shared: true, savings: 400,
  },
];
