import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, Store } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { getImageUrl } from '../utils';

const Cart = () => {
    const { user } = useAuth();
    const { refreshCart } = useCart();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [voucherCode, setVoucherCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedVoucher, setAppliedVoucher] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: '/cart' } }, replace: true });
            return;
        }
        fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await api.get(`/cart/${user.id}`);
            const cart = response.data.data || response.data;
            const items = cart.items || [];
            setCartItems(items);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        // Remove old, add with new quantity
        try {
            await api.delete(`/cart/${user.id}/remove`, { params: { productId } });
            await api.post(`/cart/${user.id}/add`, null, { params: { productId, quantity: newQuantity } });
            await fetchCart();
            refreshCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await api.delete(`/cart/${user.id}/remove`, { params: { productId } });
            setSelectedItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
            await fetchCart();
            refreshCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const toggleSelectItem = (productId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === cartItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(cartItems.map(item => item.product.id)));
        }
    };

    const getSelectedTotal = () => {
        return cartItems
            .filter(item => selectedItems.has(item.product.id))
            .reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const getSelectedCount = () => {
        return selectedItems.size;
    };

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        try {
            const orderValue = getSelectedTotal();
            if (orderValue === 0) {
                alert('Vui lòng chọn sản phẩm để áp dụng mã.');
                return;
            }
            const res = await api.post(`/vouchers/apply?code=${voucherCode}&orderValue=${orderValue}`);
            setDiscountAmount(res.data.data);
            setAppliedVoucher(voucherCode);
            alert('Áp mã giảm giá thành công! Giảm: ' + formatPrice(res.data.data));
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Không thể áp dụng mã');
            setDiscountAmount(0);
            setAppliedVoucher(null);
        }
    };

    const getFinalTotal = () => {
        const subtotal = getSelectedTotal();
        return Math.max(0, subtotal - discountAmount);
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    if (loading) return <div className="p-8 text-center bg-gray-100 min-h-screen">Đang tải giỏ hàng...</div>;

    if (!user) return null;

    return (
        <div className="bg-gray-100 min-h-screen pb-24">
            <div className="container mx-auto px-4 pt-6">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <Breadcrumb items={[
                        { label: 'Trang chủ', path: '/' },
                        { label: 'Giỏ Hàng' }
                    ]} />
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded shadow-sm p-16 text-center">
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">Giỏ hàng của bạn còn trống</p>
                        <Link to="/" className="bg-primary-dark text-white px-8 py-2 rounded-sm hover:bg-primary-darker transition">
                            Mua Ngay
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Table header */}
                        <div className="bg-white rounded shadow-sm p-4 mb-3 hidden md:grid grid-cols-12 items-center text-sm text-gray-500">
                            <div className="col-span-1 flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 accent-primary-dark cursor-pointer"
                                />
                            </div>
                            <div className="col-span-4">Sản Phẩm</div>
                            <div className="col-span-2 text-center">Đơn Giá</div>
                            <div className="col-span-2 text-center">Số Lượng</div>
                            <div className="col-span-2 text-center">Số Tiền</div>
                            <div className="col-span-1 text-center">Thao Tác</div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-3">
                            {cartItems.map(item => (
                                <div key={item.id} className="bg-white rounded shadow-sm p-4 grid grid-cols-12 items-center gap-2">
                                    {/* Checkbox */}
                                    <div className="col-span-1 flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.has(item.product.id)}
                                            onChange={() => toggleSelectItem(item.product.id)}
                                            className="w-4 h-4 accent-primary-dark cursor-pointer"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="col-span-4 flex items-center gap-3">
                                        <Link to={`/product/${item.product.id}`}>
                                            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                                                {item.product.imageUrl ? (
                                                    <img src={getImageUrl(item.product.imageUrl)} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                                                )}
                                            </div>
                                        </Link>
                                        <div className="min-w-0">
                                            <Link to={`/product/${item.product.id}`} className="text-sm text-gray-800 line-clamp-2 hover:text-primary-dark">
                                                {item.product.name}
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Unit Price */}
                                    <div className="col-span-2 text-center text-sm text-gray-600">
                                        {formatPrice(item.product.price)}
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="col-span-2 flex items-center justify-center">
                                        <div className="flex items-center border border-gray-300 rounded-sm">
                                            <button
                                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                                className="px-2 py-1 border-r border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="px-4 py-1 text-sm min-w-[40px] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                                className="px-2 py-1 border-l border-gray-300 hover:bg-gray-50"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="col-span-2 text-center text-primary-dark font-medium text-sm">
                                        {formatPrice(item.product.price * item.quantity)}
                                    </div>

                                    {/* Delete */}
                                    <div className="col-span-1 text-center">
                                        <button
                                            onClick={() => handleRemoveItem(item.product.id)}
                                            className="text-gray-400 hover:text-red-500 transition"
                                        >
                                            Xoá
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Sticky Bottom Bar */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-5px_10px_rgba(0,0,0,0.1)] z-50">
                    <div className="container mx-auto px-4">

                        {/* Voucher Input */}
                        <div className="flex justify-end items-center py-2 border-b border-gray-100 gap-2">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary-dark" />
                                <span className="text-sm font-medium">Shopee Voucher</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nhập mã giảm giá"
                                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary-dark uppercase"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                />
                                <button
                                    className="text-primary-dark text-sm font-medium hover:text-primary-darker disabled:opacity-50"
                                    onClick={handleApplyVoucher}
                                    disabled={!voucherCode || selectedItems.size === 0}
                                >
                                    Áp Dụng
                                </button>
                            </div>
                        </div>

                        <div className="py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 accent-primary-dark"
                                    />
                                    <span className="text-sm">Chọn Tất Cả ({cartItems.length})</span>
                                </label>
                                <button
                                    onClick={() => {
                                        selectedItems.forEach(productId => handleRemoveItem(productId));
                                    }}
                                    className="text-sm text-gray-600 hover:text-red-500"
                                >
                                    Xoá
                                </button>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right text-sm">
                                    <div className="flex items-center justify-end gap-2 text-gray-500">
                                        Tổng tiền hàng ({getSelectedCount()} sản phẩm):
                                        <span>{formatPrice(getSelectedTotal())}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex items-center justify-end gap-2 text-primary-dark text-xs">
                                            Voucher giảm giá:
                                            <span>-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="text-lg mt-1">
                                        Tổng thanh toán:
                                        <span className="text-primary-dark text-2xl font-medium ml-2">
                                            {formatPrice(getFinalTotal())}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    disabled={selectedItems.size === 0}
                                    className="bg-primary-dark text-white px-12 py-3 rounded-sm hover:bg-primary-darker disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm font-medium uppercase shadow-md"
                                    onClick={() => {
                                        const itemsToCheckout = cartItems.filter(item => selectedItems.has(item.product.id));
                                        navigate('/checkout', { state: { items: itemsToCheckout } });
                                    }}
                                >
                                    Mua Hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Cart;
