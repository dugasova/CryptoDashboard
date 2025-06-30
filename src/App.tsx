import React, { lazy } from 'react';
import './App.scss';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './pages/Header/Layout';
import ErrorRoute from './routes/ErrorRoute';
import { DarkModeProvider } from './context/DarkModeContext.tsx'; // Import DarkModeProvider from the .tsx file
import AdminRoute from './routes/AdminRoute.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import AuthGuard from './HOC/AuthGuard.tsx';
import AboutRoute from './routes/AboutRoute.tsx';
import PrivacyRoute from './routes/PrivacyRoute.tsx';
import ContactRoute from './routes/ContactRoute.tsx';
import TermsServicesRoute from './routes/TermsServicesRoute.tsx';
import RegisterRoute from './routes/RegisterRoute.tsx';
import LoginRoute from './routes/LoginRoute.tsx';


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
        },
         {
          path: `about`,
          element: <AboutRoute />,
        },
        {
          path: `privacy`,
          element: <PrivacyRoute />,
        },
        {
          path: `contact`,
          element: <ContactRoute />,
        },
          {
          path: `terms`,
          element: <TermsServicesRoute />,
        },
         {
          path: `register`,
          element: <RegisterRoute />,
        },
        {
          path: `login`,
          element: <LoginRoute />,
        },
      ],
      errorElement: <ErrorRoute />,
    }
  ])
  return (
    <AuthProvider> {/* Wrap the application with AuthProvider */}
      <DarkModeProvider> {/* Wrap the application with DarkModeProvider */}
        <RouterProvider router={router} />
      </DarkModeProvider>
    </AuthProvider>
  )
}
