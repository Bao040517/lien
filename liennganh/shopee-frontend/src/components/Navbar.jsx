import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, Store, LogOut, Menu, Search, Bell, HelpCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [msgUnreadCount, setMsgUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        const fetchMsgUnread = async () => {
            try {
                const res = await api.get('/messages/unread-count', { params: { userId: user.id } });
                setMsgUnreadCount(res.data.data || 0);
            } catch (e) { /* ignore */ }
        };
        fetchMsgUnread();
        const interval = setInterval(fetchMsgUnread, 10000);
        return () => clearInterval(interval);
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
            {/* Top tiny bar */}
            <div className="container mx-auto px-4 text-xs font-bold flex justify-between py-1">
                <div className="flex gap-4">
                    <Link to="/seller" className="hover:text-gray-200">Kênh Người Bán</Link>
                    {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="hover:text-gray-200 font-semibold border-l pl-4 ml-2 border-white/30">Kênh Quản Trị</Link>
                    )}
                    <span className="hover:text-gray-200 cursor-pointer">Tải ứng dụng</span>
                    <span className="hover:text-gray-200 cursor-pointer">Kết nối</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                        <Bell className="w-3 h-3" /> Thông Báo
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                        <HelpCircle className="w-3 h-3" /> Hỗ Trợ
                    </div>
                    {!user && (
                        <>
                            <Link to="/register" className="font-bold hover:text-gray-200">Đăng Ký</Link>
                            <Link to="/login" className="font-bold hover:text-gray-200">Đăng Nhập</Link>
                        </>
                    )}
                    {user && (
                        <div className="flex items-center gap-2 cursor-pointer hover:text-gray-200 relative group pb-1">
                            <span className="font-bold">{user.username}</span>
                            <div className="absolute top-full right-0 bg-white text-black shadow-lg rounded w-40 hidden group-hover:block border pt-1 z-50">
                                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Tài khoản của tôi</Link>
                                <Link to="/purchase" className="block px-4 py-2 hover:bg-gray-100">Đơn mua</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Đăng xuất</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Navbar */}
            <div className="container mx-auto px-4 pb-3 pt-2">
                <div className="flex items-center justify-between gap-10">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <Store className="w-10 h-10" />
                        <span className="text-2xl font-bold">Nikki</span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl">
                        <form onSubmit={handleSearch} className="bg-white p-1 rounded-sm flex shadow-sm relative">
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 text-black outline-none"
                                placeholder="Shopee bao ship 0Đ - Đăng ký ngay!"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="bg-primary-dark px-6 rounded-sm hover:bg-primary-darker transition">
                                <Search className="w-5 h-5 text-white" />
                            </button>
                        </form>
                        <div className="flex gap-3 text-xs mt-1 text-white/80 overflow-hidden h-4">
                            <span className="cursor-pointer hover:text-white">Áo Phông Đẹp</span>
                            <span className="cursor-pointer hover:text-white">Dép Crocs</span>
                            <span className="cursor-pointer hover:text-white">Váy Trễ Vai</span>
                            <span className="cursor-pointer hover:text-white">Áo Khoác</span>
                            <span className="cursor-pointer hover:text-white">Túi Xách Nữ</span>
                        </div>
                    </div>

                    {/* Chat + Cart Icons */}
                    <div className="flex items-center gap-4 shrink-0">
                        {user && (
                            <Link to="/messages" className="relative cursor-pointer hover:text-gray-200" title="Tin nhắn">
                                <MessageCircle className="w-7 h-7" />
                                {msgUnreadCount > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full">
                                        {msgUnreadCount > 9 ? '9+' : msgUnreadCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        <div className="relative cursor-pointer hover:text-gray-200">
                            <Link to="/cart">
                                <ShoppingCart className="w-8 h-8" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-white text-primary text-xs font-bold px-1.5 py-0.5 rounded-full border border-primary">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
