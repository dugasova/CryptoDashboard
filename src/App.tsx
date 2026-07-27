import { lazy } from 'react';
import './App.scss';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './pages/Header/Layout';
import ErrorRoute from './routes/ErrorRoute';
import { DarkModeProvider } from './context/DarkModeContext.tsx'; // Import DarkModeProvider from the .tsx file
import { AuthProvider } from './context/AuthContext.tsx';
import AuthGuard from './HOC/AuthGuard.tsx';

// Lazy load the route components with explicit literal paths so Vite can code-split correctly
const HomeRouteLazy = lazy(() => import('./routes/HomeRoute.tsx'));
const CryptoRouteLazy = lazy(() => import('./routes/CryptoRoute.tsx'));
const DetailsRouteLazy = lazy(() => import('./routes/DetailsRoute.tsx'));
const MyCryptoRouteLazy = lazy(() => import('./routes/MyCryptoRoute.tsx'));
const AdminRouteLazy = lazy(() => import('./routes/AdminRoute.tsx'));
const AboutRouteLazy = lazy(() => import('./routes/AboutRoute.tsx'));
const PrivacyRouteLazy = lazy(() => import('./routes/PrivacyRoute.tsx'));
const ContactRouteLazy = lazy(() => import('./routes/ContactRoute.tsx'));
const TermsServicesRouteLazy = lazy(() => import('./routes/TermsServicesRoute.tsx'));
const RegisterRouteLazy = lazy(() => import('./routes/RegisterRoute.tsx'));
const LoginRouteLazy = lazy(() => import('./routes/LoginRoute.tsx'));

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
          element: <AdminRouteLazy />,
        },
        {
          path: `about`,
          element: <AboutRouteLazy />,
        },
        {
          path: `privacy`,
          element: <PrivacyRouteLazy />,
        },
        {
          path: `contact`,
          element: <ContactRouteLazy />,
        },
        {
          path: `terms`,
          element: <TermsServicesRouteLazy />,
        },
        {
          path: `register`,
          element: <RegisterRouteLazy />,
        },
        {
          path: `login`,
          element: <LoginRouteLazy />,
        },
        {
          path: `auth`,
          element: <LoginRouteLazy />,
        },
        {
          path: `market-cap`,
          element: <HomeRouteLazy />,
        }
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
