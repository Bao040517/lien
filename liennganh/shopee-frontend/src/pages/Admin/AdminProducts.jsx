import { useState, useEffect } from 'react';
import api from '../../api';
import { Package, Search, Trash2, Eye, ExternalLink } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('ALL');

    useEffect(() => {
        Promise.all([
            api.get('/products'),
            api.get('/categories')
        ]).then(([pRes, cRes]) => {
            setProducts(pRes.data.data || []);
            setCategories(cRes.data.data || []);
        }).catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Xoá sản phẩm "${name}"? Hành động này không thể hoàn tác.`)) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch { alert('Xoá thất bại!'); }
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    const filtered = products.filter(p => {
        const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'ALL' || p.category?.id?.toString() === catFilter;
        return matchSearch && matchCat;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">{products.length} sản phẩm trong hệ thống</p>
                </div>
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
                                    <th className="px-6 py-3">Danh mục</th>
                                    <th className="px-6 py-3">Shop</th>
                                    <th className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-gray-300 m-auto mt-3.5" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{product.name}</p>
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
                                            <span className="text-sm text-gray-500">{product.category?.name || '—'}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="text-sm text-gray-500">{product.shop?.name || '—'}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <a href={`/product/${product.id}`} target="_blank" rel="noreferrer"
                                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Xem">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button onClick={() => handleDelete(product.id, product.name)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Xoá">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                <p>Không tìm thấy sản phẩm</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
