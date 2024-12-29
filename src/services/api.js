import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = Bearer ${token};
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
     const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if(!refreshToken) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('refreshToken');
                   window.location.href = '/login';
                   return Promise.reject(error);
                }
                const refreshResponse = await axios.post(${API_BASE_URL}/auth/refresh, { refreshToken });
                if (refreshResponse.status === 200) {
                  const { token, refreshToken: newRefreshToken } = refreshResponse.data;
                  localStorage.setItem('token', token);
                   localStorage.setItem('refreshToken', newRefreshToken);
                  api.defaults.headers.common['Authorization'] = Bearer ${token};
                  originalRequest.headers['Authorization'] = Bearer ${token};
                  return api(originalRequest);
                }else{
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } catch (refreshError) {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }


    return Promise.reject(error);
  }
);


const handleResponse = (response) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
};


const handleError = (error) => {
  console.error('API Error:', error);
  if(error.response && error.response.data && error.response.data.message) {
     throw new Error(error.response.data.message);
  }
  throw new Error(error.message || 'An unexpected error occurred');
};


const authApi = {
    register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData);
          return handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return handleResponse(response);
    } catch (error) {
        handleError(error);
    }
  },
   logout: async () => {
        try {
             localStorage.removeItem('token');
             localStorage.removeItem('refreshToken');
             window.location.href = '/login';
        } catch (error) {
           handleError(error)
        }
    },
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      return handleResponse(response);
    } catch (error) {
        handleError(error)
    }
  },
};


const goalApi = {
   createGoal: async (goalData) => {
      try {
         const response = await api.post('/goals', goalData);
         return handleResponse(response);
      } catch (error) {
         handleError(error)
      }
   },
   getGoals: async () => {
      try {
         const response = await api.get('/goals');
          return handleResponse(response);
      } catch (error) {
         handleError(error)
      }
   },
   updateGoal: async (id, goalData) => {
      try {
        const response = await api.put(/goals/${id}, goalData);
        return handleResponse(response);
      } catch (error) {
        handleError(error)
      }
   },
  deleteGoal: async (id) => {
    try {
      const response = await api.delete(/goals/${id});
        return handleResponse(response);
    } catch (error) {
       handleError(error)
    }
  },
};

const progressApi = {
  createProgress: async (progressData) => {
        try {
          const response = await api.post('/progress', progressData);
          return handleResponse(response);
        } catch (error) {
           handleError(error)
        }
   },
    getProgress: async (goalId) => {
      try {
        const response = await api.get(/progress/${goalId});
          return handleResponse(response);
      } catch (error) {
          handleError(error)
      }
    },
  updateProgress: async (id, progressData) => {
      try {
        const response = await api.put(/progress/${id}, progressData);
        return handleResponse(response)
      } catch (error) {
         handleError(error)
      }
  },
  deleteProgress: async (id) => {
     try {
       const response = await api.delete(/progress/${id});
         return handleResponse(response);
     } catch (error) {
        handleError(error)
     }
  },
};


const apiService = {
  auth: authApi,
  goals: goalApi,
  progress: progressApi
};

export default apiService;