export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="mt-24 border-t border-black/10 bg-linen">
      <div className="container-page flex flex-col gap-10 py-16 sm:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-3xl leading-tight sm:text-4xl">
              Let&rsquo;s build your
              <br />
              digital presence.
            </p>
          </div>
          <a
            href="mailto:hello@miora.web"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3 text-sm text-paper transition-opacity hover:opacity-80"
          >
            hello@miora.web
          </a>
        </div>

        <div className="flex flex-col gap-4 border-t border-black/10 pt-8 text-sm text-black/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} MIORA WEB. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
