import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api';
import { MapPin, CreditCard, Banknote, Truck, Tag, Coins, X } from 'lucide-react';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { refreshCart } = useCart();

    const [items, setItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [voucherCode, setVoucherCode] = useState('');
    const [showVoucherInput, setShowVoucherInput] = useState(false);

    // Address Modal States
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({
        phoneNumber: '',
        city: '',
        district: '',
        ward: '',
        street: '',
        addressType: 'HOME',
        isDefault: true,
    });
    const [savingAddress, setSavingAddress] = useState(false);

    // Vietnam Administrative Divisions
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Fetch provinces on modal open
    useEffect(() => {
        if (showAddressModal && provinces.length === 0) {
            fetchProvinces();
        }
    }, [showAddressModal]);

    const fetchProvinces = async () => {
        try {
            const res = await fetch('https://provinces.open-api.vn/api/?depth=1');
            const data = await res.json();
            setProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const handleProvinceChange = async (e) => {
        const code = e.target.value;
        const province = provinces.find(p => String(p.code) === code);
        setAddressForm({ ...addressForm, city: province?.name || '', district: '', ward: '' });
        setDistricts([]);
        setWards([]);
        if (!code) return;
        setLoadingLocation(true);
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
            const data = await res.json();
            setDistricts(data.districts || []);
        } catch (error) {
            console.error('Error fetching districts:', error);
        } finally {
            setLoadingLocation(false);
        }
    };

    const handleDistrictChange = async (e) => {
        const code = e.target.value;
        const district = districts.find(d => String(d.code) === code);
        setAddressForm({ ...addressForm, district: district?.name || '', ward: '' });
        setWards([]);
        if (!code) return;
        setLoadingLocation(true);
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
            const data = await res.json();
            setWards(data.wards || []);
        } catch (error) {
            console.error('Error fetching wards:', error);
        } finally {
            setLoadingLocation(false);
        }
    };

    const handleWardChange = (e) => {
        const code = e.target.value;
        const ward = wards.find(w => String(w.code) === code);
        setAddressForm({ ...addressForm, ward: ward?.name || '' });
    };

    useEffect(() => {
        if (!state || !state.items || state.items.length === 0) {
            alert("Không có sản phẩm nào để thanh toán.");
            navigate('/');
            return;
        }
        setItems(state.items);
    }, [state, navigate]);

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await api.get(`/addresses/user/${user.id}`);
            const addressList = res.data.data || res.data || [];
            setAddresses(addressList);
            if (addressList.length > 0) {
                const defaultAddr = addressList.find(a => a.isDefault) || addressList[0];
                setSelectedAddress(defaultAddr);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setPageLoading(false);
        }
    };

    const handleSaveAddress = async () => {
        // Validate - chỉ cần địa chỉ, thông tin user lấy tự động
        if (!addressForm.phoneNumber.trim()) { alert("Vui lòng nhập số điện thoại."); return; }
        if (!addressForm.city.trim()) { alert("Vui lòng nhập Tỉnh/Thành phố."); return; }
        if (!addressForm.district.trim()) { alert("Vui lòng nhập Quận/Huyện."); return; }
        if (!addressForm.ward.trim()) { alert("Vui lòng nhập Phường/Xã."); return; }
        if (!addressForm.street.trim()) { alert("Vui lòng nhập địa chỉ cụ thể."); return; }

        setSavingAddress(true);
        try {
            const payload = {
                recipientName: user.username,
                phoneNumber: addressForm.phoneNumber,
                city: addressForm.city,
                district: addressForm.district,
                ward: addressForm.ward,
                street: addressForm.street,
                isDefault: addressForm.isDefault
            };
            const res = await api.post(`/addresses/user/${user.id}`, payload);
            const newAddress = res.data.data || res.data;
            setAddresses(prev => [...prev, newAddress]);
            setSelectedAddress(newAddress);
            setShowAddressModal(false);
            // Reset form + location dropdowns
            setAddressForm({
                phoneNumber: '', city: '', district: '', ward: '', street: '', addressType: 'HOME', isDefault: true
            });
            setDistricts([]);
            setWards([]);
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Lưu địa chỉ thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setSavingAddress(false);
        }
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => {
            const price = item.variant ? item.variant.price : (item.product.price || item.price);
            return total + (price * item.quantity);
        }, 0);
    };

    const getTotalQuantity = () => {
        return items.reduce((acc, i) => acc + i.quantity, 0);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setShowAddressModal(true);
            return;
        }
        setLoading(true);
        try {
            const orderItems = items.map(item => ({
                product: { id: item.product.id },
                quantity: item.quantity
            }));

            const payload = {
                userId: user.id,
                items: orderItems,
                voucherCode: voucherCode || "",
                addressId: selectedAddress.id,
                paymentMethod: paymentMethod
            };

            const res = await api.post('/orders', payload);

            if (res.data && (res.data.code === 200 || res.status === 200)) {
                const orderId = res.data.data ? res.data.data.id : 'NEW';
                alert(`Đặt hàng thành công! Mã đơn hàng: ${orderId}`);
                refreshCart();
                navigate('/');
            } else {
                throw new Error(res.data.message || "Order failed");
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Đặt hàng thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    if (!user) {
        navigate('/login');
        return null;
    }

    if (pageLoading) return <div className="p-8 text-center bg-gray-100 min-h-screen">Loading Checkout...</div>;

    return (
        <div className="bg-gray-100 min-h-screen pb-36">
            <div className="container mx-auto px-4 pt-6">
                <div className="flex items-center gap-4 mb-6 text-orange-500">
                    <div className="text-2xl font-medium border-r border-orange-500 pr-4">Thanh Toán</div>
                    <div className="text-lg">Shopee Clone</div>
                </div>

                {/* Address Section */}
                <div className="bg-white p-6 rounded shadow-sm mb-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 repeating-linear-gradient-45"></div>
                    <div className="flex items-center gap-2 text-orange-500 text-lg mb-4">
                        <MapPin className="w-5 h-5" /> Địa Chỉ Nhận Hàng
                    </div>

                    {selectedAddress ? (
                        <div className="flex items-center gap-4">
                            <div className="font-bold">{selectedAddress.recipientName || user.fullName} (+84 {selectedAddress.phoneNumber || '987xxxxx'})</div>
                            <div className="text-gray-800">
                                {selectedAddress.street}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.city}
                            </div>
                            {selectedAddress.isDefault && (
                                <div className="border border-orange-500 text-orange-500 text-xs px-1 py-0.5">Mặc định</div>
                            )}
                            <button
                                onClick={() => setShowAddressModal(true)}
                                className="text-blue-500 text-sm ml-4 hover:underline"
                            >Thay Đổi</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="text-gray-500">Chưa có địa chỉ.</div>
                            <button
                                onClick={() => setShowAddressModal(true)}
                                className="text-blue-500 text-sm hover:underline"
                            >Thêm Địa Chỉ Mới</button>
                        </div>
                    )}
                </div>

                {/* Products Section */}
                <div className="bg-white rounded shadow-sm overflow-hidden mb-4">
                    <div className="p-6">
                        <div className="grid grid-cols-12 text-gray-500 text-sm mb-4">
                            <div className="col-span-6">Sản phẩm</div>
                            <div className="col-span-2 text-center">Đơn giá</div>
                            <div className="col-span-2 text-center">Số lượng</div>
                            <div className="col-span-2 text-right">Thành tiền</div>
                        </div>

                        {items.map((item, index) => {
                            const product = item.product || item;
                            const price = item.variant ? item.variant.price : (product.price || item.price);
                            const image = item.variant?.imageUrl || product.imageUrl;

                            return (
                                <div key={index} className="grid grid-cols-12 items-center gap-4 mb-4 last:mb-0">
                                    <div className="col-span-6 flex gap-4">
                                        <img src={image} alt={product.name} className="w-12 h-12 object-cover border" />
                                        <div>
                                            <div className="line-clamp-1">{product.name}</div>
                                            {item.variant && (
                                                <div className="text-xs text-gray-500">Phân loại: {Object.values(JSON.parse(item.variant.attributes || '{}')).join(', ')}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">{formatPrice(price)}</div>
                                    <div className="col-span-2 text-center">{item.quantity}</div>
                                    <div className="col-span-2 text-right font-medium text-orange-500">{formatPrice(price * item.quantity)}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-dashed border-gray-200 mx-6"></div>

                    <div className="p-6 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Lời nhắn:</span>
                            <input type="text" placeholder="Lưu ý cho người bán..." className="border border-gray-300 rounded px-2 py-1 w-64 outline-none focus:border-gray-500" />
                        </div>
                        <div className="flex items-center gap-10 text-green-600">
                            <div className="flex items-center gap-1"><Truck className="w-4 h-4" /> Đơn vị vận chuyển:</div>
                            <div>Nhanh <span className="text-black text-xs ml-1">(Nhận hàng vào 15 Tháng 2 - 17 Tháng 2)</span></div>
                            <div className="text-black pl-4">đ15.000</div>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded shadow-sm mb-4">
                    <div className="flex items-center gap-2 text-lg mb-4">
                        <CreditCard className="w-5 h-5 text-gray-500" /> Phương Thức Thanh Toán
                    </div>
                    <div className="flex gap-4">
                        <button
                            className={`px-4 py-2 border rounded text-sm ${paymentMethod === 'COD' ? 'border-orange-500 text-orange-500' : 'border-gray-300 hover:border-orange-500'}`}
                            onClick={() => setPaymentMethod('COD')}
                        >
                            Thanh toán khi nhận hàng (COD)
                        </button>
                        <button
                            className={`px-4 py-2 border rounded text-sm ${paymentMethod === 'Banking' ? 'border-orange-500 text-orange-500' : 'border-gray-300 hover:border-orange-500'}`}
                            onClick={() => setPaymentMethod('Banking')}
                        >
                            Chuyển khoản ngân hàng
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== FIXED BOTTOM BAR - Giống Shopee ===== */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
                {/* Row 1: Shopee Voucher + Shopee Xu */}
                <div className="border-b border-gray-100">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium">Shopee Voucher</span>
                            {showVoucherInput ? (
                                <div className="flex items-center gap-2 ml-2">
                                    <input
                                        type="text"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        placeholder="Nhập mã voucher..."
                                        className="border border-gray-300 rounded px-2 py-1 text-sm w-40 outline-none focus:border-orange-400"
                                    />
                                    <button
                                        onClick={() => setShowVoucherInput(false)}
                                        className="text-xs text-gray-400 hover:text-gray-600"
                                    >✕</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowVoucherInput(true)}
                                    className="text-blue-500 text-sm ml-2 hover:underline"
                                >Chọn hoặc nhập mã</button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            <span>Shopee Xu</span>
                            <span className="text-gray-400 ml-1">Bạn chưa có Shopee Xu ⓘ</span>
                            <span className="text-gray-400 ml-2">-0đ</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Select All + Total + Mua Hàng */}
                <div className="container mx-auto px-4 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked readOnly className="w-4 h-4 accent-orange-500" />
                            <span className="text-sm">Chọn Tất Cả ({items.length})</span>
                        </label>
                        <button className="text-sm text-gray-600 hover:text-orange-500">Xóa</button>
                        <span className="text-sm text-gray-300">|</span>
                        <button className="text-sm text-orange-500 hover:underline">Lưu vào mục Đã thích</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm text-gray-700">Tổng cộng ({getTotalQuantity()} sản phẩm):</span>
                                <span className="text-orange-500 text-xl font-medium">{formatPrice(getTotalPrice() + 15000)}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Tiết kiệm <span className="text-orange-500">{formatPrice(0)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="bg-orange-500 text-white px-10 py-3 rounded-sm hover:bg-orange-600 font-medium text-base min-w-[160px]"
                        >
                            {loading ? 'Đang Xử Lý...' : 'Mua Hàng'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== ADDRESS MODAL POPUP - Giống Shopee ===== */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => { if (selectedAddress) setShowAddressModal(false); }}
                    ></div>

                    {/* Modal */}
                    <div className="relative bg-white rounded-md shadow-xl w-full max-w-[420px] max-h-[85vh] mx-4 animate-[fadeIn_0.2s_ease-out] flex flex-col">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-2 flex-shrink-0">
                            <h2 className="text-lg font-medium text-gray-800">Địa chỉ mới</h2>
                            <p className="text-xs text-gray-500 mt-1">Vui lòng thêm địa chỉ nhận hàng</p>
                        </div>

                        {/* Form - Scrollable */}
                        <div className="px-6 py-3 space-y-3 overflow-y-auto flex-1">
                            {/* Thông tin người nhận - lấy từ user đã đăng nhập */}
                            <div className="bg-gray-50 rounded px-4 py-3 flex items-center justify-between">
                                <div>
                                    <span className="text-sm text-gray-500">Người nhận: </span>
                                    <span className="text-sm font-medium text-gray-800">{user.username}</span>
                                    <span className="text-sm text-gray-400 ml-2">({user.email})</span>
                                </div>
                            </div>

                            {/* Số điện thoại */}
                            <input
                                type="text"
                                placeholder="Số điện thoại liên hệ"
                                value={addressForm.phoneNumber}
                                onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors"
                            />

                            {/* Tỉnh/Thành phố */}
                            <select
                                value={provinces.find(p => p.name === addressForm.city)?.code || ''}
                                onChange={handleProvinceChange}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors bg-white appearance-none cursor-pointer"
                            >
                                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                {provinces.map(p => (
                                    <option key={p.code} value={p.code}>{p.name}</option>
                                ))}
                            </select>

                            {/* Quận/Huyện */}
                            <select
                                value={districts.find(d => d.name === addressForm.district)?.code || ''}
                                onChange={handleDistrictChange}
                                disabled={districts.length === 0}
                                className={`w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors bg-white appearance-none ${districts.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <option value="">{loadingLocation ? 'Đang tải...' : '-- Chọn Quận/Huyện --'}</option>
                                {districts.map(d => (
                                    <option key={d.code} value={d.code}>{d.name}</option>
                                ))}
                            </select>

                            {/* Phường/Xã */}
                            <select
                                value={wards.find(w => w.name === addressForm.ward)?.code || ''}
                                onChange={handleWardChange}
                                disabled={wards.length === 0}
                                className={`w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors bg-white appearance-none ${wards.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <option value="">{loadingLocation ? 'Đang tải...' : '-- Chọn Phường/Xã --'}</option>
                                {wards.map(w => (
                                    <option key={w.code} value={w.code}>{w.name}</option>
                                ))}
                            </select>

                            {/* Địa chỉ cụ thể */}
                            <textarea
                                placeholder="Địa chỉ cụ thể (số nhà, tên đường...)"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                rows={2}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-orange-400 transition-colors resize-none"
                            ></textarea>

                            {/* Loại địa chỉ */}
                            <div>
                                <p className="text-xs text-gray-600 mb-1.5">Loại địa chỉ:</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setAddressForm({ ...addressForm, addressType: 'HOME' })}
                                        className={`px-4 py-1.5 border rounded text-xs transition-colors ${addressForm.addressType === 'HOME' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                                    >
                                        Nhà Riêng
                                    </button>
                                    <button
                                        onClick={() => setAddressForm({ ...addressForm, addressType: 'OFFICE' })}
                                        className={`px-4 py-1.5 border rounded text-xs transition-colors ${addressForm.addressType === 'OFFICE' ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                                    >
                                        Văn Phòng
                                    </button>
                                </div>
                            </div>

                            {/* Đặt làm mặc định */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={addressForm.isDefault}
                                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                    className="w-4 h-4 accent-orange-500"
                                />
                                <span className="text-xs text-gray-500">Đặt làm địa chỉ mặc định</span>
                            </label>
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-6 pb-5 pt-3 flex items-center justify-end gap-3 flex-shrink-0">
                            <button
                                onClick={() => { if (selectedAddress) setShowAddressModal(false); else navigate('/'); }}
                                className="px-6 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Trở Lại
                            </button>
                            <button
                                onClick={handleSaveAddress}
                                disabled={savingAddress}
                                className="px-6 py-2 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600 transition-colors min-w-[100px]"
                            >
                                {savingAddress ? 'Đang lưu...' : 'Hoàn thành'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
