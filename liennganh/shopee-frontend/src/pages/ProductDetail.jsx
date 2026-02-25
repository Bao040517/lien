import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Minus, Plus, MessageSquare, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils';

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

    // States cho sản phẩm liên quan
    const [relatedProducts, setRelatedProducts] = useState([]);
    const relatedRef = React.useRef(null);

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

                // Gọi API lấy sản phẩm liên quan (cùng danh mục)
                if (productData.category?.id) {
                    api.get(`/products/category/${productData.category.id}`, { params: { size: 10 } })
                        .then(res => {
                            const relatedData = res.data.data?.content || res.data.data || res.data;
                            // Lọc bỏ sản phẩm hiện tại
                            setRelatedProducts(relatedData.filter(p => p.id !== productData.id));
                        })
                        .catch(err => console.error("Error fetching related products", err));
                }

            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Reset state khi ID sản phẩm thay đổi
        setQuantity(1);
        setSelectedVariant(null);
        setSelectedOptions({});
    }, [id]);

    // Slider cuộn cho sản phẩm liên quan
    const scrollRelated = (direction) => {
        if (relatedRef.current) {
            const scrollAmount = 300; // Cuộn khoảng 3 sản phẩm mỗi lần
            relatedRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

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

    const handleChatNow = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!product.shop?.id) {
            alert('Không tìm thấy thông tin shop');
            return;
        }
        try {
            // Lấy userId của chủ shop
            const ownerRes = await api.get(`/shops/${product.shop.id}/owner-id`);
            const ownerId = ownerRes.data.data;
            if (ownerId === user.id) {
                alert('Bạn không thể nhắn tin cho chính mình!');
                return;
            }
            // Tạo/tìm hội thoại
            const convRes = await api.post(`/messages/conversations?userId1=${user.id}&userId2=${ownerId}`);
            const conv = convRes.data.data;
            const otherUser = conv.user1.id === user.id ? conv.user2 : conv.user1;
            // Navigate đến trang chat với thông tin hội thoại
            navigate('/messages', { state: { openConv: { id: conv.id, otherUser } } });
        } catch (e) {
            console.error('Lỗi mở chat:', e);
            alert('Không thể mở chat. Vui lòng thử lại!');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!product) return <div className="p-8 text-center">Product not found.</div>;

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const attributeGroups = getAttributeGroups();
    const isDiscounted = !selectedVariant && product.discountPercentage > 0;
    const baseDisplayPrice = selectedVariant ? selectedVariant.price : product.price;
    const displayPrice = isDiscounted ? product.discountedPrice : baseDisplayPrice;
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
                {/* Breadcrumb */}
                <div className="mb-4">
                    <Breadcrumb items={[
                        { label: 'Trang chủ', path: '/' },
                        ...(product.category ? [{ label: product.category.name, path: `/category/${product.category.id}` }] : []),
                        { label: product.name }
                    ]} />
                </div>

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
                            <div className="flex items-center text-primary-dark border-b border-primary-dark pb-0.5">
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
                        <div className="bg-gray-50 p-4 mb-6 flex items-center gap-4">
                            {priceRange && !selectedVariant ? (
                                <div className="text-3xl font-medium text-primary-dark">
                                    {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    {isDiscounted && (
                                        <div className="text-gray-400 line-through text-lg">
                                            {formatPrice(baseDisplayPrice)}
                                        </div>
                                    )}
                                    <div className="text-3xl font-medium text-primary-dark">
                                        {formatPrice(displayPrice)}
                                    </div>
                                    {isDiscounted && (
                                        <div className="bg-primary-dark text-white text-sm font-bold px-2 py-0.5 rounded-sm uppercase inline-block">
                                            Giảm {product.discountPercentage}%
                                        </div>
                                    )}
                                </div>
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
                                                        ? 'border-primary-dark text-primary-dark bg-primary-lighter'
                                                        : 'border-gray-300 text-gray-700 hover:border-primary-dark hover:text-primary-dark'
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
                                    className="px-6 py-3 border border-primary-dark bg-primary-lighter text-primary-dark rounded-sm flex items-center gap-2 hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Thêm Vào Giỏ Hàng
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={!quantity || quantity < 1 || quantity > displayStock}
                                    className="px-8 py-3 bg-primary-dark text-white rounded-sm hover:bg-primary-darker transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <button onClick={handleChatNow} className="px-3 py-1 border border-primary-dark text-primary-dark text-sm bg-primary-lighter rounded-sm flex items-center gap-1 hover:bg-primary-light transition">
                                <MessageSquare className="w-3 h-3" /> Chat Ngay
                            </button>
                            <Link to={`/shop/${product.shop?.id}`} className="px-3 py-1 border border-gray-300 text-gray-500 text-sm rounded-sm flex items-center gap-1 hover:bg-gray-50">
                                <Store className="w-3 h-3" /> Xem Shop
                            </Link>
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
                        <div className="bg-primary-lighter border border-primary-light rounded p-4 mb-6 flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-primary-dark text-3xl font-bold">
                                    {(reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)}<span className="text-lg"> trên 5</span>
                                </div>
                                <div className="flex items-center justify-center gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length) ? 'fill-primary-dark text-primary-dark' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = reviews.filter(r => r.rating === star).length;
                                    return count > 0 ? (
                                        <span key={star} className="text-xs border border-primary text-primary-dark px-3 py-1 rounded-full">
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
                        <div className="space-y-0 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 py-4 last:border-0">
                                    <div className="flex gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-dark to-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {(review.user?.username || review.username || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-800">{review.user?.username || review.username || "Người dùng ẩn danh"}</div>
                                            {/* Stars */}
                                            <div className="flex items-center gap-0.5 my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < (review.rating || 0) ? 'fill-primary-dark text-primary-dark' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            {/* Quality label */}
                                            {review.rating >= 4 && (
                                                <div className="text-xs text-primary-dark mb-1">
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

                {/* 5. RELATED PRODUCTS SECTION */}
                {relatedProducts.length > 0 && (
                    <div className="bg-white rounded shadow-sm overflow-hidden mb-8 mt-4 group/related relative">
                        <div className="bg-gray-50 p-4 border-b">
                            <h2 className="text-gray-700 uppercase font-medium text-lg">Sản Phẩm Cùng Danh Mục</h2>
                        </div>

                        {/* Left Arrow */}
                        <button
                            onClick={() => scrollRelated('left')}
                            className="absolute left-2 top-[60%] -translate-y-1/2 z-20 w-10 h-10 bg-white/90 shadow-md border hover:border-primary-dark hover:text-primary-dark rounded-full flex items-center justify-center opacity-0 group-hover/related:opacity-100 transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        {/* Right Arrow */}
                        <button
                            onClick={() => scrollRelated('right')}
                            className="absolute right-2 top-[60%] -translate-y-1/2 z-20 w-10 h-10 bg-white/90 shadow-md border hover:border-primary-dark hover:text-primary-dark rounded-full flex items-center justify-center opacity-0 group-hover/related:opacity-100 transition-all"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        <div ref={relatedRef} className="overflow-x-auto snap-x flex scroll-smooth p-4 gap-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {relatedProducts.map((item) => (
                                <Link
                                    to={`/product/${item.id}`}
                                    key={item.id}
                                    className="min-w-[180px] max-w-[180px] flex-shrink-0 border border-gray-100 hover:border-primary-dark rounded-lg overflow-hidden cursor-pointer block transition-all hover:shadow-md group bg-white snap-start"
                                >
                                    <div className="relative aspect-square bg-gray-50">
                                        {item.imageUrl ? (
                                            <img
                                                src={getImageUrl(item.imageUrl)}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingCart className="text-gray-300 w-10 h-10" />
                                            </div>
                                        )}
                                        {item.discountPercentage > 0 && (
                                            <div className="absolute top-0 right-0">
                                                <div className="bg-gradient-to-b from-yellow-400 to-primary-dark text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                                    <div className="text-[10px] leading-tight">GIẢM</div>
                                                    <div className="text-sm font-black leading-tight">{item.discountPercentage}%</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] mb-2">{item.name}</h3>
                                        <div className="flex justify-between items-end min-h-[44px]">
                                            <div className="flex flex-col justify-end">
                                                <div className="text-primary-dark font-medium text-sm leading-tight">
                                                    {formatPrice(item.discountedPrice || item.price)}
                                                </div>
                                                {item.discountPercentage > 0 && (
                                                    <div className="text-gray-400 text-xs line-through mt-0.5">
                                                        {formatPrice(item.price)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
