import {
    createBrowserRouter,
} from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';

import Home from '../pages/Home/Home';
import Commission from '../pages/Commission/Commission';
import Blog from '../pages/Blog/Blog';
import BlogPost from '../pages/Blog/BlogPost';

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
        path: '/commission',
        element: <Commission />,
    },
],
    {
        basename: import.meta.env.BASE_URL,
    }
);

export default router;
