import { type Project } from "../../data/schemas/project.schema";


type Props = {
    project: Project;
};

function ProjectCard({ project }: Props) {
    return (
        // <article className="project-card">

        //     <h2>{project.title}</h2>

        //     <p>{project.description}</p>

        //     <div>   
        //         <span> img </span>
        //     </div>

        //     <div>
        //         {project.tags.map(tag => (
        //             <span key={tag}>
        //                 {tag}
        //             </span>
        //         ))}
        //     </div>
        // </article>
        <section className="project-card featured">

            <div className="project-thumbnail">
                {/* <img src="./assets/travelbuddy.webp" alt="TravelBUDDY 썸네일"> */}
            </div>


            <div className="project-content">


                <div className="project-header">
                    <h3 className="project-title">
                        {project.title}
                    </h3>

                    <span className="project-badge">
                        {project.featured}
                    </span>
                </div>


                <p className="project-description">
                    {project.description}
                </p>

                <p> {project.period} </p>

                <p> {project.role} </p>

                <p> {project.teamSize} </p>

                <div>
                    {project.tags.map(tag => (
                        <span key={tag}>
                            {tag} 
                        </span>
                    ))}
                </div>


                <div className="project-actions">
                    <a
                        href="https://github.com/example"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link github"
                    >
                        GitHub
                    </a>

                    <a
                        href="#"
                        className="project-link demo"
                    >
                        Live Demo
                    </a>
                </div>

            </div>
        </section>
    );
}

export default ProjectCard;