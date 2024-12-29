import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { Common } from './Common';

const AuthForms = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Username and password are required.');
            return;
        }
        try {
            const authEndpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await api.post(authEndpoint, { username, password });

            if (response.status === 200 || response.status === 201) {
                const { token } = response.data;
                login(token);
                navigate('/dashboard');
                console.log(${isLogin ? 'Login' : 'Registration'} successful);
            } else {
                setError(response.data.message || 'Authentication failed');
                console.error(${isLogin ? 'Login' : 'Registration'} failed with status: ${response.status}, response.data);
            }
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'An unexpected error occurred';
            setError(message);
            console.error(${isLogin ? 'Login' : 'Registration'} error:, err);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Common.Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Common.Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Common.Button type="submit" className="w-full">
                            {isLogin ? 'Login' : 'Register'}
                        </Common.Button>
                    </div>
                </form>
                <div className="mt-4 text-center">
                    <button type="button" className="text-blue-500 hover:underline" onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setUsername('');
                        setPassword('');
                    }}>
                        {isLogin
                            ? 'Need an account? Register'
                            : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthForms;