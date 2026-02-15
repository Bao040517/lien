import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { ShoppingBag, ChevronRight, Zap, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Countdown Timer Component (Moved outside)
const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        if (!targetDate) return {};
        // Handle array format [yyyy, MM, dd, HH, mm, ss] if necessary
        let date = new Date(targetDate);
        if (Array.isArray(targetDate)) {
            // Construct ISO string if needed, or simple Date cons
            // Simplest: use new Date(year, month-1, day, ...)
            date = new Date(targetDate[0], targetDate[1] - 1, targetDate[2], targetDate[3], targetDate[4], targetDate[5]);
        }

        const difference = +date - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60))), // Total hours
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const format = (num) => num ? num.toString().padStart(2, '0') : '00';

    if (!timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
        return <div className="text-white font-bold text-sm">ENDED</div>;
    }

    return (
        <div className="flex gap-1 ml-4 text-white font-bold text-sm">
            <span className="bg-black p-1 rounded">{format(timeLeft.hours)}</span>
            <span className="text-black">:</span>
            <span className="bg-black p-1 rounded">{format(timeLeft.minutes)}</span>
            <span className="text-black">:</span>
            <span className="bg-black p-1 rounded">{format(timeLeft.seconds)}</span>
        </div>
    );
};

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [flashSales, setFlashSales] = useState([]);
    const [activeFlashSale, setActiveFlashSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 40;
    const flashSaleRef = useRef(null);

    const scrollFlashSale = (direction) => {
        if (flashSaleRef.current) {
            const scrollAmount = 320;
            flashSaleRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes, flashSalesRes] = await Promise.allSettled([
                    api.get('/products'),
                    api.get('/categories'),
                    api.get('/flash-sales/current')
                ]);

                if (productsRes.status === 'fulfilled') {
                    const productData = productsRes.value.data.data || productsRes.value.data;
                    setProducts(Array.isArray(productData) ? productData : []);
                }

                if (categoriesRes.status === 'fulfilled') {
                    const categoryData = categoriesRes.value.data.data || categoriesRes.value.data;
                    setCategories(Array.isArray(categoryData) ? categoryData : []);
                }

                if (flashSalesRes.status === 'fulfilled') {
                    const flashSaleData = flashSalesRes.value.data.data || flashSalesRes.value.data;
                    if (Array.isArray(flashSaleData) && flashSaleData.length > 0) {
                        // Take the first active flash sale
                        const currentFS = flashSaleData[0];
                        setActiveFlashSale(currentFS);
                        setFlashSales(currentFS.items || []);
                    } else {
                        setFlashSales([]);
                    }
                }

            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = products.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: document.getElementById('daily-suggestions')?.offsetTop - 140, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="text-center py-10 bg-gray-100 min-h-screen">Loading Shopee...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <div className="container mx-auto px-4 pt-4 space-y-6">

                {/* 1. CATEGORIES SECTION */}
                {/* 1. CATEGORIES SECTION */}
                <div className="bg-white p-4 rounded shadow-sm">
                    <h2 className="text-gray-500 uppercase font-medium mb-4 text-sm">Danh Mục</h2>
                    <div className="grid grid-cols-10 gap-4">
                        {categories.slice(0, 20).map(cat => {
                            // Map category name to icon file
                            const iconMap = {
                                'Thời trang nam': 'cat_thoi_trang_nam.jpg',
                                'Thời trang nữ': 'cat_thoi_trang_nu.jpg',
                                'Điện thoại & Phụ kiện': 'cat_dien_thoai.jpg',
                                'Máy tính & Laptop': 'cat_laptop.jpg',
                                'Thiết bị điện tử': 'cat_electronics.jpg',
                                'Nhà cửa & Đời sống': 'cat_home.jpg',
                                'Sức khỏe & Làm đẹp': 'cat_beauty.jpg',
                                'Mẹ & Bé': 'cat_baby.jpg',
                                'Thể thao & Du lịch': 'cat_sports.jpg',
                                'Giày dép nam': 'cat_shoes_men.jpg',
                                'Giày dép nữ': 'cat_shoes_women.jpg',
                                'Túi ví nữ': 'cat_bag.jpg',
                                'Phụ kiện & Trang sức': 'cat_jewelry.jpg',
                                'Đồng hồ': 'cat_watch.jpg',
                                'Bách hóa online': 'cat_grocery.jpg',
                                'Ô tô & Xe máy': 'cat_auto.jpg',
                                'Nhà sách online': 'cat_book.jpg',
                                'Thú cưng': 'cat_pet.jpg',
                            };
                            const iconFile = iconMap[cat.name] || 'cat_thoi_trang_nam.jpg'; // Fallback

                            return (
                                <Link
                                    to={`/category/${cat.id}`}
                                    state={{ categoryName: cat.name }}
                                    key={cat.id}
                                    className="flex flex-col items-center group cursor-pointer hover:shadow-md border border-transparent hover:border-gray-200 p-2 rounded transition"
                                >
                                    <div className="w-20 h-20 mb-2 flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-1 rounded-full border border-gray-100 bg-gray-50">
                                        <img
                                            src={`http://localhost:8080/api/files/${iconFile}`}
                                            alt={cat.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/80x80?text=IMG';
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-center text-gray-800 group-hover:text-orange-500 line-clamp-2">{cat.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* 2. FLASH SALE SECTION */}
                <div className="bg-white rounded shadow-sm overflow-hidden">
                    {/* Flash Sale Header — Red gradient banner */}
                    <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 px-5 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Zap className="fill-yellow-300 text-yellow-300 w-6 h-6 animate-pulse" />
                                <span className="text-white font-black text-xl tracking-wider uppercase" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                                    FLASH SALE
                                </span>
                                <Zap className="fill-yellow-300 text-yellow-300 w-6 h-6 animate-pulse" />
                            </div>
                            {activeFlashSale && <CountdownTimer targetDate={activeFlashSale.endTime} />}
                        </div>
                        <Link to="/flash-sale" className="text-white text-sm font-medium flex items-center hover:opacity-80 transition">
                            Xem tất cả <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Flash Sale Products with Arrow Buttons */}
                    <div className="relative py-4 px-3 group/flash">
                        {/* Left Arrow */}
                        <button
                            onClick={() => scrollFlashSale('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 shadow-lg rounded-full flex items-center justify-center hover:bg-white opacity-0 group-hover/flash:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        {/* Right Arrow */}
                        <button
                            onClick={() => scrollFlashSale('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/90 shadow-lg rounded-full flex items-center justify-center hover:bg-white opacity-0 group-hover/flash:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>

                        <div ref={flashSaleRef} className="overflow-x-auto flex gap-3 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {(flashSales.length > 0 ? flashSales : products.slice(0, 12)).map((item, idx) => {
                                const product = item.product || item;
                                if (!product) return null;

                                const isFlashSaleItem = !!item.discountedPrice;
                                const originalPrice = product.price || 0;
                                const salePrice = item.discountedPrice || originalPrice;
                                const discountPercent = originalPrice > 0 ? Math.round((1 - salePrice / originalPrice) * 100) : 0;

                                // Flash Sale specific metrics
                                const soldCount = item.soldQuantity || 0;
                                const stockTotal = (item.stockQuantity || 0) + soldCount;
                                const soldPercent = isFlashSaleItem && stockTotal > 0
                                    ? Math.min(100, Math.round((soldCount / stockTotal) * 100))
                                    : Math.floor(Math.random() * 50 + 10); // Fallback for random suggestion

                                const displaySoldCount = isFlashSaleItem ? soldCount : Math.floor(Math.random() * 500 + 50);

                                return (
                                    <Link
                                        to={`/product/${product.id}`}
                                        key={item.id || product.id || idx}
                                        className="min-w-[160px] max-w-[160px] flex-shrink-0 border border-gray-100 hover:border-orange-400 rounded-lg overflow-hidden cursor-pointer block transition-all hover:shadow-md group bg-white"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-square bg-gray-50">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingBag className="text-gray-300 w-10 h-10" />
                                                </div>
                                            )}
                                            {/* Discount Badge */}
                                            {discountPercent > 0 && (
                                                <div className="absolute top-0 right-0">
                                                    <div className="bg-gradient-to-b from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                                        <div className="text-[10px] leading-tight">GIẢM</div>
                                                        <div className="text-sm font-black leading-tight">{discountPercent}%</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price & Progress */}
                                        <div className="px-2 py-2.5 text-center">
                                            <div className="text-red-500 font-bold text-lg leading-tight">
                                                <span className="text-xs align-top">₫</span>
                                                {salePrice.toLocaleString('vi-VN')}
                                            </div>
                                            {originalPrice > salePrice && (
                                                <div className="text-gray-400 text-xs line-through mt-0.5">
                                                    ₫{originalPrice.toLocaleString('vi-VN')}
                                                </div>
                                            )}
                                            {/* Sold progress bar */}
                                            <div className="relative w-full h-[18px] bg-orange-100 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                                    style={{ width: `${Math.max(5, soldPercent)}%` }}
                                                ></div>
                                                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold uppercase drop-shadow-sm">
                                                    Đã bán {displaySoldCount}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 3. DAILY SUGGESTIONS - PAGINATED */}
                <div className="mt-8" id="daily-suggestions">
                    <div className="bg-white sticky top-[120px] z-40 border-b-4 border-orange-500 py-3 text-center mb-4 shadow-sm">
                        <h3 className="text-orange-500 font-bold uppercase text-lg">Gợi Ý Hôm Nay</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {currentProducts.map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded hover:shadow-lg hover:-translate-y-0.5 transition duration-100 border border-transparent hover:border-orange-500 cursor-pointer overflow-hidden relative block group">
                                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                                    )}
                                    <div className="absolute top-0 right-0 bg-yellow-100 text-orange-500 px-1 text-xs">
                                        -{Math.floor(Math.random() * 50 + 10)}%
                                    </div>
                                </div>
                                <div className="p-2">
                                    <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] mb-2">{product.name}</h3>
                                    <div className="flex justify-between items-end">
                                        <div className="text-orange-500 font-medium">
                                            <span className="text-xs underline align-top">đ</span>
                                            <span className="text-lg">{product.price?.toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">Đã bán {product.soldCount || Math.floor(Math.random() * 1000 + 50)}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                                .reduce((acc, page, i, arr) => {
                                    if (i > 0 && page - arr[i - 1] > 1) acc.push('...');
                                    acc.push(page);
                                    return acc;
                                }, [])
                                .map((item, i) =>
                                    item === '...' ? (
                                        <span key={`dot-${i}`} className="px-2 text-gray-400">...</span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => goToPage(item)}
                                            className={`w-10 h-10 rounded font-medium text-sm ${currentPage === item
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-white border hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    )
                                )}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Home;

