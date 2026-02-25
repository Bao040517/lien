import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Nếu đã đăng nhập rồi, redirect về trang phù hợp
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/';
            if (user.role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else if (user.role === 'SELLER') {
                navigate('/seller', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        }
    }, [user, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(username.trim(), password.trim());
        if (result.success) {
            // Lấy đường dẫn mà user muốn truy cập trước khi đăng nhập
            const from = location.state?.from?.pathname || '/';
            const role = result.user?.role;
            
            if (role === 'ADMIN') {
                navigate('/admin');
            } else if (role === 'SELLER') {
                navigate('/seller');
            } else {
                // Nếu là USER và có trang redirect, quay về trang đó
                navigate(from);
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary-dark text-white py-2 rounded hover:bg-primary-darker transition"
                >
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/register" className="text-primary-dark hover:underline">Register</Link>
            </div>
        </div>
    );
};

export default Login;
