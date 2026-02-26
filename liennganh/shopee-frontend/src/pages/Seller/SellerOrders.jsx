import { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Search, Clock, Package, Truck, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import Pagination from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';

const statusConfig = {
    PENDING: { label: 'Chờ xác nhận', icon: Clock, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    SHIPPING: { label: 'Đang vận chuyển', icon: Package, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    DELIVERING: { label: 'Đang giao hàng', icon: Truck, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    DELIVERED: { label: 'Đã giao', icon: CheckCircle, color: 'bg-green-50 text-green-700 border-green-200' },
    CANCELLED: { label: 'Đã huỷ', icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200' }
};

const allStatuses = ['PENDING', 'SHIPPING', 'DELIVERING', 'DELIVERED', 'CANCELLED'];

const SellerOrders = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    useEffect(() => {
        if (!user) return;

        api.get('/seller/orders', {
            params: { sellerId: user.id }
        })
            .then(res => {
                const allOrders = res.data.data || [];
                // Sắp xếp ID giảm dần → mới nhất lên đầu
                allOrders.sort((a, b) => b.id - a.id);
                setOrders(allOrders);
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, [user]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await api.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch { toast.info('Cập nhật trạng thái thất bại!'); }
        finally { setUpdating(null); }
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

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

            {/* Status Filter Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
                <button onClick={() => setStatusFilter('ALL')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${statusFilter === 'ALL' ? 'bg-primary-dark text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}>
                    Tất cả <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${statusFilter === 'ALL' ? 'bg-primary-dark' : 'bg-gray-200'}`}>{orders.length}</span>
                </button>
                {allStatuses.map(s => {
                    const cfg = statusConfig[s];
                    return (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${statusFilter === s ? 'bg-primary-dark text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}>
                            {cfg.label}
                            {statusCounts[s] > 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === s ? 'bg-primary-dark' : 'bg-gray-200'}`}>{statusCounts[s]}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-dark outline-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-primary-dark border-t-transparent rounded-full mx-auto mb-2"></div>
                        Đang tải...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-primary-lighter/50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Mã đơn</th>
                                    <th className="px-6 py-4 font-semibold">Người mua</th>
                                    <th className="px-6 py-4 font-semibold">Tổng mặt hàng</th>
                                    <th className="px-6 py-4 font-semibold">Khách thanh toán</th>
                                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                                    <th className="px-6 py-4 font-semibold">Ngày Đặt</th>
                                    <th className="px-6 py-4 text-center font-semibold">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentOrders.map(order => {
                                    const sc = statusConfig[order.status] || statusConfig.PENDING;
                                    const StatusIcon = sc.icon;
                                    return (
                                        <tr key={order.id} className={`hover:bg-primary-lighter/30 transition-colors`}>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-mono font-bold text-gray-800">
                                                    #{order.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-primary-darker rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                        {order.user?.username?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{order.user?.username || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1.5">
                                                    <Package className="w-4 h-4 text-gray-400" />
                                                    {order.orderItems?.length || 0} sản phẩm
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-bold text-primary-darker">{formatPrice(order.finalPrice)}</p>
                                                    {order.totalPrice !== order.finalPrice && (
                                                        <p className="text-xs text-gray-400 line-through mt-0.5">{formatPrice(order.totalPrice)}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${sc.color}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="relative inline-block w-full max-w-[140px]">
                                                    <select
                                                        value={order.status}
                                                        disabled={updating === order.id || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                                                        onChange={e => handleUpdateStatus(order.id, e.target.value)}
                                                        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-primary focus:border-primary-dark focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:bg-gray-50 cursor-pointer shadow-sm transition-all duration-200">
                                                        {allStatuses.map(s => (
                                                            <option key={s} value={s}>{statusConfig[s].label}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="p-12 text-center text-gray-400 bg-gray-50/50">
                                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium text-gray-500">Không tìm thấy đơn hàng</p>
                                <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
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
                            accentColor="orange"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerOrders;
