import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSiteSettings, getStrapiMedia } from "./strapi";
import type { SiteSettings } from "../types/site-settings";

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "MIORA WEB",
  headerCtaLabel: "Start a project",
  heroEyebrow: "Web design studio",
  heroHeading: "Modern websites for hotels, cafes & hospitality brands.",
  heroSubtext:
    "MIORA WEB designs and builds clean, considered digital experiences for independent hospitality businesses that want to feel as good online as they do in person.",
  projectsSectionHeading: "Selected work",
  headingFont: "Fraunces",
  bodyFont: "Inter",
  colorPaper: "#FFFFFF",
  colorLinen: "#E4E1D9",
  colorInk: "#000000",
  footerTagline: "Let's build your digital presence.",
  footerEmail: "hello@miora.web",
};

function mergeWithDefaults(fetched: SiteSettings): SiteSettings {
  const definedFields = Object.fromEntries(
    Object.entries(fetched).filter(([, value]) => value !== null && value !== undefined),
  );
  return { ...DEFAULT_SETTINGS, ...definedFields } as SiteSettings;
}

// Fraunces/Inter are already linked in index.html — skip re-fetching those.
const loadedFonts = new Set<string>(["Fraunces", "Inter"]);

function loadGoogleFont(family: string) {
  if (!family || loadedFonts.has(family)) return;
  loadedFonts.add(family);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

interface SiteSettingsContextValue {
  settings: SiteSettings;
  logoUrl: string;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  logoUrl: "",
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    getSiteSettings()
      .then((data) => {
        if (!cancelled) setSettings(mergeWithDefaults(data));
      })
      .catch(() => {
        // CMS unreachable or not yet configured — keep the built-in defaults.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--color-paper", settings.colorPaper);
    root.setProperty("--color-linen", settings.colorLinen);
    root.setProperty("--color-ink", settings.colorInk);
    root.setProperty("--font-display", `"${settings.headingFont}", Georgia, serif`);
    root.setProperty(
      "--font-sans",
      `"${settings.bodyFont}", system-ui, -apple-system, sans-serif`,
    );

    loadGoogleFont(settings.headingFont);
    loadGoogleFont(settings.bodyFont);
  }, [settings]);

  const logoUrl = getStrapiMedia(settings.logo);

  return (
    <SiteSettingsContext.Provider value={{ settings, logoUrl }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
