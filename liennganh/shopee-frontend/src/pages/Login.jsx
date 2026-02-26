import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, ShoppingBag, AtSign } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname || '/';
            if (user.role === 'ADMIN') navigate('/admin', { replace: true });
            else if (user.role === 'SELLER') navigate('/seller', { replace: true });
            else navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(username.trim(), password.trim());
        if (result.success) {
            const from = location.state?.from?.pathname || '/';
            const role = result.user?.role;
            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'SELLER') navigate('/seller');
            else navigate(from);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-orange-50 via-white to-orange-50">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">

                {/* Left Side - Branding */}
                <div className="hidden lg:block relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-orange-700" />
                    <div className="relative h-full flex flex-col justify-center p-12 text-white">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Nikki Shop</span>
                        </div>
                        <h2 className="text-4xl font-black mb-6 leading-tight">
                            Chào mừng bạn<br />quay trở lại.
                        </h2>
                        <p className="text-lg text-white/80 mb-10 leading-relaxed">
                            Truy cập bảng điều khiển cá nhân và tiếp tục hành trình mua sắm của bạn.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[...'NLT'].map((c, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-white/20 flex items-center justify-center text-sm font-bold backdrop-blur-sm">
                                        {c}
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-white/90">10,000+ người dùng tin tưởng</span>
                        </div>
                    </div>
                    {/* Decorative */}
                    <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -top-16 -left-16 w-48 h-48 bg-black/10 rounded-full blur-3xl" />
                </div>

                {/* Right Side - Login Form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 lg:hidden mb-6">
                            <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center text-white">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-lg text-gray-800">Nikki Shop</span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Đăng nhập</h1>
                        <p className="text-gray-500">Nhập thông tin tài khoản để tiếp tục.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                            <span className="text-red-400">⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Tên đăng nhập hoặc Email</label>
                            <div className="relative group">
                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-dark transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 h-14 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                                <a href="#" className="text-sm font-semibold text-primary-dark hover:underline">Quên mật khẩu?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-dark transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 h-14 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center">
                            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary-dark focus:ring-primary-dark" />
                            <label className="ml-2 text-sm font-medium text-gray-600 cursor-pointer">Ghi nhớ đăng nhập</label>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="w-full h-14 bg-primary-dark hover:bg-primary-darker text-white font-bold rounded-xl shadow-lg shadow-primary-dark/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 group">
                            {loading ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang xử lý...</>
                            ) : (
                                <>Đăng Nhập <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8">
                        <div className="relative flex items-center mb-8">
                            <div className="flex-grow border-t border-gray-200" />
                            <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Hoặc</span>
                            <div className="flex-grow border-t border-gray-200" />
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm text-gray-700">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                Google
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm text-gray-700">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                                GitHub
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-gray-600">
                            Chưa có tài khoản? <Link to="/register" className="text-primary-dark font-bold hover:underline">Tạo tài khoản</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
