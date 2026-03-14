import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Tag, Plus, Trash2, Pencil, Calendar, DollarSign, Percent } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const emptyForm = {
    code: '',
    discountType: 'FIXED',
    discountValue: '',
    minOrderValue: '',
    usageLimit: 100,
    startDate: '',
    endDate: ''
};

const AdminVouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const res = await api.get('/vouchers');
            const data = res.data.data || res.data || [];
            setVouchers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toDatetimeLocal = (isoStr) => {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const formatForApi = (datetimeLocalStr) => {
        if (!datetimeLocalStr) return '';
        return datetimeLocalStr.length === 16 ? datetimeLocalStr + ':00' : datetimeLocalStr;
    };

    const openCreateModal = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEditModal = (v) => {
        setEditingId(v.id);
        setForm({
            code: v.code,
            discountType: v.discountType,
            discountValue: v.discountValue,
            minOrderValue: v.minOrderValue ?? '',
            usageLimit: v.usageLimit ?? '',
            startDate: toDatetimeLocal(v.startDate),
            endDate: toDatetimeLocal(v.endDate),
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!form.code || !form.discountValue || !form.startDate || !form.endDate) {
                toast.warning('Vui lòng điền đầy đủ thông tin bắt buộc');
                return;
            }
            if (new Date(form.startDate) >= new Date(form.endDate)) {
                toast.warning('Ngày kết thúc phải sau ngày bắt đầu');
                return;
            }

            const payload = {
                code: form.code,
                discountType: form.discountType,
                discountValue: Number(form.discountValue),
                minOrderValue: Number(form.minOrderValue || 0),
                usageLimit: form.usageLimit !== '' ? Number(form.usageLimit) : null,
                startDate: formatForApi(form.startDate),
                endDate: formatForApi(form.endDate),
            };

            if (editingId) {
                const res = await api.put(`/vouchers/${editingId}`, payload);
                const updated = res.data.data || res.data;
                setVouchers(prev => prev.map(v => v.id === editingId ? updated : v));
                toast.success('Cập nhật voucher thành công!');
            } else {
                const res = await api.post('/vouchers', payload);
                setVouchers(prev => [...prev, res.data.data || res.data]);
                toast.success('Tạo voucher thành công!');
            }

            setShowModal(false);
            setEditingId(null);
            setForm(emptyForm);
        } catch (error) {
            console.error(error);
            toast.info((editingId ? 'Cập nhật' : 'Tạo') + ' voucher thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
        try {
            await api.delete(`/vouchers/${id}`);
            setVouchers(prev => prev.filter(v => v.id !== id));
            toast.success('Xóa voucher thành công!');
        } catch (error) {
            console.error(error);
            toast.info('Xóa voucher thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Voucher</h1>
                <button
                    onClick={openCreateModal}
                    className="bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-darker transition"
                >
                    <Plus className="w-4 h-4" /> Tạo Voucher
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải...</div>
                ) : vouchers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Chưa có voucher nào.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3">Mã Code</th>
                                    <th className="px-6 py-3">Giảm giá</th>
                                    <th className="px-6 py-3">Đơn tối thiểu</th>
                                    <th className="px-6 py-3">Lượt còn lại</th>
                                    <th className="px-6 py-3">Bắt đầu</th>
                                    <th className="px-6 py-3">Hết hạn</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {vouchers.map(v => {
                                    const now = new Date();
                                    const isExpired = new Date(v.endDate) < now;
                                    const notStarted = new Date(v.startDate) > now;
                                    return (
                                        <tr key={v.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-primary-darker">{v.code}</td>
                                            <td className="px-6 py-4">
                                                {v.discountType === 'FIXED'
                                                    ? formatPrice(v.discountValue)
                                                    : `${v.discountValue}%`
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{formatPrice(v.minOrderValue)}</td>
                                            <td className="px-6 py-4 text-gray-600">{v.usageLimit ?? 'Không giới hạn'}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(v.startDate).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(v.endDate).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isExpired ? (
                                                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs">Hết hạn</span>
                                                ) : notStarted ? (
                                                    <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full text-xs">Chưa bắt đầu</span>
                                                ) : (
                                                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs">Hoạt động</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(v)}
                                                        className="text-gray-400 hover:text-primary-dark transition"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(v.id)}
                                                        className="text-gray-400 hover:text-red-500 transition"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-primary-dark" />
                            {editingId ? 'Chỉnh Sửa Voucher' : 'Tạo Voucher Mới'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Voucher</label>
                                <input
                                    type="text"
                                    placeholder="VD: SALE50"
                                    value={form.code}
                                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                    className="w-full border border-gray-300 rounded p-2 uppercase"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                                    <select
                                        value={form.discountType}
                                        onChange={e => setForm({ ...form, discountType: e.target.value })}
                                        className="w-full border border-gray-300 rounded p-2"
                                    >
                                        <option value="FIXED">Số tiền cố định (VND)</option>
                                        <option value="PERCENTAGE">Phần trăm (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={form.discountValue}
                                            onChange={e => setForm({ ...form, discountValue: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2 pl-8"
                                            required
                                        />
                                        <div className="absolute left-2.5 top-2.5 text-gray-400">
                                            {form.discountType === 'FIXED' ? <DollarSign className="w-4 h-4" /> : <Percent className="w-4 h-4" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu</label>
                                    <input
                                        type="number"
                                        value={form.minOrderValue}
                                        onChange={e => setForm({ ...form, minOrderValue: e.target.value })}
                                        className="w-full border border-gray-300 rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượt dùng</label>
                                    <input
                                        type="number"
                                        value={form.usageLimit}
                                        onChange={e => setForm({ ...form, usageLimit: e.target.value })}
                                        className="w-full border border-gray-300 rounded p-2"
                                        placeholder="Để trống = không giới hạn"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={form.startDate}
                                            onChange={e => setForm({ ...form, startDate: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2 pl-9"
                                            required
                                        />
                                        <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={form.endDate}
                                            onChange={e => setForm({ ...form, endDate: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2 pl-9"
                                            required
                                        />
                                        <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingId(null); }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >Hủy</button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary-dark text-white rounded hover:bg-primary-darker"
                                >
                                    {editingId ? 'Lưu Thay Đổi' : 'Tạo Voucher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVouchers;
