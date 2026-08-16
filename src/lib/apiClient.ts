// Central API configuration and HTTP client for the GlowAlchemy admin frontend.
//
// Every module should import the base URL/origin from here instead of
// re-resolving `import.meta.env` and hardcoding `localhost` fallbacks.
//
// Environment:
//   VITE_API_BASE_URL  -> backend origin, e.g. https://api.example.com  (no trailing slash, no /api)
//   VITE_SOCKET_URL    -> backend socket origin, defaults to VITE_API_BASE_URL / same origin

import axios from "axios";

const envAny = import.meta.env || {};

function stripSlashes(value: string): string {
  return value.replace(/\/+$/, "").replace(/\/api\/?$/, "");
}

export function resolveApiOrigin(): string {
  const raw = String(envAny.VITE_API_BASE_URL || "").trim();
  if (raw) return stripSlashes(raw);
  // Empty origin means same-origin requests (Vite dev proxy in development,
  // the deployment host in production). Never default to a hardcoded host.
  return "";
}

export function resolveSocketOrigin(): string {
  const raw = String(envAny.VITE_SOCKET_URL || "").trim();
  if (raw) return raw.replace(/\/+$/, "");
  const origin = resolveApiOrigin();
  if (origin) return origin;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export const API_ORIGIN = resolveApiOrigin();

// Prefix a path with the API origin when one is configured, otherwise keep
// the path relative (same-origin via the dev proxy or shared deployment host).
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_ORIGIN}${p}`;
}

// Central axios instance with authentication and normalized error handling.
export const apiClient = axios.create({
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear the session on genuinely unauthenticated calls; the
      // sign-in page will re-prompt. Logout is handled by the auth flow.
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);
