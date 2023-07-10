export const rootURL = "http://localhost:4000";

export function fetcher(path: string, options?: RequestInit) {
  if (path[0] !== "/") path = "/" + path;
  return fetch(rootURL + path, options);
}
