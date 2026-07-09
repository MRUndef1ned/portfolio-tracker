export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.errors?.message ?? "API request failed");
  }
  return json.data as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.errors?.message ?? "API request failed");
  }
  return json.data as T;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.errors?.message ?? "API request failed");
  }
  return json.data as T;
}
