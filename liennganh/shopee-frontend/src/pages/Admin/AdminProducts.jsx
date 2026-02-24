import { useState, useEffect } from 'react';
import api from '../../api';
import { Search, Plus, Trash2, Edit, Save, X, Ban, Settings, CheckCircle, Package, ExternalLink, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/Admin/ConfirmModal';
import PromptModal from '../../components/Admin/PromptModal';
import { getImageUrl } from '../../utils';
import { useToast } from '../../context/ToastContext';

const AdminProducts = () => {
    const toast = useToast();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('ALL');
    const [lastSeenMaxId, setLastSeenMaxId] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', targetId: null, action: '' });
    const [promptModal, setPromptModal] = useState({ isOpen: false, title: '', message: '', targetId: null, targetName: '' });


    useEffect(() => {
        // Lấy maxId đã xem lần trước từ localStorage
        const savedMaxId = parseInt(localStorage.getItem('admin_products_last_seen_max_id') || '0');
        setLastSeenMaxId(savedMaxId);
        fetchData();
    }, []);

    const fetchData = () => {
        Promise.all([
            api.get('/products/all', { params: { size: 1000 } }), // Fetch virtually all for client-side pagination or increase size
            api.get('/categories', { params: { size: 1000 } })
        ]).then(([pRes, cRes]) => {
            const allProducts = pRes.data.data?.content || pRes.data.data || [];
            // Sắp xếp theo ID giảm dần → sản phẩm mới nhất lên đầu
            allProducts.sort((a, b) => b.id - a.id);
            setProducts(allProducts);
            setCategories(cRes.data.data?.content || cRes.data.data || []);

            // Lưu maxId hiện tại vào localStorage để lần sau biết đâu là "mới"
            if (allProducts.length > 0) {
                const currentMaxId = Math.max(...allProducts.map(p => p.id));
                localStorage.setItem('admin_products_last_seen_max_id', currentMaxId.toString());
            }
        }).catch(e => console.error(e))
            .finally(() => setLoading(false));
    };

    // Kiểm tra sản phẩm có phải mới tạo không (ID > lastSeenMaxId)
    const isNewProduct = (product) => lastSeenMaxId > 0 && product.id > lastSeenMaxId;

    const handleDelete = (id, name) => {
        setConfirmModal({
            isOpen: true,
            type: 'danger',
            title: `Xoá sản phẩm "${name}"?`,
            message: 'Hành động này không thể hoàn tác.',
            targetId: id,
            action: 'delete'
        });
    };

    const confirmDelete = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch { toast.error('Xoá thất bại!'); }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleBan = (id, name) => {
        setPromptModal({
            isOpen: true,
            title: `Khóa sản phẩm "${name}"`,
            message: 'Vui lòng nhập lý do khóa sản phẩm:',
            targetId: id,
            targetName: name
        });
    };

    const confirmBan = async (reason) => {
        const id = promptModal.targetId;
        try {
            await api.put(`/products/${id}/ban`, null, { params: { reason } });
            setProducts(prev => prev.map(p =>
                p.id === id ? { ...p, banned: true, isBanned: true, violationReason: reason } : p
            ));
        } catch (e) {
            toast.error('Khóa thất bại: ' + (e.response?.data?.message || e.message));
        }
        setPromptModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleUnban = (id, name) => {
        setConfirmModal({
            isOpen: true,
            type: 'success',
            title: `Mở khóa sản phẩm "${name}"?`,
            message: 'Sản phẩm sẽ được hiển thị trở lại bình thường.',
            targetId: id,
            action: 'unban'
        });
    };

    const confirmUnban = async (id) => {
        try {
            await api.put(`/products/${id}/unban`);
            setProducts(prev => prev.map(p =>
                p.id === id ? { ...p, banned: false, isBanned: false, violationReason: null } : p
            ));
        } catch (e) {
            toast.error('Mở khóa thất bại: ' + (e.response?.data?.message || e.message));
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    const newCount = products.filter(p => isNewProduct(p)).length;

    const filtered = products.filter(p => {
        const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'ALL' || p.category?.id?.toString() === catFilter;
        return matchSearch && matchCat;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [search, catFilter]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filtered.length / productsPerPage);



    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">{products.length} sản phẩm trong hệ thống</p>
                </div>
            </div>

            {/* Banner thông báo sản phẩm mới */}
            {newCount > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-green-800 font-semibold">🎉 Có {newCount} sản phẩm mới vừa được tạo!</p>
                        <p className="text-green-600 text-sm">Sản phẩm mới đã được đưa lên đầu danh sách và đánh dấu nổi bật.</p>
                    </div>
                </div>
            )}

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
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3">Danh mục / Shop</th>
                                    <th className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentProducts.map(product => {
                                    const isBanned = product.banned || product.isBanned;
                                    const isNew = isNewProduct(product);
                                    return (
                                        <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors ${isBanned ? 'bg-red-100 border-l-4 border-red-500'
                                            : isNew ? 'bg-green-50 border-l-4 border-green-500'
                                                : ''
                                            }`}>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                        {product.imageUrl ? (
                                                            <img src={getImageUrl(product.imageUrl)} alt="" className={`w-full h-full object-cover ${isBanned ? 'grayscale' : ''}`} />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-gray-300 m-auto mt-3.5" />
                                                        )}
                                                        {isBanned && (
                                                            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                                                <ShieldAlert className="w-6 h-6 text-red-600 drop-shadow-sm" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-sm font-medium truncate max-w-xs ${isBanned ? 'text-red-800' : isNew ? 'text-green-800' : 'text-gray-800'}`}>
                                                            {product.name}
                                                            {isNew && (
                                                                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full animate-bounce">
                                                                    <Sparkles className="w-3 h-3" /> MỚI
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-400">ID: {product.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="text-sm font-bold text-blue-600">{formatPrice(product.price)}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.stockQuantity > 10 ? 'bg-green-50 text-green-700'
                                                    : product.stockQuantity > 0 ? 'bg-yellow-50 text-yellow-700'
                                                        : 'bg-red-50 text-red-700'
                                                    }`}>{product.stockQuantity}</span>
                                            </td>
                                            <td className="px-6 py-3">
                                                {isBanned ? (
                                                    <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded border border-red-200 inline-block">
                                                        <span className="font-bold block flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> BỊ KHÓA</span>
                                                        <span className="italic max-w-[150px] truncate block mt-0.5" title={product.violationReason}>{product.violationReason}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">Đang bán</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-800">{product.category?.name || '—'}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {product.shop?.name || '—'}
                                                        {product.shop?.ownerUsername && (
                                                            <span className="text-gray-400"> ({product.shop.ownerUsername})</span>
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <a href={`/product/${product.id}`} target="_blank" rel="noreferrer"
                                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Xem">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>

                                                    {isBanned ? (
                                                        <button onClick={() => handleUnban(product.id, product.name)}
                                                            className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition shadow-sm" title="Gỡ khóa">
                                                            <ShieldCheck className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleBan(product.id, product.name)}
                                                            className="p-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition shadow-sm" title="Khóa / Cảnh báo">
                                                            <ShieldAlert className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <button onClick={() => handleDelete(product.id, product.name)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Xoá vĩnh viễn">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
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
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filtered.length}
                            startItem={indexOfFirstProduct + 1}
                            endItem={Math.min(indexOfLastProduct, filtered.length)}
                            itemLabel="sản phẩm"
                            accentColor="blue"
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                type={confirmModal.type}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={() => {
                    if (confirmModal.action === 'delete') confirmDelete(confirmModal.targetId);
                    else if (confirmModal.action === 'unban') confirmUnban(confirmModal.targetId);
                }}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />

            <PromptModal
                isOpen={promptModal.isOpen}
                title={promptModal.title}
                message={promptModal.message}
                defaultValue="Vi phạm tiêu chuẩn cộng đồng"
                placeholder="Nhập lý do..."
                onConfirm={confirmBan}
                onCancel={() => setPromptModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default AdminProducts;
