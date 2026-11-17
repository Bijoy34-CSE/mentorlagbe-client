const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Plain fetch for server components (public routes only, no token needed)
export async function serverFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}