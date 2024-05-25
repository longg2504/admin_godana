import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import NotFoundPage from 'views/NotFoundPage';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/admin/login',
      element: <AuthLogin3 />
    },
    {
      path: '*',
      element: <NotFoundPage/>
    },
  ]
};

export default AuthenticationRoutes;
