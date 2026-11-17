import { authClient } from "./auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Keep the JWT in memory so we do not ask for a new one on every request
let cached: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string | null> {
  if (cached && cached.expiresAt > Date.now()) return cached.token;

  const { data } = await authClient.token();
  if (!data?.token) return null;

  // The token lives for 1 hour, so we refresh it a little earlier
  cached = { token: data.token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return data.token;
}

// Call this on sign in and sign out
export function clearToken() {
  cached = null;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean; // send the JWT token with the request
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiError("Please sign in to continue", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message ?? "Something went wrong", response.status);
  }
  return data as T;
}