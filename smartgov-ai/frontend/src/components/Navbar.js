import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../styles/navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar fade-in">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏛️</span>
          SmartGov AI
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          ☰
        </button>

        <ul className={`navbar-menu ${showMenu ? 'active' : ''}`}>
          <li>
            <Link to="/" className="nav-link" onClick={() => setShowMenu(false)}>
              Home
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link
                  to="/schemes"
                  className="nav-link"
                  onClick={() => setShowMenu(false)}
                >
                  Schemes
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className="nav-link"
                  onClick={() => setShowMenu(false)}
                >
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link
                  to="/documents"
                  className="nav-link"
                  onClick={() => setShowMenu(false)}
                >
                  Documents
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="nav-link"
                  onClick={() => setShowMenu(false)}
                >
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">
                Welcome, {user.first_name || user.username}!
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-small">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-small">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-small">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
