import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import { Search, Trash2, Package, ExternalLink, ShieldAlert, ShieldCheck, Sparkles, CheckCircle, Clock, XCircle, Pencil } from 'lucide-react';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/Admin/ConfirmModal';
import PromptModal from '../../components/Admin/PromptModal';
import BadWordWarning from '../../components/BadWordWarning';
import { getImageUrl, toProductSlug } from '../../utils';
import { useToast } from '../../context/ToastContext';

const TABS = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ duyệt' },
    { value: 'APPROVED', label: 'Đã duyệt' },
    { value: 'REJECTED', label: 'Đã từ chối' },
    { value: 'BANNED', label: 'Tạm khóa' },
];

const STATUS_STYLES = {
    PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'Chờ duyệt' },
    APPROVED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle, label: 'Đã duyệt' },
    REJECTED: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: XCircle, label: 'Đã từ chối' },
    BANNED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: ShieldAlert, label: 'Tạm khóa' },
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('ALL');
    const [activeTab, setActiveTab] = useState('ALL');
    const [lastSeenMaxId, setLastSeenMaxId] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', targetId: null, action: '' });
    const [promptModal, setPromptModal] = useState({ isOpen: false, title: '', message: '', targetId: null, targetName: '', action: '' });

    useEffect(() => {
        const savedMaxId = parseInt(localStorage.getItem('admin_products_last_seen_max_id') || '0');
        setLastSeenMaxId(savedMaxId);
    }, []);

    // Tự động refetch mỗi lần navigate về trang này (kể cả sau khi edit xong)
    useEffect(() => {
        fetchData();
    }, [location.key]);

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            api.get('/products/all', { params: { size: 1000 } }),
            api.get('/categories', { params: { size: 1000 } })
        ]).then(([pRes, cRes]) => {
            const allProducts = pRes.data.data?.content || pRes.data.data || [];
            allProducts.sort((a, b) => b.id - a.id);
            setProducts(allProducts);
            setCategories(cRes.data.data?.content || cRes.data.data || []);
            if (allProducts.length > 0) {
                const currentMaxId = Math.max(...allProducts.map(p => p.id));
                localStorage.setItem('admin_products_last_seen_max_id', currentMaxId.toString());
            }
        }).catch(e => console.error(e))
            .finally(() => setLoading(false));
    };

    const isNewProduct = (product) => lastSeenMaxId > 0 && product.id > lastSeenMaxId;

    const getStatus = (p) => p.productStatus || 'PENDING';

    const handleDelete = (id, name) => {
        setConfirmModal({ isOpen: true, type: 'danger', title: `Xoá sản phẩm "${name}"?`, message: 'Hành động này không thể hoàn tác.', targetId: id, action: 'delete' });
    };

    const confirmDelete = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch { toast.error('Xoá thất bại!'); }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleStatusChange = async (productId, newStatus) => {
        if (newStatus === 'BANNED' || newStatus === 'REJECTED') {
            const product = products.find(p => p.id === productId);
            setPromptModal({
                isOpen: true,
                title: newStatus === 'BANNED' ? `Khóa sản phẩm "${product?.name}"` : `Từ chối sản phẩm "${product?.name}"`,
                message: newStatus === 'BANNED' ? 'Nhập lý do khóa sản phẩm:' : 'Nhập lý do từ chối:',
                targetId: productId,
                targetName: product?.name,
                action: newStatus
            });
            return;
        }

        try {
            const res = await api.put(`/products/${productId}/status`, null, { params: { status: newStatus } });
            const updated = res.data.data;
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updated } : p));
        } catch (e) {
            toast.error('Lỗi: ' + (e.response?.data?.message || e.message));
        }
    };

    const confirmPromptAction = async (reason) => {
        const { targetId, action } = promptModal;
        try {
            const res = await api.put(`/products/${targetId}/status`, null, { params: { status: action, reason } });
            const updated = res.data.data;
            setProducts(prev => prev.map(p => p.id === targetId ? { ...p, ...updated } : p));
        } catch (e) {
            toast.error('Lỗi: ' + (e.response?.data?.message || e.message));
        }
        setPromptModal(prev => ({ ...prev, isOpen: false }));
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    const tabCounts = {
        ALL: products.length,
        PENDING: products.filter(p => getStatus(p) === 'PENDING').length,
        APPROVED: products.filter(p => getStatus(p) === 'APPROVED').length,
        REJECTED: products.filter(p => getStatus(p) === 'REJECTED').length,
        BANNED: products.filter(p => getStatus(p) === 'BANNED').length,
    };

    const filtered = products.filter(p => {
        const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'ALL' || p.category?.id?.toString() === catFilter;
        const matchTab = activeTab === 'ALL' || getStatus(p) === activeTab;
        return matchSearch && matchCat && matchTab;
    });

    useEffect(() => { setCurrentPage(1); }, [search, catFilter, activeTab]);

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / productsPerPage);

    const StatusDropdown = ({ product }) => {
        const status = getStatus(product);
        const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
        return (
            <select
                value={status}
                onChange={e => handleStatusChange(product.id, e.target.value)}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer outline-none transition-all ${style.bg} ${style.text} ${style.border} hover:shadow-sm`}
            >
                <option value="PENDING">⏳ Chờ duyệt</option>
                <option value="APPROVED">✅ Đã duyệt</option>
                <option value="REJECTED">❌ Đã từ chối</option>
                <option value="BANNED">🔒 Tạm khóa</option>
            </select>
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">{products.length} sản phẩm trong hệ thống</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 p-1.5 mb-6 flex items-center gap-1 overflow-x-auto">
                {TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.value
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.value
                            ? 'bg-white/25 text-white'
                            : 'bg-gray-100 text-gray-500'
                            }`}>
                            {tabCounts[tab.value]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm tên sản phẩm..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
                </div>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none">
                    <option value="ALL">Tất cả danh mục</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id.toString()}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Đang tải...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Sản phẩm</th>
                                    <th className="px-6 py-3">Giá</th>
                                    <th className="px-6 py-3">Kho</th>
                                    <th className="px-6 py-3">Danh mục / Shop</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentProducts.map(product => {
                                    const status = getStatus(product);
                                    const isNew = isNewProduct(product);
                                    const rowColor = status === 'BANNED' ? 'bg-red-50/70 border-l-4 border-red-500'
                                        : status === 'REJECTED' ? 'bg-orange-50/50 border-l-4 border-orange-400'
                                            : status === 'PENDING' ? 'bg-amber-50/40 border-l-4 border-amber-400'
                                                : isNew ? 'bg-green-50 border-l-4 border-green-500'
                                                    : '';
                                    return (
                                        <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors ${rowColor}`}>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                        {product.imageUrl ? (
                                                            <img src={getImageUrl(product.imageUrl)} alt="" className={`w-full h-full object-cover ${status === 'BANNED' || status === 'REJECTED' ? 'grayscale opacity-60' : ''}`} />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-gray-300 m-auto mt-3.5" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium max-w-xs flex items-center text-gray-800">
                                                            <span className="truncate">{product.name}</span>
                                                            <BadWordWarning productName={product.name} variant="admin" />
                                                            {isNew && (
                                                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full animate-bounce flex-shrink-0">
                                                                    <Sparkles className="w-3 h-3" /> MỚI
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-400">ID: {product.id}</p>
                                                        {product.violationReason && (status === 'BANNED' || status === 'REJECTED') && (
                                                            <p className="text-xs text-red-500 italic mt-0.5 truncate max-w-[200px]" title={product.violationReason}>
                                                                Lý do: {product.violationReason}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="text-sm font-bold text-blue-600">{formatPrice(product.price)}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.stockQuantity > 10 ? 'bg-green-50 text-green-700' : product.stockQuantity > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                                                    {product.stockQuantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-800">{product.category?.name || '—'}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {product.shop?.name || '—'}
                                                        {product.shop?.ownerUsername && <span className="text-gray-400"> ({product.shop.ownerUsername})</span>}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <StatusDropdown product={product} />
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <a href={toProductSlug(product.name, product.id)} target="_blank" rel="noreferrer"
                                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Xem">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                    <button onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Chỉnh sửa">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id, product.name)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Xoá vĩnh viễn">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                <p>Không tìm thấy sản phẩm</p>
                            </div>
                        )}
                        <Pagination
                            currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}
                            totalItems={filtered.length} startItem={indexOfFirst + 1}
                            endItem={Math.min(indexOfLast, filtered.length)} itemLabel="sản phẩm" accentColor="blue"
                        />
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen} type={confirmModal.type} title={confirmModal.title} message={confirmModal.message}
                onConfirm={() => { if (confirmModal.action === 'delete') confirmDelete(confirmModal.targetId); }}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />

            <PromptModal
                isOpen={promptModal.isOpen} title={promptModal.title} message={promptModal.message}
                defaultValue={promptModal.action === 'BANNED' ? 'Vi phạm tiêu chuẩn cộng đồng' : 'Không đạt tiêu chuẩn'}
                placeholder="Nhập lý do..."
                onConfirm={confirmPromptAction}
                onCancel={() => setPromptModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default AdminProducts;
