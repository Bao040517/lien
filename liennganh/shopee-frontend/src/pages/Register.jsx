import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, user } = useAuth();
    const navigate = useNavigate();

    // Nếu đã đăng nhập rồi, redirect về trang chủ
    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(username.trim(), email.trim(), password.trim());
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                >
                    Register
                </button>
            </form>
            <div className="mt-4 text-center">
                <span className="text-gray-600">Already have an account? </span>
                <Link to="/login" className="text-orange-500 hover:underline">Login</Link>
            </div>
        </div>
    );
};

export default Register;
