import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { Ticket, Plus, Trash2, Calendar, DollarSign, Percent, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../context/ToastContext';

const emptyForm = {
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: '',
    usageLimit: '',
    startDate: '',
    endDate: ''
};

const SellerVouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const vouchersPerPage = 6;
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const { user } = useAuth();

    const fetchVouchers = async () => {
        if (!user) return;
        try {
            const res = await api.get('/vouchers/my-shop', {
                params: { userId: user.id }
            });
            setVouchers(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch vouchers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchVouchers();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 15; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setFormData(prev => ({ ...prev, code: result }));
    };

    const toDatetimeLocal = (isoStr) => {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const openCreateModal = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const openEditModal = (voucher) => {
        setEditingId(voucher.id);
        setFormData({
            code: voucher.code,
            discountType: voucher.discountType,
            discountValue: voucher.discountValue,
            minOrderValue: voucher.minOrderValue ?? '',
            usageLimit: voucher.usageLimit ?? '',
            startDate: toDatetimeLocal(voucher.startDate),
            endDate: toDatetimeLocal(voucher.endDate),
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (!formData.code || !formData.discountValue || !formData.startDate || !formData.endDate) {
            toast.warning("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            toast.info("Ngày kết thúc phải sau ngày bắt đầu.");
            return;
        }

        const payload = {
            ...formData,
            discountValue: parseFloat(formData.discountValue),
            minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
            usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
            startDate: formData.startDate.length === 16 ? formData.startDate + ':00' : formData.startDate,
            endDate: formData.endDate.length === 16 ? formData.endDate + ':00' : formData.endDate
        };

        try {
            if (editingId) {
                await api.put(`/vouchers/my-shop/${editingId}`, payload, {
                    params: { userId: user.id }
                });
                toast.success('Cập nhật mã giảm giá thành công!');
            } else {
                await api.post('/vouchers/my-shop', payload, {
                    params: { userId: user.id }
                });
                toast.success('Tạo mã giảm giá thành công!');
            }
            setShowModal(false);
            fetchVouchers();
            setFormData(emptyForm);
            setEditingId(null);
        } catch (error) {
            console.error('Failed to save voucher:', error);
            toast.info(error.response?.data?.message || 'Lưu mã giảm giá thất bại. Kiểm tra lại thông tin.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return;
        if (!user) return;
        try {
            await api.delete(`/vouchers/my-shop/${id}`, {
                params: { userId: user.id }
            });
            setVouchers(prev => prev.filter(v => v.id !== id));
        } catch (error) {
            console.error('Failed to delete voucher:', error);
            toast.info('Xóa mã giảm giá thất bại.');
        }
    };

    const indexOfLastVoucher = currentPage * vouchersPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
    const currentVouchers = vouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);
    const totalPages = Math.ceil(vouchers.length / vouchersPerPage);

    const paginate = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const paginationRange = [];
    for (let i = 1; i <= totalPages; i++) paginationRange.push(i);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Ticket className="w-8 h-8 text-primary-dark" />
                    Mã Giảm Giá Của Shop
                </h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-darker transition"
                >
                    <Plus className="w-5 h-5" /> Tạo Mã Mới
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">Đang tải...</div>
                ) : currentVouchers.length > 0 ? (
                    currentVouchers.map(voucher => (
                        <div key={voucher.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 hover:shadow-md transition relative group overflow-hidden">
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>

                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-primary-light text-primary-darker font-bold px-3 py-1 rounded text-sm mb-1 inline-block">
                                    {voucher.code}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => openEditModal(voucher)}
                                        className="text-gray-400 hover:text-primary-dark"
                                        title="Chỉnh sửa"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(voucher.id)}
                                        className="text-gray-400 hover:text-red-500"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-primary-lighter rounded-full text-primary-dark">
                                    {voucher.discountType === 'PERCENTAGE' ? (
                                        <Percent className="w-5 h-5" />
                                    ) : (
                                        <DollarSign className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">
                                        Giảm {voucher.discountType === 'PERCENTAGE' ? `${voucher.discountValue}%` : voucher.discountValue.toLocaleString() + 'đ'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Đơn tối thiểu: {voucher.minOrderValue ? voucher.minOrderValue.toLocaleString() + 'đ' : '0đ'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1 border-t pt-3 mt-3 border-dashed">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{format(new Date(voucher.startDate), 'dd/MM/yyyy HH:mm')} - {format(new Date(voucher.endDate), 'dd/MM/yyyy HH:mm')}</span>
                                </div>
                                <div className="text-xs">
                                    Lượt dùng: <span className="font-medium text-gray-700">{voucher.usageLimit ?? 'Không giới hạn'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Chưa có mã giảm giá nào</p>
                    </div>
                )}
            </div>

            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white p-4 rounded shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">
                        Hiển thị <span className="font-medium text-gray-800">{indexOfFirstVoucher + 1}</span> đến{' '}
                        <span className="font-medium text-gray-800">
                            {Math.min(indexOfLastVoucher, vouchers.length)}
                        </span>{' '}
                        trong số <span className="font-medium text-gray-800">{vouchers.length}</span> mã giảm giá
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Trước
                        </button>

                        {paginationRange.map((page, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(page)}
                                className={`px-3 py-1 border rounded transition ${currentPage === page
                                    ? 'bg-primary-dark text-white border-primary-dark'
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {editingId ? 'Chỉnh Sửa Mã Giảm Giá' : 'Tạo Mã Giảm Giá Mới'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Voucher</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-dark outline-none uppercase"
                                        placeholder="VD: SHOPKHAIVOUCHER"
                                        required
                                    />
                                    {!editingId && (
                                        <button
                                            type="button"
                                            onClick={generateRandomCode}
                                            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition whitespace-nowrap font-medium"
                                            title="Tạo mã ngẫu nhiên 15 ký tự"
                                        >
                                            Random
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                                    <select
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-dark outline-none"
                                    >
                                        <option value="PERCENTAGE">Phần trăm (%)</option>
                                        <option value="FIXED">Số tiền cố định</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm</label>
                                    <input
                                        type="number"
                                        name="discountValue"
                                        value={formData.discountValue}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-dark outline-none"
                                        placeholder="VD: 10 hoặc 50000"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị đơn hàng tối thiểu</label>
                                <input
                                    type="number"
                                    name="minOrderValue"
                                    value={formData.minOrderValue}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-dark outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn lượt dùng</label>
                                <input
                                    type="number"
                                    name="usageLimit"
                                    value={formData.usageLimit}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-dark outline-none"
                                    placeholder="Không giới hạn"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-dark outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-dark outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingId(null); }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition"
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

export default SellerVouchers;
