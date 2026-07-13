import { useSyncExternalStore } from "react";

export type StoredProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarSrc: string | null;
  street: string;
  city: string;
  state: string;
  zip: string;
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

const JUST_REGISTERED_KEY = "waypoint_just_registered";

export function markJustRegistered() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(JUST_REGISTERED_KEY, "1");
}

// Reads and clears the flag so the congratulations banner shows exactly once,
// on the first home-page visit after signup.
export function consumeJustRegistered(): boolean {
  if (typeof window === "undefined") return false;
  const flag = sessionStorage.getItem(JUST_REGISTERED_KEY) === "1";
  if (flag) sessionStorage.removeItem(JUST_REGISTERED_KEY);
  return flag;
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

function subscribeToProfile(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

let cachedRaw: string | null = null;
let cachedProfile: StoredProfile | null = null;

function getProfileSnapshot(): StoredProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedProfile = raw ? JSON.parse(raw) : null;
    } catch {
      cachedProfile = null;
    }
  }
  return cachedProfile;
}

function getServerProfileSnapshot() {
  return null;
}

export function useProfile(): StoredProfile | null {
  return useSyncExternalStore(subscribeToProfile, getProfileSnapshot, getServerProfileSnapshot);
}
