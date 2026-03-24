import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  UserPlus, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  User, 
  Target, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const PATHS = ['Sports', 'Tech', 'Arts', 'Business', 'Camps', 'Music'];

const stepVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0, filter: 'blur(4px)' }),
  center: { x: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.3, ease: 'easeOut' } },
  exit:   (dir) => ({ x: dir < 0 ? 50 : -50, opacity: 0, filter: 'blur(4px)', transition: { duration: 0.2, ease: 'easeIn' } }),
};

const PasswordStrength = ({ password }) => {
  const score = [
    password.length >= 6,
    password.length >= 10,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="strength-bar"
            style={{ background: i <= score ? colors[score] : '#e2e8f0' }} />
        ))}
      </div>
      <span className="strength-label" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    path: '',
    password: '',
    agreed: false,
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const goNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.firstName.trim()) return setError('Please enter your first name.');
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return setError('Please enter a valid email.');
    }
    if (step === 2 && !formData.path) return setError('Please pick a path to continue.');
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setError('');
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password || formData.password.length < 6) return setError('Password must be 6+ chars.');
    if (!formData.agreed) return setError('Please agree to terms.');

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          path: formData.path,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('kids_token', data.token);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err.message || 'Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const titles = ['Start Your Journey', 'Pick Your Path', 'Secure Your Account'];
  const subtitles = ['Tell us about yourself', 'What are you curious about?', 'Almost there — you got this'];

  return (
    <div className="auth-page">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} layout>
        <div className="progress-container">
          <motion.div className="progress-bar" animate={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <button className="back-home-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="auth-header-top">
          <motion.div className="auth-icon-modern" key={step} animate={{ scale: [0.8, 1], rotate: [direction === 1 ? 10 : -10, 0] }}>
            <UserPlus size={22} />
          </motion.div>
        </div>

        <div className="step-dots">
          {[1,2,3].map(i => (
            <div key={i} className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              {i < step && <CheckCircle2 size={12} strokeWidth={3} />}
            </div>
          ))}
        </div>

        <motion.h2 layout>{titles[step - 1]}</motion.h2>
        <p className="auth-subtitle">{subtitles[step - 1]}</p>

        <AnimatePresence>
          {error && (
            <motion.div className="auth-error-banner" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <AlertCircle size={15} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="form-step-container">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="step-content-wrapper">
              
              {step === 1 && (
                <div className="step-inner">
                  <div className="modern-input-wrapper">
                    <input className="modern-input" type="text" placeholder="First Name" value={formData.firstName} onChange={(e) => update('firstName', e.target.value)} />
                  </div>
                  <div className="modern-input-wrapper">
                    <input className="modern-input" type="email" placeholder="Email Address" value={formData.email} onChange={(e) => update('email', e.target.value)} />
                  </div>
                  <button type="button" className="btn-main-action" onClick={goNext}>
                    Continue <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="step-inner">
                  <div className="path-grid">
                    {PATHS.map(item => (
                      <button key={item} type="button" className={`path-chip ${formData.path === item ? 'active' : ''}`} onClick={() => update('path', item)}>
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="dual-btns">
                    <button type="button" className="btn-secondary" onClick={goBack}>Back</button>
                    <button type="button" className="btn-main-action" onClick={goNext}>Next <ChevronRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit} className="step-inner">
                  <div className="signup-summary">
                    <div className="summary-item"><User size={14} className="blue-icon" /> {formData.firstName}</div>
                    <span className="summary-dot">·</span>
                    <div className="summary-item"><Target size={14} className="red-icon" /> {formData.path}</div>
                  </div>
                  <div className="modern-input-wrapper">
                    <input className="modern-input" type={showPass ? 'text' : 'password'} placeholder="Create Password" value={formData.password} onChange={(e) => update('password', e.target.value)} />
                    <button type="button" className="input-eye" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <PasswordStrength password={formData.password} />
                  <div className="terms-container">
                    <input type="checkbox" id="terms" checked={formData.agreed} onChange={(e) => update('agreed', e.target.checked)} />
                    <label htmlFor="terms">I agree to the <span className="dark-bold">Terms & Privacy</span></label>
                  </div>
                  <div className="dual-btns">
                    <button type="button" className="btn-secondary" onClick={goBack}>Back</button>
                    <button type="submit" className="btn-main-action" disabled={loading}>
                      {loading ? <span className="btn-spinner" /> : <><ShieldCheck size={18} /> Finish</>}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="auth-footer-text">Already have an account? <span className="link-highlight" onClick={() => navigate('/login')}>Login</span></p>
      </motion.div>
    </div>
  );
};

export default SignUp;