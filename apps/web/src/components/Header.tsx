import { Link } from "react-router-dom";
import { useSiteSettings } from "../lib/SiteSettingsContext";

export default function Header() {
  const { settings, logoUrl } = useSiteSettings();

  // Text wordmark splits on the first space (bold + muted) to echo the
  // logo-less "MIORA WEB" look for any two-word site name; single-word
  // names just render plain.
  const [firstWord, ...rest] = settings.siteName.split(" ");
  const restOfName = rest.join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="flex items-center">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={settings.siteName}
              className="h-10 w-10 rounded-full border border-black/10 object-cover sm:h-12 sm:w-12"
            />
          ) : (
            <span className="font-display text-lg tracking-tight sm:text-xl">
              {firstWord}
              {restOfName && <span className="text-black/50"> {restOfName}</span>}
            </span>
          )}
        </Link>
        <a
          href="#contact"
          className="rounded-full border border-black px-4 py-2 text-sm transition-colors hover:bg-black hover:text-paper sm:px-5"
        >
          {settings.headerCtaLabel}
        </a>
      </div>
    </header>
  );
}
