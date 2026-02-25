import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { ShoppingBag, ChevronRight, Zap, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils';

// Countdown Timer Component (Moved outside)
const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        if (!targetDate) return {};

        let parsedDate = targetDate;
        if (typeof targetDate === 'string') {
            parsedDate = targetDate.replace(' ', 'T');
        }

        let date = new Date(parsedDate);
        if (Array.isArray(targetDate)) {
            date = new Date(targetDate[0], targetDate[1] - 1, targetDate[2], targetDate[3] || 0, targetDate[4] || 0, targetDate[5] || 0);
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

    const format = (num) => (num !== undefined && num !== null) ? num.toString().padStart(2, '0') : '00';

    if (timeLeft.hours === undefined) {
        return <div className="text-white font-bold text-sm">ĐÃ KẾT THÚC</div>;
    }

    return (
        <div className="flex gap-1 ml-4 text-white font-bold text-sm">
            <span className="bg-black p-1 rounded min-w-[24px] text-center">{format(timeLeft.hours)}</span>
            <span className="text-black">:</span>
            <span className="bg-black p-1 rounded min-w-[24px] text-center">{format(timeLeft.minutes)}</span>
            <span className="text-black">:</span>
            <span className="bg-black p-1 rounded min-w-[24px] text-center">{format(timeLeft.seconds)}</span>
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
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const [sliderImages, setSliderImages] = useState([]);

    const ITEMS_PER_PAGE = 40;
    const flashSaleRef = useRef(null);

    const categoryRef = useRef(null);

    const scrollFlashSale = (direction) => {
        if (flashSaleRef.current) {
            const scrollAmount = 320;
            flashSaleRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollCategory = (direction) => {
        if (categoryRef.current) {
            const scrollAmount = categoryRef.current.clientWidth;
            categoryRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes, flashSalesRes, bannersRes] = await Promise.allSettled([
                    api.get('/products'),
                    api.get('/categories'),
                    api.get('/flash-sales/current'),
                    api.get('/sliders/active')
                ]);

                if (productsRes.status === 'fulfilled') {
                    const responseData = productsRes.value.data.data || productsRes.value.data;
                    const productData = responseData.content || responseData;
                    setProducts(Array.isArray(productData) ? productData : []);
                }

                if (categoriesRes.status === 'fulfilled') {
                    const responseData = categoriesRes.value.data.data || categoriesRes.value.data;
                    const categoryData = responseData.content || responseData;
                    setCategories(Array.isArray(categoryData) ? categoryData : []);
                }

                if (flashSalesRes.status === 'fulfilled') {
                    const flashSaleData = flashSalesRes.value.data?.data || flashSalesRes.value.data || [];
                    if (Array.isArray(flashSaleData) && flashSaleData.length > 0) {
                        // Take the first active flash sale
                        const currentFS = flashSaleData[0];
                        setActiveFlashSale(currentFS);
                        setFlashSales(currentFS.items || []);
                    } else {
                        // Tạo mock downtime kết thúc vào cuối ngày hôm nay
                        const endOfDay = new Date();
                        endOfDay.setHours(23, 59, 59, 999);
                        setActiveFlashSale({ endTime: endOfDay });
                        setFlashSales([]);
                    }
                }

                if (bannersRes.status === 'fulfilled') {
                    const bannerData = bannersRes.value.data?.data || bannersRes.value.data || [];
                    setSliderImages(Array.isArray(bannerData) ? bannerData : []);
                }

            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Slider auto-play
    useEffect(() => {
        if (!sliderImages.length) return;
        const slideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Tăng thời gian chờ lên 5s để dễ nhìn hơn
        return () => clearInterval(slideInterval);
    }, [sliderImages.length, currentSlide]); // Depend vào currentSlide để đếm lại giờ khi tự bấm

    // Slider Controls
    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? sliderImages.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % sliderImages.length);
    };

    // Swipe logic
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        // Reset values
        setTouchStart(null);
        setTouchEnd(null);
    };

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

                {/* 0. SLIDER BANNER */}
                {sliderImages.length > 0 && (
                    <div className="flex justify-center w-full mt-4 mb-6">
                        <div className="flex gap-2 w-full max-w-5xl aspect-[16/9] md:aspect-[2.5/1] rounded-2xl overflow-hidden shadow-md">
                            <div
                                className="w-full h-full relative rounded-lg overflow-hidden group shadow-sm bg-gray-200"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {sliderImages.map((banner, idx) => (
                                    <img
                                        key={banner.id || idx}
                                        src={getImageUrl(banner.imageUrl)}
                                        alt={banner.title || `Banner ${idx}`}
                                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                        onClick={() => { if (banner.link) window.open(banner.link, '_blank'); }}
                                        style={{ cursor: banner.link ? 'pointer' : 'default' }}
                                    />
                                ))}

                                {/* Nút điều hướng mũi tên */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                                {/* Slide dots */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {sliderImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-primary-dark w-5 scale-110' : 'bg-white/60 hover:bg-white'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 1. CATEGORIES SECTION */}
                <div className="bg-white p-4 rounded shadow-sm relative group/cats">
                    <h2 className="text-gray-500 uppercase font-medium mb-4 text-sm">Danh Mục</h2>

                    {/* Left Arrow */}
                    <button
                        onClick={() => scrollCategory('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-md border hover:border-primary-dark hover:text-primary-dark rounded-full flex items-center justify-center opacity-0 group-hover/cats:opacity-100 transition-all transform -translate-x-1/2"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    {/* Right Arrow */}
                    <button
                        onClick={() => scrollCategory('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-md border hover:border-primary-dark hover:text-primary-dark rounded-full flex items-center justify-center opacity-0 group-hover/cats:opacity-100 transition-all transform translate-x-1/2"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="overflow-x-auto snap-x snap-mandatory flex scroll-smooth" ref={categoryRef} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {/* Nhóm các danh mục thành từng trang (mỗi trang có grid 2 dòng x 10 cột) để khi trượt sẽ qua trang mới */}
                        {Array.from({ length: Math.ceil(categories.length / 20) }).map((_, pageIndex) => {
                            const pageCategories = categories.slice(pageIndex * 20, (pageIndex + 1) * 20);
                            return (
                                <div key={pageIndex} className="min-w-full flex-shrink-0 snap-start grid grid-cols-4 md:grid-cols-10 gap-x-2 gap-y-4 px-2">
                                    {pageCategories.map(cat => (
                                        <Link
                                            to={`/category/${cat.id}`}
                                            state={{ categoryName: cat.name }}
                                            key={cat.id}
                                            className="flex flex-col items-center group cursor-pointer hover:shadow-sm border border-transparent hover:border-gray-200 p-2 rounded transition bg-white"
                                        >
                                            <div className="w-16 h-16 md:w-20 md:h-20 mb-2 flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-1 rounded-full border border-gray-100 bg-gray-50">
                                                {cat.imageUrl ? (
                                                    <img
                                                        src={getImageUrl(cat.imageUrl)}
                                                        alt={cat.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://placehold.co/80x80?text=IMG';
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-xl md:text-2xl text-gray-400 font-bold">
                                                        {cat.name?.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-center text-gray-800 group-hover:text-primary-dark line-clamp-2 w-full">{cat.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. FLASH SALE SECTION */}
                <div className="bg-white rounded shadow-sm overflow-hidden">
                    {/* Flash Sale Header — Red gradient banner */}
                    <div className="bg-gradient-to-r from-primary-darker via-primary to-primary-darker px-5 py-3 flex justify-between items-center">
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
                                const salePrice = isFlashSaleItem ? item.discountedPrice : (product.discountedPrice || originalPrice);
                                const discountPercent = isFlashSaleItem && originalPrice > 0 ? Math.round((1 - salePrice / originalPrice) * 100) : (product.discountPercentage || 0);

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
                                        className="min-w-[160px] max-w-[160px] flex-shrink-0 border border-gray-100 hover:border-primary-dark rounded-lg overflow-hidden cursor-pointer block transition-all hover:shadow-md group bg-white"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-square bg-gray-50">
                                            {product.imageUrl ? (
                                                <img
                                                    src={getImageUrl(product.imageUrl)}
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
                                                    <div className="bg-gradient-to-b from-yellow-400 to-primary-dark text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
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
                                            <div className="relative w-full h-[18px] bg-primary-light rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-dark to-primary rounded-full"
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
                    <div className="bg-white sticky top-[120px] z-40 border-b-4 border-primary-dark py-3 text-center mb-4 shadow-sm">
                        <h3 className="text-primary-dark font-bold uppercase text-lg">Gợi Ý Hôm Nay</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {currentProducts.map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded hover:shadow-lg hover:-translate-y-0.5 transition duration-100 border border-transparent hover:border-primary-dark cursor-pointer overflow-hidden relative block group">
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
                                            <div className="text-primary-dark font-medium leading-tight">
                                                <span className="text-xs underline align-top">đ</span>
                                                <span className="text-lg">{(product.discountedPrice || product.price || 0).toLocaleString('vi-VN')}</span>
                                            </div>
                                            {product.discountPercentage > 0 && (
                                                <div className="text-gray-400 text-xs line-through mt-0.5">
                                                    ₫{(product.price || 0).toLocaleString('vi-VN')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 pb-1">Đã bán {product.soldCount || Math.floor(Math.random() * 1000 + 50)}</div>
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
                                                ? 'bg-primary-dark text-white'
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

