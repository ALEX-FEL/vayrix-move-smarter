import type { EmergencyContact, UserProfile } from "@/models";
import { currentUser, emergencyContacts } from "@/mocks/user";
import { delay, uid } from "@/lib/async";

// In-memory mutation of mocks — API-like behaviour.
let user: UserProfile = { ...currentUser };
let contacts: EmergencyContact[] = [...emergencyContacts];

export const userService = {
  async get(): Promise<UserProfile> {
    await delay(200);
    return user;
  },
  async update(patch: Partial<UserProfile>): Promise<UserProfile> {
    await delay(500);
    user = { ...user, ...patch };
    return user;
  },
  async listContacts(): Promise<EmergencyContact[]> {
    await delay(200);
    return contacts;
  },
  async addContact(c: Omit<EmergencyContact, "id">): Promise<EmergencyContact> {
    await delay(400);
    const created = { ...c, id: uid("ec") };
    contacts = [...contacts, created];
    return created;
  },
  async removeContact(id: string): Promise<void> {
    await delay(300);
    contacts = contacts.filter((c) => c.id !== id);
  },
};
