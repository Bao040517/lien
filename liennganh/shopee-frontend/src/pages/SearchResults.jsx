import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';
import { ShoppingBag, Filter, Store, Star, MessageSquare, Clock, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const [products, setProducts] = useState([]);
    const [matchedShop, setMatchedShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('relevance');

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setMatchedShop(null);
            try {
                // Fetch products and matching shops in parallel
                const [productsRes, shopsRes] = await Promise.all([
                    api.get(`/products/filter`, {
                        params: {
                            keyword: keyword,
                            sortBy: sortBy === 'relevance' ? null : sortBy
                        }
                    }),
                    api.get(`/shops/search`, { params: { keyword: keyword } })
                ]);

                setProducts(productsRes.data.data?.content || productsRes.data.data || []);

                // Take the first matched shop
                const shops = shopsRes.data.data || [];
                if (shops.length > 0) {
                    // Fetch product count for the matched shop
                    const shop = shops[0];
                    try {
                        const shopProductsRes = await api.get(`/products/shop/${shop.id}`, { params: { size: 1 } });
                        const totalElements = shopProductsRes.data.data?.totalElements || 0;
                        setMatchedShop({ ...shop, productCount: totalElements });
                    } catch {
                        setMatchedShop({ ...shop, productCount: 0 });
                    }
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (keyword) {
            fetchResults();
        } else {
            setProducts([]);
            setMatchedShop(null);
            setLoading(false);
        }
    }, [keyword, sortBy]);

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <div className="container mx-auto px-4 py-6">
                {/* Header & Filter Bar */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Link to="/">Trang chủ</Link>
                    <span>&gt;</span>
                    <span>Kết quả tìm kiếm cho "{keyword}"</span>
                </div>

                {/* Matched Shop Card */}
                {matchedShop && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b">
                            <span className="text-sm text-gray-500 font-medium">
                                SHOP LIÊN QUAN ĐẾN "<span className="uppercase text-gray-700">{keyword}</span>"
                            </span>
                            <Link
                                to={`/shop/${matchedShop.id}`}
                                className="text-orange-500 text-sm font-medium flex items-center gap-1 hover:underline"
                            >
                                Xem Shop <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="p-5 flex flex-col md:flex-row gap-6 items-start">
                            {/* Shop Info */}
                            <Link to={`/shop/${matchedShop.id}`} className="flex items-center gap-4 group shrink-0">
                                <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-md border-2 border-orange-300">
                                    {matchedShop.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-500 transition">
                                        {matchedShop.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Online</p>
                                </div>
                            </Link>

                            {/* Shop Stats */}
                            <div className="flex flex-wrap gap-x-8 gap-y-3 items-center text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <ShoppingBag className="w-4 h-4 text-orange-400" />
                                    <span>Sản Phẩm: </span>
                                    <span className="text-orange-500 font-semibold">{matchedShop.productCount}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Star className="w-4 h-4 text-orange-400" />
                                    <span>Đánh Giá: </span>
                                    <span className="text-orange-500 font-semibold">4.9</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MessageSquare className="w-4 h-4 text-orange-400" />
                                    <span>Tỉ Lệ Phản Hồi: </span>
                                    <span className="text-orange-500 font-semibold">99%</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                    <span>Phản Hồi: </span>
                                    <span className="text-orange-500 font-semibold">trong vài giờ</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="ml-auto shrink-0 hidden md:block">
                                <Link
                                    to={`/shop/${matchedShop.id}`}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2"
                                >
                                    <Store className="w-4 h-4" /> Xem Shop
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sort Bar */}
                <div className="bg-white p-4 rounded shadow-sm mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 flex items-center gap-1"><Filter className="w-4 h-4" /> Sắp xếp theo</span>
                        <button
                            className={`px-4 py-2 rounded-sm text-sm ${sortBy === 'relevance' ? 'bg-orange-500 text-white' : 'bg-white border hover:bg-gray-50'}`}
                            onClick={() => setSortBy('relevance')}
                        >
                            Liên quan
                        </button>
                        <button
                            className={`px-4 py-2 rounded-sm text-sm ${sortBy === 'date_desc' ? 'bg-orange-500 text-white' : 'bg-white border hover:bg-gray-50'}`}
                            onClick={() => setSortBy('date_desc')}
                        >
                            Mới nhất
                        </button>
                        <button
                            className={`px-4 py-2 rounded-sm text-sm ${sortBy === 'price_asc' ? 'bg-orange-500 text-white' : 'bg-white border hover:bg-gray-50'}`}
                            onClick={() => setSortBy('price_asc')}
                        >
                            Giá: Thấp đến Cao
                        </button>
                        <button
                            className={`px-4 py-2 rounded-sm text-sm ${sortBy === 'price_desc' ? 'bg-orange-500 text-white' : 'bg-white border hover:bg-gray-50'}`}
                            onClick={() => setSortBy('price_desc')}
                        >
                            Giá: Cao đến Thấp
                        </button>
                    </div>
                </div>

                {/* Results Title */}
                {!loading && products.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                        <ShoppingBag className="w-4 h-4" />
                        Kết quả tìm kiếm cho từ khoá '<span className="text-orange-500 font-medium">{keyword}</span>'
                    </div>
                )}

                {/* Results Grid */}
                {loading ? (
                    <div className="text-center py-20">Đang tìm kiếm...</div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {products.map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded hover:shadow-lg hover:-translate-y-0.5 transition duration-100 border border-transparent hover:border-orange-500 cursor-pointer overflow-hidden relative block group">
                                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                                    {product.imageUrl ? (
                                        <img src={getImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                                    )}
                                    {product.discountPercentage > 0 && (
                                        <div className="absolute top-0 right-0 bg-yellow-100 text-orange-500 px-1 text-xs font-semibold z-10">
                                            -{product.discountPercentage}%
                                        </div>
                                    )}
                                </div>
                                <div className="p-2">
                                    <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] mb-2">{product.name}</h3>
                                    <div className="flex justify-between items-end min-h-[44px]">
                                        <div className="flex flex-col justify-end">
                                            <div className="text-orange-500 font-medium leading-tight text-sm">
                                                {formatPrice(product.discountedPrice || product.price || 0)}
                                            </div>
                                            {product.discountPercentage > 0 && (
                                                <div className="text-gray-400 text-xs line-through mt-0.5">
                                                    {formatPrice(product.price || 0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 pb-1">Đã bán {product.soldCount || 0}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 text-center rounded shadow-sm">
                        <div className="flex justify-center mb-4">
                            <ShoppingBag className="w-16 h-16 text-gray-300" />
                        </div>
                        <h3 className="text-lg text-gray-800 mb-2">Không tìm thấy kết quả nào</h3>
                        <p className="text-gray-500">Hãy thử sử dụng các từ khóa chung chung hơn</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
