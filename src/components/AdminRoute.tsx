import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <div>Loading...</div>;
  }

  const { user, loading } = auth;

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
