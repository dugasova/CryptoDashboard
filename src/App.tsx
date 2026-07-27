import { lazy } from 'react';
import './App.scss';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './pages/Header/Layout';
import ErrorPage from './pages/Error/Error.tsx';
import { DarkModeProvider } from './context/DarkModeContext.tsx'; // Import DarkModeProvider from the .tsx file
import { AuthProvider } from './context/AuthContext.tsx';
import AuthGuard from './HOC/AuthGuard.tsx';

// Lazy load the page components with explicit literal paths so Vite can code-split correctly
const HomeLazy = lazy(() => import('./pages/Home/Home.tsx'));
const CryptoLazy = lazy(() => import('./pages/Crypto/Crypto.tsx'));
const DetailsLazy = lazy(() => import('./pages/Details/Details.tsx'));
const MyCryptoLazy = lazy(() => import('./pages/MyCrypto/MyCrypto.tsx'));
const AdminLazy = lazy(() => import('./pages/Admin/Admin.tsx'));
const AboutLazy = lazy(() => import('./pages/About/About.tsx'));
const PrivacyLazy = lazy(() => import('./pages/Privacy/Privacy.tsx'));
const ContactLazy = lazy(() => import('./pages/Contact/Contact.tsx'));
const TermsServicesLazy = lazy(() => import('./pages/TermsServices/TermsServices.tsx'));
const RegisterLazy = lazy(() => import('./pages/Register/Register.tsx'));
const LoginLazy = lazy(() => import('./pages/Login/Login.tsx'));

// Created once at module scope: recreating it on every render would reset
// the data router's internal state (loader cache, scroll restoration, in-flight navigation).
const router = createBrowserRouter([
  {
    path: `/`,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomeLazy />,
      },
      {
        path: `crypto`,
        element: <CryptoLazy />,
      },
      {
        path: `crypto/:id`,
        element: <DetailsLazy />,
      },
      {
        path: `my-crypto`,
        element: <AuthGuard><MyCryptoLazy /></AuthGuard>,
      },
      {
        path: `admin`,
        element: <AdminLazy />,
      },
      {
        path: `about`,
        element: <AboutLazy />,
      },
      {
        path: `privacy`,
        element: <PrivacyLazy />,
      },
      {
        path: `contact`,
        element: <ContactLazy />,
      },
      {
        path: `terms`,
        element: <TermsServicesLazy />,
      },
      {
        path: `register`,
        element: <RegisterLazy />,
      },
      {
        path: `login`,
        element: <LoginLazy />,
      },
      {
        path: `auth`,
        element: <LoginLazy />,
      },
      {
        path: `market-cap`,
        element: <HomeLazy />,
      }
    ],
    errorElement: <ErrorPage />,
  }
]);

export default function App() {
  return (
    <AuthProvider> {/* Wrap the application with AuthProvider */}
      <DarkModeProvider> {/* Wrap the application with DarkModeProvider */}
        <RouterProvider router={router} />
      </DarkModeProvider>
    </AuthProvider>
  )
}
