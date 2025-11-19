import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/AuthSlice';
import { activatePremium } from '../store/PremiumSlice';

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
}

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const token = localStorage.getItem('token');
  
  // Restore auth state if token exists but not authenticated
  useEffect(() => {
    if (token && !isAuth) {
      dispatch(loginSuccess({ token }));
      
      const decodedToken = parseJwt(token);
      if (decodedToken && decodedToken.isPremium) {
        dispatch(activatePremium());
      }
    }
  }, [token, isAuth, dispatch]);

  // If not authenticated and no token exists, redirect to login
  if (!isAuth && !token) {
    return <Navigate to="/" replace />;
  }

  // If authenticated or token exists, render the children
  return children;
};

export default ProtectedRoute;