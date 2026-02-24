import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirection based on user role if they try to access an unauthorized page
        if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
        if (user.role === 'SELLER') return <Navigate to="/seller" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
