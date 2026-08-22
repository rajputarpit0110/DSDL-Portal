import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await apiClient.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await apiClient.post('/auth/login', { email, password });
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const data = await apiClient.post('/auth/register', userData);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
