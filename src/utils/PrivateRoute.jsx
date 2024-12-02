import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const authToken = localStorage.getItem('authTokens');
  const auth = authToken ? JSON.parse(authToken) : null;

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
