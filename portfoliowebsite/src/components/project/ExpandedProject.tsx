import { useState } from "react";
import { Link } from "react-router-dom";
import { type Project } from "../../data/schemas/project.schema";
import { useGithubCommits } from "../../hooks/useGithubCommits";
import { assetUrl } from "../../utils/assetUrl";
import TroubleCard from "./TroubleCard";

import '../../styles/expandedProject.css';

interface Props {
    project: Project;
}

function ExpandedProject({
    project,
}: Props) {

    const commits = useGithubCommits(
        project.githubRepo
    )

    const [showAllCommits, setShowAllCommits] =
    useState(false);

    const sortedTroubles = [...project.troubles].sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date.localeCompare(b.date);
    });

    return (
        <section className="expanded-project">
            <Link to="/" className="back-link">
                ← Home
            </Link>

            <div className="project-hero">
                <img
                    src={assetUrl(project.thumbnail)}
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

                    <div className="project-meta">
                        <span>{project.period}</span>
                        <span>{project.teamSize}</span>
                        <span>{project.role}</span>
                    </div>

                    <div className="tech-stack">
                        {project.techStack.map((tech) => (
                            <span
                                key={tech.name}
                                className="tech-chip"
                            >
                                {tech.name}
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

                        {project.backendGithubUrl && (
                            <a
                                href={project.backendGithubUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Backend
                            </a>
                        )}

                        {project.validation?.deployed && (
                            <a
                                href={project.deployUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Demo
                            </a>
                        )}

                        {project.figmaUrl && (
                            <a
                                href={project.figmaUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Figma
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Problem Statement */}
            <div className="project-block">
                <h3>Problem Statement</h3>

                <div className="problem-statement">
                    <div className="problem-row">
                        <strong>배경</strong>
                        <p>{project.problemStatement.background}</p>
                    </div>

                    <div className="problem-row">
                        <strong>문제</strong>
                        <p>{project.problemStatement.painPoint}</p>
                    </div>

                    <div className="problem-row">
                        <strong>목표</strong>
                        <p>{project.problemStatement.goal}</p>
                    </div>
                </div>
            </div>

            {/* Domain Insights */}
            {project.domainInsights && project.domainInsights.length > 0 && (
                <div className="project-block">
                    <h3>Domain Insights</h3>

                    <div className="insight-list">
                        {project.domainInsights.map((insight, i) => (
                            <div key={i} className="insight-card">
                                <p className="insight-observation">"{insight.observation}"</p>
                                <p className="insight-impact">→ {insight.impact}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Features */}
            <div className="project-block">
                <h3>Features</h3>

                <div className="feature-grid">
                    {project.features.map((feature) => (
                        <div
                            key={feature.title}
                            className={`feature-card${feature.priority ? ` feature-${feature.priority}` : ''}`}
                        >
                            <div className="feature-header">
                                <h4>{feature.title}</h4>
                                {feature.priority && (
                                    <span className={`feature-badge feature-badge-${feature.priority}`}>
                                        {feature.priority === 'core' ? '핵심' : '확장'}
                                    </span>
                                )}
                            </div>

                            <p>{feature.description}</p>

                            {feature.intent && (
                                <p className="feature-intent">→ {feature.intent}</p>
                            )}
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
                                        src={assetUrl(demo.src)}
                                        alt={demo.title}
                                    />
                                )}

                            {demo.type === 'video' && (
                                <video
                                    controls
                                    src={assetUrl(demo.src)}
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
                    {sortedTroubles.map((trouble) => (
                        <TroubleCard
                            key={trouble.problem}
                            trouble={trouble}
                            githubRepo={project.githubRepo}
                        />
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

            {/* Tech Stack Rationale */}
            <div className="project-block">
                <h3>Tech Stack</h3>

                <div className="tech-rationale-list">
                    {project.techStack.map((tech) => (
                        <div key={tech.name} className="tech-rationale-item">
                            <span className="tech-name">{tech.name}</span>
                            <p className="tech-reason">{tech.reason}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Validation */}
            {project.validation && (
                <div className="project-block">
                    <h3>Validation</h3>

                    <div className="validation">
                        {project.validation.userCount && (
                            <div className="validation-row">
                                <strong>사용자</strong>
                                <p>{project.validation.userCount}</p>
                            </div>
                        )}

                        {project.validation.feedback && (
                            <div className="validation-row">
                                <strong>반응</strong>
                                <p>{project.validation.feedback}</p>
                            </div>
                        )}

                        {project.validation.learnings && (
                            <div className="validation-row">
                                <strong>확인</strong>
                                <p>{project.validation.learnings}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

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