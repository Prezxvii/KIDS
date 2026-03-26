import React, { useState, useRef } from 'react';
import { ChevronDown, User, LogOut, BookOpen, HelpCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const resourcesTimer = useRef(null);
  const userTimer = useRef(null);

  // Dropdown Handlers
  const openResources = () => { clearTimeout(resourcesTimer.current); setIsResourcesOpen(true); };
  const closeResources = () => { resourcesTimer.current = setTimeout(() => setIsResourcesOpen(false), 150); };

  const openUser = () => { clearTimeout(userTimer.current); setIsUserOpen(true); };
  const closeUser = () => { userTimer.current = setTimeout(() => setIsUserOpen(false), 150); };

  const handleLogout = () => {
    setIsUserOpen(false);
    logout();
    navigate('/');
  };

  const handleHashLink = (e, sectionId) => {
    if (window.location.pathname !== '/') {
      e.preventDefault();
      navigate(`/#${sectionId}`);
      // Small timeout to allow the navigation to happen before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  const PATH_COLORS = {
    Tech: '#2B88D8', Sports: '#EE272E', Arts: '#8b5cf6',
    Business: '#f59e0b', Camps: '#10b981', Music: '#ec4899',
  };
  const pathColor = user ? (PATH_COLORS[user.path] || '#2B88D8') : '#2B88D8';

  return (
    <div className="navbar-wrapper">
      <div className="navbar-inner">

        {/* ── Logo ── */}
        <div className="nav-left">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="red">K</span>
            <span className="blue">I</span>
            <span className="yellow">D</span>
            <span className="blue">S</span>
          </div>
        </div>

        {/* ── Center Links ── */}
        <ul className="nav-center">
          <li><Link to="/">Home</Link></li>

          <li className="dropdown-wrapper" onMouseEnter={openResources} onMouseLeave={closeResources}>
            <button className="dropdown-trigger" onClick={() => navigate('/resources')}>
              Resources
              <ChevronDown className={`nav-chevron ${isResourcesOpen ? 'rotate' : ''}`} size={16} />
            </button>
            {isResourcesOpen && (
              <div className="dropdown-outer" onMouseEnter={openResources} onMouseLeave={closeResources}>
                <ul className="dropdown-menu">
                  <li><Link to="/resources?category=Sports">Sports & Fitness</Link></li>
                  <li><Link to="/resources?category=Tech">Tech & Coding</Link></li>
                  <li><Link to="/resources?category=Arts">Arts & Design</Link></li>
                  <li><Link to="/resources?category=Business">Business & Finance</Link></li>
                </ul>
              </div>
            )}
          </li>

          <li>
            <a href="/#about" onClick={(e) => handleHashLink(e, 'about')}>About</a>
          </li>
          
          {/* Restored FAQ Link */}
          <li>
            <a href="/#faq" onClick={(e) => handleHashLink(e, 'faq')}>FAQ</a>
          </li>
        </ul>

        {/* ── Right: Auth ── */}
        <div className="nav-right">
          {user ? (
            <div className="nav-user-wrapper" onMouseEnter={openUser} onMouseLeave={closeUser}>
              <button className="btn-user-avatar" style={{ borderColor: pathColor }} onClick={() => navigate('/profile')}>
                <span className="avatar-initials" style={{ background: pathColor }}>
                  {user.firstName.slice(0, 2).toUpperCase()}
                </span>
                <span className="avatar-name">{user.firstName}</span>
                <ChevronDown className={`nav-chevron ${isUserOpen ? 'rotate' : ''}`} size={15} />
              </button>

              {isUserOpen && (
                <div className="user-dropdown" onMouseEnter={openUser} onMouseLeave={closeUser}>
                  <div className="user-dropdown-header">
                    <p className="user-dropdown-name">{user.firstName}</p>
                    <p className="user-dropdown-path" style={{ color: pathColor }}>{user.path} Track</p>
                  </div>
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item" onClick={() => { setIsUserOpen(false); navigate('/profile'); }}>
                    <User size={14} /> My Profile
                  </button>
                  <button className="user-dropdown-item" onClick={() => { setIsUserOpen(false); navigate(`/resources?category=${user.path}`); }}>
                    <BookOpen size={14} /> My Resources
                  </button>
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item signout" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-signup" onClick={() => navigate('/signup')}>Get Started</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;