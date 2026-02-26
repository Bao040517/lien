import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Breadcrumb from '../components/Breadcrumb';
import {
    User, Lock, MapPin, Plus, Pencil, Trash2, Eye, EyeOff, X, Shield, Mail, Calendar, ChevronRight
} from 'lucide-react';

const MyAccount = () => {
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');

    // Change Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Address States
    const [addresses, setAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
        recipientName: '', phoneNumber: '', city: '', district: '', ward: '', street: '', isDefault: false,
    });
    const [savingAddress, setSavingAddress] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Vietnam Administrative Divisions
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchAddresses();
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await api.get(`/addresses/user/${user.id}`);
            setAddresses(res.data.data || res.data || []);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    // ============ CHANGE PASSWORD ============
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.warning('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (newPassword.length < 8) {
            toast.warning('Mật khẩu mới phải có ít nhất 8 ký tự.');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.warning('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (currentPassword === newPassword) {
            toast.warning('Mật khẩu mới phải khác mật khẩu hiện tại.');
            return;
        }

        setChangingPassword(true);
        try {
            await api.put('/auth/change-password', { currentPassword, newPassword });
            toast.success('Đổi mật khẩu thành công!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại.');
        } finally {
            setChangingPassword(false);
        }
    };

    // ============ ADDRESS ============
    const fetchProvinces = async () => {
        if (provinces.length > 0) return;
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
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
            const data = await res.json();
            setDistricts(data.districts || []);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const handleDistrictChange = async (e) => {
        const code = e.target.value;
        const district = districts.find(d => String(d.code) === code);
        setAddressForm({ ...addressForm, district: district?.name || '', ward: '' });
        setWards([]);
        if (!code) return;
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
            const data = await res.json();
            setWards(data.wards || []);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    const handleWardChange = (e) => {
        const code = e.target.value;
        const ward = wards.find(w => String(w.code) === code);
        setAddressForm({ ...addressForm, ward: ward?.name || '' });
    };

    const openAddModal = () => {
        setEditingAddress(null);
        setAddressForm({
            recipientName: user.username, phoneNumber: '', city: '', district: '', ward: '', street: '', isDefault: false,
        });
        setDistricts([]);
        setWards([]);
        fetchProvinces();
        setShowAddressModal(true);
    };

    const openEditModal = (addr) => {
        setEditingAddress(addr);
        setAddressForm({
            recipientName: addr.recipientName || '',
            phoneNumber: addr.phoneNumber || '',
            city: addr.city || '',
            district: addr.district || '',
            ward: addr.ward || '',
            street: addr.street || '',
            isDefault: addr.isDefault || addr.default || false,
        });
        setDistricts([]);
        setWards([]);
        fetchProvinces();
        setShowAddressModal(true);
    };

    const handleSaveAddress = async () => {
        if (!addressForm.recipientName.trim()) { toast.warning('Vui lòng nhập tên người nhận.'); return; }
        if (!addressForm.phoneNumber.trim()) { toast.warning('Vui lòng nhập số điện thoại.'); return; }
        if (!addressForm.city.trim()) { toast.warning('Vui lòng chọn Tỉnh/Thành phố.'); return; }
        if (!addressForm.district.trim()) { toast.warning('Vui lòng chọn Quận/Huyện.'); return; }
        if (!addressForm.ward.trim()) { toast.warning('Vui lòng chọn Phường/Xã.'); return; }
        if (!addressForm.street.trim()) { toast.warning('Vui lòng nhập địa chỉ cụ thể.'); return; }

        setSavingAddress(true);
        try {
            const payload = {
                recipientName: addressForm.recipientName,
                phoneNumber: addressForm.phoneNumber,
                city: addressForm.city,
                district: addressForm.district,
                ward: addressForm.ward,
                street: addressForm.street,
                isDefault: addressForm.isDefault,
            };

            if (editingAddress) {
                await api.put(`/addresses/user/${user.id}/${editingAddress.id}`, payload);
                toast.success('Cập nhật địa chỉ thành công!');
            } else {
                await api.post(`/addresses/user/${user.id}`, payload);
                toast.success('Thêm địa chỉ mới thành công!');
            }
            setShowAddressModal(false);
            fetchAddresses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lưu địa chỉ thất bại.');
        } finally {
            setSavingAddress(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
        setDeletingId(addressId);
        try {
            await api.delete(`/addresses/user/${user.id}/${addressId}`);
            toast.success('Xóa địa chỉ thành công!');
            fetchAddresses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xóa địa chỉ thất bại.');
        } finally {
            setDeletingId(null);
        }
    };

    if (!user) return null;

    const tabs = [
        { id: 'profile', label: 'Hồ Sơ', icon: User },
        { id: 'password', label: 'Đổi Mật Khẩu', icon: Lock },
        { id: 'address', label: 'Địa Chỉ', icon: MapPin },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 pt-6 pb-10">
                <div className="mb-4">
                    <Breadcrumb items={[
                        { label: 'Trang chủ', path: '/' },
                        { label: 'Tài khoản của tôi' }
                    ]} />
                </div>

                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-56 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-100">
                                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-7 h-7 text-primary-dark" />
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-gray-800 text-sm">{user.username}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
                                </div>
                            </div>
                            <nav className="py-2">
                                {tabs.map(tab => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${isActive
                                                ? 'text-primary-dark bg-primary/5 border-r-2 border-primary-dark font-medium'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="px-7 py-5 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-800">Hồ Sơ Của Tôi</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Quản lý thông tin hồ sơ của bạn</p>
                                </div>
                                <div className="p-7">
                                    <div className="max-w-lg space-y-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 text-sm text-gray-500 text-right">Tên đăng nhập</div>
                                            <div className="flex-1 flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-800 font-medium">{user.username}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 text-sm text-gray-500 text-right">Email</div>
                                            <div className="flex-1 flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-800">{user.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 text-sm text-gray-500 text-right">Vai trò</div>
                                            <div className="flex-1 flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-gray-400" />
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                                    user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                                    user.role === 'SELLER' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'SELLER' ? 'Người bán' : 'Người mua'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Change Password Tab */}
                        {activeTab === 'password' && (
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="px-7 py-5 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-800">Đổi Mật Khẩu</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
                                </div>
                                <div className="p-7">
                                    <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
                                            <div className="relative">
                                                <input
                                                    type={showCurrentPw ? 'text' : 'password'}
                                                    value={currentPassword}
                                                    onChange={e => setCurrentPassword(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark/20 transition pr-10"
                                                    placeholder="Nhập mật khẩu hiện tại"
                                                />
                                                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPw ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark/20 transition pr-10"
                                                    placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                                                />
                                                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {newPassword && newPassword.length < 8 && (
                                                <p className="text-xs text-red-500 mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu mới</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPw ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={e => setConfirmPassword(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark/20 transition pr-10"
                                                    placeholder="Nhập lại mật khẩu mới"
                                                />
                                                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {confirmPassword && newPassword !== confirmPassword && (
                                                <p className="text-xs text-red-500 mt-1">Mật khẩu xác nhận không khớp</p>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={changingPassword}
                                            className="bg-primary-dark text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-darker transition disabled:opacity-50"
                                        >
                                            {changingPassword ? 'Đang xử lý...' : 'Xác Nhận'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Address Tab */}
                        {activeTab === 'address' && (
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Địa Chỉ Của Tôi</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Quản lý địa chỉ nhận hàng</p>
                                    </div>
                                    <button
                                        onClick={openAddModal}
                                        className="flex items-center gap-2 bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-darker transition"
                                    >
                                        <Plus className="w-4 h-4" /> Thêm Địa Chỉ Mới
                                    </button>
                                </div>
                                <div className="p-7">
                                    {loadingAddresses ? (
                                        <div className="text-center py-10 text-gray-400">Đang tải...</div>
                                    ) : addresses.length === 0 ? (
                                        <div className="text-center py-16">
                                            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>
                                            <button onClick={openAddModal} className="mt-3 text-primary-dark text-sm font-medium hover:underline">
                                                Thêm địa chỉ mới
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {addresses.map(addr => (
                                                <div key={addr.id} className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1.5">
                                                                <span className="font-semibold text-gray-800">{addr.recipientName}</span>
                                                                <span className="text-gray-300">|</span>
                                                                <span className="text-gray-500 text-sm">{addr.phoneNumber}</span>
                                                                {(addr.isDefault || addr.default) && (
                                                                    <span className="text-xs border border-primary-dark text-primary-dark px-2 py-0.5 rounded">Mặc định</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600">{addr.street}</p>
                                                            <p className="text-sm text-gray-500">{addr.ward}, {addr.district}, {addr.city}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                                            <button
                                                                onClick={() => openEditModal(addr)}
                                                                className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" /> Sửa
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAddress(addr.id)}
                                                                disabled={deletingId === addr.id}
                                                                className="text-red-400 hover:text-red-600 text-sm font-medium flex items-center gap-1 ml-2"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" /> {deletingId === addr.id ? '...' : 'Xóa'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== ADDRESS MODAL ===== */}
            {showAddressModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddressModal(false)}></div>
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-[460px] max-h-[85vh] mx-4 flex flex-col animate-[fadeIn_0.2s_ease-out]">
                        <div className="px-6 pt-6 pb-3 flex items-center justify-between flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                            </h2>
                            <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-3 space-y-3 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Tên người nhận</label>
                                <input
                                    type="text" placeholder="Họ và tên"
                                    value={addressForm.recipientName}
                                    onChange={e => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary-dark"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Số điện thoại</label>
                                <input
                                    type="text" placeholder="Số điện thoại liên hệ"
                                    value={addressForm.phoneNumber}
                                    onChange={e => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary-dark"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Tỉnh/Thành phố</label>
                                <select
                                    value={provinces.find(p => p.name === addressForm.city)?.code || ''}
                                    onChange={handleProvinceChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white focus:border-primary-dark"
                                >
                                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Quận/Huyện</label>
                                <select
                                    value={districts.find(d => d.name === addressForm.district)?.code || ''}
                                    onChange={handleDistrictChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none bg-white focus:border-primary-dark"
                                >
                                    <option value="">-- Chọn Quận/Huyện --</option>
                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Phường/Xã</label>
                                <select
                                    value={wards.find(w => w.name === addressForm.ward)?.code || ''}
                                    onChange={handleWardChange}
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
                                    value={addressForm.street}
                                    onChange={e => setAddressForm({ ...addressForm, street: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary-dark resize-none"
                                    rows={2}
                                />
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
                            <button onClick={() => setShowAddressModal(false)} className="px-6 py-2.5 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition">
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveAddress}
                                disabled={savingAddress}
                                className="px-6 py-2.5 bg-primary-dark text-white rounded-lg text-sm font-medium hover:bg-primary-darker transition disabled:opacity-50"
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

export default MyAccount;
