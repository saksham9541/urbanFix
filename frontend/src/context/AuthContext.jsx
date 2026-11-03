import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getCurrentUserApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('urbanfix_token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('urbanfix_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Sync token to localStorage and fetch user profile if token exists but no user
  useEffect(() => {
    if (token) {
      localStorage.setItem('urbanfix_token', token);
      if (!user) {
        getCurrentUserApi()
          .then((data) => {
            setUser(data);
            localStorage.setItem('urbanfix_user', JSON.stringify(data));
          })
          .catch(() => {
            logout();
          });
      }
    } else {
      localStorage.removeItem('urbanfix_token');
      localStorage.removeItem('urbanfix_user');
    }
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const data = await loginApi(usernameOrEmail, password);
      setToken(data.token);
      const userData = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles,
      };
      setUser(userData);
      localStorage.setItem('urbanfix_token', data.token);
      localStorage.setItem('urbanfix_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await registerApi(userData);
      setToken(data.token);
      const newUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles,
      };
      setUser(newUser);
      localStorage.setItem('urbanfix_token', data.token);
      localStorage.setItem('urbanfix_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('urbanfix_token');
    localStorage.removeItem('urbanfix_user');
  };

  const roles = user?.roles || [];
  const isCitizen = roles.includes('ROLE_CITIZEN') || roles.includes('ROLE_ADMIN');
  const isOfficer = roles.includes('ROLE_OFFICER') || roles.includes('ROLE_ADMIN');
  const isAdmin = roles.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        roles,
        isCitizen,
        isOfficer,
        isAdmin,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

