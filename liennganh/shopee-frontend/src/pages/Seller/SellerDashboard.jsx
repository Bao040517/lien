import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, Plus, DollarSign, ShoppingBag, TrendingUp, Eye } from 'lucide-react';
import api from '../../api';

const SellerDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0
    });

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const [productsRes, statsRes] = await Promise.all([
                api.get(`/products/my-shop?userId=${user.id}`),
                api.get(`/seller/statistics?sellerId=${user.id}`).catch(() => ({ data: { data: null } }))
            ]);

            // Handle Products
            const productsData = productsRes.data.data || productsRes.data.result;
            if (Array.isArray(productsData)) {
                setProducts(productsData);
            }

            // Handle Stats
            const statsData = statsRes.data.data || statsRes.data;
            if (statsData) {
                setStats({
                    totalProducts: statsData.totalProducts || 0,
                    totalOrders: statsData.totalOrders || 0,
                    revenue: statsData.totalRevenue || 0
                });
            } else {
                // Fallback if stats API fails or returns null (though it shouldn't)
                const prods = Array.isArray(productsData) ? productsData : [];
                setStats(prev => ({
                    ...prev,
                    totalProducts: prods.length,
                    revenue: prods.reduce((sum, p) => sum + (Number(p.price) * (p.sold || 0)), 0)
                }));
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-6 mb-8 text-white shadow-lg">
                <h1 className="text-2xl font-bold mb-1">Xin chào, {user?.username}! 👋</h1>
                <p className="text-orange-100">Chào mừng bạn đến Kênh Người Bán. Quản lý shop của bạn tại đây.</p>
                <div className="flex gap-3 mt-4">
                    <Link to="/seller/add-product"
                        className="flex items-center gap-2 bg-white text-orange-500 px-5 py-2 rounded-lg font-medium hover:bg-orange-50 transition shadow-sm">
                        <Plus className="w-4 h-4" /> Thêm sản phẩm
                    </Link>
                    <Link to="/seller/products"
                        className="flex items-center gap-2 bg-white/20 text-white px-5 py-2 rounded-lg font-medium hover:bg-white/30 transition backdrop-blur-sm">
                        <Package className="w-4 h-4" /> Quản lý sản phẩm
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Tổng Sản Phẩm</h3>
                            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Package className="text-orange-500 w-6 h-6" />
                        </div>
                    </div>
                    <Link to="/seller/products" className="text-xs text-orange-500 hover:underline mt-3 block">Xem tất cả →</Link>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Đơn Hàng</h3>
                            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.totalOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="text-blue-500 w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 text-sm font-medium">Doanh Thu</h3>
                            <p className="text-3xl font-bold mt-2 text-gray-800">{formatPrice(stats.revenue)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <DollarSign className="text-green-500 w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Sản phẩm gần đây</h3>
                    <Link to="/seller/products"
                        className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                        Xem tất cả →
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Đang tải...
                    </div>
                ) : (products && products.length > 0) ? (
                    <div className="divide-y divide-gray-50">
                        {products.slice(0, 5).map((product) => (
                            <div key={product.id} className="px-6 py-3 flex items-center gap-4 hover:bg-orange-50/30 transition">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-5 h-5 text-gray-300 m-auto mt-3.5" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                                    <p className="text-xs text-gray-400">{product.category?.name || 'Chưa phân loại'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-orange-600">{formatPrice(product.price)}</p>
                                    <p className="text-xs text-gray-400">Kho: {product.stockQuantity}</p>
                                </div>
                                <Link to={`/seller/edit-product/${product.id}`}
                                    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition">
                                    <Eye className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                        <p>Chưa có sản phẩm nào.</p>
                        <Link to="/seller/add-product"
                            className="inline-flex items-center gap-2 mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition">
                            <Plus className="w-4 h-4" /> Thêm sản phẩm đầu tiên
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
