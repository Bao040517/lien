import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { Ticket, Plus, Trash2, Calendar, DollarSign, Percent } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { format } from 'date-fns';

const SellerVouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const vouchersPerPage = 6;
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderValue: '',
        usageLimit: '',
        startDate: '',
        endDate: ''
    });

    const { user } = useAuth(); // Get user from context
    const toast = useToast();

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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const length = 15;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setFormData(prev => ({
            ...prev,
            code: result
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        // Validations
        if (!formData.code || !formData.discountValue || !formData.startDate || !formData.endDate) {
            toast.warning('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Date Validation: Start must be BEFORE End
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            toast.warning('Ngày kết thúc phải sau ngày bắt đầu. (Lưu ý: 12:00 PM là 12 giờ trưa, không phải đêm)');
            return;
        }

        const payload = {
            ...formData,
            discountValue: parseFloat(formData.discountValue),
            minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : null,
            usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
            // Ensure we send the local time string as is (appending seconds), rather than converting to UTC
            startDate: formData.startDate.length === 16 ? formData.startDate + ':00' : formData.startDate,
            endDate: formData.endDate.length === 16 ? formData.endDate + ':00' : formData.endDate
        };

        try {
            await api.post('/vouchers/my-shop', payload, {
                params: { userId: user.id }
            });
            setShowModal(false);
            fetchVouchers();
            setFormData({
                code: '',
                discountType: 'PERCENTAGE',
                discountValue: '',
                minOrderValue: '',
                usageLimit: '',
                startDate: '',
                endDate: ''
            });
        } catch (error) {
            console.error('Failed to create voucher:', error);
            toast.error(error.response?.data?.message || 'Tạo mã giảm giá thất bại. Kiểm tra lại thông tin.');
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
            toast.error('Xóa mã giảm giá thất bại.');
        }
    };

    // Calculate pagination
    const indexOfLastVoucher = currentPage * vouchersPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
    const currentVouchers = vouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);
    const totalPages = Math.ceil(vouchers.length / vouchersPerPage);



    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Ticket className="w-8 h-8 text-orange-500" />
                    Mã Giảm Giá Của Shop
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
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
                            {/* Decorative Cutouts */}
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>

                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-orange-100 text-orange-600 font-bold px-3 py-1 rounded text-sm mb-1 inline-block">
                                    {voucher.code}
                                </div>
                                <button
                                    onClick={() => handleDelete(voucher.id)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-orange-50 rounded-full text-orange-500">
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
                                    <span>{format(new Date(voucher.startDate), 'dd/MM/yyyy')} - {format(new Date(voucher.endDate), 'dd/MM/yyyy')}</span>
                                </div>
                                <div className="text-xs">
                                    Lượt dùng: <span className="font-medium text-gray-700">{voucher.usageLimit || 'Không giới hạn'}</span>
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

            {/* Pagination Controls */}
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
                                onClick={() => typeof page === 'number' ? paginate(page) : null}
                                disabled={typeof page !== 'number'}
                                className={`px-3 py-1 border rounded transition ${currentPage === page
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : typeof page === 'number'
                                        ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                        : 'border-transparent text-gray-400'
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Tạo Mã Giảm Giá Mới</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã Voucher</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none uppercase"
                                        placeholder="VD: SHOPKHAI TRUONG"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={generateRandomCode}
                                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition whitespace-nowrap font-medium"
                                        title="Tạo mã ngẫu nhiên 15 ký tự"
                                    >
                                        Random
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                                    <select
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
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
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
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
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
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
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
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
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
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
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                                >
                                    Tạo Voucher
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
