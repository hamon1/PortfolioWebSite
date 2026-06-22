import { useState } from "react";
import { type Project } from "../../data/schemas/project.schema";
import { useGithubCommits } from "../../hooks/useGithubCommits";

import '../../styles/expandedProject.css';

interface Props {
    project: Project;

    onClose: () => void;
}

function ExpandedProject({
    project,
    onClose,
}: Props) {

    const commits = useGithubCommits(
        project.githubRepo
    )

    const [showAllCommits, setShowAllCommits] =
    useState(false);

    return (
        <section className="expanded-project">
            <button onClick={onClose}>
                닫기
            </button>

            <div className="project-hero">
                <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="project-thumbnail"
                />

                <div className="project-summary">
                    <div className="project-badge">
                        {project.featured && <span>Featured</span>}
                    </div>

                    <h2>{project.title}</h2>

                    <p className="project-short-description">
                        {project.shortDescription}
                    </p>

                    <p className="project-description">
                        {project.description}
                    </p>

                    <div className="project-meta">
                        <span>{project.period}</span>
                        <span>{project.teamSize}</span>
                        <span>{project.role}</span>
                    </div>

                    <div className="tech-stack">
                        {project.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="tech-chip"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="project-links">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                GitHub
                            </a>
                        )}

                        {project.deployUrl && (
                            <a
                                href={project.deployUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Demo
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="project-block">
                <h3>Features</h3>

                <div className="feature-grid">
                    {project.features.map((feature) => (
                        <div
                            key={feature.title}
                            className="feature-card"
                        >
                            <h4>{feature.title}</h4>

                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Demo */}
            <div className="project-block">
                <h3>Demo</h3>

                <div className="demo-grid">
                    {project.demos.map((demo) => (
                        <div
                            key={demo.src}
                            className="demo-card"
                        >
                            {(demo.type === 'image' ||
                                demo.type === 'gif') && (
                                    <img
                                        src={demo.src}
                                        alt={demo.title}
                                    />
                                )}

                            {demo.type === 'video' && (
                                <video
                                    controls
                                    src={demo.src}
                                />
                            )}

                            <div className="demo-content">
                                <h4>{demo.title}</h4>

                                {demo.description && (
                                    <p>{demo.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trouble Shooting */}
            <div className="project-block">
                <h3>Trouble Shooting</h3>

                <div className="trouble-list">
                    {project.troubles.map((trouble) => (
                        <div
                            key={trouble.problem}
                            className="trouble-card"
                        >
                            <div>
                                <strong>Problem</strong>
                                <p>{trouble.problem}</p>
                            </div>

                            <div>
                                <strong>Cause</strong>
                                <p>{trouble.cause}</p>
                            </div>

                            <div>
                                <strong>Solution</strong>
                                <p>{trouble.solution}</p>
                            </div>

                            {trouble.result && (
                                <div>
                                    <strong>Result</strong>
                                    <p>{trouble.result}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* DevLog */}
            <div className="project-block">
                <div className="block-header">
                    <h3>DevLog</h3>

                    {commits.length > 3 && (
                        <button
                            onClick={() =>
                                setShowAllCommits(
                                    (prev) => !prev
                                )
                            }
                        >
                            {showAllCommits
                                ? "간략히 보기"
                                : "전체 보기"}
                        </button>
                    )}
                </div>

                {/* Commits */}
                <div className="commit-list">
                    {(showAllCommits
                        ? commits
                        : commits.slice(0, 3)
                    ).map((commit) => {
                        const message = commit.commit?.message ?? '';
                        const typeMatch = message.match(/^(\w+)(\(.+?\))?(!?:)/);
                        const type = typeMatch?.[0];
                        const rest = type ? message.slice(type.length) : message;

                        return (
                            <div
                                key={commit.sha}
                                className="commit-item"
                            >
                                <span className="commit-date">
                                    {new Date(
                                        commit.commit?.author.date
                                    ).toLocaleDateString('ko-KR')}
                                </span>

                                <p className="commit-message">
                                    {type && (
                                        <span className="commit-type">{type}</span>
                                    )}
                                    {rest}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Retrospective */}
            {project.retrospective && (
                <div className="project-block">
                    <h3>Retrospective</h3>

                    <p className="retrospective">
                        {project.retrospective}
                    </p>
                </div>
            )}

        </section>
    );
}

export default ExpandedProject;