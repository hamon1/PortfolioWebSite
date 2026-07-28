import ProjectCard from '../../components/project/ProjectCard';

import { projects } from '../../data/parsers/project.parser';

import '../../styles/project.css';

function Projects() {
    return (
        <section className="projects-section projects-page">
            <div className="projects-section-header">
                <span className="section-label">Archive</span>
                <h1>Projects</h1>
                <p className="projects-subtitle">진행한 프로젝트 전체 목록</p>
            </div>

            <div className='project-grid-wrapper'>
                <div className="project-grid">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Projects;
