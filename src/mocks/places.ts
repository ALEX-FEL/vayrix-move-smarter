import type { Place } from "@/models";

export const currentLocation: Place = {
  id: "loc_current",
  name: "Ma position actuelle",
  subtitle: "Essos, Yaoundé",
  lat: 3.866,
  lng: 11.516,
};

export const places: Place[] = [
  { id: "p_airport", name: "Nsimalen Airport", subtitle: "Yaoundé", lat: 3.722, lng: 11.553 },
  { id: "p_market", name: "Marché Central", subtitle: "Centre-ville", lat: 3.867, lng: 11.518 },

];
