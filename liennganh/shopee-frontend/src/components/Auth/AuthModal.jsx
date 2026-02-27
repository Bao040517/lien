import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, User, Lock, Mail, Store, ArrowRight, Eye, EyeOff, CheckCircle2, Github, Chrome } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (isAuthModalOpen) {
            setError('');
            setFieldErrors({});
            setUsername('');
            setEmail('');
            setPassword('');
        }
    }, [isAuthModalOpen, authModalMode]);

    if (!isAuthModalOpen) return null;

    const validate = () => {
        const errors = {};
        if (!username.trim()) errors.username = 'Vui lòng nhập tên đăng nhập';
        if (authModalMode === 'register') {
            if (!email.trim()) errors.email = 'Vui lòng nhập email';
            else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email không hợp lệ';
        }
        if (!password) errors.password = 'Vui lòng nhập mật khẩu';
        else if (password.length < 8) errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        setLoading(true);
        try {
            if (authModalMode === 'login') {
                const result = await login(username.trim(), password.trim());
                if (result.success) {
                    toast.success('Chào mừng bạn quay trở lại!');
                    closeAuthModal();
                    const role = result.user?.role;
                    if (role === 'ADMIN') navigate('/admin');
                    else if (role === 'SELLER') navigate('/seller');
                } else {
                    setError(result.message);
                }
            } else {
                const result = await register(username.trim(), email.trim(), password.trim());
                if (result.success) {
                    toast.success('Đăng ký thành công! Hãy đăng nhập nhé.');
                    setAuthModalMode('login');
                } else {
                    setError(result.message);
                }
            }
        } catch (err) {
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-modal-fade">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row min-h-[550px] animate-modal-scale">

                {/* Left Side: Illustration */}
                <div className="hidden md:flex md:w-5/12 bg-primary relative p-10 flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <img src="/auth_bg.png" alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">Nikki</span>
                        </div>

                        <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
                            {authModalMode === 'login'
                                ? 'Chào mừng bạn quay trở lại!'
                                : 'Trở thành thành viên của gia đình Nikki'}
                        </h2>
                        <p className="text-white/80 text-lg">
                            Khám phá hàng ngàn sản phẩm chất lượng với giá ưu đãi mỗi ngày.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 text-white/70 text-sm">
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Bảo mật</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Tiện lợi</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Tốc độ</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative blobs */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl"></div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center bg-white">
                    <button
                        onClick={closeAuthModal}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {authModalMode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {authModalMode === 'login'
                                ? 'Nhập thông tin của bạn để tiếp tục.'
                                : 'Hãy điền các thông tin dưới đây để bắt đầu.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 border border-red-100">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Tên đăng nhập</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    className={`w-full bg-gray-50 border ${fieldErrors.username ? 'border-red-400 focus:ring-red-200' : 'border-gray-100 focus:border-primary focus:ring-primary/20'} rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all focus:ring-4 text-gray-800`}
                                    placeholder="Username của bạn"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value); setFieldErrors(prev => ({ ...prev, username: '' })); }}
                                    required
                                />
                            </div>
                            {fieldErrors.username && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.username}</p>}
                        </div>

                        {authModalMode === 'register' && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        className={`w-full bg-gray-50 border ${fieldErrors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-100 focus:border-primary focus:ring-primary/20'} rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all focus:ring-4 text-gray-800`}
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }}
                                        required
                                    />
                                </div>
                                {fieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.email}</p>}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Mật khẩu</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full bg-gray-50 border ${fieldErrors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-100 focus:border-primary focus:ring-primary/20'} rounded-2xl pl-12 pr-12 py-3.5 outline-none transition-all focus:ring-4 text-gray-800`}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })); }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {fieldErrors.password && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.password}</p>}
                            {authModalMode === 'register' && !fieldErrors.password && (
                                <p className="text-gray-400 text-[10px] mt-1 ml-1">Tối thiểu 8 ký tự</p>
                            )}
                        </div>

                        {authModalMode === 'login' && (
                            <div className="flex justify-end pr-1">
                                <button type="button" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"> Quên mật khẩu? </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {authModalMode === 'login' ? 'Đăng Nhập Ngay' : 'Đăng Ký Tài Khoản'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                <span className="bg-white px-4 text-gray-400">Hoặc tiếp tục với</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all">
                                <Github className="w-4 h-4 text-gray-700" />
                                <span className="text-sm font-semibold text-gray-700">Github</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all">
                                <Chrome className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-gray-700">Google</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        {authModalMode === 'login' ? (
                            <>
                                Chưa có tài khoản?{' '}
                                <button
                                    onClick={() => setAuthModalMode('register')}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Đăng ký miễn phí
                                </button>
                            </>
                        ) : (
                            <>
                                Đã có tài khoản?{' '}
                                <button
                                    onClick={() => setAuthModalMode('login')}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Đăng nhập ngay
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
