import { Link } from 'react-router-dom';

function Header() {

    // const moveSection = (
    //     id: string
    // ) => {

    //     const section =
    //         document.getElementById(id);

    //     section?.scrollIntoView({
    //         behavior: 'smooth',
    //     });
    // };

    return (
        <header>
{/* 
            <button
                onClick={() =>
                    moveSection('projects')
                }
            >
                Projects
            </button>

            <button
                onClick={() =>
                    moveSection('demo')
                }
            >
                Demo
            </button>

            <button
                onClick={() =>
                    moveSection('devlog')
                }
            >
                DevLog
            </button>

            <button
                onClick={() =>
                    moveSection('about')
                }
            >
                About
            </button> */}

            <Link to="/commission">
                Commission
            </Link>

        </header>
    );
}

export default Header;