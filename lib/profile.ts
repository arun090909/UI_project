export type StoredProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarSrc: string | null;
  city: string;
  state: string;
  locations: string[];
  skills: string[];
  roles: string[];
};

const PROFILE_KEY = "waypoint_profile";
const ACCOUNTS_KEY = "waypoint_accounts";

function readAccounts(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function emailExists(email: string): boolean {
  return readAccounts().includes(email.trim().toLowerCase());
}

export function saveProfile(profile: StoredProfile) {
  if (typeof window === "undefined") return;
  const email = profile.email.trim().toLowerCase();
  const accounts = readAccounts();
  if (!accounts.includes(email)) accounts.push(email);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfile(): StoredProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
