import { useState } from 'react';

import ProjectCard from '../../components/project/ProjectCard';
import ExpandedProject from '../../components/project/ExpandedProject';

import { projects } from '../../data/parsers/project.parser';


function Projects() {
    //     return (
    //         <section id="projects">
    //             <div className="section-header">
    //                 <h2>Featured Projects</h2>

    //                 <button>전체 보기</button>
    //             </div>

    //             <div className="project-grid">

    //                 {projects.map(project => (
    //                     <ProjectCard
    //                         key={project.id}
    //                         project={project}
    //                     />
    //                 ))}
    //                 {/* <ProjectCard />

    //                 <ProjectCard />

    //                 <ProjectCard /> */}
    //             </div>
    //         </section>
    //     );
    const [selectedProjectId, setSelectedProjectId] =
        useState<string | null>(null);

    const selectedProject = projects.find(
        (project) => project.id === selectedProjectId
    );

    return (
        <section>
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