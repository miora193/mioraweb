import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectBySlug, getStrapiMedia } from "../lib/strapi";
import type { Project } from "../types/project";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    getProjectBySlug(slug)
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch(() => {
        if (!cancelled) setProject(null);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (project === undefined) {
    return <div className="container-page py-24 text-black/50">Loading&hellip;</div>;
  }

  if (project === null) {
    return (
      <div className="container-page py-24">
        <p className="text-black/60">Project not found.</p>
        <Link to="/" className="mt-4 inline-block underline">
          Back to work
        </Link>
      </div>
    );
  }

  const cover = getStrapiMedia(project.cover);
  const meta = [
    { label: "Client", value: project.client },
    { label: "Category", value: project.category },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year },
  ].filter((item) => item.value);

  return (
    <main className="container-page py-16 sm:py-20">
      <Link to="/" className="text-sm text-black/50 hover:text-black">
        &larr; Back to work
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl">{project.title}</h1>
        {project.websiteUrl && (
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black px-5 py-2 text-sm transition-colors hover:bg-black hover:text-paper"
          >
            Visit live site &#8599;
          </a>
        )}
      </div>
      {project.summary && (
        <p className="mt-4 max-w-2xl text-lg text-black/60">{project.summary}</p>
      )}

      {meta.length > 0 && (
        <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-black/10 py-6 sm:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label}>
              <dt className="text-xs uppercase tracking-wide text-black/40">
                {item.label}
              </dt>
              <dd className="mt-1">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {cover && (
        <div className="mt-12 aspect-[16/10] overflow-hidden bg-linen">
          <img
            src={cover}
            alt={project.cover?.alternativeText || project.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {project.description && (
        <p className="mt-10 max-w-2xl whitespace-pre-line text-black/70">
          {project.description}
        </p>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {project.gallery.map((image) => (
            <div key={image.id} className="aspect-[4/3] overflow-hidden bg-linen">
              <img
                src={getStrapiMedia(image)}
                alt={image.alternativeText || project.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
