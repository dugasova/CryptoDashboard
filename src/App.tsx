import React, { lazy, useState } from 'react';
import './App.scss';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './pages/Header/Layout';
import ErrorRoute from './routes/ErrorRoute';
import { DarkModeProvider } from './context/DarkModeContext.tsx'; // Import DarkModeProvider from the .tsx file
import AdminRoute from './routes/AdminRoute.tsx';
import AuthContext from './context/AuthContext.tsx';
import AuthGuard from './HOC/AuthGuard.tsx';


// Universal function for lazy loading routes
const lazyLoadRoute = (routePath: string) => {
  return lazy(() => import(`./routes/${routePath}.tsx`));
};

// Lazy load the route components using the universal function
const HomeRouteLazy = lazyLoadRoute('HomeRoute');
const CryptoRouteLazy = lazyLoadRoute('CryptoRoute');
const DetailsRouteLazy = lazyLoadRoute('DetailsRoute');
const MyCryptoRouteLazy = lazyLoadRoute('MyCryptoRoute');

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const router = createBrowserRouter([
    {
      path: `/`,
      element: <Layout />,
      children: [
        {
          path: `/`,
          element: <HomeRouteLazy />,
        },
        {
          path: `crypto`,
          element: <CryptoRouteLazy />,
        },
        {
          path: `crypto/:id`,
          element: <DetailsRouteLazy />,
        },
        {
          path: `/my-crypto`,
          element: <AuthGuard><MyCryptoRouteLazy /></AuthGuard>,
        },
        {
          path: `admin`,
          element: <AdminRoute />,
        }
      ],
      errorElement: <ErrorRoute />,
    }
  ])
  return (
    <AuthContext.Provider value={{isAuth, setIsAuth}}> {/* Wrap the application with AuthContext */}
      <DarkModeProvider> {/* Wrap the application with DarkModeProvider */}
        <RouterProvider router={router} />
      </DarkModeProvider>
    </AuthContext.Provider>
  )
}
