import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import './styles/global.css';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-500 p-4 text-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Fitness Tracker
          </Link>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/" className="hover:text-blue-200">
                Home
              </Link>
            </li>
            {user ? (
              <>
               <li>
                    <button onClick={handleLogout} className="hover:text-blue-200">
                        Logout
                    </button>
                  </li>
                 
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-200">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="container mx-auto flex-1 p-4">
        {children}
      </main>
      <footer className="bg-gray-700 text-white text-center p-4">
        <p>&copy; {new Date().getFullYear()} Fitness Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;