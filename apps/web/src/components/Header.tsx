import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="font-display text-lg tracking-tight sm:text-xl">
          MIORA <span className="text-black/50">WEB</span>
        </Link>
        <a
          href="#contact"
          className="rounded-full border border-black px-4 py-2 text-sm transition-colors hover:bg-black hover:text-paper sm:px-5"
        >
          Start a project
        </a>
      </div>
    </header>
  );
}
