import { useContext, type ReactNode } from 'react';
import AuthContext from '../context/AuthContext.tsx';
import { Navigate, useLocation } from 'react-router';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const authContext = useContext(AuthContext);
  const { pathname } = useLocation();

  if (!authContext) throw new Error('AuthGuard must be used within an AuthProvider');

  if (!authContext.isAuth) return <Navigate to="/" replace state={{ prevPath: pathname }} />;
  return children;
}
