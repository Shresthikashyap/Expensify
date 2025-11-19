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

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const decodedToken = token? parseJwt(localStorage.getItem('token')): null;
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  
  // If authenticated or token exists, redirect to home
  if (isAuth || token) {
    dispatch(loginSuccess({ token }));

    if (decodedToken && decodedToken.isPremium) {
    dispatch(activatePremium());
    }
    return <Navigate to="/home" replace />;
  } else {
    <Navigate to="/" replace />
  }
  
  return children;
};

export default PublicRoute;