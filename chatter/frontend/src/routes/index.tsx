import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Register from '../pages/Register';
import ChatPage from '../pages/ChatPage';
import WaitingForValidation from '../pages/WaitingForValidation';
import NotFoundPage from '../pages/NotFoundPage';

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: '/service',
      element: <div>Service Page</div>,
    },
    {
      path: '/about-us',
      element: <div>About Us</div>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: '/',
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: '/',
          element: <div>User Home Page</div>,
        },
        {
          path: '/chat',
          element: <ChatPage />,
        },
        {
          path: '/logout',
          element: <Logout />,
        },
        {
          path: '/verify',
          element: <WaitingForValidation />,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: '/',
      element: <div>Home Page</div>,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ];

  // Define the 404 Not Found route
  const notFoundRoute = [
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
    ...notFoundRoute, // Include the 404 route last
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
