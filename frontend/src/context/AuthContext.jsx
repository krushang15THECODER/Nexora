import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/user/profile', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      await fetchProfile();
      return { success: true };
    }
    return { success: false, error: data.message || 'Login failed' };
  };

  const signup = async (name, email, password) => {
    const res = await fetch('/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      await fetchProfile();
      return { success: true };
    }
    return { success: false, error: data.message || 'Signup failed' };
  };

  const logout = async () => {
    try {
      await fetch('/user/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setUser(null);
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await fetch('/user/delete', { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setUser(null);
        return { success: true };
      }
      return { success: false, error: 'Failed to delete account' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
