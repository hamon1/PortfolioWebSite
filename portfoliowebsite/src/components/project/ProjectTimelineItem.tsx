import { Link } from 'react-router-dom';

import { type Project } from "../../data/schemas/project.schema";
import { assetUrl } from "../../utils/assetUrl";

import '../../styles/projectCard.css';
import '../../styles/projectTimeline.css';

type Props = {
    project: Project;

    periodStart: string;

    isLast: boolean;
};

function ProjectTimelineItem({ project, periodStart, isLast }: Props) {
    const isDeployed = project.validation?.deployed ?? false;

    return (
        <div className={`timeline-row${isLast ? ' timeline-row--last' : ''}`}>
            <div className="timeline-date">{periodStart}</div>

            <div className="timeline-rail">
                <div className="timeline-line" />
                <div className="timeline-node" />
            </div>

            <Link to={`/projects/${project.id}`} className="timeline-card">
                <div className="timeline-thumb">
                    <img
                        src={assetUrl(project.thumbnail)}
                        alt={project.title}
                    />
                </div>

                <div className="timeline-body">
                    <div className="project-card-title-row">
                        <h3>{project.title}</h3>

                        <span
                            className={`deploy-indicator ${isDeployed ? 'deploy-indicator--live' : 'deploy-indicator--offline'}`}
                            role="img"
                            aria-label={isDeployed ? '배포됨' : '미배포'}
                            title={isDeployed ? '배포됨' : '미배포'}
                        />
                    </div>

                    <p className="timeline-meta">
                        {project.period} · {project.role}
                    </p>

                    <p className="timeline-description">
                        {project.shortDescription}
                    </p>

                    <div className="timeline-chips">
                        {project.techStack.slice(0, 3).map((tech) => (
                            <span key={tech.name} className="project-card-chip">
                                {tech.name}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProjectTimelineItem;
