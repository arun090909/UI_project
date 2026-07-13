const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
const TOKEN_STORAGE_KEY = "waypoint.employer.jwt";

export type EmployerRegistrationPayload = {
  companyName: string;
  industry: string;
  companySize: string;
  founded?: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  phone: string;
  password: string;
  city: string;
  streetAddress?: string;
  zipCode: string;
  careersContactEmail?: string;
  website?: string;
  aboutCompany?: string;
  hiringAreas: string[];
};

export type JobPostingPayload = {
  jobId: string;
  title: string;
  workType: string;
  location: string;
  employmentType: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: string[];
  description: string;
  applicationDeadline?: string;
  resumeRequired: boolean;
};

export type AuthResponse = {
  tokenType: "Bearer";
  accessToken: string;
  employer: {
    id: string;
    companyName: string;
    workEmail: string;
    contactName: string;
    city: string;
  };
};

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeToken(token: string) {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export async function registerEmployer(payload: EmployerRegistrationPayload) {
  const response = await request<AuthResponse>("/api/auth/employer/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  storeToken(response.accessToken);
  return response;
}

export async function createJobPosting(payload: JobPostingPayload) {
  return request("/api/employer/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
    authenticated: true,
  });
}

async function request<T>(
  path: string,
  options: RequestInit & { authenticated?: boolean } = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.authenticated) {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}
