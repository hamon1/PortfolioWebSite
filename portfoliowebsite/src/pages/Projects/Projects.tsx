import ProjectCard from '../../components/project/ProjectCard';
import { projects } from '../../data/parsers/project.parser';


function Projects() {
    return (
        <section id="featured-projects">
            <div className="section-header">
                <h2>Featured Projects</h2>

                <button>전체 보기</button>
            </div>

            <div className="project-grid">

                {projects.map(project => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                    />
                ))}
                {/* <ProjectCard />

                <ProjectCard />

                <ProjectCard /> */}
            </div>
        </section>
    );
}

export default Projects;