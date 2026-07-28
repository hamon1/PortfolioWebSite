import { Link } from 'react-router-dom';

import ProjectCard from '../../components/project/ProjectCard';
import { projects } from '../../data/parsers/project.parser';

import '../../styles/project.css';

const FEATURED_COUNT = 3;

function FeaturedProjects() {
    const featured = projects.slice(0, FEATURED_COUNT);

    return (
        <section id="projects-section" className="projects-section">
            <div className="projects-section-header">
                <span className="section-label">Work</span>
                <h2>Projects</h2>
            </div>

            <div className='project-grid-wrapper'>
                <div className="project-grid">
                    {featured.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                        />
                    ))}
                </div>
            </div>

            <div className="projects-section-footer">
                <Link to="/projects" className="btn-outline">
                    전체 프로젝트 보기 →
                </Link>
            </div>
        </section>
    );
}

export default FeaturedProjects;
