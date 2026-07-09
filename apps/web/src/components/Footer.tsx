import { useSiteSettings } from "../lib/SiteSettingsContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const hasSocialLinks = settings.footerInstagramUrl || settings.footerLinkedinUrl;

  return (
    <footer id="contact" className="mt-24 border-t border-black/10 bg-linen">
      <div className="container-page flex flex-col gap-10 py-16 sm:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="max-w-md font-display text-3xl leading-tight sm:text-4xl">
              {settings.footerTagline}
            </p>
          </div>
          {settings.footerEmail && (
            <a
              href={`mailto:${settings.footerEmail}`}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3 text-sm text-paper transition-opacity hover:opacity-80"
            >
              {settings.footerEmail}
            </a>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-black/10 pt-8 text-sm text-black/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {settings.siteName}. All rights reserved.
          </p>
          {hasSocialLinks && (
            <div className="flex gap-6">
              {settings.footerInstagramUrl && (
                <a
                  href={settings.footerInstagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black"
                >
                  Instagram
                </a>
              )}
              {settings.footerLinkedinUrl && (
                <a
                  href={settings.footerLinkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black"
                >
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
