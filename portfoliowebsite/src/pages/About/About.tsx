import '../../styles/hero.css';

const techStack = [
    'React', 'TypeScript', 'Vite',
    'Java', 'Spring Boot', 'MySQL',
    'Git', 'Figma',
];

function About() {
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
                    {techStack.map((tech) => (
                        <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                </div>
            </section>
        </>
    );
}

export default About;
