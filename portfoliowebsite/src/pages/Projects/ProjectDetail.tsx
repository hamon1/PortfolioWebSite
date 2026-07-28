import { useParams, Link } from 'react-router-dom';

import ExpandedProject from '../../components/project/ExpandedProject';
import { projects } from '../../data/parsers/project.parser';

import '../../styles/project.css';

function ProjectDetail() {
    const { id } = useParams<{ id: string }>();

    const project = projects.find((p) => p.id === id);

    if (!project) {
        return (
            <div className="project-error-page">
                <p>프로젝트를 찾을 수 없습니다.</p>
                <Link to="/projects">← 목록으로 돌아가기</Link>
            </div>
        );
    }

    return <ExpandedProject project={project} />;
}

export default ProjectDetail;
