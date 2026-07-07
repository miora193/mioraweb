import { Link } from "react-router-dom";
import type { Project } from "../types/project";
import { getStrapiMedia } from "../lib/strapi";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority }: ProjectCardProps) {
  const cover = getStrapiMedia(project.cover);

  return (
    <Link to={`/projects/${project.slug}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-linen">
        {cover ? (
          <img
            src={cover}
            alt={project.cover?.alternativeText || project.title}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-black/30">
            {project.title}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg sm:text-xl">{project.title}</h3>
        {project.category && (
          <span className="shrink-0 text-sm text-black/50">{project.category}</span>
        )}
      </div>
      {project.summary && (
        <p className="mt-1 text-sm text-black/60">{project.summary}</p>
      )}
    </Link>
  );
}
