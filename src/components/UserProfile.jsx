import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Settings, LogOut, BookOpen,
  Edit3, Check, X, Zap, ArrowUpRight,
  ChevronRight, Bell, Calendar, LayoutGrid,
  Code, Dribbble, Palette, TrendingUp, Tent, Music,
  MapPin, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── Path config — icons instead of emojis ───────────────────────────────────
const PATH_CONFIG = {
  Tech:     { icon: <Code size={16} />,       color: '#2B88D8', bg: '#eaf3fb' },
  Sports:   { icon: <Dribbble size={16} />,   color: '#EE272E', bg: '#fef2f2' },
  Arts:     { icon: <Palette size={16} />,    color: '#8b5cf6', bg: '#f5f3ff' },
  Business: { icon: <TrendingUp size={16} />, color: '#f59e0b', bg: '#fffbeb' },
  Camps:    { icon: <Tent size={16} />,       color: '#10b981', bg: '#ecfdf5' },
  Music:    { icon: <Music size={16} />,      color: '#ec4899', bg: '#fdf2f8' },
};

// ─── Stat icons ───────────────────────────────────────────────────────────────
const STAT_ICONS = {
  track:    { icon: <LayoutGrid size={22} /> },
  programs: { icon: <BookOpen   size={22} /> },
  since:    { icon: <Calendar   size={22} /> },
};

const SUGGESTED = {
  Tech:     [{ name: 'ScriptEd Coding in Schools', url: 'https://scripted.org',             tag: 'Free · Bronx'         }, { name: 'NYPL TechConnect',              url: 'https://www.nypl.org',            tag: 'Free · All Boroughs'  }, { name: 'Access Code — C4Q',             url: 'https://www.c4q.nyc',             tag: 'Free · Queens'        }],
  Sports:   [{ name: 'NYC Parks Youth Sports',      url: 'https://www.nycgovparks.org',      tag: 'Free · All Boroughs'  }, { name: 'PAL Teen Centers',              url: 'https://palnyc.org',              tag: 'Free · Manhattan'     }, { name: 'Rucker Park Basketball',        url: '#',                               tag: 'Free · Harlem'        }],
  Arts:     [{ name: 'Creative Arts Works',         url: '#',                                tag: 'Paid Internship · Manhattan' }, { name: 'Digital Media Lab',        url: 'https://www.nypl.org',            tag: 'Free · Staten Island' }, { name: 'Summer Rising Art Intensive',   url: '#',                               tag: 'Free · Manhattan'     }],
  Business: [{ name: 'SYEP — Summer Youth Employment', url: 'https://www.nyc.gov/site/dycd', tag: 'Paid · All Boroughs'  }, { name: 'Work, Learn & Grow',            url: '#',                               tag: 'Paid · All Boroughs'  }, { name: 'NYCEDC Youth Entrepreneur',     url: '#',                               tag: 'Free · All Boroughs'  }],
  Camps:    [{ name: 'COMPASS After-School',        url: 'https://www.nyc.gov/site/dycd',    tag: 'Free · All Boroughs'  }, { name: 'Beacon Community Centers',      url: 'https://www.nyc.gov/site/dycd',   tag: 'Free · All Boroughs'  }, { name: 'Summer Rising',                 url: '#',                               tag: 'Free · All Boroughs'  }],
  Music:    [{ name: 'Digital Media Lab',           url: 'https://www.nypl.org',             tag: 'Free · Staten Island' }, { name: 'Creative Arts Works',           url: '#',                               tag: 'Paid · Manhattan'     }, { name: 'COMPASS After-School',          url: '#',                               tag: 'Free · All Boroughs'  }],
};

// ─── Main Component ───────────────────────────────────────────────────────────
const UserProfile = () => {
  const navigate = useNavigate();

  const [user,       setUser]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('overview');
  const [editing,    setEditing]    = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [editData,   setEditData]   = useState({ firstName: '', path: '' });

  // ── Load user from token ──────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('kids_token');
    if (!token) { navigate('/login', { replace: true }); return; }

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        setUser(data);
        setEditData({ firstName: data.firstName, path: data.path });
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('kids_token');
        navigate('/login', { replace: true });
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('kids_token');
    navigate('/', { replace: true });
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    const token = localStorage.getItem('kids_token');
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(editData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(prev => ({ ...prev, ...data }));
      setSaveStatus('saved');
      setEditing(false);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch {
      setSaveStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner" />
      </div>
    );
  }

  const pathInfo  = PATH_CONFIG[user?.path] || PATH_CONFIG.Tech;
  const suggested = SUGGESTED[user?.path]   || SUGGESTED.Tech;
  const initials  = user?.firstName ? user.firstName.slice(0, 2).toUpperCase() : 'KD';

  const tabs = [
    { id: 'overview',  label: 'Overview',     icon: <User size={15} />     },
    { id: 'resources', label: 'My Resources', icon: <BookOpen size={15} /> },
    { id: 'settings',  label: 'Settings',     icon: <Settings size={15} /> },
  ];

  const stats = [
    { label: 'Your Track',         value: user?.path || '—',  ...STAT_ICONS.track    },
    { label: 'Programs Available', value: '12+',               ...STAT_ICONS.programs },
    { label: 'Member Since',       value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Today',                                              ...STAT_ICONS.since    },
  ];

  return (
    <div className="profile-page">

      {/* ── Hero Banner ── */}
      <div className="profile-hero">
        <div className="profile-hero-inner">

          {/* Avatar circle */}
          <motion.div
            className="profile-avatar"
            style={{ background: `linear-gradient(135deg, ${pathInfo.color}, #111)` }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {initials}
          </motion.div>

          {/* Name + path */}
          <motion.div
            className="profile-identity"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1>{user?.firstName}</h1>
            <div
              className="profile-path-badge"
              style={{ background: pathInfo.bg, color: pathInfo.color }}
            >
              {/* Icon instead of emoji */}
              <span className="badge-icon">{pathInfo.icon}</span>
              {user?.path} Track
            </div>
            <p className="profile-email">{user?.email}</p>
          </motion.div>

          {/* Action buttons */}
          <div className="profile-hero-actions">
            <motion.button
              className="btn-edit-profile"
              onClick={() => setEditing(!editing)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            >
              <Edit3 size={14} /> Edit Profile
            </motion.button>
            <motion.button
              className="btn-logout"
              onClick={handleLogout}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            >
              <LogOut size={14} /> Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      <div className="profile-body">

        {/* ── Edit Panel ── */}
        <AnimatePresence>
          {editing && (
            <motion.div
              className="edit-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="edit-panel-inner">
                <h3>Edit Profile</h3>
                <div className="edit-row">
                  <label>First Name</label>
                  <input
                    className="edit-input"
                    value={editData.firstName}
                    onChange={(e) => setEditData(p => ({ ...p, firstName: e.target.value }))}
                  />
                </div>
                <div className="edit-row">
                  <label>Your Path</label>
                  <div className="edit-path-grid">
                    {Object.entries(PATH_CONFIG).map(([id, cfg]) => (
                      <button
                        key={id}
                        className={`edit-path-btn ${editData.path === id ? 'active' : ''}`}
                        style={editData.path === id
                          ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color }
                          : {}}
                        onClick={() => setEditData(p => ({ ...p, path: id }))}
                      >
                        <span className="edit-path-icon">{cfg.icon}</span>
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="edit-actions">
                  <button className="edit-cancel" onClick={() => setEditing(false)}>
                    <X size={14} /> Cancel
                  </button>
                  <motion.button
                    className="edit-save"
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    {saveStatus === 'saving' ? <><span className="btn-spinner" /> Saving…</>
                      : saveStatus === 'saved' ? <><Check size={14} /> Saved!</>
                      : <><Check size={14} /> Save Changes</>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tabs ── */}
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <motion.div className="tab-underline" layoutId="tab-underline" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="tab-content">

                {/* Welcome banner */}
                <div className="welcome-card" style={{ borderColor: pathInfo.color }}>
                  <div className="welcome-card-left">
                    <Zap size={18} style={{ color: pathInfo.color, flexShrink: 0 }} />
                    <div>
                      <h3>Welcome to KIDS, {user?.firstName}!</h3>
                      <p>
                        You're on the <strong>{user?.path}</strong> track.
                        Explore programs and resources curated just for you.
                      </p>
                    </div>
                  </div>
                  <motion.button
                    className="welcome-cta"
                    style={{ background: pathInfo.color }}
                    onClick={() => navigate(`/resources?category=${user?.path}`)}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  >
                    Explore Resources <ArrowUpRight size={14} />
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="stats-row">
                  {stats.map((s, i) => (
                    <motion.div
                      key={i}
                      className="stat-card"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <span className="stat-icon" style={{ color: pathInfo.color }}>
                        {s.icon}
                      </span>
                      <span className="stat-value">{s.value}</span>
                      <span className="stat-label">{s.label}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Recommended */}
                <div className="section-header">
                  <h3>Recommended for You</h3>
                  <button className="see-all-btn" onClick={() => setActiveTab('resources')}>
                    See all <ChevronRight size={14} />
                  </button>
                </div>
                <div className="quick-resources">
                  {suggested.map((r, i) => (
                    <motion.a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quick-resource-card"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}
                    >
                      <div className="qr-icon-box" style={{ background: pathInfo.bg, color: pathInfo.color }}>
                        {pathInfo.icon}
                      </div>
                      <div className="qr-info">
                        <h4>{r.name}</h4>
                        <span className="qr-tag">
                          <MapPin size={11} /> {r.tag}
                        </span>
                      </div>
                      <ExternalLink size={14} className="qr-arrow" />
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* ── RESOURCES ── */}
            {activeTab === 'resources' && (
              <div className="tab-content">
                <div className="section-header">
                  <h3>Programs Matched to Your Path</h3>
                  <span
                    className="section-badge"
                    style={{ background: pathInfo.bg, color: pathInfo.color }}
                  >
                    <span className="badge-icon">{pathInfo.icon}</span>
                    {user?.path}
                  </span>
                </div>
                <div className="resources-list">
                  {suggested.map((r, i) => (
                    <motion.a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-list-item"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ x: 4 }}
                    >
                      <div className="rli-icon" style={{ background: pathInfo.bg, color: pathInfo.color }}>
                        {pathInfo.icon}
                      </div>
                      <div className="rli-info">
                        <h4>{r.name}</h4>
                        <span><MapPin size={11} /> {r.tag}</span>
                      </div>
                      <ExternalLink size={14} className="rli-arrow" />
                    </motion.a>
                  ))}
                </div>
                <div className="explore-more-banner">
                  <Bell size={16} />
                  <p>Want to explore other tracks?</p>
                  <button className="explore-more-btn" onClick={() => navigate('/resources')}>
                    Browse All Resources <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {activeTab === 'settings' && (
              <div className="tab-content">
                <div className="settings-section">
                  <h3>Account</h3>
                  <div className="settings-rows">
                    {[
                      { label: 'Name',  value: user?.firstName,      editable: true  },
                      { label: 'Email', value: user?.email,           editable: false },
                      { label: 'Path',  value: user?.path,            editable: true,
                        icon: <span style={{ color: pathInfo.color }}>{pathInfo.icon}</span> },
                    ].map((row, i) => (
                      <div key={i} className="settings-row">
                        <div>
                          <span className="settings-row-label">{row.label}</span>
                          <span className="settings-row-value">
                            {row.icon && <span className="settings-row-icon">{row.icon}</span>}
                            {row.value}
                          </span>
                        </div>
                        {row.editable && (
                          <button
                            className="settings-edit-btn"
                            onClick={() => { setEditing(true); setActiveTab('overview'); }}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings-section danger-zone">
                  <h3>Account Actions</h3>
                  <motion.button
                    className="btn-signout-full"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <LogOut size={16} /> Sign Out of KIDS
                  </motion.button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserProfile;