import type { StrapiMedia } from "./project";

export interface SiteSettings {
  siteName: string;
  logo?: StrapiMedia | null;
  headerCtaLabel?: string;
  heroEyebrow?: string;
  heroHeading?: string;
  heroSubtext?: string;
  projectsSectionHeading?: string;
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
