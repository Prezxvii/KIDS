import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Settings, LogOut, BookOpen,
  Edit3, Check, X, Zap, ArrowUpRight,
  ChevronRight, Bell, Calendar, LayoutGrid,
  Code, Dribbble, Palette, TrendingUp, Tent, Music,
  MapPin, ExternalLink, ShieldCheck, RefreshCw, 
  Clock, Award, Sparkles, Heart, Share2, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

// ─── API CONFIGURATION ──────────────────────────────────────────────────────
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── PATH CONFIGURATION ─────────────────────────────────────────────────────
const PATH_CONFIG = {
  Tech:     { icon: <Code size={16} />,       color: '#2B88D8', bg: '#eaf3fb', description: 'Software, Web, & Apps' },
  Sports:   { icon: <Dribbble size={16} />,   color: '#EE272E', bg: '#fef2f2', description: 'Athletics & Fitness' },
  Arts:     { icon: <Palette size={16} />,    color: '#8b5cf6', bg: '#f5f3ff', description: 'Design & Visual Arts' },
  Business: { icon: <TrendingUp size={16} />, color: '#f59e0b', bg: '#fffbeb', description: 'Entrepreneurship' },
  Camps:    { icon: <Tent size={16} />,       color: '#10b981', bg: '#ecfdf5', description: 'Summer & Outdoor' },
  Music:    { icon: <Music size={16} />,      color: '#ec4899', bg: '#fdf2f8', description: 'Audio & Production' },
};

// ─── EXTENDED SUGGESTED RESOURCES ───────────────────────────────────────────
const SUGGESTED = {
  Tech: [
    { name: 'ScriptEd Coding in Schools', url: 'https://scripted.org', tag: 'Free · Bronx', time: 'After School' },
    { name: 'NYPL TechConnect', url: 'https://www.nypl.org', tag: 'Free · All Boroughs', time: 'Weekend' },
    { name: 'Access Code — C4Q', url: 'https://www.c4q.nyc', tag: 'Free · Queens', time: 'Evenings' },
    { name: 'Guerilla Girls Tech Intensive', url: '#', tag: 'Scholarship · Manhattan', time: 'Summer' },
    { name: 'The Knowledge House', url: 'https://theknowledgehouse.org', tag: 'Free · South Bronx', time: 'Year-round' }
  ],
  Sports: [
    { name: 'NYC Parks Youth Sports', url: 'https://www.nycgovparks.org', tag: 'Free · All Boroughs', time: 'Weekend' },
    { name: 'PAL Teen Centers', url: 'https://palnyc.org', tag: 'Free · Manhattan', time: 'After School' },
    { name: 'Rucker Park Basketball', url: '#', tag: 'Free · Harlem', time: 'Open Play' },
    { name: 'Ice Hockey in Harlem', url: '#', tag: 'Scholarship · Harlem', time: 'Seasonal' },
    { name: 'Row New York', url: 'https://rownewyork.org', tag: 'Free · Queens', time: 'Year-round' }
  ],
  Arts: [
    { name: 'Creative Arts Works', url: '#', tag: 'Paid Internship · Manhattan', time: 'Summer' },
    { name: 'Digital Media Lab', url: 'https://www.nypl.org', tag: 'Free · Staten Island', time: 'After School' },
    { name: 'Summer Rising Art Intensive', url: '#', tag: 'Free · Manhattan', time: 'Summer' },
    { name: 'Artistic Noise', url: 'https://artisticnoise.org', tag: 'Free · Harlem', time: 'After School' },
    { name: 'Reel Works Video', url: 'https://reelworks.org', tag: 'Free · Brooklyn', time: 'After School' }
  ],
  Business: [
    { name: 'SYEP — Summer Youth Employment', url: 'https://www.nyc.gov/site/dycd', tag: 'Paid · All Boroughs', time: 'Summer' },
    { name: 'Work, Learn & Grow', url: '#', tag: 'Paid · All Boroughs', time: 'Year-round' },
    { name: 'NYCEDC Youth Entrepreneur', url: '#', tag: 'Free · All Boroughs', time: 'Weekend' },
    { name: 'NFTE NY Metro', url: 'https://nfte.com', tag: 'Free · All Boroughs', time: 'School-based' }
  ],
  Camps: [
    { name: 'COMPASS After-School', url: 'https://www.nyc.gov/site/dycd', tag: 'Free · All Boroughs', time: 'After School' },
    { name: 'Beacon Community Centers', url: 'https://www.nyc.gov/site/dycd', tag: 'Free · All Boroughs', time: 'Year-round' },
    { name: 'Summer Rising', url: '#', tag: 'Free · All Boroughs', time: 'Summer' },
    { name: 'Camp Junior', url: 'https://freshair.org', tag: 'Free · Bronx Residents', time: 'Summer' }
  ],
  Music: [
    { name: 'Building Beats', url: '#', tag: 'Free · Brooklyn', time: 'After School' },
    { name: 'Willie Mae Rock Camp', url: 'https://williemaerockcamp.org', tag: 'Sliding Scale · Brooklyn', time: 'Summer' },
    { name: 'Education Through Music', url: 'https://etmonline.org', tag: 'Free · All Boroughs', time: 'In-school' },
    { name: 'VH1 Save The Music', url: '#', tag: 'Grants · All Boroughs', time: 'Resource' }
  ],
};

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [editData, setEditData] = useState({ firstName: '', path: '' });
  const [notifications, setNotifications] = useState(true);

  // ── Load User ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('kids_token');
    if (!token) { navigate('/login', { replace: true }); return; }

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
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
    localStorage.clear();
    navigate('/', { replace: true });
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    const token = localStorage.getItem('kids_token');
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setUser(prev => ({ ...prev, ...data }));
      setSaveStatus('saved');
      setEditing(false);
      setTimeout(() => setSaveStatus(''), 2500);
    } catch {
      setSaveStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-overlay">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <RefreshCw size={40} color="#2B88D8" />
        </motion.div>
        <p>Syncing your profile...</p>
      </div>
    );
  }

  const pathInfo = PATH_CONFIG[user?.path] || PATH_CONFIG.Tech;
  const suggested = SUGGESTED[user?.path] || SUGGESTED.Tech;
  const initials = user?.firstName?.slice(0, 2).toUpperCase() || 'KD';

  return (
    <div className="profile-wrapper">
      
      {/* ── PROFILE HERO ── */}
      <section className="profile-hero-section">
        <div className="profile-hero-container">
          <div className="avatar-stack">
            <motion.div 
              className="avatar-main"
              style={{ background: `linear-gradient(135deg, ${pathInfo.color}, #111)` }}
              whileHover={{ scale: 1.05 }}
            >
              {initials}
            </motion.div>
            <div className="avatar-decoration" style={{ borderColor: pathInfo.color }} />
          </div>

          <div className="profile-info-block">
            <div className="name-row">
              <h2>{user?.firstName}</h2>
              {saveStatus === 'saved' && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="save-pill">
                  <Check size={12} /> Updated
                </motion.span>
              )}
            </div>
            <div className="path-display" style={{ background: pathInfo.bg, color: pathInfo.color }}>
              {pathInfo.icon} {user?.path} Track
            </div>
            <span className="profile-sub">{user?.email}</span>
          </div>

          <div className="hero-action-group">
            <button className="hero-btn-alt" onClick={() => setEditing(!editing)}>
              <Edit3 size={15} /> <span>Edit</span>
            </button>
            <button className="hero-btn-logout" onClick={handleLogout}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </section>

      <div className="profile-content-grid">
        
        {/* ── SIDEBAR NAVIGATION ── */}
        <aside className="profile-sidebar">
          <nav className="profile-nav">
            {[
              { id: 'overview', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
              { id: 'resources', label: 'My Track', icon: <BookOpen size={18} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
            ].map(tab => (
              <button 
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
                {activeTab === tab.id && <motion.div layoutId="nav-glow" className="nav-glow" />}
              </button>
            ))}
          </nav>

          <div className="sidebar-ad">
            <Sparkles size={20} color={pathInfo.color} />
            <h4>KIDS Pro</h4>
            <p>Get priority access to paid summer internships.</p>
            <button style={{ background: pathInfo.color }}>Learn More</button>
          </div>
        </aside>

        {/* ── MAIN WORKSPACE ── */}
        <main className="profile-main">
          
          <AnimatePresence mode="wait">
            {editing && (
              <motion.div 
                className="edit-modal-overlay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <motion.div className="edit-modal-content" layoutId="edit-panel">
                  <div className="modal-header">
                    <h3>Profile Settings</h3>
                    <button onClick={() => setEditing(false)}><X size={20} /></button>
                  </div>
                  <div className="modal-body">
                    <div className="input-field">
                      <label>First Name</label>
                      <input 
                        value={editData.firstName} 
                        onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                      />
                    </div>
                    <div className="input-field">
                      <label>Active Track</label>
                      <div className="path-selector-grid">
                        {Object.keys(PATH_CONFIG).map(p => (
                          <button 
                            key={p}
                            className={`path-option ${editData.path === p ? 'selected' : ''}`}
                            onClick={() => setEditData({...editData, path: p})}
                          >
                            {PATH_CONFIG[p].icon} {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn-save-main" onClick={handleSave}>
                      {saveStatus === 'saving' ? <RefreshCw className="animate-spin" /> : 'Confirm Changes'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="welcome-banner" style={{ background: pathInfo.bg }}>
                  <div className="banner-text">
                    <Zap size={24} color={pathInfo.color} />
                    <h2>Good Morning, {user?.firstName}!</h2>
                    <p>You've completed <strong>3</strong> resource applications this week. Keep up the hustle.</p>
                  </div>
                </div>

                <div className="dashboard-stats">
                  <div className="stat-box">
                    <Clock size={20} />
                    <div className="stat-info">
                      <span className="stat-num">14h</span>
                      <span className="stat-label">Learning Time</span>
                    </div>
                  </div>
                  <div className="stat-box">
                    <Award size={20} />
                    <div className="stat-info">
                      <span className="stat-num">2</span>
                      <span className="stat-label">Certificates</span>
                    </div>
                  </div>
                  <div className="stat-box">
                    <Calendar size={20} />
                    <div className="stat-info">
                      <span className="stat-num">
                        {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <span className="stat-label">Member Since</span>
                    </div>
                  </div>
                </div>

                <h3 className="section-title">Jump Back In</h3>
                <div className="resource-quick-grid">
                  {suggested.slice(0, 3).map((res, i) => (
                    <motion.div key={i} className="resource-mini-card" whileHover={{ y: -5 }}>
                      <div className="mini-card-head" style={{ color: pathInfo.color }}>
                        {pathInfo.icon}
                        <span>{res.time}</span>
                      </div>
                      <h4>{res.name}</h4>
                      <div className="mini-card-footer">
                        <span className="mini-tag">{res.tag}</span>
                        <a href={res.url} target="_blank" rel="noreferrer"><ArrowUpRight size={16} /></a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="track-header">
                  <div className="track-title-group">
                    {pathInfo.icon}
                    <h3>Your {user?.path} Catalog</h3>
                  </div>
                  <button className="filter-btn">Filters <ChevronRight size={14} /></button>
                </div>

                <div className="resource-detailed-list">
                  {suggested.map((res, i) => (
                    <motion.div 
                      key={i} 
                      className="detailed-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="item-main">
                        <div className="item-icon-box" style={{ background: pathInfo.bg, color: pathInfo.color }}>
                          {pathInfo.icon}
                        </div>
                        <div className="item-text">
                          <h4>{res.name}</h4>
                          <p><MapPin size={12} /> {res.tag} • {res.time}</p>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button className="btn-save-res"><Heart size={16} /></button>
                        <a href={res.url} target="_blank" rel="noreferrer" className="btn-visit">
                          Apply <ExternalLink size={14} />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" className="settings-pane">
                <div className="settings-group">
                  <h3>Preferences</h3>
                  <div className="settings-item">
                    <div className="item-info">
                      <Bell size={18} />
                      <div>
                        <strong>Push Notifications</strong>
                        <p>Get alerted for new SYEP deadlines.</p>
                      </div>
                    </div>
                    <div 
                      className={`toggle ${notifications ? 'on' : ''}`} 
                      onClick={() => setNotifications(!notifications)}
                    >
                      <div className="toggle-knob" />
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <h3>Safety & Support</h3>
                  <div className="settings-link-list">
                    <button className="link-item"><ShieldCheck size={18} /> Privacy Center</button>
                    <button className="link-item"><Info size={18} /> Help & FAQ</button>
                    <button className="link-item"><Share2 size={18} /> Refer a Friend</button>
                  </div>
                </div>

                <div className="danger-zone-compact">
                  <button onClick={handleLogout} className="btn-logout-final">
                    <LogOut size={16} /> Sign Out of All Devices
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
};

export default UserProfile;