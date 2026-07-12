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
  // { id: "p_market", name: "Marché Central", subtitle: "Centre-ville", lat: 3.867, lng: 11.518 },
  // { id: "p_bastos", name: "Bastos", subtitle: "Quartier diplomatique", lat: 3.891, lng: 11.514 },
  // { id: "p_akwa", name: "Akwa", subtitle: "Quartier d'affaires", lat: 3.877, lng: 11.528 },
  // { id: "p_omnisport", name: "Omnisport", subtitle: "Stade", lat: 3.877, lng: 11.503 },
  // { id: "p_mvog", name: "Mvog-Mbi", subtitle: "Résidentiel", lat: 3.855, lng: 11.512 },
];
