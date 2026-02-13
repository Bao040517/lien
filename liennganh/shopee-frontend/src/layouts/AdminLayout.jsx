import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Store, Package, ShoppingCart, LogOut, ChevronRight, Tag, Ticket, Zap, ShieldCheck } from 'lucide-react';

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

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

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
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
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
