import type { UserProfile, EmergencyContact } from "@/models";

export const currentUser: UserProfile = {
  id: "u_alex",
  name: "Alex K.",
  email: "alex@vayrix.com",
  phone: "+237 6 55 12 34 56",
  language: "fr",
  initials: "AK",
};

export const emergencyContacts: EmergencyContact[] = [
  { id: "ec1", name: "Marie K.", phone: "+237 6 77 20 15 84", relation: "Épouse" },
  { id: "ec2", name: "Jean B.", phone: "+237 6 99 40 11 22", relation: "Frère" },
];
