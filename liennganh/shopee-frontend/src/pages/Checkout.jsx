import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api';
import { MapPin, CreditCard, Store, Truck, Tag, Coins, X, ChevronRight } from 'lucide-react';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { refreshCart } = useCart();

    const [groupedItems, setGroupedItems] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // Voucher States per Shop: { [shopId]: { code: '', discount: 0, applied: false } }
    const [shopVouchers, setShopVouchers] = useState({});

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

        // Group items by shop
        const groups = {};
        state.items.forEach(item => {
            const product = item.product || item;
            const shopId = product.shop ? product.shop.id : 'system';
            const shopName = product.shop ? product.shop.name : 'Hệ Thống';

            if (!groups[shopId]) {
                groups[shopId] = {
                    shopName,
                    shopId,
                    items: []
                };
            }
            groups[shopId].items.push(item);
        });
        setGroupedItems(groups);

        // Initialize voucher state for each shop
        const initialVouchers = {};
        Object.keys(groups).forEach(shopId => {
            initialVouchers[shopId] = { code: '', discount: 0, applied: false };
        });
        setShopVouchers(initialVouchers);

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

    const getShopSubtotal = (shopId) => {
        const group = groupedItems[shopId];
        if (!group) return 0;
        return group.items.reduce((total, item) => {
            const price = item.variant ? item.variant.price : (item.product.price || item.price);
            return total + (price * item.quantity);
        }, 0);
    };

    const handleApplyVoucher = async (shopId) => {
        const voucherData = shopVouchers[shopId];
        if (!voucherData.code) return;

        try {
            const subTotal = getShopSubtotal(shopId);
            const res = await api.post('/vouchers/apply', null, {
                params: {
                    code: voucherData.code,
                    orderValue: subTotal,
                    shopId: shopId === 'system' ? null : shopId
                }
            });

            console.log("Voucher API Response:", res.data);

            if (res.data.success === false || res.data.code !== 1000) {
                throw new Error(res.data.message || "Lỗi áp dụng voucher");
            }

            // Success case
            setShopVouchers(prev => ({
                ...prev,
                [shopId]: { ...prev[shopId], discount: Number(res.data.data), applied: true }
            }));

            alert(`Áp dụng thành công! Giảm: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(res.data.data)}`);

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Mã giảm giá không hợp lệ";
            alert(msg);
            setShopVouchers(prev => ({
                ...prev,
                [shopId]: { ...prev[shopId], discount: 0, applied: false }
            }));
        }
    };

    const handleRemoveVoucher = (shopId) => {
        setShopVouchers(prev => ({
            ...prev,
            [shopId]: { ...prev[shopId], code: '', discount: 0, applied: false }
        }));
    };

    const getTotalPayment = () => {
        let total = 0;
        Object.keys(groupedItems).forEach(shopId => {
            const subTotal = getShopSubtotal(shopId);
            const discount = shopVouchers[shopId]?.discount || 0;
            // Assuming simplified shipping for now, e.g., 15k per shop or total?
            // Existing code added 15k flat. Let's add 15k per shop for now as they are separate shipments.
            total += (subTotal - discount + 15000);
        });
        return Math.max(0, total);
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setShowAddressModal(true);
            return;
        }

        setLoading(true);
        const shopIds = Object.keys(groupedItems);
        const results = [];

        try {
            // Create orders sequentially or parallel
            for (const shopId of shopIds) {
                const group = groupedItems[shopId];
                const voucher = shopVouchers[shopId];

                const orderItems = group.items.map(item => {
                    // Handle case where item might be the product itself or a cart item
                    const product = item.product || item;
                    return {
                        productId: product.id,
                        quantity: item.quantity
                    };
                });

                const payload = {
                    userId: user.id,
                    items: orderItems,
                    voucherCode: voucher.applied ? voucher.code : "",
                    addressId: selectedAddress.id,
                    paymentMethod: paymentMethod
                };

                // We continue even if one fails? For now, implementing "all or nothing" logic is hard without backend transaction.
                // We will try to place all, and report errors.
                try {
                    const res = await api.post('/orders', payload);
                    results.push({ shopId, status: 'success', orderId: res.data.data.id });
                } catch (err) {
                    console.error(`Failed to place order for shop ${shopId}`, err);
                    results.push({ shopId, status: 'error', message: err.response?.data?.message || err.message });
                }
            }

            const failures = results.filter(r => r.status === 'error');
            if (failures.length === 0) {
                alert(`Đặt hàng thành công! Bạn đã tạo ${results.length} đơn hàng.`);
                refreshCart();
                navigate('/');
            } else {
                if (results.length === failures.length) {
                    alert("Đặt hàng thất bại. Vui lòng thử lại.");
                } else {
                    alert(`Đặt hàng hoàn tất một phần. ${results.length - failures.length} đơn thành công, ${failures.length} đơn thất bại.`);
                    refreshCart();
                    navigate('/');
                }
            }

        } catch (error) {
            console.error("Order error:", error);
            alert("Lỗi hệ thống khi đặt hàng.");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    if (!user) {
        navigate('/login', { state: { from: { pathname: '/checkout' } }, replace: true });
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

                {/* Products Section - Grouped by Shop */}
                {Object.keys(groupedItems).map(shopId => {
                    const group = groupedItems[shopId];
                    const voucher = shopVouchers[shopId] || { code: '', discount: 0, applied: false };
                    const subTotal = getShopSubtotal(shopId);

                    return (
                        <div key={shopId} className="bg-white rounded shadow-sm overflow-hidden mb-4">
                            {/* Shop Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                                <Store className="w-4 h-4 text-gray-500" />
                                <span className="font-medium text-gray-800">{group.shopName}</span>
                            </div>

                            <div className="p-6">
                                {group.items.map((item, index) => {
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

                            {/* Voucher Input for this Shop */}
                            <div className="px-6 py-4 bg-orange-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-medium text-gray-700">Voucher của Shop</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {voucher.applied ? (
                                        <div className="flex items-center gap-2 bg-white border border-orange-200 rounded px-2 py-1">
                                            <span className="text-orange-600 font-medium text-sm">{voucher.code}</span>
                                            <span className="text-xs text-gray-500">(-{formatPrice(voucher.discount)})</span>
                                            <button onClick={() => handleRemoveVoucher(shopId)}>
                                                <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nhập mã voucher"
                                                className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-orange-500 uppercase"
                                                value={shopVouchers[shopId]?.code || ''}
                                                onChange={(e) => setShopVouchers(prev => ({
                                                    ...prev,
                                                    [shopId]: { ...prev[shopId], code: e.target.value }
                                                }))}
                                            />
                                            <button
                                                onClick={() => handleApplyVoucher(shopId)}
                                                className="bg-orange-500 text-white text-xs px-3 py-1 rounded hover:bg-orange-600"
                                            >
                                                Áp Dụng
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="p-6 flex items-center justify-between text-sm border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Lời nhắn:</span>
                                    <input type="text" placeholder="Lưu ý cho người bán..." className="border border-gray-300 rounded px-2 py-1 w-64 outline-none focus:border-gray-500" />
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-10 text-green-600">
                                        <div className="flex items-center gap-1"><Truck className="w-4 h-4" /> Đơn vị vận chuyển:</div>
                                        <div>Nhanh <span className="text-black text-xs ml-1">(Nhận hàng vào 15 Tháng 2 - 17 Tháng 2)</span></div>
                                        <div className="text-black pl-4">đ15.000</div>
                                    </div>
                                    <div className="text-gray-800 font-medium">
                                        Tổng số tiền ({group.items.length} sản phẩm): <span className="text-orange-500 text-lg">{formatPrice(subTotal + 15000 - voucher.discount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}


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

            {/* ===== FIXED BOTTOM BAR ===== */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
                <div className="container mx-auto px-4 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Footer info/legal if needed */}
                        <div className="text-xs text-gray-500">
                            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <span className="text-blue-500">Điều khoản Shopee</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm text-gray-700">Tổng thanh toán:</span>
                                <span className="text-orange-500 text-xl font-medium">{formatPrice(getTotalPayment())}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                (Đã bao gồm phí vận chuyển và giảm giá)
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

            {/* ===== ADDRESS MODAL POPUP ===== */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => { if (selectedAddress) setShowAddressModal(false); }}></div>
                    <div className="relative bg-white rounded-md shadow-xl w-full max-w-[420px] max-h-[85vh] mx-4 animate-[fadeIn_0.2s_ease-out] flex flex-col">
                        <div className="px-6 pt-6 pb-2 flex-shrink-0">
                            <h2 className="text-lg font-medium text-gray-800">Địa chỉ mới</h2>
                        </div>
                        <div className="px-6 py-3 space-y-3 overflow-y-auto flex-1">
                            <input
                                type="text" placeholder="Số điện thoại liên hệ"
                                value={addressForm.phoneNumber} onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none focus:border-orange-400"
                            />
                            {/* ... (Provinces/Districts/Wards Selects - Simplified for brevity but logic remains) ... */}
                            <select
                                value={provinces.find(p => p.name === addressForm.city)?.code || ''} onChange={handleProvinceChange}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none bg-white"
                            >
                                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                            </select>

                            <select
                                value={districts.find(d => d.name === addressForm.district)?.code || ''} onChange={handleDistrictChange}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none bg-white"
                            >
                                <option value="">-- Chọn Quận/Huyện --</option>
                                {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                            </select>

                            <select
                                value={wards.find(w => w.name === addressForm.ward)?.code || ''} onChange={handleWardChange}
                                className="w-full border border-gray-300 rounded px-4 py-3 text-sm outline-none bg-white"
                            >
                                <option value="">-- Chọn Phường/Xã --</option>
                                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                            </select>

                            <textarea
                                placeholder="Địa chỉ cụ thể"
                                value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                            ></textarea>
                        </div>
                        <div className="px-6 pb-5 pt-3 flex items-center justify-end gap-3 flex-shrink-0">
                            <button onClick={() => { if (selectedAddress) setShowAddressModal(false); else navigate('/'); }} className="px-6 py-2 text-sm text-gray-600 hover:text-gray-800">Trở Lại</button>
                            <button onClick={handleSaveAddress} disabled={savingAddress} className="px-6 py-2 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600">{savingAddress ? 'Đang lưu...' : 'Hoàn thành'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
