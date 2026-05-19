// import { Link } from 'react-router-dom';

// function Header() {
//     return (
//         <header>

//             <div className="header-inner">

//                 <Link to="/">
//                     build_log
//                 </Link>

//                 <nav>

//                     <ul>

//                         <li>
//                             <Link to="/about">
//                                 About
//                             </Link>
//                         </li>

//                         <li>
//                             <Link to="/projects">
//                                 Projects
//                             </Link>
//                         </li>

//                         <li>
//                             <Link to="/demo">
//                                 Demo
//                             </Link>
//                         </li>

//                         <li>
//                             <Link to="/devlog">
//                                 Dev Log
//                             </Link>
//                         </li>

//                         <li>
//                             <Link to="/commission">
//                                 Commission
//                             </Link>
//                         </li>

//                     </ul>

//                 </nav>

//             </div>

//         </header>
//     );
// }

// export default Header;


import { Link } from 'react-router-dom';

function Header() {

    const moveSection = (
        id: string
    ) => {

        const section =
            document.getElementById(id);

        section?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    return (
        <header>

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
            </button>

            <Link to="/commission">
                Commission
            </Link>

        </header>
    );
}

export default Header;