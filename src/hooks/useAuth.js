import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const { setUser, user, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 > Date.now()) {
            setUser(decodedToken.user);
            setToken(token);
              api.defaults.headers.common['Authorization'] = Bearer ${token};
            } else {
            localStorage.removeItem('token');
              setUser(null);
              setToken(null);
            delete api.defaults.headers.common['Authorization'];
            }
        } else{
          setUser(null);
          setToken(null)
          delete api.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('token');
        setUser(null);
          setToken(null);
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [setUser, setToken]);


  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
        setToken(token);
      const decodedToken = jwtDecode(token);
        setUser(decodedToken.user);
        api.defaults.headers.common['Authorization'] = Bearer ${token};
      navigate('/pages', { replace: true });
    } catch (error) {
        console.error('Login failed:', error);
      localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
        const { token } = response.data;
      localStorage.setItem('token', token);
        setToken(token);
        const decodedToken = jwtDecode(token);
      setUser(decodedToken.user);
       api.defaults.headers.common['Authorization'] = Bearer ${token};
        navigate('/pages', { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);
      localStorage.removeItem('token');
      setUser(null);
        setToken(null);
      delete api.defaults.headers.common['Authorization'];
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/', { replace: true });
  };


  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};

export default useAuth;