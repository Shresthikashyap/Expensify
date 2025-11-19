import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Home, DollarSign, Trophy, Download, UserCircle, LogOut } from 'lucide-react';
import Signup from './components/AuthForm/SignUp';
import Login from './components/AuthForm/Login';
import ForgetPassword from './components/AuthForm/ForgetPassword';
import Expenses from './components/Expenses/Expense';
import HomeComponent from './components/Home/Home';
import Leaderboard from './components/Leaderboard/Leaderboard';
import { logout, loginSuccess } from './store/AuthSlice';
import './App.css';
import { toggleTheme } from './store/ThemeSlice';
import Premium from './components/Premium/Premium';
import CompleteAuthForm from './components/CompleteProfile/CompleteAuthForm';
import Downloads from './components/Downloads/Downloads';
import PublicRoute from './components/PublicRote';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const isDarkTheme = useSelector(state => state.theme.isDarkTheme);
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Restore auth on reload
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
    
      dispatch(loginSuccess({ token })); // this will also set isAuthenticated = true
      <Navigate to="/home" replace />
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    if (isDarkTheme) {
      dispatch(toggleTheme());
    }
  };

  const navLinks = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Expenses', path: '/expenses', icon: DollarSign },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Downloads', path: '/downloads', icon: Download },
    { label: 'Complete Profile', path: '/completeprofile', icon: UserCircle },
    { label: 'LogOut', path: '/', onClick: handleLogout, icon: LogOut },
  ];

  useEffect(() => {
    const body = document.querySelector('body');
    if (isDarkTheme) {
      body.style.backgroundColor = '#333';
      body.style.color = '#fff';
    } else {
      body.style.backgroundColor = 'rgb(218, 178, 132)';
      body.style.color = '#333';
    }
  }, [isDarkTheme]);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div>
        <div className="container">
          {!isAuth && <header>Expensify</header>}
          {isAuth && (
            <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
              <header>{isCollapsed ? 'E' : 'Expensify'}</header>
              <ul>
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <li key={index}>
                      <Link to={link.path} onClick={link.onClick} title={link.label}>
                        <Icon size={22} />
                        <span className="nav-label">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          <div className={`main-content ${isAuth ? (isCollapsed ? 'collapsed-sidebar' : 'expanded-sidebar') : ''}`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/forgetpassword" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
  
              
              {/* Protected Routes */}
              <Route path="/home" element={<ProtectedRoute><HomeComponent /></ProtectedRoute>} />
              <Route path="/downloads" element={<ProtectedRoute><Downloads /></ProtectedRoute>} />
              <Route path="/completeprofile" element={<ProtectedRoute><CompleteAuthForm /></ProtectedRoute>} />
              <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;