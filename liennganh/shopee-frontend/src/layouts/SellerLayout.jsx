import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Settings, LogOut, Store, ImagePlus, Bell, Ticket } from 'lucide-react';

const menuItems = [
    { path: '/seller', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/seller/products', label: 'Sản phẩm', icon: Package },
    { path: '/seller/notifications', label: 'Thông báo', icon: Bell },
    { path: '/seller/vouchers', label: 'Mã giảm giá', icon: Ticket }, // New item
    { path: '/seller/add-product', label: 'Thêm sản phẩm', icon: ImagePlus },
    { path: '/seller/orders', label: 'Đơn hàng', icon: ShoppingBag },
    { path: '/seller/revenue', label: 'Doanh thu', icon: BarChart3 },
];

const SellerLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Notification Logic
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications/unread-count', { params: { userId: user.id } });
            setUnreadCount(res.data.data);
        } catch (e) { console.error("Error fetching unread count", e); }
    };

    const handleToggleNotifications = async () => {
        if (!showNotifications) {
            try {
                const res = await api.get('/notifications', { params: { userId: user.id } });
                setNotifications(res.data.data);
            } catch (e) { console.error("Error fetching notifications", e); }
        }
        setShowNotifications(!showNotifications);
    };

    const handleMarkRead = async (notif) => {
        if (!notif.read) {
            try {
                await api.put(`/notifications/${notif.id}/read`);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
            } catch (e) { console.error("Error marking read", e); }
        }
        setShowNotifications(false);

        // Navigate logic
        if (notif.type === 'Product' || notif.type === 'PRODUCT_BAN' || notif.type === 'PRODUCT_UNBAN') {
            navigate('/seller/products');
        } else if (notif.type === 'Review' || notif.type === 'REVIEW') {
            navigate('/seller/reviews'); // Assuming reviews page exists, or products
        } else if (notif.type === 'Order' || notif.type === 'ORDER') {
            navigate('/seller/orders');
        }
    };

    if (!user || user.role !== 'SELLER') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-orange-50">
                <div className="text-center">
                    <Store className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                    <h1 className="text-2xl font-bold mb-2 text-gray-800">Truy cập bị từ chối</h1>
                    <p className="text-gray-500 mb-6">Bạn cần đăng ký trở thành Seller để truy cập trang này.</p>
                    <Link to="/register-seller" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
                        Đăng ký bán hàng
                    </Link>
                </div>
            </div>
        );
    }

    if (user.sellerStatus === 'PENDING') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-yellow-50">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-yellow-800">Đang chờ duyệt</h1>
                    <p className="text-yellow-700 mb-6">
                        Yêu cầu đăng ký Seller của bạn đang được Admin xem xét. Vui lòng quay lại sau.
                    </p>
                    <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    if (user.sellerStatus === 'REJECTED') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-red-800">Yêu cầu bị từ chối</h1>
                    <p className="text-red-700 mb-6">
                        Yêu cầu trở thành Seller của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ.
                    </p>
                    <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col fixed h-full z-40 shadow-sm">
                {/* Logo */}
                <div className="px-6 py-5 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight text-gray-800">Kênh Người Bán</h1>
                            <p className="text-xs text-gray-400">Shopee Clone</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${isActive
                                    ? 'bg-orange-50 text-orange-600 font-medium border-l-4 border-orange-500'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="border-t p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{user.username}</p>
                            <p className="text-xs text-gray-400">Seller</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/" className="text-xs text-gray-400 hover:text-orange-500 transition">
                            Về cửa hàng
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-gray-400 hover:text-red-400 text-xs transition"
                        >
                            <LogOut className="w-3 h-3" /> Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Top Header */}
                <header className="bg-white border-b px-8 py-4 sticky top-0 z-30 shadow-sm">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {menuItems.find(item => item.path === location.pathname)?.label || 'Seller Center'}
                        </h2>

                        {/* Notification Bell */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={handleToggleNotifications}
                                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <Bell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
                                        <h3 className="text-sm font-semibold text-gray-700">Thông báo</h3>
                                        <button onClick={() => { }} className="text-xs text-blue-500 hover:underline">Đã đọc tất cả</button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400 text-sm">Chưa có thông báo nào</div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => handleMarkRead(notif)}
                                                    className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{notif.title}</p>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                                                            <p className="text-[10px] text-gray-400 mt-2">
                                                                {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-2 border-t text-center bg-gray-50">
                                        <Link to="/seller/notifications" className="text-xs text-blue-500 hover:underline font-medium">
                                            Xem tất cả
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
