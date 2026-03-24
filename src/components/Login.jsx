import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Redirect back to where they came from, or profile
  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password)
      return setError('Please fill in all fields.');

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email:    formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Save token
      localStorage.setItem('kids_token', data.token);

      // Redirect
      navigate(from, { replace: true });

    } catch (err) {
      setError(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        layout
      >
        <div className="auth-header-top">
          <motion.div
            className="auth-icon-modern"
            whileHover={{ rotate: 15, scale: 1.1 }}
          >
            <LogIn size={24} />
          </motion.div>
        </div>

        <h2>Welcome Back</h2>
        <p className="auth-subtitle">
          Sign in to continue to{' '}
          <span className="logo-text-inline">
            <span className="red">K</span>
            <span className="blue">I</span>
            <span className="yellow">D</span>
            <span className="blue">S</span>
          </span>
        </p>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="auth-error-banner"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertCircle size={15} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="modern-input-wrapper">
            <input
              className="modern-input"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="modern-input-wrapper">
            <input
              className="modern-input"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="input-eye"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="forgot-container">
  <span 
    className="forgot-password-link" 
    onClick={() => navigate('/forgot-password')}
  >
    Forgot Password?
  </span>
</div>

          <motion.button
            type="submit"
            className="btn-main-action"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="btn-spinner" /> Signing in…
              </span>
            ) : (
              <><ShieldCheck size={18} /> Login</>
            )}
          </motion.button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <span className="link-highlight" onClick={() => navigate('/signup')}>
            Sign Up →
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;