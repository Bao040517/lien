import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import {
    Users, Store, Package, ShoppingCart, DollarSign, UserCheck, TrendingUp, AlertCircle,
    ArrowUpRight, Clock, CheckCircle, Truck, XCircle
} from 'lucide-react';

const statusColors = {
    PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Clock },
    PAYMENT_PENDING: { bg: 'bg-orange-50', text: 'text-orange-700', icon: AlertCircle },
    PROCESSING: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Package },
    SHIPPED: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: Truck },
    DELIVERED: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
    CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle }
};

const statusLabels = {
    PENDING: 'Chờ xác nhận',
    PAYMENT_PENDING: 'Chờ thanh toán',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã huỷ'
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/admin/statistics').catch(() => null),
            api.get('/admin/sellers/pending').catch(() => ({ data: { data: [] } })),
            api.get('/users').catch(() => ({ data: { data: [] } })),
            api.get('/products').catch(() => ({ data: { data: [] } })),
            api.get('/admin/orders').catch(() => ({ data: { data: [] } }))
        ]).then(([statsRes, pendingRes, usersRes, productsRes, ordersRes]) => {
            const users = usersRes?.data?.data || [];
            const products = productsRes?.data?.data || [];
            const orders = ordersRes?.data?.data || [];
            const pending = pendingRes?.data?.data || [];
            setPendingSellers(pending);

            if (statsRes?.data?.data) {
                setStats(statsRes.data.data);
            } else {
                // Fallback: calculate stats manually
                const ordersByStatus = {};
                orders.forEach(o => {
                    ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
                });
                setStats({
                    totalUsers: users.length,
                    totalSellers: users.filter(u => u.role === 'SELLER').length,
                    totalProducts: products.length,
                    totalOrders: orders.length,
                    totalRevenue: orders.reduce((s, o) => s + (Number(o.finalPrice) || 0), 0),
                    pendingSellers: pending.length,
                    ordersByStatus
                });
            }
        }).finally(() => setLoading(false));
    }, []);

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/sellers/${id}/approve`);
            setPendingSellers(prev => prev.filter(s => s.id !== id));
            setStats(prev => prev ? { ...prev, pendingSellers: (prev.pendingSellers || 1) - 1 } : prev);
        } catch { alert('Duyệt thất bại!'); }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Từ chối seller này?')) return;
        try {
            await api.put(`/admin/sellers/${id}/reject`);
            setPendingSellers(prev => prev.filter(s => s.id !== id));
            setStats(prev => prev ? { ...prev, pendingSellers: (prev.pendingSellers || 1) - 1 } : prev);
        } catch { alert('Từ chối thất bại!'); }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
    );

    const statCards = [
        { label: 'Người dùng', value: stats?.totalUsers || 0, icon: Users, color: 'blue', link: '/admin/users' },
        { label: 'Người bán', value: stats?.totalSellers || 0, icon: Store, color: 'orange', link: '/admin/sellers' },
        { label: 'Sản phẩm', value: stats?.totalProducts || 0, icon: Package, color: 'green', link: '/admin/products' },
        { label: 'Đơn hàng', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'purple', link: '/admin/orders' },
        { label: 'Doanh thu', value: formatPrice(stats?.totalRevenue), icon: DollarSign, color: 'emerald', isPrice: true },
        { label: 'Chờ duyệt', value: stats?.pendingSellers || 0, icon: UserCheck, color: 'yellow', link: '/admin/sellers' },
    ];

    const colorMap = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
        green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' },
        yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'text-yellow-500' },
    };

    return (
        <div>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map((card) => {
                    const c = colorMap[card.color];
                    const Icon = card.icon;
                    const content = (
                        <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition group">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${c.icon}`} />
                                </div>
                                {card.link && <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />}
                            </div>
                            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                            <p className={`text-2xl font-bold ${card.isPrice ? 'text-lg' : ''} text-gray-800`}>
                                {card.value}
                            </p>
                        </div>
                    );
                    return card.link ? <Link key={card.label} to={card.link}>{content}</Link> : <div key={card.label}>{content}</div>;
                })}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Order Status Breakdown */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-700">Đơn hàng theo trạng thái</h3>
                        <Link to="/admin/orders" className="text-sm text-blue-500 hover:text-blue-600">Xem tất cả →</Link>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => {
                            const sc = statusColors[status] || { bg: 'bg-gray-50', text: 'text-gray-700', icon: Package };
                            const StatusIcon = sc.icon;
                            const total = stats?.totalOrders || 1;
                            const pct = Math.round((count / total) * 100);
                            return (
                                <div key={status} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 ${sc.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <StatusIcon className={`w-4 h-4 ${sc.text}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{statusLabels[status] || status}</span>
                                            <span className="font-medium text-gray-800">{count}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full ${sc.bg.replace('50', '400')}`}
                                                style={{ width: `${pct}%`, backgroundColor: sc.text.includes('yellow') ? '#eab308' : sc.text.includes('blue') ? '#3b82f6' : sc.text.includes('green') ? '#22c55e' : sc.text.includes('red') ? '#ef4444' : sc.text.includes('orange') ? '#f97316' : sc.text.includes('indigo') ? '#6366f1' : '#9ca3af' }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {(!stats?.ordersByStatus || Object.keys(stats.ordersByStatus).length === 0) && (
                            <p className="text-center text-gray-400 py-4">Chưa có đơn hàng nào</p>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-700 mb-4">Thao tác nhanh</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Quản lý người dùng', path: '/admin/users', icon: Users, color: 'blue' },
                            { label: 'Duyệt người bán', path: '/admin/sellers', icon: UserCheck, color: 'orange' },
                            { label: 'Quản lý sản phẩm', path: '/admin/products', icon: Package, color: 'green' },
                            { label: 'Quản lý đơn hàng', path: '/admin/orders', icon: ShoppingCart, color: 'purple' },
                        ].map(item => {
                            const Icon = item.icon;
                            const c = colorMap[item.color];
                            return (
                                <Link key={item.path} to={item.path}
                                    className={`flex items-center gap-3 p-4 rounded-xl ${c.bg} hover:shadow-sm transition`}>
                                    <Icon className={`w-5 h-5 ${c.icon}`} />
                                    <span className={`text-sm font-medium ${c.text}`}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pending Sellers */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-bold text-gray-700">Yêu cầu đăng ký Seller</h3>
                        {pendingSellers.length > 0 && (
                            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                {pendingSellers.length}
                            </span>
                        )}
                    </div>
                    <Link to="/admin/sellers" className="text-sm text-blue-500 hover:text-blue-600">Xem tất cả →</Link>
                </div>

                {pendingSellers.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-200" />
                        <p>Không có yêu cầu nào đang chờ duyệt</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left">Người dùng</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Trạng thái</th>
                                <th className="px-6 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pendingSellers.slice(0, 5).map(seller => (
                                <tr key={seller.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {seller.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-gray-800">{seller.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-500">{seller.email}</td>
                                    <td className="px-6 py-3">
                                        <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
                                            Chờ duyệt
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right space-x-2">
                                        <button onClick={() => handleApprove(seller.id)}
                                            className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition">
                                            Duyệt
                                        </button>
                                        <button onClick={() => handleReject(seller.id)}
                                            className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition">
                                            Từ chối
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
