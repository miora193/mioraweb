import { useEffect, useState } from "react";
import ProjectGrid from "../components/ProjectGrid";
import { getProjects } from "../lib/strapi";
import { useSiteSettings } from "../lib/SiteSettingsContext";
import type { Project } from "../types/project";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const { settings } = useSiteSettings();

  useEffect(() => {
    let cancelled = false;

    getProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <section className="container-page pb-16 pt-16 sm:pb-24 sm:pt-24">
        <p className="mb-6 text-sm uppercase tracking-[0.2em] text-black/50">
          {settings.heroEyebrow}
        </p>
        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] sm:text-6xl">
          {settings.heroHeading}
        </h1>
        <p className="mt-6 max-w-xl text-base text-black/60 sm:text-lg">
          {settings.heroSubtext}
        </p>
      </section>

      <section className="container-page pb-24 sm:pb-32">
        <div className="mb-10 flex items-center justify-between border-t border-black/10 pt-8">
          <h2 className="font-display text-2xl sm:text-3xl">{settings.projectsSectionHeading}</h2>
          {status === "error" && (
            <p className="text-sm text-black/50">Unable to load projects.</p>
          )}
        </div>

        {status === "loading" ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-linen" />
                <div className="mt-4 h-4 w-2/3 bg-linen" />
              </div>
            ))}
          </div>
        ) : (
          <ProjectGrid projects={projects} />
        )}
      </section>
    </main>
  );
}
