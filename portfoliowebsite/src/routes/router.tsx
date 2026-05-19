// import {
//     createBrowserRouter,
// } from 'react-router-dom';

// import MainLayout from '../layouts/MainLayout';

// import Home from '../pages/Home/Home';
// import Projects from '../pages/Projects/Projects';
// import ProjectDetail from '../pages/Projects/ProjectDetail';

// import Demo from '../pages/Demo/Demo';

// import Commission from '../pages/Commission/Commission';

// import DevLog from '../pages/DevLog/DevLog';
// import LogDetail from '../pages/DevLog/LogDetail';

// import About from '../pages/About/About';

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <MainLayout />,

//         children: [
//             {
//                 index: true,
//                 element: <Home />,
//             },

//             {
//                 path: 'projects',
//                 element: <Projects />,
//             },

//             {
//                 path: 'projects/:id',
//                 element: <ProjectDetail />,
//             },

//             {
//                 path: 'demo',
//                 element: <Demo />,
//             },

//             {
//                 path: 'commission',
//                 element: <Commission />,
//             },

//             {
//                 path: 'devlog',
//                 element: <DevLog />,
//             },

//             {
//                 path: 'devlog/:id',
//                 element: <LogDetail />,
//             },

//             {
//                 path: 'about',
//                 element: <About />,
//             },
//         ],
//     },
// ]);

// export default router;

import {
    createBrowserRouter,
} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

import Home from '../pages/Home/Home';
import Commission from '../pages/Commission/Commission';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },

    {
        path: '/commission',
        element: <Commission />,
    },
],
    {
        basename: import.meta.env.BASE_URL,
    }
);

export default router;