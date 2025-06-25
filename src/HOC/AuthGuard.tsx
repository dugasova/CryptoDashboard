import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext.tsx';
import { Navigate, useLocation } from 'react-router';

export default function AuthGuard({children}) {
    const { isAuth } = useContext(AuthContext);
    const {pathname} = useLocation();

  if (!isAuth) return <Navigate to="/" replace state={{ prevPath: pathname}}/>;
  return children
}
