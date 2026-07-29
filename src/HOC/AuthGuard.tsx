import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuth } = useAuth();
  const { pathname } = useLocation();

  if (!isAuth) return <Navigate to="/" replace state={{ prevPath: pathname }} />;
  return children;
}
