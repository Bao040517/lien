import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Plus, DollarSign, ShoppingBag, Eye, Star, MessageSquare, RotateCcw, ShoppingCart, AlertTriangle } from 'lucide-react';
import api from '../../api';
import { getImageUrl } from '../../utils';
import Pagination from '../../components/Pagination';

const SellerDashboard = () => {
    const { user } = useAuth();
    const { shopProfile } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [productDetailStats, setProductDetailStats] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
        totalSold: 0,
        totalFeedback: 0,
        returnRate: 0,
        averageRating: 0
    });

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const statsRes = await api.get(`/seller/statistics?sellerId=${user.id}`);
            const statsData = statsRes.data.data || statsRes.data;

            if (statsData) {
                setStats({
                    totalProducts: statsData.totalProducts || 0,
                    totalOrders: statsData.totalOrders || 0,
                    revenue: statsData.totalRevenue || 0,
                    totalSold: statsData.totalSold || 0,
                    totalFeedback: statsData.totalFeedback || 0,
                    returnRate: statsData.returnRate || 0,
                    averageRating: statsData.averageRating || 0
                });

                // Dữ liệu chi tiết từng sản phẩm từ backend
                if (statsData.productDetailStats) {
                    setProductDetailStats(statsData.productDetailStats);
                }
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productDetailStats.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(productDetailStats.length / productsPerPage);



    return (
        <div>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary-dark to-primary-dark rounded-2xl p-6 mb-8 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-1">Xin chào, {shopProfile?.name || user?.username}! 👋</h1>
                <p className="text-primary-light">Chào mừng bạn đến Kênh Người Bán. Quản lý shop của bạn tại đây.</p>
                <div className="flex gap-3 mt-4">
                    <Link to="/seller/add-product"
                        className="flex items-center gap-2 bg-white text-primary-dark px-5 py-2 rounded-lg font-medium hover:bg-primary-lighter transition shadow-sm">
                        <Plus className="w-4 h-4" /> Thêm sản phẩm
                    </Link>
                    <Link to="/seller/product-analytics"
                        className="flex items-center gap-2 bg-white/20 text-white px-5 py-2 rounded-lg font-medium hover:bg-white/30 transition backdrop-blur-sm">
                        <Package className="w-4 h-4" /> Thống kê sản phẩm
                    </Link>
                </div>
            </div>

            {/* Banner cảnh báo sản phẩm bị khóa */}
            {productDetailStats.some(p => p.isBanned) && (
                <div className="bg-gradient-to-r from-primary-lighter to-primary-lighter border border-primary-light rounded-xl p-4 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-red-800 font-semibold">⚠️ Có {productDetailStats.filter(p => p.isBanned).length} sản phẩm bị khóa!</p>
                        <p className="text-red-600 text-sm">Vui lòng kiểm tra và cập nhật lại thông tin sản phẩm vi phạm.</p>
                    </div>
                    <Link to="/seller/products" className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium whitespace-nowrap">
                        Xem chi tiết →
                    </Link>
                </div>
            )}

            {/* Summary Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Tổng Sản Phẩm</h3>
                            <p className="text-2xl font-bold mt-1 text-gray-800">{stats.totalProducts}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary-lighter rounded-xl flex items-center justify-center">
                            <Package className="text-primary-dark w-5 h-5" />
                        </div>
                    </div>
                    <Link to="/seller/products" className="text-xs text-primary-dark hover:underline mt-2 block">Xem tất cả →</Link>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Đơn Hàng</h3>
                            <p className="text-2xl font-bold mt-1 text-gray-800">{stats.totalOrders}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="text-blue-500 w-5 h-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wide">Doanh Thu</h3>
                            <p className="text-2xl font-bold mt-1 text-gray-800">{formatPrice(stats.revenue)}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                            <DollarSign className="text-green-500 w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chi tiết sản phẩm - Detail Table from Backend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Chi tiết sản phẩm</h3>
                    <Link to="/seller/products"
                        className="text-sm text-primary-dark hover:text-primary-darker font-medium">
                        Xem tất cả →
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-primary-dark border-t-transparent rounded-full mx-auto mb-2"></div>
                        Đang tải...
                    </div>
                ) : productDetailStats.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                                    <th className="px-4 py-3 text-left font-medium">Sản Phẩm</th>
                                    <th className="px-4 py-3 text-left font-medium">Giá</th>
                                    <th className="px-4 py-3 text-center font-medium">Kho</th>
                                    <th className="px-4 py-3 text-center font-medium">Đã Bán</th>
                                    <th className="px-4 py-3 text-center font-medium">Đánh Giá</th>
                                    <th className="px-4 py-3 text-center font-medium">Sao TB</th>
                                    <th className="px-4 py-3 text-center font-medium">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product) => (
                                    <tr key={product.productId} className={`border-t border-gray-100 transition ${product.isBanned
                                        ? 'bg-red-50 border-l-4 border-red-500 hover:bg-red-100/50'
                                        : 'hover:bg-primary-lighter/30'
                                        }`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                    {product.imageUrl ? (
                                                        <img src={getImageUrl(product.imageUrl)} alt="" className={`w-full h-full object-cover ${product.isBanned ? 'grayscale opacity-60' : ''}`} />
                                                    ) : (
                                                        <Package className="w-4 h-4 text-gray-300 m-auto mt-3" />
                                                    )}
                                                    {product.isBanned && (
                                                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`font-medium text-sm truncate max-w-[200px] ${product.isBanned ? 'text-red-700' : 'text-gray-900'}`}>
                                                        {product.productName}
                                                        {product.isBanned && (
                                                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                                                                <AlertTriangle className="w-3 h-3" /> BỊ KHÓA
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-400">ID: {product.productId}</p>
                                                    {product.isBanned && product.violationReason && (
                                                        <p className="text-xs text-red-500 mt-0.5 truncate max-w-[200px]" title={product.violationReason}>
                                                            Lý do: {product.violationReason}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-semibold text-primary-darker">{formatPrice(product.price)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-medium ${product.stockQuantity <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                                                {product.stockQuantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-medium text-purple-600">{product.sold}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-medium text-blue-600">{product.reviewCount}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star className={`w-3.5 h-3.5 ${product.averageRating > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                <span className="font-medium text-gray-700">{product.averageRating.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link to={`/seller/edit-product/${product.productId}`}
                                                className="p-1.5 text-gray-400 hover:text-primary-dark hover:bg-primary-lighter rounded-lg transition inline-block">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {/* Tổng (Totals Row) - all from backend */}
                            <tfoot>
                                <tr className="bg-primary-lighter border-t-2 border-primary font-bold text-gray-800">
                                    <td className="px-4 py-3" colSpan={2}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary-darker">TỔNG CỘNG</span>
                                            <span className="text-sm font-normal text-gray-400">({productDetailStats.length} sản phẩm)</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-600">
                                        {productDetailStats.reduce((sum, p) => sum + (p.stockQuantity || 0), 0)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-purple-600">{stats.totalSold}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-blue-600">{stats.totalFeedback}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                            <span className="text-yellow-600">{stats.averageRating}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1 text-sm">
                                            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                                            <span className={`${stats.returnRate > 5 ? 'text-red-500' : 'text-green-600'}`}>
                                                {stats.returnRate}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={productDetailStats.length}
                            startItem={indexOfFirstProduct + 1}
                            endItem={Math.min(indexOfLastProduct, productDetailStats.length)}
                            itemLabel="sản phẩm"
                            accentColor="orange"
                        />
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                        <p>Chưa có sản phẩm nào.</p>
                        <Link to="/seller/add-product"
                            className="inline-flex items-center gap-2 mt-3 bg-primary-dark text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-darker transition">
                            <Plus className="w-4 h-4" /> Thêm sản phẩm đầu tiên
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
