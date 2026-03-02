import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api';
import { ShoppingBag, Filter } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { getImageUrl, toProductSlug } from '../utils';

const CategoryProducts = () => {
    const { id } = useParams();
    const location = useLocation();
    const categoryName = location.state?.categoryName || 'Danh mục';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('relevance');

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Call filter endpoint with categoryId
                const res = await api.get(`/products/filter`, {
                    params: {
                        categoryId: id,
                        sortBy: sortBy === 'relevance' ? null : sortBy
                    }
                });
                setProducts(res.data.data?.content || res.data.data || []);
            } catch (error) {
                console.error("Error fetching category products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProducts();
        }
    }, [id, sortBy]);

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <Breadcrumb items={[
                        { label: 'Trang chủ', path: '/' },
                        { label: categoryName }
                    ]} />
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-4 rounded shadow-sm mb-6">
                    <div className="flex items-center gap-4 overflow-x-auto">
                        <span className="text-gray-500 flex items-center gap-1 whitespace-nowrap"><Filter className="w-4 h-4" /> Sắp xếp theo</span>
                        <button
                            className={`px-4 py-2 rounded-sm text-sm whitespace-nowrap ${sortBy === 'relevance' ? 'bg-primary-dark text-white' : 'bg-white border hover:bg-gray-50'}`}
                            onClick={() => setSortBy('relevance')}
                        >
                            Liên quan
                        </button>
                        <button
                            className={`px-4 py-2 rounded-sm text-sm whitespace-nowrap ${sortBy === 'date_desc' ? 'bg-primary-dark text-white' : 'bg-white border hover:bg-gray-50'}`}
                            onClick={() => setSortBy('date_desc')}
                        >
                            Mới nhất
                        </button>
                        <button
                            className={`px-4 py-2 rounded-sm text-sm whitespace-nowrap ${sortBy === 'price_asc' ? 'bg-primary-dark text-white' : 'bg-white border hover:bg-gray-50'}`}
                            onClick={() => setSortBy('price_asc')}
                        >
                            Giá: Thấp đến Cao
                        </button>
                        <button
                            className={`px-4 py-2 rounded-sm text-sm whitespace-nowrap ${sortBy === 'price_desc' ? 'bg-primary-dark text-white' : 'bg-white border hover:bg-gray-50'}`}
                            onClick={() => setSortBy('price_desc')}
                        >
                            Giá: Cao đến Thấp
                        </button>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-dark mx-auto"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {products.map((product) => (
                            <Link to={toProductSlug(product.name, product.id)} key={product.id} className="bg-white rounded hover:shadow-lg hover:-translate-y-0.5 transition duration-100 border border-transparent hover:border-primary-dark cursor-pointer overflow-hidden relative block group">
                                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                                    {product.imageUrl ? (
                                        <img src={getImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                                    )}
                                    {product.discountPercentage > 0 && (
                                        <div className="absolute top-0 right-0 bg-yellow-100 text-primary-dark px-1 text-xs font-semibold z-10">
                                            -{product.discountPercentage}%
                                        </div>
                                    )}
                                </div>
                                <div className="p-2">
                                    <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] mb-2">{product.name}</h3>
                                    <div className="flex justify-between items-end min-h-[44px]">
                                        <div className="flex flex-col justify-end">
                                            <div className="text-primary-dark font-medium leading-tight text-sm">
                                                {formatPrice(product.discountedPrice || product.price || 0)}
                                            </div>
                                            {product.discountPercentage > 0 && (
                                                <div className="text-gray-400 text-xs line-through mt-0.5">
                                                    {formatPrice(product.price || 0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 pb-1">Đã bán {product.sold || 0}</div>
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
                        <h3 className="text-lg text-gray-800 mb-2">Chưa có sản phẩm nào trong danh mục này</h3>
                        <Link to="/" className="text-primary-dark hover:underline">Quay lại trang chủ</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProducts;
