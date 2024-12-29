import axios from 'axios';
import { useAuth } from '../src/hooks/useAuth';
import { useFetch } from '../src/hooks/useFetch';
import { renderHook, act } from '@testing-library/react';
import { AuthContext } from '../src/context/AuthContext';
import { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';


// Mock axios for API requests
jest.mock('axios');

describe('useAuth Hook', () => {
    const mockUser = { id: '123', username: 'testuser', token: 'testtoken' };

    beforeEach(() => {
        localStorage.clear();
      axios.post.mockClear()
      axios.get.mockClear();
    });

    it('should initialize with null user and false isAuthenticated', () => {
          const wrapper = ({ children }) => (
            <Router>
                <AuthContext.Provider value={{ user: null, isAuthenticated: false, login: jest.fn(), logout: jest.fn() }}>
                  {children}
                </AuthContext.Provider>
              </Router>
          );
        const { result } = renderHook(() => useAuth(), {wrapper});
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });
    
   it('should log in a user and set isAuthenticated to true', async () => {
      axios.post.mockResolvedValue({ data: { ...mockUser } });
      const wrapper = ({ children }) => (
        <Router>
            <AuthContext.Provider value={{ user: null, isAuthenticated: false, login: jest.fn(), logout: jest.fn() }}>
              {children}
            </AuthContext.Provider>
          </Router>
      );
    const { result } = renderHook(() => useAuth(), {wrapper});

    await act(async () => {
      await result.current.login('testuser', 'testpassword');
    });


      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
        username: 'testuser',
        password: 'testpassword',
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));

    });
    

    it('should handle login error', async () => {
      axios.post.mockRejectedValue(new Error('Login failed'));

      const wrapper = ({ children }) => (
          <Router>
            <AuthContext.Provider value={{ user: null, isAuthenticated: false, login: jest.fn(), logout: jest.fn() }}>
              {children}
            </AuthContext.Provider>
          </Router>
        );
      const { result } = renderHook(() => useAuth(), {wrapper});

      await act(async () => {
         await expect(result.current.login('testuser', 'wrongpassword')).rejects.toThrow('Login failed');
      });

     expect(axios.post).toHaveBeenCalledTimes(1);
     expect(result.current.user).toBeNull();
     expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem('user')).toBeNull()
    });
     
  it('should log out a user and set isAuthenticated to false', async () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    const wrapper = ({ children }) => (
      <Router>
          <AuthContext.Provider value={{ user: mockUser, isAuthenticated: true, login: jest.fn(), logout: jest.fn() }}>
            {children}
          </AuthContext.Provider>
        </Router>
    );
    const { result } = renderHook(() => useAuth(), {wrapper});

      act(() => {
        result.current.logout();
      });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('user')).toBeNull();
  });
});



describe('useFetch Hook', () => {
   
    beforeEach(() => {
      axios.get.mockClear();
    });

    it('should fetch data successfully', async () => {
    const mockData = [{ id: 1, name: 'Test Goal' }];
    axios.get.mockResolvedValue({ data: mockData });
    const { result } = renderHook(() => useFetch('/api/goals'));

     await act(async () => {
       await result.current.fetchData();
     });
      
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/goals');
      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
    
  it('should handle fetch error', async () => {
    axios.get.mockRejectedValue(new Error('Fetch failed'));
    const { result } = renderHook(() => useFetch('/api/goals'));


      await act(async () => {
        await result.current.fetchData();
      });

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
       expect(result.current.error).toEqual('Fetch failed');
    });

      it('should set loading state while fetching', async () => {
        const mockData = [{ id: 1, name: 'Test Goal' }];
        axios.get.mockResolvedValue({ data: mockData });
        const { result } = renderHook(() => useFetch('/api/goals'));
  
      
         act(() => {
           result.current.fetchData();
         });
         
         expect(result.current.loading).toBe(true);
  
          await act(async () => {
              await result.current.fetchData();
           });

         expect(result.current.loading).toBe(false);
       
    });
});