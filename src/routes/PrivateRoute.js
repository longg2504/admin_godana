// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';



const PrivateRoute = ({ element: Component }) => {
    const isAuthenticated = localStorage.getItem("jwt")
    return isAuthenticated ? <Component /> : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
