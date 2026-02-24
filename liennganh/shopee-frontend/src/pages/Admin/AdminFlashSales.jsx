import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Zap, Plus, Trash2, Calendar, ShoppingBag } from 'lucide-react';
import { getImageUrl } from '../../utils';

const AdminFlashSales = () => {
    const [flashSales, setFlashSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        startDate: '',
        endDate: '',
        productIds: []
    });
    const [selectedSale, setSelectedSale] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFlashSales();
        fetchProducts();
    }, []);

    const fetchFlashSales = async () => {
        try {
            const res = await api.get('/flash-sales');
            const data = res.data.data || res.data || [];
            setFlashSales(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products/all');
            setProducts(res.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDateForBackend = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!form.startDate || !form.endDate) {
                alert('Vui lòng chọn thời gian bắt đầu và kết thúc');
                return;
            }

            const payload = {
                name: `Flash Sale ${new Date(form.startDate).toLocaleDateString()}`,
                startTime: formatDateForBackend(form.startDate),
                endTime: formatDateForBackend(form.endDate),
                items: form.productIds.map(id => {
                    const product = products.find(p => p.id === id);
                    return {
                        product: { id: id },
                        discountedPrice: product ? product.price * 0.9 : 0,
                        stockQuantity: 10
                    };
                }),
                isActive: true
            };

            if (editingId) {
                const res = await api.put(`/flash-sales/${editingId}`, payload);
                const updated = res.data.data || res.data;
                setFlashSales(prev => prev.map(s => s.id === editingId ? updated : s));
            } else {
                const res = await api.post('/flash-sales', payload);
                const newSale = res.data.data || res.data;
                setFlashSales(prev => [...prev, newSale]);
            }

            setShowModal(false);
            setForm({ startDate: '', endDate: '', productIds: [] });
            setEditingId(null);
            setSearchTerm('');

        } catch (error) {
            console.error(error);
            alert('Thất bại: ' + (error.response?.data?.message || 'Lỗi không xác định'));
        }
    };

    const handleEditClick = (sale, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setEditingId(sale.id);

        const formatLocal = (d) => {
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
        };

        setForm({
            startDate: formatLocal(new Date(sale.startTime)),
            endDate: formatLocal(new Date(sale.endTime)),
            productIds: sale.items ? sale.items.map(i => i.product.id) : []
        });
        setShowModal(true);
    };

    const toggleProductSelection = (id) => {
        setForm(prev => {
            const exists = prev.productIds.includes(id);
            if (exists) return { ...prev, productIds: prev.productIds.filter(pid => pid !== id) };
            return { ...prev, productIds: [...prev.productIds, id] };
        });
    };

    const handleRandomSelect = () => {
        if (products.length === 0) return;
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 20).map(p => p.id);
        setForm(prev => ({ ...prev, productIds: selected }));
    };

    const getStatus = (start, end) => {
        const now = new Date();
        const startTime = new Date(start);
        const endTime = new Date(end);
        if (now >= startTime && now <= endTime) return 'ACTIVE';
        if (now < startTime) return 'UPCOMING';
        return 'ENDED';
    };

    const groupedSales = {
        ACTIVE: flashSales.filter(s => getStatus(s.startTime, s.endTime) === 'ACTIVE'),
        UPCOMING: flashSales.filter(s => getStatus(s.startTime, s.endTime) === 'UPCOMING'),
        ENDED: flashSales.filter(s => getStatus(s.startTime, s.endTime) === 'ENDED')
    };

    const renderSaleItem = (sale) => (
        <div
            key={sale.id}
            onClick={() => setSelectedSale(sale)}
            className="p-4 flex items-center justify-between hover:bg-gray-50 border-b last:border-0 border-gray-100 cursor-pointer group"
        >
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800">{sale.name || `Flash Sale #${sale.id}`}</span>
                    {getStatus(sale.startTime, sale.endTime) === 'ACTIVE' && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full animate-pulse">Đang diễn ra</span>
                    )}
                    {getStatus(sale.startTime, sale.endTime) === 'UPCOMING' && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Sắp diễn ra</span>
                    )}
                    {getStatus(sale.startTime, sale.endTime) === 'ENDED' && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">Đã kết thúc</span>
                    )}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(sale.startTime).toLocaleString('vi-VN')}</span>
                    <span>→</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(sale.endTime).toLocaleString('vi-VN')}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                    {sale.items?.length || sale.products?.length || 0} sản phẩm
                </div>
                {getStatus(sale.startTime, sale.endTime) !== 'ENDED' && (
                    <button
                        onClick={(e) => handleEditClick(sale, e)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                        title="Chỉnh sửa (thêm/bớt sản phẩm)"
                    >
                        <Zap className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );

    const handleCreateClick = () => {
        setEditingId(null);
        const now = new Date();
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        now.setHours(now.getHours() + 1);

        const nextHour = new Date(now);
        const oneHourLater = new Date(nextHour);
        oneHourLater.setHours(oneHourLater.getHours() + 1);

        const formatLocal = (d) => {
            const pad = (n) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        setForm({
            startDate: formatLocal(nextHour),
            endDate: formatLocal(oneHourLater),
            productIds: []
        });
        setSearchTerm('');
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Flash Sale</h1>
                <button
                    onClick={handleCreateClick}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition"
                >
                    <Plus className="w-4 h-4" /> Tạo Flash Sale
                </button>
            </div>

            <div className="space-y-6">
                {groupedSales.ACTIVE.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
                        <div className="p-4 border-b border-green-100 bg-green-50">
                            <h3 className="font-bold text-green-800 flex items-center gap-2">
                                <Zap className="w-4 h-4" /> Đang diễn ra
                            </h3>
                        </div>
                        <div>
                            {groupedSales.ACTIVE.map(renderSaleItem)}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
                    <div className="p-4 border-b border-blue-50 bg-blue-50">
                        <h3 className="font-bold text-blue-800 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Sắp tới
                        </h3>
                    </div>
                    {groupedSales.UPCOMING.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">Chưa có chương trình nào sắp tới.</div>
                    ) : (
                        <div>
                            {groupedSales.UPCOMING.map(renderSaleItem)}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            Lịch sử
                        </h3>
                    </div>
                    {groupedSales.ENDED.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">Chưa có lịch sử chương trình nào.</div>
                    ) : (
                        <div>
                            {groupedSales.ENDED.map(renderSaleItem)}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 animate-[fadeIn_0.2s_ease-out] max-h-[90vh] flex flex-col">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 flex-shrink-0">
                            <Zap className="w-5 h-5 text-orange-500" /> {editingId ? 'Chỉnh Sửa Flash Sale' : 'Tạo Flash Sale Mới'}
                        </h2>

                        <div className="overflow-y-auto flex-1 pr-2">
                            <form id="flash-sale-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                                        <input
                                            type="datetime-local"
                                            value={form.startDate}
                                            onChange={e => setForm({ ...form, startDate: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                                        <input
                                            type="datetime-local"
                                            value={form.endDate}
                                            onChange={e => setForm({ ...form, endDate: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Sản phẩm tham gia</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, productIds: [] }))}
                                                className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition"
                                            >
                                                Xóa tất cả
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRandomSelect}
                                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition flex items-center gap-1"
                                                title="Chọn ngẫu nhiên 20 sản phẩm"
                                            >
                                                <Zap className="w-3 h-3" /> Random 20
                                            </button>
                                        </div>
                                    </div>

                                    {/* Selected Items Preview */}
                                    {form.productIds.length > 0 && (
                                        <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">Đã chọn ({form.productIds.length})</div>
                                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                                {form.productIds.map(id => {
                                                    const p = products.find(prod => prod.id === id);
                                                    if (!p) return null;
                                                    return (
                                                        <div key={id} className="flex items-center gap-1 bg-white border border-orange-200 rounded-full pl-1 pr-2 py-1 shadow-sm">
                                                            <img src={getImageUrl(p.imageUrl)} alt="" className="w-5 h-5 rounded-full object-cover" />
                                                            <span className="text-xs font-medium max-w-[120px] truncate">{p.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleProductSelection(id)}
                                                                className="ml-1 text-gray-400 hover:text-red-500 rounded-full p-0.5 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Search and List */}
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm sản phẩm để thêm..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 mb-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                    />

                                    <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto p-2 space-y-1">
                                        {filteredProducts.map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => toggleProductSelection(p.id)}
                                                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${form.productIds.includes(p.id) ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-200' : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${form.productIds.includes(p.id) ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                                    }`}>
                                                    {form.productIds.includes(p.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <img src={getImageUrl(p.imageUrl)} alt="" className="w-8 h-8 rounded object-cover bg-gray-100 flex-shrink-0" />
                                                <div className="flex-1 text-sm truncate">{p.name}</div>
                                                <div className="text-xs font-medium text-orange-600 flex-shrink-0">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 text-right">Đã chọn: {form.productIds.length}</p>
                                </div>
                            </form>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => { setShowModal(false); setEditingId(null); setSearchTerm(''); }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >Hủy</button>
                            <button
                                type="submit"
                                form="flash-sale-form"
                                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                            >{editingId ? 'Cập Nhật' : 'Tạo Flash Sale'}</button>
                        </div>
                    </div>
                </div>
            )}

            {selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 animate-[fadeIn_0.2s_ease-out] max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-orange-500" /> {selectedSale.name || `Flash Sale #${selectedSale.id}`}
                                </h2>
                                <div className="text-sm text-gray-500 mt-1">
                                    {new Date(selectedSale.startTime).toLocaleString('vi-VN')} - {new Date(selectedSale.endTime).toLocaleString('vi-VN')}
                                </div>
                            </div>
                            <button onClick={() => setSelectedSale(null)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 pr-2">
                            <h4 className="font-semibold text-gray-700 mb-3">Sản phẩm tham gia ({selectedSale.items?.length || 0})</h4>
                            <div className="space-y-2">
                                {selectedSale.items?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-100 rounded bg-gray-50">
                                        <img src={getImageUrl(item.product?.imageUrl)} alt="" className="w-12 h-12 rounded object-cover bg-white" />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm text-gray-800 line-clamp-1">{item.product?.name || 'Sản phẩm'}</div>
                                            <div className="flex items-center gap-4 mt-1 text-xs">
                                                <span className="text-gray-500 line-through">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product?.price || 0)}
                                                </span>
                                                <span className="text-orange-600 font-bold">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.discountedPrice || 0)}
                                                </span>
                                                <span className="text-gray-500">
                                                    Kho: {item.stockQuantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100 mt-4 gap-2">
                            {getStatus(selectedSale.startTime, selectedSale.endTime) !== 'ENDED' && (
                                <button
                                    onClick={(e) => {
                                        setSelectedSale(null);
                                        handleEditClick(selectedSale, e);
                                    }}
                                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2"
                                >
                                    <Zap className="w-4 h-4" /> Chỉnh sửa
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFlashSales;
