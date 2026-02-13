import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Minus, Plus, MessageSquare, Store } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { refreshCart } = useCart();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, reviewsRes] = await Promise.all([
                    api.get(`/products/${id}`),
                    api.get(`/reviews/product/${id}`)
                ]);
                const productData = productRes.data.data || productRes.data;
                setProduct(productData);
                setReviews(reviewsRes.data.data || reviewsRes.data || []);

                // Auto-select first variant if available
                if (productData.variants && productData.variants.length > 0) {
                    setSelectedVariant(productData.variants[0]);
                    try {
                        const attrs = JSON.parse(productData.variants[0].attributes);
                        setSelectedOptions(attrs);
                    } catch (e) { /* ignore */ }
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Parse variants into attribute groups
    const getAttributeGroups = () => {
        if (!product?.variants || product.variants.length === 0) return {};
        const groups = {};
        product.variants.forEach(variant => {
            try {
                const attrs = JSON.parse(variant.attributes);
                Object.entries(attrs).forEach(([key, value]) => {
                    if (!groups[key]) groups[key] = new Set();
                    groups[key].add(value);
                });
            } catch (e) { /* ignore */ }
        });
        // Convert sets to arrays
        Object.keys(groups).forEach(key => {
            groups[key] = [...groups[key]];
        });
        return groups;
    };

    const handleSelectOption = (attrName, value) => {
        const newOptions = { ...selectedOptions, [attrName]: value };
        setSelectedOptions(newOptions);

        // Find matching variant
        if (product?.variants) {
            const match = product.variants.find(v => {
                try {
                    const attrs = JSON.parse(v.attributes);
                    return Object.entries(newOptions).every(([k, val]) => attrs[k] === val);
                } catch (e) { return false; }
            });
            if (match) setSelectedVariant(match);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setAddingToCart(true);
        try {
            await api.post(`/cart/${user.id}/add`, null, {
                params: { productId: id, quantity }
            });
            alert("Đã thêm vào giỏ hàng!");
            refreshCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Thêm vào giỏ hàng thất bại.");
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Prepare items for checkout
        const itemToBuy = {
            product: product,
            quantity: quantity,
            variant: selectedVariant
        };

        navigate('/checkout', { state: { items: [itemToBuy] } });
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!product) return <div className="p-8 text-center">Product not found.</div>;

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const attributeGroups = getAttributeGroups();
    const displayPrice = selectedVariant ? selectedVariant.price : product.price;
    const displayStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
    const displayImage = selectedVariant?.imageUrl || product.imageUrl;

    // Price range for variants
    const getPriceRange = () => {
        if (!product.variants || product.variants.length === 0) return null;
        const prices = product.variants.map(v => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        if (min === max) return null;
        return { min, max };
    };
    const priceRange = getPriceRange();

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <div className="container mx-auto px-4 pt-6">
                {/* Product Info Card */}
                <div className="bg-white rounded shadow-sm p-6 mb-4 flex flex-col md:flex-row gap-8">
                    {/* Left: Image */}
                    <div className="w-full md:w-1/3">
                        <div className="aspect-square bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                            {displayImage ? (
                                <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <ShoppingCart className="w-20 h-20 text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl font-medium mb-2 line-clamp-2">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-4 text-sm">
                            <div className="flex items-center text-orange-500 border-b border-orange-500 pb-0.5">
                                <span className="font-bold underline mr-1">4.5</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                                </div>
                            </div>
                            <div className="border-l pl-4 border-gray-300 text-gray-500">
                                <span className="text-black font-medium border-b border-black pb-0.5 mr-1">{product.soldCount || 100}</span>
                                Đã Bán
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gray-50 p-4 mb-6">
                            {priceRange && !selectedVariant ? (
                                <div className="text-3xl font-medium text-orange-500">
                                    {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                                </div>
                            ) : (
                                <div className="text-3xl font-medium text-orange-500">{formatPrice(displayPrice)}</div>
                            )}
                        </div>

                        {/* Variant Selectors */}
                        {Object.entries(attributeGroups).length > 0 && (
                            <div className="space-y-4 mb-6">
                                {Object.entries(attributeGroups).map(([attrName, options]) => (
                                    <div key={attrName} className="flex items-start gap-6">
                                        <span className="text-gray-500 w-24 pt-2 shrink-0">{attrName}</span>
                                        <div className="flex flex-wrap gap-2">
                                            {options.map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleSelectOption(attrName, opt)}
                                                    className={`px-4 py-2 border rounded-sm text-sm transition ${selectedOptions[attrName] === opt
                                                        ? 'border-orange-500 text-orange-500 bg-orange-50'
                                                        : 'border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-400'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Quantity */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-6">
                                    <span className="text-gray-500 w-24">Số Lượng</span>
                                    <div className="flex items-center border border-gray-300 rounded-sm">
                                        <button
                                            onClick={() => { setQuantity(Math.max(1, quantity - 1)); }}
                                            disabled={quantity <= 1}
                                            className="px-3 py-1 border-r border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        ><Minus className="w-3 h-3" /></button>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={quantity}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                // Allow empty for typing
                                                if (val === '') { setQuantity(''); return; }
                                                const num = parseInt(val, 10);
                                                if (!isNaN(num) && num >= 0) {
                                                    setQuantity(num);
                                                }
                                            }}
                                            onBlur={() => {
                                                // On blur, enforce min 1 and max stock
                                                const num = parseInt(quantity, 10);
                                                if (!num || num < 1) setQuantity(1);
                                                else if (num > displayStock) setQuantity(displayStock);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') e.target.blur();
                                            }}
                                            className="w-14 text-center outline-none py-1"
                                        />
                                        <button
                                            onClick={() => {
                                                if (quantity < displayStock) setQuantity(quantity + 1);
                                            }}
                                            disabled={quantity >= displayStock}
                                            className="px-3 py-1 border-l border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        ><Plus className="w-3 h-3" /></button>
                                    </div>
                                    <span className="text-gray-500 text-sm">{displayStock} sản phẩm có sẵn</span>
                                </div>
                                {/* Stock warning */}
                                {quantity !== '' && parseInt(quantity, 10) > displayStock && (
                                    <div className="ml-30 text-red-500 text-sm font-medium animate-pulse">
                                        ⚠ Số lượng vượt quá hàng trong kho! (tối đa {displayStock})
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || !quantity || quantity < 1 || quantity > displayStock}
                                    className="px-6 py-3 border border-orange-500 bg-orange-50 text-orange-500 rounded-sm flex items-center gap-2 hover:bg-orange-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Thêm Vào Giỏ Hàng
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={!quantity || quantity < 1 || quantity > displayStock}
                                    className="px-8 py-3 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Mua Ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shop Info */}
                <div className="bg-white rounded shadow-sm p-6 mb-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Store className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                        <div className="font-medium text-lg">{product.shop?.name || product.shopName || "Cửa hàng chính hãng"}</div>
                        <div className="text-gray-500 text-sm">Online 5 phút trước</div>
                        <div className="flex gap-2 mt-2">
                            <button className="px-3 py-1 border border-orange-500 text-orange-500 text-sm bg-orange-50 rounded-sm flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" /> Chat Ngay
                            </button>
                            <button className="px-3 py-1 border border-gray-300 text-gray-500 text-sm rounded-sm flex items-center gap-1 hover:bg-gray-50">
                                <Store className="w-3 h-3" /> Xem Shop
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                <div className="bg-white rounded shadow-sm p-6 mb-4">
                    <div className="bg-gray-50 p-3 mb-4 text-lg uppercase text-gray-700 font-medium">Chi Tiết Sản Phẩm</div>
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed pl-4">
                        {product.description || "Chưa có mô tả cho sản phẩm này."}
                    </div>
                </div>

                {/* Reviews */}
                <div className="bg-white rounded shadow-sm p-6">
                    <div className="bg-gray-50 p-3 mb-4 text-lg uppercase text-gray-700 font-medium">Đánh Giá Sản Phẩm</div>

                    {/* Rating Summary */}
                    {reviews.length > 0 && (
                        <div className="bg-orange-50 border border-orange-100 rounded p-4 mb-6 flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-orange-500 text-3xl font-bold">
                                    {(reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)}<span className="text-lg"> trên 5</span>
                                </div>
                                <div className="flex items-center justify-center gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length) ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = reviews.filter(r => r.rating === star).length;
                                    return count > 0 ? (
                                        <span key={star} className="text-xs border border-orange-300 text-orange-500 px-3 py-1 rounded-full">
                                            {star} Sao ({count})
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}

                    {reviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Chưa có đánh giá nào.</div>
                    ) : (
                        <div className="space-y-0">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 py-4 last:border-0">
                                    <div className="flex gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {(review.user?.username || review.username || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-800">{review.user?.username || review.username || "Người dùng ẩn danh"}</div>
                                            {/* Stars */}
                                            <div className="flex items-center gap-0.5 my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < (review.rating || 0) ? 'fill-orange-500 text-orange-500' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            {/* Quality label */}
                                            {review.rating >= 4 && (
                                                <div className="text-xs text-orange-500 mb-1">
                                                    Chất lượng sản phẩm: <span className="font-medium">{review.rating === 5 ? 'Tuyệt vời' : 'Tốt'}</span>
                                                </div>
                                            )}
                                            {/* Comment */}
                                            <div className="text-sm text-gray-700 mt-1 leading-relaxed">{review.comment}</div>
                                            {/* Date */}
                                            <div className="text-xs text-gray-400 mt-2">
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
