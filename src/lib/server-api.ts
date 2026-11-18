const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ServerApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Plain fetch for server components (public routes only, no token needed)
export async function serverFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new ServerApiError(`Request failed with status ${response.status}`, response.status);
  }
  return response.json() as Promise<T>;
}