
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import CompletionPage from './pages/CompletionPage';
import AccountPage from './pages/AccountPage';
import AuthContext from './context/AuthContext.jsx';
import './index.css';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/account">Account</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<VideoPlayerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/completion" element={<CompletionPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </Router>
  );
}

export default App;
