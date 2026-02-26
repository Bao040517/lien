import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const { register, user } = useAuth();
    const navigate = useNavigate();

    // Nếu đã đăng nhập rồi, redirect về trang chủ
    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const validate = () => {
        const errors = {};
        if (!username.trim()) {
            errors.username = 'Vui lòng nhập tên đăng nhập';
        }
        if (!email.trim()) {
            errors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email không hợp lệ';
        }
        if (!password) {
            errors.password = 'Vui lòng nhập mật khẩu';
        } else if (password.length < 8) {
            errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        const result = await register(username.trim(), email.trim(), password.trim());
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng Ký</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Tên đăng nhập</label>
                    <input
                        type="text"
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark ${fieldErrors.username ? 'border-red-400' : ''}`}
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setFieldErrors(prev => ({ ...prev, username: '' })); }}
                        required
                    />
                    {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark ${fieldErrors.email ? 'border-red-400' : ''}`}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }}
                        required
                    />
                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Mật khẩu</label>
                    <input
                        type="password"
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-dark ${fieldErrors.password ? 'border-red-400' : ''}`}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })); }}
                        required
                    />
                    {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                    <p className="text-gray-400 text-xs mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary-dark text-white py-2 rounded hover:bg-primary-darker transition"
                >
                    Đăng Ký
                </button>
            </form>
            <div className="mt-4 text-center">
                <span className="text-gray-600">Đã có tài khoản? </span>
                <Link to="/login" className="text-primary-dark hover:underline">Đăng nhập</Link>
            </div>
        </div>
    );
};

export default Register;
