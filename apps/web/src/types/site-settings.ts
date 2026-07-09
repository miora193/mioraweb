import type { StrapiMedia } from "./project";

export interface SiteSettings {
  siteName: string;
  logo?: StrapiMedia | null;
  headingFont: string;
  bodyFont: string;
  colorPaper: string;
  colorLinen: string;
  colorInk: string;
  footerTagline?: string;
  footerEmail?: string;
  footerInstagramUrl?: string;
  footerLinkedinUrl?: string;
}
