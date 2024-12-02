import React, { createContext, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const initialAuthTokens = localStorage.getItem('authTokens')
    ? JSON.parse(localStorage.getItem('authTokens'))
    : null;

  const initialUser = initialAuthTokens
    ? jwt_decode(initialAuthTokens.access)
    : null;

  const [authTokens, setAuthTokens] = useState(initialAuthTokens);
  const [user, setUser] = useState(initialUser);

  // Handle user login
  const loginUser = async (e) => {
    e.preventDefault();
    const credentials = new FormData(e.currentTarget);

    const response = await fetch(`/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.get('username'),
        password: credentials.get('password'),
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      navigate('/');
    } else {
      alert('Something went wrong!');
    }
  };

  // Handle user registration
  const registerUser = async (e) => {
    e.preventDefault();
    const credentials = new FormData(e.currentTarget);

    const response = await fetch('/api/register/', {
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

    const data = await response.json();

    if (response.status === 201) {
      navigate('/login');
    } else {
      return { errors: Object.values(data).flat() };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/');
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export default AuthContext;
