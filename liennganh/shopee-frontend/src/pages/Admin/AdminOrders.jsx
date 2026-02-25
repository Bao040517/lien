import { useState, useEffect } from 'react';
import api from '../../api';
import { ShoppingCart, Search, Clock, Package, Truck, CheckCircle, XCircle, AlertCircle, ChevronDown, Sparkles } from 'lucide-react';
import Pagination from '../../components/Pagination';

const statusConfig = {
    PENDING: { label: 'Chờ xác nhận', icon: Clock, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    SHIPPING: { label: 'Đang vận chuyển', icon: Package, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    DELIVERING: { label: 'Đang giao hàng', icon: Truck, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    DELIVERED: { label: 'Đã giao', icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200' },
    CANCELLED: { label: 'Đã huỷ', icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200' }
};

const allStatuses = ['PENDING', 'SHIPPING', 'DELIVERING', 'DELIVERED', 'CANCELLED'];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState(null);
    const [lastSeenMaxId, setLastSeenMaxId] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    useEffect(() => {
        const savedMaxId = parseInt(localStorage.getItem('admin_orders_last_seen_max_id') || '0');
        setLastSeenMaxId(savedMaxId);

        api.get('/admin/orders')
            .then(res => {
                const allOrders = res.data.data || [];
                // Sắp xếp ID giảm dần → mới nhất lên đầu
                allOrders.sort((a, b) => b.id - a.id);
                setOrders(allOrders);

                // Lưu maxId hiện tại
                if (allOrders.length > 0) {
                    const currentMaxId = Math.max(...allOrders.map(o => o.id));
                    localStorage.setItem('admin_orders_last_seen_max_id', currentMaxId.toString());
                }
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const isNewOrder = (order) => lastSeenMaxId > 0 && order.id > lastSeenMaxId;

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await api.put(`/ admin / orders / ${orderId}/status?status=${newStatus}`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch { alert('Cập nhật trạng thái thất bại!'); }
        finally { setUpdating(null); }
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

    const newCount = orders.filter(o => isNewOrder(o)).length;

    const filtered = orders.filter(o => {
        const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
        const matchSearch = !search || o.id?.toString().includes(search) ||
            o.user?.username?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    // Count orders by status
    const statusCounts = {};
    orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filtered.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filtered.length / ordersPerPage);



    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">{orders.length} đơn hàng</p>
                </div>
            </div>

            {/* Banner thông báo đơn hàng mới */}
            {newCount > 0 && (
                <div className="bg-gradient-to-r from-primary-lighter to-primary-lighter border border-primary-light rounded-xl p-4 mb-6 flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-red-800 font-semibold">🛒 Có {newCount} đơn hàng mới!</p>
                        <p className="text-red-600 text-sm">Đơn hàng mới đã được đưa lên đầu danh sách và đánh dấu nổi bật.</p>
                    </div>
                </div>
            )}

            {/* Status Filter Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
                <button onClick={() => setStatusFilter('ALL')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${statusFilter === 'ALL' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}>
                    Tất cả <span className="text-xs ml-1 px-1.5 py-0.5 rounded-full bg-gray-200">{orders.length}</span>
                </button>
                {allStatuses.map(s => {
                    const cfg = statusConfig[s];
                    return (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${statusFilter === s ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}>
                            {cfg.label}
                            {statusCounts[s] > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-200">{statusCounts[s]}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Đang tải...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Mã đơn</th>
                                    <th className="px-6 py-3">Khách hàng</th>
                                    <th className="px-6 py-3">Sản phẩm</th>
                                    <th className="px-6 py-3">Tổng tiền</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3">Ngày tạo</th>
                                    <th className="px-6 py-3 text-center">Cập nhật</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentOrders.map(order => {
                                    const sc = statusConfig[order.status] || statusConfig.PENDING;
                                    const StatusIcon = sc.icon;
                                    const isNew = isNewOrder(order);
                                    return (
                                        <tr key={order.id} className={`hover:bg-gray-50/50 transition-colors ${isNew ? 'bg-red-50 border-l-4 border-red-500' : ''
                                            }`}>
                                            <td className="px-6 py-3">
                                                <span className="text-sm font-mono font-bold text-gray-800">
                                                    #{order.id}
                                                    {isNew && (
                                                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-bounce">
                                                            <Sparkles className="w-3 h-3" /> MỚI
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {order.user?.username?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-sm text-gray-700">{order.user?.username || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-500">
                                                {order.orderItems?.length || 0} sản phẩm
                                            </td>
                                            <td className="px-6 py-3">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">{formatPrice(order.finalPrice)}</p>
                                                    {order.totalPrice !== order.finalPrice && (
                                                        <p className="text-xs text-gray-400 line-through">{formatPrice(order.totalPrice)}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${sc.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-400">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '—'}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={order.status}
                                                        disabled={updating === order.id || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                                                        onChange={e => handleUpdateStatus(order.id, e.target.value)}
                                                        className="appearance-none bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium focus:ring-2 focus:ring-blue-300 outline-none disabled:opacity-50 cursor-pointer">
                                                        {allStatuses.map(s => (
                                                            <option key={s} value={s}>{statusConfig[s].label}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                <p>Không tìm thấy đơn hàng</p>
                            </div>
                        )}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filtered.length}
                            startItem={indexOfFirstOrder + 1}
                            endItem={Math.min(indexOfLastOrder, filtered.length)}
                            itemLabel="đơn hàng"
                            accentColor="blue"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
