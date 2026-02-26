import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api';
import { MapPin, CreditCard, Store, Truck, Tag, Coins, X, ChevronRight, Plus, Check } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const toast = useToast();
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
    const [addressModalView, setAddressModalView] = useState('list'); // 'list' | 'add'
    const [tempSelectedAddress, setTempSelectedAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
        recipientName: '',
        phoneNumber: '',
        city: '',
        district: '',
        ward: '',
        street: '',
        addressType: 'HOME',
        isDefault: false,
    });
    const [savingAddress, setSavingAddress] = useState(false);

    // Vietnam Administrative Divisions
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        if (showAddressModal && addressModalView === 'add' && provinces.length === 0) {
            fetchProvinces();
        }
    }, [showAddressModal, addressModalView]);

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
            toast.info("Không có sản phẩm nào để thanh toán.");
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
        if (!addressForm.recipientName.trim()) { toast.warning("Vui lòng nhập tên người nhận."); return; }
        if (!addressForm.phoneNumber.trim()) { toast.warning("Vui lòng nhập số điện thoại."); return; }
        if (!addressForm.city.trim()) { toast.warning("Vui lòng nhập Tỉnh/Thành phố."); return; }
        if (!addressForm.district.trim()) { toast.warning("Vui lòng nhập Quận/Huyện."); return; }
        if (!addressForm.ward.trim()) { toast.warning("Vui lòng nhập Phường/Xã."); return; }
        if (!addressForm.street.trim()) { toast.warning("Vui lòng nhập địa chỉ cụ thể."); return; }

        setSavingAddress(true);
        try {
            const payload = {
                recipientName: addressForm.recipientName,
                phoneNumber: addressForm.phoneNumber,
                city: addressForm.city,
                district: addressForm.district,
                ward: addressForm.ward,
                street: addressForm.street,
                isDefault: addressForm.isDefault
            };
            const res = await api.post(`/addresses/user/${user.id}`, payload);
            const newAddress = res.data.data || res.data;
            const updatedList = [...addresses, newAddress];
            setAddresses(updatedList);
            setTempSelectedAddress(newAddress);
            setAddressModalView('list');
            setAddressForm({
                recipientName: '', phoneNumber: '', city: '', district: '', ward: '', street: '', addressType: 'HOME', isDefault: false
            });
            setDistricts([]);
            setWards([]);
            toast.success("Thêm địa chỉ mới thành công!");
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error("Lưu địa chỉ thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setSavingAddress(false);
        }
    };

    const handleConfirmAddress = () => {
        if (tempSelectedAddress) {
            setSelectedAddress(tempSelectedAddress);
        }
        setShowAddressModal(false);
    };

    const openAddNewAddressForm = () => {
        setAddressForm({
            recipientName: user.username, phoneNumber: '', city: '', district: '', ward: '', street: '', addressType: 'HOME', isDefault: false
        });
        setDistricts([]);
        setWards([]);
        setAddressModalView('add');
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

            toast.info(`Áp dụng thành công! Giảm: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(res.data.data)}`);

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Mã giảm giá không hợp lệ";
            toast.info(msg);
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
            setAddressModalView(addresses.length > 0 ? 'list' : 'add');
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
                toast.info(`Đặt hàng thành công! Bạn đã tạo ${results.length} đơn hàng.`);
                refreshCart();
                navigate('/');
            } else {
                if (results.length === failures.length) {
                    toast.warning("Đặt hàng thất bại. Vui lòng thử lại.");
                } else {
                    toast.info(`Đặt hàng hoàn tất một phần. ${results.length - failures.length} đơn thành công, ${failures.length} đơn thất bại.`);
                    refreshCart();
                    navigate('/');
                }
            }

        } catch (error) {
            console.error("Order error:", error);
            toast.info("Lỗi hệ thống khi đặt hàng.");
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
                <div className="mb-4">
                    <Breadcrumb items={[
                        { label: 'Trang chủ', path: '/' },
                        { label: 'Giỏ hàng', path: '/cart' },
                        { label: 'Thanh toán' }
                    ]} />
                </div>
                <div className="flex items-center gap-4 mb-6 text-primary-dark">
                    <div className="text-2xl font-medium border-r border-primary-dark pr-4">Thanh Toán</div>
                    <div className="text-lg">Nikki</div>
                </div>

                {/* Address Section */}
                <div className="bg-white p-6 rounded shadow-sm mb-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-primary repeating-linear-gradient-45"></div>
                    <div className="flex items-center gap-2 text-primary-dark text-lg mb-4">
                        <MapPin className="w-5 h-5" /> Địa Chỉ Nhận Hàng
                    </div>

                    {selectedAddress ? (
                        <div className="flex items-center gap-4">
                            <div className="font-bold">{selectedAddress.recipientName || user.fullName} (+84 {selectedAddress.phoneNumber || '987xxxxx'})</div>
                            <div className="text-gray-800">
                                {selectedAddress.street}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.city}
                            </div>
                            {selectedAddress.isDefault && (
                                <div className="border border-primary-dark text-primary-dark text-xs px-1 py-0.5">Mặc định</div>
                            )}
                            <button
                                onClick={() => { setTempSelectedAddress(selectedAddress); setAddressModalView('list'); setShowAddressModal(true); }}
                                className="text-blue-500 text-sm ml-4 hover:underline"
                            >Thay Đổi</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="text-gray-500">Chưa có địa chỉ.</div>
                            <button
                                onClick={() => { setAddressModalView(addresses.length > 0 ? 'list' : 'add'); setShowAddressModal(true); }}
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
                                            <div className="col-span-2 text-right font-medium text-primary-dark">{formatPrice(price * item.quantity)}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-dashed border-gray-200 mx-6"></div>

                            {/* Voucher Input for this Shop */}
                            <div className="px-6 py-4 bg-primary-lighter/30 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-primary-dark" />
                                    <span className="text-sm font-medium text-gray-700">Voucher của Shop</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {voucher.applied ? (
                                        <div className="flex items-center gap-2 bg-white border border-primary rounded px-2 py-1">
                                            <span className="text-primary-darker font-medium text-sm">{voucher.code}</span>
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
                                                className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary-dark uppercase"
                                                value={shopVouchers[shopId]?.code || ''}
                                                onChange={(e) => setShopVouchers(prev => ({
                                                    ...prev,
                                                    [shopId]: { ...prev[shopId], code: e.target.value }
                                                }))}
                                            />
                                            <button
                                                onClick={() => handleApplyVoucher(shopId)}
                                                className="bg-primary-dark text-white text-xs px-3 py-1 rounded hover:bg-primary-darker"
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
                                        Tổng số tiền ({group.items.length} sản phẩm): <span className="text-primary-dark text-lg">{formatPrice(subTotal + 15000 - voucher.discount)}</span>
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
                            className={`px-4 py-2 border rounded text-sm ${paymentMethod === 'COD' ? 'border-primary-dark text-primary-dark' : 'border-gray-300 hover:border-primary-dark'}`}
                            onClick={() => setPaymentMethod('COD')}
                        >
                            Thanh toán khi nhận hàng (COD)
                        </button>
                        <button
                            className={`px-4 py-2 border rounded text-sm ${paymentMethod === 'Banking' ? 'border-primary-dark text-primary-dark' : 'border-gray-300 hover:border-primary-dark'}`}
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
                                <span className="text-primary-dark text-xl font-medium">{formatPrice(getTotalPayment())}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                (Đã bao gồm phí vận chuyển và giảm giá)
                            </div>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="bg-primary-dark text-white px-10 py-3 rounded-sm hover:bg-primary-darker font-medium text-base min-w-[160px]"
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
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[520px] max-h-[85vh] mx-4 animate-[fadeIn_0.2s_ease-out] flex flex-col">

                        {/* ===== LIST VIEW ===== */}
                        {addressModalView === 'list' && (
                            <>
                                <div className="px-6 pt-6 pb-3 flex items-center justify-between flex-shrink-0 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-800">Địa Chỉ Của Tôi</h2>
                                    <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="overflow-y-auto flex-1 px-6 py-4">
                                    {addresses.length === 0 ? (
                                        <div className="text-center py-10">
                                            <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">Bạn chưa có địa chỉ nào.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {addresses.map(addr => {
                                                const isSelected = tempSelectedAddress?.id === addr.id;
                                                return (
                                                    <div
                                                        key={addr.id}
                                                        onClick={() => setTempSelectedAddress(addr)}
                                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected
                                                            ? 'border-primary-dark bg-primary/5 ring-1 ring-primary-dark/20'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'border-primary-dark bg-primary-dark' : 'border-gray-300'}`}>
                                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold text-gray-800 text-sm">{addr.recipientName}</span>
                                                                    <span className="text-gray-300">|</span>
                                                                    <span className="text-gray-500 text-sm">{addr.phoneNumber}</span>
                                                                    {(addr.isDefault || addr.default) && (
                                                                        <span className="text-[10px] border border-primary-dark text-primary-dark px-1.5 py-0.5 rounded ml-1">Mặc định</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 leading-relaxed">{addr.street}</p>
                                                                <p className="text-sm text-gray-400">{addr.ward}, {addr.district}, {addr.city}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="px-6 pb-5 pt-3 flex items-center justify-between flex-shrink-0 border-t border-gray-100">
                                    <button
                                        onClick={openAddNewAddressForm}
                                        className="flex items-center gap-1.5 text-sm text-primary-dark font-medium hover:underline"
                                    >
                                        <Plus className="w-4 h-4" /> Thêm Địa Chỉ Mới
                                    </button>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowAddressModal(false)}
                                            className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 rounded hover:bg-gray-50 transition"
                                        >Hủy</button>
                                        <button
                                            onClick={handleConfirmAddress}
                                            disabled={!tempSelectedAddress}
                                            className="px-6 py-2 bg-primary-dark text-white rounded text-sm font-medium hover:bg-primary-darker transition disabled:opacity-40"
                                        >Xác Nhận</button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ===== ADD NEW ADDRESS VIEW ===== */}
                        {addressModalView === 'add' && (
                            <>
                                <div className="px-6 pt-6 pb-3 flex items-center justify-between flex-shrink-0 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-800">Thêm Địa Chỉ Mới</h2>
                                    <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="px-6 py-4 space-y-3 overflow-y-auto flex-1">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Tên người nhận</label>
                                        <input
                                            type="text" placeholder="Họ và tên"
                                            value={addressForm.recipientName} onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary-dark"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Số điện thoại</label>
                                        <input
                                            type="text" placeholder="Số điện thoại liên hệ"
                                            value={addressForm.phoneNumber} onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary-dark"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Tỉnh/Thành phố</label>
                                        <select
                                            value={provinces.find(p => p.name === addressForm.city)?.code || ''} onChange={handleProvinceChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white focus:border-primary-dark"
                                        >
                                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                            {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Quận/Huyện</label>
                                        <select
                                            value={districts.find(d => d.name === addressForm.district)?.code || ''} onChange={handleDistrictChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white focus:border-primary-dark"
                                        >
                                            <option value="">-- Chọn Quận/Huyện --</option>
                                            {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Phường/Xã</label>
                                        <select
                                            value={wards.find(w => w.name === addressForm.ward)?.code || ''} onChange={handleWardChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white focus:border-primary-dark"
                                        >
                                            <option value="">-- Chọn Phường/Xã --</option>
                                            {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ cụ thể</label>
                                        <textarea
                                            placeholder="Số nhà, tên đường..."
                                            value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary-dark resize-none"
                                            rows={2}
                                        ></textarea>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={addressForm.isDefault}
                                            onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-primary-dark focus:ring-primary-dark"
                                        />
                                        <span className="text-sm text-gray-600">Đặt làm địa chỉ mặc định</span>
                                    </label>
                                </div>
                                <div className="px-6 pb-5 pt-3 flex items-center justify-end gap-3 flex-shrink-0 border-t border-gray-100">
                                    <button
                                        onClick={() => { addresses.length > 0 ? setAddressModalView('list') : setShowAddressModal(false); }}
                                        className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 rounded hover:bg-gray-50 transition"
                                    >Trở Lại</button>
                                    <button onClick={handleSaveAddress} disabled={savingAddress} className="px-6 py-2 bg-primary-dark text-white rounded text-sm font-medium hover:bg-primary-darker transition disabled:opacity-50">{savingAddress ? 'Đang lưu...' : 'Hoàn thành'}</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
