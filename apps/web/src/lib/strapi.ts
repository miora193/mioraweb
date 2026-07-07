import type { Project, StrapiListResponse, StrapiMedia } from "../types/project";

export const STRAPI_URL: string =
  import.meta.env.VITE_STRAPI_URL ?? "http://localhost:1337";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api${path}`);
  if (!res.ok) {
    throw new Error(`Strapi request failed (${res.status}): ${path}`);
  }
  return res.json() as Promise<T>;
}

export function getStrapiMedia(media?: StrapiMedia | null): string {
  if (!media?.url) return "";
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await fetchJson<StrapiListResponse<Project>>(
    "/projects?populate=cover,gallery&sort=order:asc",
  );
  return data;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data } = await fetchJson<StrapiListResponse<Project>>(
    `/projects?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=cover,gallery`,
  );
  return data[0] ?? null;
}
