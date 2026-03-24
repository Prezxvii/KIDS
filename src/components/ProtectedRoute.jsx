import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Reads token directly from localStorage — no AuthContext dependency needed.
// UserProfile handles its own token verification on mount.
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token    = localStorage.getItem('kids_token');

  if (!token) {
    // Not logged in — redirect to login, remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;