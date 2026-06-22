import { useState } from 'react';

import ProjectCard from '../../components/project/ProjectCard';
import ExpandedProject from '../../components/project/ExpandedProject';

import { projects } from '../../data/parsers/project.parser';

import '../../styles/project.css';

function Projects() {
    const [selectedProjectId, setSelectedProjectId] =
        useState<string | null>(null);

    const selectedProject = projects.find(
        (project) => project.id === selectedProjectId
    );

    return (
        <section id="projects-section" className="projects-section">
            <div className='project-grid-wrapper'>
                <div className="project-grid">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onExpand={() =>
                                setSelectedProjectId(project.id)
                            }
                        />
                    ))}
                </div>
            </div>

            {selectedProject && (
                <ExpandedProject
                    project={selectedProject}
                    onClose={() =>
                        setSelectedProjectId(null)
                    }
                />
            )}
        </section>
    );
}

export default Projects;