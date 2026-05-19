import { type Project } from "../../data/schemas/project.schema";


type Props = {
    project: Project;
};

function ProjectCard({ project }: Props) {
    return (
        <article className="project-card">

            <h2>{project.title}</h2>

            <p>{project.description}</p>

            <div>
                {project.tags.map(tag => (
                    <span key={tag}>
                        {tag}
                    </span>
                ))}
            </div>
        </article>
    );
}

export default ProjectCard;