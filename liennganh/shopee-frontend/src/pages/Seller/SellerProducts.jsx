import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Plus, Search, Trash2, Edit3, Eye } from 'lucide-react';
import api from '../../api';

const SellerProducts = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (user) fetchProducts();
    }, [user]);

    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products/my-shop?userId=${user.id}`);
            const data = res.data.data || res.data.result || [];
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId, productName) => {
        if (!window.confirm(`Bạn có chắc muốn xoá sản phẩm "${productName}"?`)) return;
        setDeleting(productId);
        try {
            await api.delete(`/products/${productId}`);
            setProducts(prev => prev.filter(p => p.id !== productId));
        } catch (error) {
            console.error("Failed to delete:", error);
            alert('Xoá sản phẩm thất bại!');
        } finally {
            setDeleting(null);
        }
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
                    <p className="text-gray-500 text-sm mt-1">{products.length} sản phẩm</p>
                </div>
                <Link to="/seller/add-product"
                    className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition font-medium shadow-sm">
                    <Plus className="w-5 h-5" /> Thêm sản phẩm
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text" value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 outline-none"
                    />
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
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
                                    <th className="px-6 py-3">Biến thể</th>
                                    <th className="px-6 py-3">Danh mục</th>
                                    <th className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(product => (
                                    <tr key={product.id} className="hover:bg-orange-50/30 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt="" className={`w-full h-full object-cover ${product.banned ? 'grayscale opacity-75' : ''}`} />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-gray-300 m-auto mt-4" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`font-medium truncate max-w-xs ${product.banned ? 'text-red-700' : 'text-gray-900'}`}>{product.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">ID: {product.id}</p>
                                                    {product.banned && (
                                                        <div className="mt-1 text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded border border-red-200 inline-block">
                                                            <span className="font-bold flex items-center gap-1">⚠ BỊ KHÓA</span>
                                                            <span className="block italic mt-0.5 max-w-[200px] truncate" title={product.violationReason}>{product.violationReason}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-orange-600 font-bold">{formatPrice(product.price)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stockQuantity > 10
                                                ? 'bg-green-50 text-green-700'
                                                : product.stockQuantity > 0
                                                    ? 'bg-yellow-50 text-yellow-700'
                                                    : 'bg-red-50 text-red-700'
                                                }`}>
                                                {product.stockQuantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500">
                                                {product.variants?.length || 0} biến thể
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500">{product.category?.name || '—'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link to={`/product/${product.id}`} target="_blank"
                                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                                    title="Xem">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link to={`/seller/edit-product/${product.id}`}
                                                    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
                                                    title="Sửa">
                                                    <Edit3 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    disabled={deleting === product.id}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                                                    title="Xoá">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-3 text-gray-200" />
                        <p className="text-gray-400 text-lg mb-1">
                            {searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
                        </p>
                        <p className="text-gray-300 text-sm mb-4">
                            {searchTerm ? 'Thử từ khoá khác' : 'Bắt đầu bán hàng ngay!'}
                        </p>
                        {!searchTerm && (
                            <Link to="/seller/add-product"
                                className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition">
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
