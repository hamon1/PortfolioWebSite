import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>

            <div className="header-inner">

                <Link to="/">
                    build_log
                </Link>

                <nav>

                    <ul>

                        <li>
                            <Link to="/about">
                                About
                            </Link>
                        </li>

                        <li>
                            <Link to="/projects">
                                Projects
                            </Link>
                        </li>

                        <li>
                            <Link to="/devlog">
                                Dev Log
                            </Link>
                        </li>

                        <li>
                            <Link to="/commission">
                                Commission
                            </Link>
                        </li>

                    </ul>

                </nav>

            </div>

        </header>
    );
}

export default Header;