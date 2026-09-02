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

import MouseGlow from '../../components/effects/MouseGlow';

import '../../styles/hero.css';

type TechItem = {
    name: string;
    icon: IconType;
    color: string;
};

const techStack: TechItem[] = [
    { name: 'React',         icon: SiReact,       color: '#61DAFB' },
    { name: 'React Native',  icon: SiReact,       color: '#61DAFB' },
    { name: 'TypeScript',    icon: SiTypescript,  color: '#3178C6' },
    { name: 'Vite',          icon: SiVite,        color: '#646CFF' },
    { name: 'Java',          icon: FaJava,        color: '#ED8B00' },
    { name: 'Spring Boot',   icon: SiSpringboot,  color: '#6DB33F' },
    { name: 'MongoDB',       icon: SiMongodb,     color: '#47A248' },
    { name: 'Firebase',      icon: SiFirebase,    color: '#FFCA28' },
    { name: 'Git',           icon: SiGit,         color: '#F05032' },
    { name: 'GitHub',        icon: SiGithub,      color: '#94A3B8' },
    { name: 'Figma',         icon: SiFigma,       color: '#F24E1E' },
    { name: 'Claude Code',   icon: SiClaude,      color: '#C96442' },
];

function About() {
    return (
        <div className="about-wrapper">
            <MouseGlow />

            <section id="hero-section" className="hero-section">
                <span className="hero-label">Developer</span>

                <h1 className="hero-title">
                    기록하고 만들며<br />성장하는 개발자
                </h1>

                <p className="hero-desc">
                    프로젝트와 작업 경험 아카이빙
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
                    {techStack.map(({ name, icon: Icon, color }) => (
                        <span key={name} className="tech-tag">
                            <Icon size={15} color={color} />
                            {name}
                        </span>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default About;
