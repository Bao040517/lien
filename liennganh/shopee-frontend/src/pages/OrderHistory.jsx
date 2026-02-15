import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, MapPin, Star } from 'lucide-react';
import ReviewModal from '../components/ReviewModal';

const ORDER_TABS = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'SHIPPING', label: 'Đang vận chuyển' },
    { key: 'DELIVERING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'CANCELLED', label: 'Đã hủy' },
];

const STATUS_CONFIG = {
    PENDING: { label: 'Chờ xác nhận', desc: 'Người bán đang chuẩn bị hàng', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock },
    SHIPPING: { label: 'Đang vận chuyển', desc: 'Đơn vị vận chuyển đã lấy hàng', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Truck },
    DELIVERING: { label: 'Đang giao hàng', desc: 'Shipper đang giao hàng đến bạn', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: MapPin },
    DELIVERED: { label: 'Giao hàng thành công', desc: 'Đơn hàng đã giao thành công', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle },
    CANCELLED: { label: 'Đã hủy', desc: 'Đơn hàng đã bị hủy', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
};

// Timeline: 4 bước chính
const STEPS = ['PENDING', 'SHIPPING', 'DELIVERING', 'DELIVERED'];

const OrderHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [currentReviewItem, setCurrentReviewItem] = useState(null);
    const [reviewOrderId, setReviewOrderId] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/orders/user/${user.id}`);
            const data = res.data.data || res.data;
            const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
            setOrders(sorted);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReview = (orderId, item) => {
        setReviewOrderId(orderId);
        setCurrentReviewItem(item);
        setIsReviewOpen(true);
    };

    const handleSubmitReview = async ({ rating, comment }) => {
        try {
            await api.post('/reviews', {
                userId: user.id,
                orderId: reviewOrderId,
                productId: currentReviewItem.product.id,
                rating,
                comment
            });
            alert('Cảm ơn bạn đã đánh giá sản phẩm!');
            setIsReviewOpen(false);
        } catch (error) {
            console.error(error);
            alert('Gửi đánh giá thất bại: ' + (error.response?.data?.message || 'Lỗi không xác định'));
        }
    };

    const filteredOrders = activeTab === 'ALL' ? orders : orders.filter(o => o.status === activeTab);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getStepIndex = (status) => {
        if (status === 'CANCELLED') return -1;
        return STEPS.indexOf(status);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Đơn mua</h1>

            {/* Tabs */}
            <div className="bg-white rounded-t-lg border-b flex overflow-x-auto">
                {ORDER_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors relative
                            ${activeTab === tab.key ? 'text-orange-500' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        {tab.label}
                        {activeTab === tab.key && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                        )}
                        {tab.key !== 'ALL' && (
                            <span className="ml-1 text-xs text-gray-400">
                                ({orders.filter(o => o.status === tab.key).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-3 mt-3">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <Package className="mx-auto mb-3 text-gray-300" size={48} />
                        <p className="text-gray-500">Chưa có đơn hàng nào</p>
                    </div>
                ) : (
                    filteredOrders.map(order => {
                        const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                        const StatusIcon = statusCfg.icon;
                        const isExpanded = expandedOrder === order.id;
                        const currentStep = getStepIndex(order.status);
                        const isDelivered = order.status === 'DELIVERED';

                        return (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                {/* Order Header */}
                                <div className="px-5 py-3 flex items-center justify-between border-b border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500">Đơn hàng</span>
                                        <span className="text-sm font-semibold text-gray-800">#{order.id}</span>
                                        <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                                        <StatusIcon size={13} />
                                        {statusCfg.label}
                                    </div>
                                </div>

                                {/* Status Description Banner */}
                                <div className={`px-5 py-2 text-xs ${statusCfg.color} border-b`}>
                                    <StatusIcon size={12} className="inline mr-1.5" />
                                    {statusCfg.desc}
                                </div>

                                {/* Order Items */}
                                <div className="px-5 py-3">
                                    {order.orderItems && order.orderItems.map((item, idx) => {
                                        const productImg = item.variant?.imageUrl || item.product?.imageUrl;
                                        const imageUrl = productImg
                                            ? (productImg.startsWith('http') ? productImg : `http://localhost:8080${productImg}`)
                                            : null;

                                        return (
                                            <div key={idx} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                                                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={item.product?.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-800 truncate">{item.product?.name || 'Sản phẩm'}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">x{item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-orange-500">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </div>
                                                    {isDelivered && (
                                                        item.isReviewed ? (
                                                            <button
                                                                disabled
                                                                className="mt-2 text-xs border border-gray-300 text-gray-400 px-3 py-1 rounded bg-gray-50 cursor-not-allowed"
                                                            >
                                                                Đã đánh giá
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenReview(order.id, { ...item, product: { ...item.product, imageUrl } });
                                                                }}
                                                                className="mt-2 text-xs border border-orange-500 text-orange-500 px-3 py-1 rounded hover:bg-orange-50 transition"
                                                            >
                                                                Đánh giá
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Footer */}
                                <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
                                    >
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Tổng tiền:</span>
                                        <span className="text-lg font-semibold text-orange-500">{formatPrice(order.finalPrice)}</span>
                                        {order.totalPrice > order.finalPrice && (
                                            <span className="text-xs text-gray-400 line-through">{formatPrice(order.totalPrice)}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="px-5 py-4 border-t border-gray-100 space-y-4 bg-white">
                                        {/* Status Timeline */}
                                        {order.status !== 'CANCELLED' ? (
                                            <div>
                                                <p className="text-xs font-medium text-gray-600 mb-3">Trạng thái đơn hàng</p>
                                                <div className="flex items-center justify-between relative">
                                                    {/* Background line */}
                                                    <div className="absolute top-3 left-6 right-6 h-0.5 bg-gray-200"></div>
                                                    {/* Progress line */}
                                                    <div
                                                        className="absolute top-3 left-6 h-0.5 bg-orange-500 transition-all duration-500"
                                                        style={{ width: currentStep >= 0 ? `${(currentStep / (STEPS.length - 1)) * (100 - 12)}%` : '0%' }}
                                                    ></div>

                                                    {STEPS.map((step, i) => {
                                                        const done = i <= currentStep;
                                                        const active = i === currentStep;
                                                        const StepIcon = STATUS_CONFIG[step].icon;
                                                        return (
                                                            <div key={step} className="flex flex-col items-center z-10 relative">
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${active ? 'bg-orange-500 text-white ring-4 ring-orange-100' :
                                                                    done ? 'bg-orange-500 text-white' :
                                                                        'bg-gray-200 text-gray-400'
                                                                    }`}>
                                                                    <StatusIcon size={12} />
                                                                </div>
                                                                <span className={`text-[10px] mt-1.5 text-center max-w-[70px] leading-tight ${done ? 'text-orange-500 font-medium' : 'text-gray-400'
                                                                    }`}>
                                                                    {STATUS_CONFIG[step].label}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-2 rounded text-sm">
                                                <XCircle size={16} /> Đơn hàng đã bị hủy
                                            </div>
                                        )}

                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-gray-50 rounded p-3">
                                                <p className="text-xs text-gray-400 mb-1">Phương thức thanh toán</p>
                                                <p className="font-medium text-gray-700">
                                                    {order.paymentMethod === 'COD' ? '💵 Thanh toán khi nhận hàng' : '🏦 Chuyển khoản ngân hàng'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded p-3">
                                                <p className="text-xs text-gray-400 mb-1">Địa chỉ giao hàng</p>
                                                <p className="font-medium text-gray-700 text-xs">
                                                    {order.shippingAddress
                                                        ? `${order.shippingAddress.street}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`
                                                        : 'Chưa có'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Voucher */}
                                        {order.voucher && (
                                            <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded">
                                                🎫 Voucher: <span className="font-medium">{order.voucher.code}</span> — Tiết kiệm {formatPrice(order.totalPrice - order.finalPrice)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onSubmit={handleSubmitReview}
                productName={currentReviewItem?.product?.name}
                productImage={currentReviewItem?.product?.imageUrl}
            />
        </div>
    );
};

export default OrderHistory;
