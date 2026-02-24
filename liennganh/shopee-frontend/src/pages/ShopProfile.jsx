import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Star, MapPin, MessageSquare, Plus, ShoppingBag, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { getImageUrl } from '../utils';

const ShopProfile = () => {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                const [shopRes, productsRes, vouchersRes] = await Promise.all([
                    api.get(`/shops/${id}`),
                    api.get(`/products/shop/${id}`, { params: { size: 10000 } }),
                    api.get(`/vouchers/shop/${id}`)
                ]);

                setShop(shopRes.data.data);
                setProducts(productsRes.data.data?.content || productsRes.data.data || []);
                setVouchers(vouchersRes.data.data?.content || vouchersRes.data.data || []);
            } catch (error) {
                console.error("Error fetching shop data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchShopData();
        }
    }, [id]);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
    if (!shop) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Shop not found</div>;

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            {/* Shop Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Shop Card */}
                        <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-800 rounded-lg p-4 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-600 border-2 border-white flex items-center justify-center overflow-hidden">
                                        <ShoppingBag className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-lg">{shop.name}</h1>
                                        <div className="text-xs text-gray-300">Online 5 phút trước</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-1.5 border border-white rounded text-sm font-medium flex items-center justify-center gap-1 hover:bg-white/10 transition">
                                        <Plus className="w-4 h-4" /> Theo dõi
                                    </button>
                                    <button className="flex-1 py-1.5 border border-white rounded text-sm font-medium flex items-center justify-center gap-1 hover:bg-white/10 transition">
                                        <MessageSquare className="w-4 h-4" /> Chat
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Shop Stats */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 py-2">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-gray-500" />
                                <div>
                                    <div className="text-gray-500 text-sm">Sản phẩm:</div>
                                    <div className="text-orange-500 font-medium">{products.length}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Star className="w-5 h-5 text-gray-500" />
                                <div>
                                    <div className="text-gray-500 text-sm">Đánh giá:</div>
                                    <div className="text-orange-500 font-medium">4.9 (2.1k đánh giá)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-gray-500" />
                                <div>
                                    <div className="text-gray-500 text-sm">Tỉ lệ phản hồi:</div>
                                    <div className="text-orange-500 font-medium">98%</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <div>
                                    <div className="text-gray-500 text-sm">Tham gia:</div>
                                    <div className="text-orange-500 font-medium text-sm">12 tháng trước</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-6 space-y-6">

                {/* Vouchers Section (Swipeable) */}
                {vouchers.length > 0 && (
                    <div className="bg-white p-4 rounded shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-800 uppercase">Mã Giảm Giá Của Shop</h2>
                        </div>
                        <div className="relative group">
                            {/* Container for horizontal scroll */}
                            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {vouchers.map(voucher => (
                                    <div key={voucher.id} className="min-w-[280px] md:min-w-[320px] bg-gradient-to-r from-orange-500 to-orange-400 rounded-sm p-0.5 flex shadow-sm snap-start shrink-0 relative">
                                        {/* Left part (Main visual) */}
                                        <div className="bg-white w-24 md:w-28 flex flex-col items-center justify-center border-r border-dashed border-gray-200 relative p-2">
                                            <div className="text-orange-500 font-bold text-sm md:text-base text-center">
                                                {voucher.discountType === 'PERCENTAGE' ? `${voucher.discountValue}%` : formatPrice(voucher.discountValue)}
                                            </div>
                                            <div className="text-gray-500 text-xs text-center mt-1">GIẢM</div>
                                            {/* Serrated edge visual trick */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col justify-between overflow-hidden">
                                                {[...Array(10)].map((_, i) => <div key={i} className="w-2 h-2 bg-gray-100 rounded-full -ml-1"></div>)}
                                            </div>
                                        </div>

                                        {/* Right part (Details) */}
                                        <div className="flex-1 bg-white p-2 md:p-3 flex flex-col justify-between relative overflow-hidden">
                                            <div>
                                                <div className="text-xs md:text-sm font-medium line-clamp-2">
                                                    Giảm {voucher.discountType === 'PERCENTAGE' ? `${voucher.discountValue}%` : formatPrice(voucher.discountValue)}
                                                    {voucher.minOrderValue > 0 ? ` Đơn tối thiểu ${formatPrice(voucher.minOrderValue)}` : ''}
                                                </div>
                                                <div className="text-[10px] md:text-xs text-gray-400 mt-1">HSD: {formatDate(voucher.endDate)}</div>
                                            </div>

                                            <div className="flex justify-end mt-2">
                                                <button className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition shadow-sm">
                                                    Lưu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Shop Products */}
                <div>
                    <div className="bg-white p-4 rounded shadow-sm">
                        <div className="flex items-center justify-between mb-4 border-b pb-2">
                            <h2 className="text-lg font-medium text-gray-800 uppercase">Sản Phẩm Của Shop</h2>
                            <div className="flex gap-2 text-sm text-gray-500">
                                <span className="text-orange-500 font-medium cursor-pointer">Phổ biến</span>
                                <span className="cursor-pointer hover:text-orange-500">Mới nhất</span>
                                <span className="cursor-pointer hover:text-orange-500">Bán chạy</span>
                            </div>
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">Shop chưa có sản phẩm nào.</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {products.map((product) => (
                                    <Link key={product.id} to={`/product/${product.id}`} className="bg-white border hover:border-orange-500 transition rounded-sm overflow-hidden group">
                                        <div className="aspect-square bg-gray-200 relative">
                                            {product.imageUrl ? (
                                                <img src={getImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                            {/* Flash Sale Tag (Mock) */}
                                            {Math.random() > 0.8 && (
                                                <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs px-2 py-0.5 font-medium">
                                                    -15%
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2">
                                            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 group-hover:text-orange-500 transition">
                                                {product.name}
                                            </h3>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-orange-500 text-base font-medium">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <span className="text-xs text-gray-500">Đã bán {product.soldCount || 0}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopProfile;
