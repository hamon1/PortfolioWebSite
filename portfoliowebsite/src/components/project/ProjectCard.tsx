import { Link } from 'react-router-dom';
import { FaGithub, FaFigma, FaExternalLinkAlt } from 'react-icons/fa';

import { type Project } from "../../data/schemas/project.schema";
import { assetUrl } from "../../utils/assetUrl";

import '../../styles/projectCard.css';

type Props = {
    project: Project;
};

function ProjectCard({ project }: Props) {
    return (
        <article className="project-card">
            <img
                src={assetUrl(project.thumbnail)}
                alt={project.title}
            />

            <h3>{project.title}</h3>

            <p className="project-card-meta">
                {project.period} · {project.role}
            </p>

            <p>{project.shortDescription}</p>

            <div className="project-card-chips">
                {project.techStack.slice(0, 3).map((tech) => (
                    <span key={tech.name} className="project-card-chip">
                        {tech.name}
                    </span>
                ))}
            </div>

            <div className="project-card-links">
                {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                    >
                        <FaGithub />
                    </a>
                )}

                {project.validation?.deployed && project.deployUrl && (
                    <a
                        href={project.deployUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Deployed site"
                    >
                        <FaExternalLinkAlt />
                    </a>
                )}

                {project.figmaUrl && (
                    <a
                        href={project.figmaUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Figma"
                    >
                        <FaFigma />
                    </a>
                )}
            </div>

            <Link to={`/projects/${project.id}`} className="project-card-detail-link">
                자세히 보기 →
            </Link>
        </article>
    );
}

export default ProjectCard;
