const isProduction = process.env.NODE_ENV === "production";
export const apiUrl = isProduction
  ? "https://askify-server.onrender.com"
  : "http://localhost:4000";

export function fetcher(path: string, options?: RequestInit) {
  if (path[0] !== "/") path = "/" + path;
  return fetch(apiUrl + path, options);
}
