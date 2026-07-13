// Domain models — swap for API DTOs later without changing consumers.

export type Place = {
  id: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
};

export type VehicleType = "moto" | "classic" | "premium";

export type VehicleOption = {
  id: VehicleType;
  label: string;
  description: string;
  eta: number; // minutes
  price: number; // XAF
  multiplier: number;
};

export type Driver = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  trips: number;
  plate: string;
  vehicle: string;
  vehicleType: VehicleType;
  photoUrl?: string;
  distanceKm: number;
};

export type NegotiationResult = {
  status: "accepted" | "rejected" | "counter";
  finalPrice: number;
  message: string;
};

export type FareEstimate = {
  distanceKm: number;
  durationMin: number;
  basePrice: number;
};

export type Ride = {
  id: string;
  from: Place;
  to: Place;
  vehicle: VehicleType;
  price: number;
  finalPrice?: number;
  distanceKm: number;
  durationMin: number;
  status: "requested" | "matched" | "ongoing" | "completed" | "cancelled";
  driverId?: string;
  createdAt: string;
  shared?: boolean;
  savings?: number;
};

export type PaymentMethodId = "cash" | "mtn" | "orange";

export type PaymentResult = {
  status: "success" | "failed";
  reference: string;
  method: PaymentMethodId;
  amount: number;
  message: string;
};

export type RiskLevel = "low" | "medium" | "high";

export type SharedRideStatus = "active" | "started" | "completed" | "cancelled";

export type ShareRequestStatus =
  | "EN_ATTENTE_CHAUFFEUR"
  | "EN_ATTENTE_CLIENT_INITIAL"
  | "PARTAGEE"
  | "REFUSEE";

export type InitialClient = {
  name: string;
  initials: string;
  alreadyDroppedOff: boolean;
};

export type SharedRide = {
  id: string;
  from: Place;
  to: Place;
  proposedPrice: number;
  originalPrice: number;
  savings: number;
  departureAt: string;
  pickupEtaMin: number;
  seatsLeft: number;
  distanceFromUserKm: number;
  addedDistanceKm: number;
  addedDurationMin: number;
  vehicle: VehicleType;
  driver: Driver;
  status: SharedRideStatus;
  sharingAllowed: boolean;
  initialClient?: InitialClient;
  newTotalPrice: number;
  initialClientNewPrice: number;
  requester: { name: string; initials: string; rating: number };
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relation: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  language: "fr" | "en";
  initials: string;
  photoUrl?: string;
};

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "empty" }
  | { status: "error"; message: string };
