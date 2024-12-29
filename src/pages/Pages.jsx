import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForms from '../components/AuthForms';
import Goal from '../components/Goal';
import { AuthContext } from '../context/AuthContext';
import Layout from '../Layout';

const Pages = () => {
  const { user } = useContext(AuthContext);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" /> : <Layout><AuthForms type="login" /></Layout>} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Layout><AuthForms type="register" /></Layout>} />
                 <Route path="/" element={user ? <Layout><Goal /></Layout> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default Pages;