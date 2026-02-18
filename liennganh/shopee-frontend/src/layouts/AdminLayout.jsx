import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { LayoutDashboard, Users, Store, Package, ShoppingCart, LogOut, Tag, Ticket, Zap, ShieldCheck } from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [badges, setBadges] = useState({});

    // Lấy baseline đã lưu từ localStorage
    const getBaseline = () => {
        try {
            const saved = localStorage.getItem('admin_badge_baseline');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    };

    const saveBaseline = (key, value) => {
        const current = getBaseline() || {};
        current[key] = value;
        localStorage.setItem('admin_badge_baseline', JSON.stringify(current));
    };

    // Khi admin click vào menu → reset badge của trang HIỆN TẠI (trang cũ)
    // để badge chỉ bị xoá khi admin rời khỏi trang đó
    const handleMenuClick = (path) => {
        // Reset badge cho trang hiện tại (trang admin đang xem) khi chuyển sang trang khác
        const currentPath = location.pathname;
        if (currentPath !== path) {
            const baseline = getBaseline() || {};
            const currentTotal = (baseline[currentPath] || 0) + (badges[currentPath] || 0);
            saveBaseline(currentPath, currentTotal);
            setBadges(prev => ({ ...prev, [currentPath]: 0 }));
        }
    };

    // Fetch và tính delta
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') return;

        const fetchBadges = async () => {
            try {
                const res = await api.get('/admin/statistics');
                const stats = res.data.data || res.data;
                const currentCounts = {
                    '/admin/users': stats.totalUsers || 0,
                    '/admin/sellers': stats.pendingSellers || 0,
                    '/admin/products': stats.totalProducts || 0,
                    '/admin/orders': stats.ordersByStatus?.PENDING || 0,
                };

                const baseline = getBaseline();
                if (!baseline) {
                    // Lần đầu → lưu baseline, badge = 0
                    localStorage.setItem('admin_badge_baseline', JSON.stringify(currentCounts));
                    setBadges({ '/admin/users': 0, '/admin/sellers': 0, '/admin/products': 0, '/admin/orders': 0 });
                } else {
                    // So sánh: delta = hiện tại - baseline
                    const deltas = {};
                    for (const key in currentCounts) {
                        const diff = currentCounts[key] - (baseline[key] || 0);
                        deltas[key] = diff > 0 ? diff : 0;
                    }
                    setBadges(deltas);
                }
            } catch (e) {
                // Bỏ qua lỗi 403 (không phải admin) im lặng
                if (e.response?.status !== 403) {
                    console.error('Error fetching admin badges:', e);
                }
            }
        };

        fetchBadges();
        const interval = setInterval(fetchBadges, 15000); // Refresh mỗi 15s
        return () => clearInterval(interval);
    }, [user]);

    const menuItems = [
        { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
        { section: 'QUẢN LÝ' },
        { path: '/admin/users', label: 'Người dùng', icon: Users },
        { path: '/admin/sellers', label: 'Người bán', icon: Store },
        { path: '/admin/products', label: 'Sản phẩm', icon: Package },
        { path: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
        { section: 'HỆ THỐNG' },
        { path: '/admin/categories', label: 'Danh mục', icon: Tag },
        { path: '/admin/vouchers', icon: Ticket, label: 'Mã giảm giá' },
        { path: '/admin/flash-sales', icon: Zap, label: 'Flash Sale' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <h1 className="text-2xl font-bold mb-2">Truy cập bị từ chối</h1>
                    <p className="text-gray-400 mb-6">Bạn không có quyền truy cập trang quản trị.</p>
                    <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">Admin Panel</h1>
                            <p className="text-xs text-slate-400">Shopee Clone</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                    {menuItems.map((item, idx) => {
                        if (item.section) {
                            return (
                                <div key={item.section} className="px-4 pt-5 pb-2">
                                    <span className="text-[10px] font-bold tracking-widest text-slate-500">{item.section}</span>
                                </div>
                            );
                        }
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        const badgeCount = badges[item.path];
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => handleMenuClick(item.path)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="flex-1">{item.label}</span>
                                {badgeCount > 0 && (
                                    <span className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-bold rounded-full animate-pulse ${isActive
                                        ? 'bg-white text-blue-600'
                                        : item.path === '/admin/sellers'
                                            ? 'bg-orange-500 text-white'
                                            : item.path === '/admin/orders'
                                                ? 'bg-red-500 text-white'
                                                : item.path === '/admin/products'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-slate-600 text-slate-200'
                                        }`}>
                                        +{badgeCount > 99 ? '99+' : badgeCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="border-t border-slate-700 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                            {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{user.username}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm w-full transition"
                    >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Top Header */}
                <header className="bg-white border-b px-8 py-4 sticky top-0 z-30 shadow-sm">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
                        </h2>
                        <div className="flex items-center gap-3">
                            <Link to="/" className="text-sm text-blue-600 hover:text-blue-700">
                                ← Về cửa hàng
                            </Link>
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

export default AdminLayout;

