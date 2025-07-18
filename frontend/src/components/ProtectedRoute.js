import { Navigate } from 'react-router-dom';
import { getAuth } from '../utils/auth';

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = getAuth();

  if (!token || !user || user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
