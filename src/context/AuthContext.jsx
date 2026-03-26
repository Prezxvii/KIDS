import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// Create the Context object
const AuthContext = createContext(null);

// Pull the API URL from environment variables (Render/Vercel)
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * AuthProvider wraps your entire App (usually in index.js or App.js)
 * to provide authentication state to all components.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('kids_token'));
  const [loading, setLoading] = useState(true); 
  const [error, setError]     = useState(null);

  // ── 1. Verify Session on Startup ──────────────────────────────────────────
  useEffect(() => {
    const verify = async () => {
      // If no token exists in localStorage, we aren't logged in
      if (!token) { 
        setLoading(false); 
        return; 
      }

      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Session expired');

        const data = await res.json();
        setUser(data); // Populate global user state
      } catch (err) {
        // If the token is fake or expired, clean up
        localStorage.removeItem('kids_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  // ── 2. Register Action ──────────────────────────────────────────────────────
  const register = useCallback(async ({ firstName, email, password, path }) => {
    setError(null);
    const res = await fetch(`${API}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, password, path }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    // Save token and user info globally
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

  // ── 3. Login Action ─────────────────────────────────────────────────────────
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

  // ── 4. Logout Action ────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('kids_token');
    setToken(null);
    setUser(null);
  }, []);

  // ── 5. Update Profile Action ────────────────────────────────────────────────
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

    // Update the local user state so the Navbar/Profile update instantly
    setUser(prev => ({ ...prev, ...data }));
    return data;
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom Hook for easy access ──────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;