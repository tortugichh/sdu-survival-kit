import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize tokens from localStorage
  const initialAuthTokens = localStorage.getItem('authTokens')
    ? JSON.parse(localStorage.getItem('authTokens'))
    : null;

  const initialUser = initialAuthTokens
    ? jwt_decode(initialAuthTokens.access)
    : null;

  const [authTokens, setAuthTokens] = useState(initialAuthTokens);
  const [user, setUser] = useState(initialUser);

  // Function to update the token
  const updateToken = async () => {
    if (!authTokens?.refresh) {
      logoutUser();
      return;
    }

    try {
      const response = await fetch('https://api.sdu-survival-kit.site/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
      } else {
        console.error('Не удалось обновить токен.');
        logoutUser();
      }
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      logoutUser();
    }
  };

  // Set up interval for refreshing the token every 4 minutes
  useEffect(() => {
    if (authTokens) {
      const interval = setInterval(() => {
        updateToken();
      }, 1000 * 60 * 4); // Refresh token every 4 minutes
      return () => clearInterval(interval);
    }
  }, [authTokens]);

  // Function to log in the user
  const loginUser = async (e) => {
    e.preventDefault();
    const credentials = new FormData(e.currentTarget);

    try {
      const response = await fetch(`https://api.sdu-survival-kit.site/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.get('username'),
          password: credentials.get('password'),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        navigate('/');
      } else {
        const errorText = await response.text();
        console.error('Ошибка при входе пользователя:', errorText);
        alert('Что-то пошло не так!');
      }
    } catch (error) {
      console.error('Ошибка при входе пользователя:', error);
      alert('Что-то пошло не так!');
    }
  };

  // Function to register the user
  const registerUser = async (e) => {
    e.preventDefault();
    const credentials = new FormData(e.currentTarget);

    try {
      const response = await fetch('https://api.sdu-survival-kit.site/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.get('username'),
          email: credentials.get('email'),
          password: credentials.get('password'),
          password2: credentials.get('password2'),
        }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        console.error('Ошибка при регистрации пользователя:', data);
        return { errors: Object.values(data).flat() };
      }
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
    }
  };

  // Function to log out the user
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/');
  };

  // Helper function to get headers with token for authorized requests
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokens?.access}`,
    };
  };

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    registerUser,
    updateToken,
    getAuthHeaders, // Add getAuthHeaders to context
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export default AuthContext;
