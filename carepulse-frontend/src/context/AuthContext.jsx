import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

// Exactly matching com.carepulse.enums.Role
export const ROLES = {
  TRIAGE: 'ROLE_TRIAGE',
  ICU_MANAGER: 'ICU_MANAGER',
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS = {
  [ROLES.TRIAGE]: 'Triage Nurse',
  [ROLES.ICU_MANAGER]: 'ICU Manager',
  [ROLES.ADMIN]: 'Administrator',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Backend expects username and password
      const response = await api.post('/auth/authenticate', { username, password });
      
      // Handles either "jwt" or "token" based on your JwtResponse DTO
      const token = response.data.jwt || response.data.token || response.data.accessToken;
      const userData = response.data.user || response.data;

      // Normalize role name (strips extra "ROLE_" prefix if present to match ROLES enum)
      let resolvedRole = userData.role || (userData.roles ? userData.roles[0] : null);
      if (resolvedRole === 'ROLE_ADMIN') resolvedRole = ROLES.ADMIN;
      if (resolvedRole === 'ROLE_ICU_MANAGER') resolvedRole = ROLES.ICU_MANAGER;

      const userProfile = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        name: userData.fullName || userData.name || userData.username,
        role: resolvedRole || ROLES.TRIAGE,
      };

      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user', JSON.stringify(userProfile));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userProfile);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Invalid username or password.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles) => roles.includes(user?.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasRole,
        hasAnyRole,
        ROLES,
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