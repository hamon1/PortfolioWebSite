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