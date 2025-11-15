
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import CompletionPage from './pages/CompletionPage';
import AccountPage from './pages/AccountPage';
import TestPage from './pages/TestPage';
import AdminPage from './pages/AdminPage'; // Import
import AuthContext from './context/AuthContext.jsx';
import AdminRoute from './components/AdminRoute'; // Import
import { subscribeToPushNotifications } from './utils/pushNotifications';
import './index.css';

function App() {
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      subscribeToPushNotifications();
    }
  }, [user]);

  return (
    <Router>
      <h1>Witaj w Ting Tong!</h1>
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/account">Account</Link>
            {user.isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <Link to="/test">Test</Link>
      </nav>
      <Routes>
        <Route path="/" element={<VideoPlayerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/completion" element={<CompletionPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="" element={<AdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
