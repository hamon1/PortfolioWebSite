import type { IconType } from 'react-icons';
import {
    SiReact,
    SiTypescript,
    SiVite,
    SiSpringboot,
    SiGit,
    SiFigma,
    SiClaude,
    SiGithub,
    SiFirebase,
    SiMongodb,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

import '../../styles/hero.css';

type TechItem = {
    name: string;
    icon: IconType;
    color: string;
    level: number;
};

const techStack: TechItem[] = [
    { name: 'React',         icon: SiReact,       color: '#61DAFB', level: 3 },
    { name: 'React Native',  icon: SiReact,       color: '#61DAFB', level: 3 },
    { name: 'TypeScript',    icon: SiTypescript,  color: '#3178C6', level: 2 },
    { name: 'Vite',          icon: SiVite,        color: '#646CFF', level: 1 },
    { name: 'Java',          icon: FaJava,        color: '#ED8B00', level: 3 },
    { name: 'Spring Boot',   icon: SiSpringboot,  color: '#6DB33F', level: 2 },
    { name: 'MongoDB',       icon: SiMongodb,     color: '#47A248', level: 2 },
    { name: 'Firebase',      icon: SiFirebase,    color: '#FFCA28', level: 2 },
    { name: 'Git',           icon: SiGit,         color: '#F05032', level: 4 },
    { name: 'GitHub',        icon: SiGithub,      color: '#94A3B8', level: 4 },
    { name: 'Figma',         icon: SiFigma,       color: '#F24E1E', level: 1 },
    { name: 'Claude Code',   icon: SiClaude,      color: '#C96442', level: 3 },
];

function About() {
    const level_text: string = "♦︎";

    return (
        <>
            <section id="hero-section" className="hero-section">
                <span className="hero-label">Frontend Developer</span>

                <h1 className="hero-title">
                    기록하고 만들며<br />성장하는 개발자
                </h1>

                <p className="hero-desc">
                    프로젝트와 작업 경험을 코드로 아카이빙합니다.
                </p>

                <div className="hero-actions">
                    <a href="#projects-section" className="btn-primary">
                        프로젝트 보기
                    </a>
                    <a
                        href="https://github.com/hamon1"
                        className="btn-outline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                </div>
            </section>

            <section id="about-section" className="about-section">
                <p className="section-title">Tech Stack</p>
                <div className="tech-grid">
                    {techStack.map(({ name, icon: Icon, color, level }) => (
                        <span key={name} className="tech-tag">
                            <Icon size={15} color={color} />
                            {name} {level_text.repeat(level)}
                        </span>
                    ))}
                </div>
            </section>
        </>
    );
}

export default About;
