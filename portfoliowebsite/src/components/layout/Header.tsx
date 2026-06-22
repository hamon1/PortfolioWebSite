import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/header.css';

function Header() {
    const [isDark, setIsDark] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const dark = saved !== 'light';
        setIsDark(dark);
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        const theme = next ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const scrollTo = (id: string) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="site-header">
            <nav className="nav-inner" aria-label="Main navigation">
                <button className="nav-logo" onClick={() => scrollTo('hero-section')}>
                    hamon<span>.dev</span>
                </button>

                <ul className="nav-links">
                    <li>
                        <button onClick={() => scrollTo('hero-section')}>About</button>
                    </li>
                    <li>
                        <button onClick={() => scrollTo('projects-section')}>Projects</button>
                    </li>
                    <li>
                        <Link to="/commission">Commission</Link>
                    </li>
                    <li>
                        <button onClick={() => scrollTo('contact-section')}>Contact</button>
                    </li>
                </ul>

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {isDark ? 'light' : 'dark'}
                </button>
            </nav>
        </header>
    );
}

export default Header;
