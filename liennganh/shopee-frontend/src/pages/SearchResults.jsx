import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';
import { ShoppingBag, Filter } from 'lucide-react';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('relevance');

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                // Call filter endpoint
                const res = await api.get(`/products/filter`, {
                    params: {
                        keyword: keyword,
                        sortBy: sortBy === 'relevance' ? null : sortBy
                    }
                });
                setProducts(res.data.data || []);
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

                {/* Results Grid */}
                {loading ? (
                    <div className="text-center py-20">Đang tìm kiếm...</div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {products.map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded hover:shadow-lg hover:-translate-y-0.5 transition duration-100 border border-transparent hover:border-orange-500 cursor-pointer overflow-hidden relative block group">
                                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                                    )}
                                    {/* Sale badge */}
                                    <div className="absolute top-0 right-0 bg-yellow-100 text-orange-500 px-1 text-xs">
                                        -{product.id % 50 + 10}%
                                    </div>
                                </div>
                                <div className="p-2">
                                    <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] mb-2">{product.name}</h3>
                                    <div className="flex justify-between items-end">
                                        <div className="text-orange-500 font-medium">
                                            <span className="text-xs underline align-top">đ</span>
                                            <span className="text-lg">{product.price?.toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">Đã bán {product.soldCount || 100}</div>
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
