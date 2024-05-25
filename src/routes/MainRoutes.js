// MainRoute.js
import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const PlaceManager = Loadable(lazy(() => import('views/utilities/Place/page/PlaceManager')));
const PlaceCreate = Loadable(lazy(() => import('views/utilities/Place/page/PlaceCreate')));
const PostList = Loadable(lazy(() => import('views/utilities/Post/page/PostList')));
const UserList = Loadable(lazy(() => import('views/utilities/User/page/UserList')));
const UserBan = Loadable(lazy(() => import('views/utilities/User/page/UserBan')));
// const NotFoundPage = Loadable(lazy(() => import('views/NotFoundPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {

  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <PrivateRoute element={DashboardDefault} />
    },
    {
      path: 'dashboard/report',
      element: <PrivateRoute element={DashboardDefault} />
    },
    {
      path: 'place/place-list',
      element: <PrivateRoute element={PlaceManager} />
    },
    {
      path: 'place/create-place',
      element: <PrivateRoute element={PlaceCreate} />
    },
    {
      path: 'user/user-list',
      element: <PrivateRoute element={UserList} />
    },
    {
      path: 'user/user-ban',
      element: <PrivateRoute element={UserBan} />
    },
    {
      path: 'post/post-list',
      element: <PrivateRoute element={PostList} />
    },

  ],


};

export default MainRoutes;
