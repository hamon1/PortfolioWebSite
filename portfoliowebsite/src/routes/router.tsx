import {
    createBrowserRouter,
} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

import Home from '../pages/Home/Home';
import Commission from '../pages/Commission/Commission';
import Blog from '../pages/Blog/Blog';
import BlogPost from '../pages/Blog/BlogPost';
import AdminWrite from '../pages/Admin/AdminWrite';
import ProjectDetail from '../pages/Projects/ProjectDetail';

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
        path: '/blog',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Blog />,
            },
            {
                path: ':slug',
                element: <BlogPost />,
            },
        ],
    },
    {
        path: '/projects',
        element: <MainLayout />,
        children: [
            {
                path: ':id',
                element: <ProjectDetail />,
            },
        ],
    },
    {
        path: '/compose',
        element: <AdminWrite />,
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
