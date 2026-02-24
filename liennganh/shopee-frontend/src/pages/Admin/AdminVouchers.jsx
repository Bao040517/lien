import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Tag, Plus, Trash2, Calendar, DollarSign, Percent } from 'lucide-react';

const AdminVouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [form, setForm] = useState({
        code: '',
        discountType: 'FIXED', // FIXED or PERCENTAGE
        discountValue: '',
        minOrderValue: '',
        usageLimit: 100,
        expiryDate: ''
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate
            if (!form.code || !form.discountValue || !form.expiryDate) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc');
                return;
            }

            const payload = {
                ...form,
                discountValue: Number(form.discountValue),
                minOrderValue: Number(form.minOrderValue),
                usageLimit: Number(form.usageLimit),
                expiryDate: new Date(form.expiryDate).toISOString()
            };

            const res = await api.post('/vouchers', payload);
            alert('Tạo voucher thành công!');
            setVouchers([...vouchers, res.data.data || res.data]);
            setShowModal(false);
            setForm({
                code: '', discountType: 'FIXED', discountValue: '', minOrderValue: '', usageLimit: 100, expiryDate: ''
            });
        } catch (error) {
            console.error(error);
            alert('Tạo voucher thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Voucher</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition"
                >
                    <Plus className="w-4 h-4" /> Tạo Voucher
                </button>
            </div>

            {/* Vouchers List */}
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
                                    <th className="px-6 py-3">Lượt dùng</th>
                                    <th className="px-6 py-3">Hết hạn</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {vouchers.map(v => {
                                    const isExpired = new Date(v.expiryDate) < new Date();
                                    return (
                                        <tr key={v.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-orange-600">{v.code}</td>
                                            <td className="px-6 py-4">
                                                {v.discountType === 'FIXED'
                                                    ? formatPrice(v.discountValue)
                                                    : `${v.discountValue}%`
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{formatPrice(v.minOrderValue)}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {v.usedCount || 0} / {v.usageLimit}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(v.expiryDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isExpired ? (
                                                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs">Hết hạn</span>
                                                ) : (
                                                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs">Hoạt động</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-orange-500" /> Tạo Voucher Mới
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
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={form.expiryDate}
                                        onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                                        className="w-full border border-gray-300 rounded p-2 pl-9"
                                        required
                                    />
                                    <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >Hủy</button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                >Tạo Voucher</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVouchers;
