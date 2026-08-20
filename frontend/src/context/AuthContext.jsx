import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session in local storage (mock implementation)
    const storedUser = localStorage.getItem('dsdl_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock authentication logic
        if (email === 'admin@dsdl.com') {
          const adminUser = { id: 1, role: 'admin', name: 'Admin User', email };
          setUser(adminUser);
          localStorage.setItem('dsdl_user', JSON.stringify(adminUser));
          resolve(adminUser);
        } else if (email === 'member@dsdl.com') {
          const memberUser = { id: 2, role: 'member', name: 'Member User', email };
          setUser(memberUser);
          localStorage.setItem('dsdl_user', JSON.stringify(memberUser));
          resolve(memberUser);
        } else if (email === 'lead@dsdl.com') {
          const leadUser = { id: 3, role: 'lead', name: 'Domain Lead', email };
          setUser(leadUser);
          localStorage.setItem('dsdl_user', JSON.stringify(leadUser));
          resolve(leadUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dsdl_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
