import { type Project } from "../../data/schemas/project.schema";

import '../../styles/projectCard.css';

type Props = {
    project: Project;

    onExpand: () => void;
};

function ProjectCard({ project, onExpand }: Props) {
    return (
        <article className="project-card">
            <img
                src={project.thumbnail}
                alt={project.title}
            />

            <h3>{project.title}</h3>

            <p>{project.description}</p>

            <button onClick={onExpand}>
                전체 보기
            </button>
        </article>
    );
}

export default ProjectCard;