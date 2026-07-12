import type { Driver } from "@/models";

export const drivers: Driver[] = [
  {
    id: "d1", name: "Eric Tchoumi", initials: "ET", rating: 4.8, trips: 1204,
    plate: "LT 782 DJ", vehicle: "Toyota Yaris", vehicleType: "classic", distanceKm: 0.6,
  },
  {
    id: "d2", name: "Marie Owona", initials: "MO", rating: 4.9, trips: 2103,
    plate: "CE 104 AB", vehicle: "Hyundai Accent", vehicleType: "classic", distanceKm: 1.1,
  },
  {
    id: "d3", name: "Samuel Biya", initials: "SB", rating: 4.7, trips: 812,
    plate: "MT 442 YD", vehicle: "Yamaha DT 125", vehicleType: "moto", distanceKm: 0.3,
  },
  {
    id: "d4", name: "Aïcha Njoya", initials: "AN", rating: 5.0, trips: 96,
    plate: "PR 001 VX", vehicle: "Mercedes E-Class", vehicleType: "premium", distanceKm: 1.4,
  },
];
