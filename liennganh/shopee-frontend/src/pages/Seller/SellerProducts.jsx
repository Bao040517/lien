import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Plus, Search, Trash2, Edit3, Eye, AlertTriangle, CheckCircle, Clock, XCircle, ShieldAlert } from 'lucide-react';
import Pagination from '../../components/Pagination';
import BadWordWarning from '../../components/BadWordWarning';
import api from '../../api';
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

const SellerProducts = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');
    const [deleting, setDeleting] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    useEffect(() => { setCurrentPage(1); }, [searchTerm, activeTab]);
    useEffect(() => { if (user) fetchProducts(); }, [user]);

    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products/my-shop?userId=${user.id}&page=0&size=10000`);
            const data = res.data.data || res.data.result || [];
            setProducts(Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const getStatus = (p) => p.productStatus || 'PENDING';

    const handleDelete = async (productId, productName) => {
        if (!window.confirm(`Bạn có chắc muốn xoá sản phẩm "${productName}"?`)) return;
        setDeleting(productId);
        try {
            await api.delete(`/products/${productId}`);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch { toast.info('Xoá sản phẩm thất bại!'); }
        finally { setDeleting(null); }
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
        const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchTab = activeTab === 'ALL' || getStatus(p) === activeTab;
        return matchSearch && matchTab;
    });

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / productsPerPage);

    const renderStatusBadge = (product) => {
        const status = getStatus(product);
        const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
        const Icon = style.icon;
        return (
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${style.bg} ${style.text} ${style.border}`}>
                <Icon className="w-3.5 h-3.5" /> {style.label}
            </span>
        );
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
                    <p className="text-gray-500 text-sm mt-1">{products.length} sản phẩm</p>
                </div>
                <Link to="/seller/add-product"
                    className="flex items-center gap-2 bg-primary-dark text-white px-5 py-2.5 rounded-lg hover:bg-primary-darker transition font-medium shadow-sm">
                    <Plus className="w-5 h-5" /> Thêm sản phẩm
                </Link>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 p-1.5 mb-6 flex items-center gap-1 overflow-x-auto">
                {TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === tab.value
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                            activeTab === tab.value
                                ? 'bg-white/25 text-white'
                                : 'bg-gray-100 text-gray-500'
                        }`}>
                            {tabCounts[tab.value]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
            </div>

            {/* Alerts */}
            {tabCounts.BANNED > 0 && activeTab === 'ALL' && (
                <div className="bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-red-800 font-semibold">Có {tabCounts.BANNED} sản phẩm bị tạm khóa</p>
                        <p className="text-red-600 text-sm">Vui lòng kiểm tra và cập nhật lại.</p>
                    </div>
                    <button onClick={() => setActiveTab('BANNED')} className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition flex-shrink-0">Xem</button>
                </div>
            )}

            {tabCounts.REJECTED > 0 && activeTab === 'ALL' && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-orange-800 font-semibold">Có {tabCounts.REJECTED} sản phẩm bị từ chối</p>
                        <p className="text-orange-600 text-sm">Hãy chỉnh sửa lại nội dung để được duyệt.</p>
                    </div>
                    <button onClick={() => setActiveTab('REJECTED')} className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition flex-shrink-0">Xem</button>
                </div>
            )}

            {tabCounts.PENDING > 0 && activeTab === 'ALL' && (
                <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-amber-800 font-semibold">Có {tabCounts.PENDING} sản phẩm đang chờ duyệt</p>
                        <p className="text-amber-600 text-sm">Sản phẩm cần admin xem xét và duyệt trước khi hiển thị.</p>
                    </div>
                    <button onClick={() => setActiveTab('PENDING')} className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition flex-shrink-0">Xem</button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin w-8 h-8 border-2 border-primary-dark border-t-transparent rounded-full mx-auto mb-3"></div>
                        Đang tải sản phẩm...
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Sản phẩm</th>
                                    <th className="px-6 py-3">Giá</th>
                                    <th className="px-6 py-3">Kho</th>
                                    <th className="px-6 py-3">Danh mục</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentProducts.map(product => {
                                    const status = getStatus(product);
                                    const rowColor = status === 'BANNED' ? 'bg-red-50 border-l-4 border-red-500'
                                        : status === 'REJECTED' ? 'bg-orange-50/50 border-l-4 border-orange-400'
                                        : status === 'PENDING' ? 'bg-amber-50/40 border-l-4 border-amber-400'
                                        : '';
                                    return (
                                        <tr key={product.id} className={`transition hover:bg-gray-50/50 ${rowColor}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                        {product.imageUrl ? (
                                                            <img src={getImageUrl(product.imageUrl)} alt="" className={`w-full h-full object-cover ${status === 'BANNED' || status === 'REJECTED' ? 'grayscale opacity-60' : ''}`} />
                                                        ) : (
                                                            <Package className="w-6 h-6 text-gray-300 m-auto mt-4" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium max-w-xs flex items-center text-gray-800">
                                                            <span className="truncate">{product.name}</span>
                                                            <BadWordWarning productName={product.name} variant="seller" />
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">ID: {product.id}</p>
                                                        {product.violationReason && (status === 'BANNED' || status === 'REJECTED') && (
                                                            <p className="text-xs text-red-500 italic mt-0.5 truncate max-w-[200px]" title={product.violationReason}>
                                                                Lý do: {product.violationReason}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-primary-darker font-bold">{formatPrice(product.price)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stockQuantity > 10 ? 'bg-green-50 text-green-700' : product.stockQuantity > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                                                    {product.stockQuantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-500">{product.category?.name || '—'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderStatusBadge(product)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link to={toProductSlug(product.name, product.id)} target="_blank"
                                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Xem">
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link to={`/seller/edit-product/${product.id}`}
                                                        className="p-2 text-gray-400 hover:text-primary-dark hover:bg-primary-lighter rounded-lg transition" title="Sửa">
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(product.id, product.name)} disabled={deleting === product.id}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40" title="Xoá">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}
                            totalItems={filtered.length} startItem={indexOfFirst + 1}
                            endItem={Math.min(indexOfLast, filtered.length)} itemLabel="sản phẩm" accentColor="orange"
                        />
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-3 text-gray-200" />
                        <p className="text-gray-400 text-lg mb-1">
                            {searchTerm || activeTab !== 'ALL' ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
                        </p>
                        <p className="text-gray-300 text-sm mb-4">
                            {searchTerm || activeTab !== 'ALL' ? 'Thử thay đổi bộ lọc' : 'Bắt đầu bán hàng ngay!'}
                        </p>
                        {!searchTerm && activeTab === 'ALL' && (
                            <Link to="/seller/add-product"
                                className="inline-flex items-center gap-2 bg-primary-dark text-white px-5 py-2 rounded-lg hover:bg-primary-darker transition">
                                <Plus className="w-4 h-4" /> Thêm sản phẩm đầu tiên
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerProducts;
