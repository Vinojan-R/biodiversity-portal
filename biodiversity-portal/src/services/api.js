const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const googleSignInUrl = `${API_URL}/auth/google`;

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Something went wrong.");
  return body;
}