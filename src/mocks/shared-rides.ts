import type { SharedRide } from "@/models";
import { places, currentLocation } from "./places";

export const sharedRides: SharedRide[] = [
  {
    id: "s1", from: currentLocation, to: places[0],
    proposedPrice: 900, originalPrice: 1500, savings: 600,
    departureAt: "Dans 8 min", seatsLeft: 2,
    requester: { name: "Julie M.", initials: "JM", rating: 4.9 },
  },
  {
    id: "s2", from: currentLocation, to: places[2],
    proposedPrice: 500, originalPrice: 800, savings: 300,
    departureAt: "Dans 12 min", seatsLeft: 1,
    requester: { name: "Paul E.", initials: "PE", rating: 4.7 },
  },
  {
    id: "s3", from: currentLocation, to: places[3],
    proposedPrice: 650, originalPrice: 1000, savings: 350,
    departureAt: "Dans 18 min", seatsLeft: 3,
    requester: { name: "Clara N.", initials: "CN", rating: 4.8 },
  },
];
