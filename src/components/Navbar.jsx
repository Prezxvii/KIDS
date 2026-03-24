import React, { useState, useRef } from 'react';
import { ChevronDown, User, LogOut, BookOpen } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUserOpen,      setIsUserOpen]      = useState(false);
  const navigate          = useNavigate();
  const { user, logout }  = useAuth();

  // Timeout refs so we can cancel close when mouse re-enters
  const resourcesTimer = useRef(null);
  const userTimer      = useRef(null);

  // ── Resources dropdown ────────────────────────────────────────────────────
  const openResources  = () => { clearTimeout(resourcesTimer.current); setIsResourcesOpen(true); };
  const closeResources = () => { resourcesTimer.current = setTimeout(() => setIsResourcesOpen(false), 150); };

  // ── User dropdown ─────────────────────────────────────────────────────────
  const openUser  = () => { clearTimeout(userTimer.current); setIsUserOpen(true); };
  const closeUser = () => { userTimer.current = setTimeout(() => setIsUserOpen(false), 150); };

  const handleLogout = () => {
    setIsUserOpen(false);
    logout();
    navigate('/');
  };

  const PATH_COLORS = {
    Tech: '#2B88D8', Sports: '#EE272E', Arts: '#8b5cf6',
    Business: '#f59e0b', Camps: '#10b981', Music: '#ec4899',
  };
  const pathColor = user ? (PATH_COLORS[user.path] || '#2B88D8') : '#2B88D8';

  const handleHashLink = (e, sectionId) => {
    if (window.location.pathname !== '/') {
      e.preventDefault();
      navigate(`/#${sectionId}`);
    }
  };

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

          {/* Resources dropdown */}
          <li
            className="dropdown-wrapper"
            onMouseEnter={openResources}
            onMouseLeave={closeResources}
          >
            <button className="dropdown-trigger" onClick={() => navigate('/resources')}>
              Resources
              <ChevronDown
                className={`nav-chevron ${isResourcesOpen ? 'rotate' : ''}`}
                size={18} color="#EE272E" strokeWidth={3}
              />
            </button>
            {isResourcesOpen && (
              <div
                className="dropdown-outer"
                onMouseEnter={openResources}
                onMouseLeave={closeResources}
              >
                <ul className="dropdown-menu">
                  <li><Link to="/resources?category=Sports">Sports &amp; Fitness</Link></li>
                  <li><Link to="/resources?category=Tech">Tech &amp; Coding</Link></li>
                  <li><Link to="/resources?category=Arts">Arts &amp; Design</Link></li>
                  <li><Link to="/resources?category=Business">Business &amp; Finance</Link></li>
                </ul>
              </div>
            )}
          </li>

          <li>
            <a href="/#about" onClick={(e) => handleHashLink(e, 'about')}>About</a>
          </li>
          <li>
            <a href="/#faq" onClick={(e) => handleHashLink(e, 'faq')}>FAQ</a>
          </li>
        </ul>

        {/* ── Right: Auth ── */}
        <div className="nav-right">
          {user ? (
            <div
              className="nav-user-wrapper"
              onMouseEnter={openUser}
              onMouseLeave={closeUser}
            >
              {/* Avatar pill */}
              <button className="btn-user-avatar" style={{ borderColor: pathColor }}>
                <span className="avatar-initials" style={{ background: pathColor }}>
                  {user.firstName.slice(0, 2).toUpperCase()}
                </span>
                <span className="avatar-name">{user.firstName}</span>
                <ChevronDown
                  className={`nav-chevron ${isUserOpen ? 'rotate' : ''}`}
                  size={15} strokeWidth={2.5}
                  style={{ color: '#64748b' }}
                />
              </button>

              {/* User dropdown — bridge gap with padding-top */}
              {isUserOpen && (
                <div
                  className="user-dropdown"
                  onMouseEnter={openUser}
                  onMouseLeave={closeUser}
                >
                  {/* Header */}
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-avatar" style={{ background: pathColor }}>
                      {user.firstName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="user-dropdown-name">{user.firstName}</p>
                      <p className="user-dropdown-path" style={{ color: pathColor }}>
                        {user.path} Track
                      </p>
                    </div>
                  </div>

                  <div className="user-dropdown-divider" />

                  <button className="user-dropdown-item"
                    onClick={() => { setIsUserOpen(false); navigate('/profile'); }}>
                    <User size={14} /> My Profile
                  </button>
                  <button className="user-dropdown-item"
                    onClick={() => { setIsUserOpen(false); navigate(`/resources?category=${user.path}`); }}>
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
            <>
              <button className="btn-login"  onClick={() => navigate('/login')}>Login</button>
              <button className="btn-signup" onClick={() => navigate('/signup')}>Get Started</button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;