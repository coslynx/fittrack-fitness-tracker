import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => Promise.resolve(),
  logout: () => {},
  isLoggedIn: false,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsLoggedIn(false);
          console.warn('Token expired, user logged out.');
          return;
        }
          setUser(decodedToken);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error decoding or verifying token:', error);
         localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsLoggedIn(false);
      }
    } else {
        setUser(null);
        setIsLoggedIn(false);
    }
  }, [token]);

  const login = useCallback(async (newToken) => {
    if (!newToken) {
        console.error('No token provided');
        return;
    }
     try {
          const decodedToken = jwtDecode(newToken);
          if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(decodedToken);
            setIsLoggedIn(true);
            console.log('User logged in successfully.');
          } else {
              console.error('Invalid or expired token provided')
              localStorage.removeItem('token');
              setToken(null);
              setUser(null);
              setIsLoggedIn(false);
          }

        } catch (error) {
            console.error('Error during login, invalid token:', error);
              localStorage.removeItem('token');
              setToken(null);
              setUser(null);
              setIsLoggedIn(false);
        }
  }, []);

    const logout = useCallback(() => {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsLoggedIn(false);
        console.log('User logged out successfully.');
  }, []);

    useEffect(() => {
        console.log('Auth Context State:', { user, token, isLoggedIn });
    }, [user, token, isLoggedIn]);
    

  const contextValue = {
    user,
    token,
      login,
    logout,
    isLoggedIn
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };