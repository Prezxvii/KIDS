import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AuthContext = createContext(null);

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('kids_token'));
  const [loading, setLoading] = useState(true); // checking stored session
  const [error, setError]     = useState(null);

  // ── Verify stored token on mount ──────────────────────────────────────────
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Token invalid');
        const data = await res.json();
        setUser(data);
      } catch {
        // Token expired or invalid — clear it
        localStorage.removeItem('kids_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async ({ firstName, email, password, path }) => {
    setError(null);
    const res = await fetch(`${API}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, password, path }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    // Backend returns token on signup
    localStorage.setItem('kids_token', data.token);
    setToken(data.token);
    setUser({
      _id:       data._id,
      firstName: data.firstName,
      email:     data.email,
      path:      data.path,
    });
    return data;
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('kids_token', data.token);
    setToken(data.token);
    setUser({
      _id:       data._id,
      firstName: data.firstName,
      email:     data.email,
      path:      data.path,
    });
    return data;
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('kids_token');
    setToken(null);
    setUser(null);
  }, []);

  // ── Update profile ────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    const res = await fetch(`${API}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed');
    setUser(prev => ({ ...prev, ...data }));
    return data;
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;