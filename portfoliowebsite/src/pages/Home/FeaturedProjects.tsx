import ProjectTimelineItem from '../../components/project/ProjectTimelineItem';
import { type Project } from '../../data/schemas/project.schema';
import { projects } from '../../data/parsers/project.parser';

import '../../styles/project.css';
import '../../styles/projectTimeline.css';

const FEATURED_COUNT = 4;

// 'desc' = 최신 프로젝트가 위로, 'asc' = 오래된 프로젝트가 위로
const SORT_DIRECTION: 'asc' | 'desc' = 'desc';

function getPeriodStart(project: Project): string {
    return project.period.split('~')[0].trim();
}

function FeaturedProjects() {
    const sorted = [...projects].sort((a, b) => {
        const diff = getPeriodStart(a).localeCompare(getPeriodStart(b));
        return SORT_DIRECTION === 'asc' ? diff : -diff;
    });

    const featured = sorted.slice(0, FEATURED_COUNT);

    return (
        <section id="projects-section" className="projects-section">
            <div className="projects-section-header">
                <span className="section-label">Work</span>
                <h2>Projects</h2>
            </div>

            <div className="timeline-list">
                {featured.map((project, index) => (
                    <ProjectTimelineItem
                        key={project.id}
                        project={project}
                        periodStart={getPeriodStart(project)}
                        isLast={index === featured.length - 1}
                    />
                ))}
            </div>
        </section>
    );
}

export default FeaturedProjects;
