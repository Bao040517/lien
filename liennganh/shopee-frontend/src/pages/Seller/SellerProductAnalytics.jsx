import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { Trophy, TrendingUp, Package, AlertTriangle, ArrowUpRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils';

const SellerProductAnalytics = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [topProducts, setTopProducts] = useState([]);
    const [productDetailStats, setProductDetailStats] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalSold: 0
    });

    useEffect(() => {
        if (!user) return;

        api.get('/seller/statistics', {
            params: { sellerId: user.id }
        })
            .then(res => {
                const data = res.data.data || res.data;
                setTopProducts(data.topProducts || []);
                setProductDetailStats(data.productDetailStats || []);
                setStats({
                    totalRevenue: data.totalRevenue || 0,
                    totalOrders: data.totalOrders || 0,
                    totalSold: data.totalSold || 0
                });
            })
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, [user]);

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p || 0);

    // Tính toán Top Sản phẩm: Doanh thu cao nhất vs Bán chạy nhất
    const topByRevenue = [...topProducts].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
    // topProducts từ backend mặc định đang là top bán chạy (theo số lượng `sold`), nhưng ta sort lại cho chắc
    const topBySold = [...topProducts].sort((a, b) => b.sold - a.sold).slice(0, 10);

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Hết hàng', color: 'text-red-600 bg-red-50 border-red-200' };
        if (stock < 10) return { label: 'Sắp hết', color: 'text-orange-600 bg-orange-50 border-orange-200' };
        return { label: 'Còn hàng', color: 'text-green-600 bg-green-50 border-green-200' };
    };

    const getProductDetail = (productId) => {
        return productDetailStats.find(p => p.productId === productId) || {};
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
                <p>Đang tải dữ liệu phân tích sản phẩm...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-7 h-7 text-orange-500" />
                        Thống Kê Sản Phẩm
                    </h1>
                    <p className="text-gray-500 mt-1">Phân tích hiệu suất bán hàng của từng mặt hàng</p>
                </div>
                <Link to="/seller/products" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm font-medium text-sm flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Đến trang Quản lý SP
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bảng Xếp Hạng 1: Bán Chạy Nhất (Số lượng) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <Trophy className="w-4 h-4" />
                            </div>
                            <h2 className="font-bold text-gray-800">Top 10 Bán Chạy Nhất</h2>
                        </div>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">{topBySold.length} Sản phẩm</span>
                    </div>

                    <div className="flex-1 p-0 overflow-y-auto max-h-[500px]">
                        {topBySold.length > 0 ? (
                            <ul className="divide-y divide-gray-50">
                                {topBySold.map((product, index) => (
                                    <li key={product.productId} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                                            ${index === 0 ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' :
                                                index === 1 ? 'bg-gray-200 text-gray-600 border border-gray-300' :
                                                    index === 2 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                        'bg-gray-100 text-gray-400'}`}>
                                            #{index + 1}
                                        </div>
                                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50 flex items-center justify-center">
                                            {getProductDetail(product.productId).imageUrl ? (
                                                <img src={getImageUrl(getProductDetail(product.productId).imageUrl)} alt={product.productName} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/product/${product.productId}`} target="_blank" className="font-medium text-gray-800 hover:text-orange-500 truncate block mb-1">
                                                {product.productName}
                                            </Link>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1 font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                                    <Package className="w-3 h-3" /> Đã bán: {product.sold}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <Package className="w-8 h-8 mb-2 opacity-50" />
                                <p>Chưa có dữ liệu sản phẩm</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bảng Xếp Hạng 2: Doanh Thu Cao Nhất */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <DollarSign className="w-4 h-4" />
                            </div>
                            <h2 className="font-bold text-gray-800">Top 10 Doanh Thu Tốt Nhất</h2>
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">{topByRevenue.length} Sản phẩm</span>
                    </div>

                    <div className="flex-1 p-0 overflow-y-auto max-h-[500px]">
                        {topByRevenue.length > 0 ? (
                            <ul className="divide-y divide-gray-50">
                                {topByRevenue.map((product, index) => (
                                    <li key={product.productId} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                                            ${index === 0 ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' :
                                                index === 1 ? 'bg-gray-200 text-gray-600 border border-gray-300' :
                                                    index === 2 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                        'bg-gray-100 text-gray-400'}`}>
                                            #{index + 1}
                                        </div>
                                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50 flex items-center justify-center">
                                            {getProductDetail(product.productId).imageUrl ? (
                                                <img src={getImageUrl(getProductDetail(product.productId).imageUrl)} alt={product.productName} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex items-center justify-between">
                                            <div className="pr-4">
                                                <Link to={`/product/${product.productId}`} target="_blank" className="font-medium text-gray-800 hover:text-green-600 line-clamp-2 mb-1 text-sm">
                                                    {product.productName}
                                                </Link>
                                                <p className="text-xs text-gray-400">Giá: {formatPrice(getProductDetail(product.productId).price)}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-green-600">{formatPrice(product.revenue)}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <DollarSign className="w-8 h-8 mb-2 opacity-50" />
                                <p>Chưa có dữ liệu doanh thu</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chi tiết tất cả List sản phẩm (Có thống kê Kho và Tồn) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-8 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 text-lg">Danh Sách Theo Hiệu Suất</h2>
                    <p className="text-sm text-gray-500">Giám sát tổng quan về doanh số và tồn kho của sản phẩm có tương tác</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                                <th className="px-6 py-4 font-semibold">Giá Bán</th>
                                <th className="px-6 py-4 font-semibold text-center">Tồn Kho</th>
                                <th className="px-6 py-4 font-semibold text-center">Đã Bán</th>
                                <th className="px-6 py-4 font-semibold text-right">Tổng Doanh Thu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {topProducts.length > 0 ? (
                                topProducts.map(product => {
                                    const detail = getProductDetail(product.productId);
                                    const stockInfo = getStockStatus(detail.stockQuantity || 0);
                                    return (
                                        <tr key={`list-${product.productId}`} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <Link to={`/product/${product.productId}`} target="_blank" className="font-medium text-gray-800 hover:text-orange-500 flex items-center gap-3">
                                                    <div className="w-10 h-10 shrink-0 rounded border border-gray-100 bg-gray-50 flex flex-col items-center justify-center overflow-hidden">
                                                        {detail.imageUrl ? (
                                                            <img src={getImageUrl(detail.imageUrl)} alt={product.productName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-gray-300" />
                                                        )}
                                                    </div>
                                                    <span className="line-clamp-2 max-w-xs">{product.productName}</span>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {formatPrice(detail.price)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${stockInfo.color}`}>
                                                    {(detail.stockQuantity || 0) < 10 && <AlertTriangle className="w-3 h-3" />}
                                                    {detail.stockQuantity || 0} ({stockInfo.label})
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-semibold text-gray-800">{product.sold}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-bold text-green-600">{formatPrice(product.revenue)}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        Không có dữ liệu chi tiết
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerProductAnalytics;
