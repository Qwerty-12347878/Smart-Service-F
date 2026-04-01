import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

const UserRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user || user.role !== 'user' || user.isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const WorkerRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user || user.role !== 'worker') {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user || !user.isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export { ProtectedRoute, UserRoute, WorkerRoute, AdminRoute };