import { Navigate } from 'react-router-dom';

// Higher-order component to protect admin routes
const ProtectedRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem('role'); // Get the role from localStorage

  if (!role || role !== requiredRole) {
    // If user is not logged in or doesn't have the correct role, redirect
    localStorage.removeItem('role');
    return <Navigate to="/login" />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
