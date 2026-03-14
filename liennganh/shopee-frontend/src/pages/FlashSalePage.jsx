import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Zap, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl, toProductSlug } from '../utils';
import Breadcrumb from '../components/Breadcrumb';

const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        if (!targetDate) return {};
        let parsedDate = targetDate;
        if (typeof targetDate === 'string') parsedDate = targetDate.replace(' ', 'T');
        let date = new Date(parsedDate);
        if (Array.isArray(targetDate)) {
            date = new Date(targetDate[0], targetDate[1] - 1, targetDate[2], targetDate[3] || 0, targetDate[4] || 0, targetDate[5] || 0);
        }
        const difference = +date - +new Date();
        if (difference > 0) {
            return {
                hours: Math.floor(difference / (1000 * 60 * 60)),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return {};
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearTimeout(timer);
    });

    const format = (n) => (n !== undefined && n !== null) ? n.toString().padStart(2, '0') : '00';

    if (timeLeft.hours === undefined) {
        return <span className="text-white font-bold text-sm">ĐÃ KẾT THÚC</span>;
    }

    return (
        <div className="flex gap-1 text-white font-bold text-sm">
            <span className="bg-black px-1.5 py-0.5 rounded">{format(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-black px-1.5 py-0.5 rounded">{format(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-black px-1.5 py-0.5 rounded">{format(timeLeft.seconds)}</span>
        </div>
    );
};

const FlashSalePage = () => {
    const [flashSales, setFlashSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const res = await api.get('/flash-sales/current');
                const data = res.data?.data || res.data || [];
                setFlashSales(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching flash sales:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFlashSales();
    }, []);

    const allItems = flashSales.flatMap(fs =>
        (fs.items || []).map(item => ({ ...item, flashSaleEndTime: fs.endTime, flashSaleName: fs.name }))
    );

    const totalPages = Math.ceil(allItems.length / itemsPerPage);
    const currentItems = allItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const activeFlashSale = flashSales.length > 0 ? flashSales[0] : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-dark"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <div className="container mx-auto px-4 pt-4">
                <div className="mb-4">
                    <Breadcrumb items={[
                        { label: 'Trang chủ', path: '/' },
                        { label: 'Flash Sale' }
                    ]} />
                </div>

                <div className="bg-gradient-to-r from-primary-darker via-primary to-primary-darker rounded-t-xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Zap className="fill-yellow-300 text-yellow-300 w-8 h-8 animate-pulse" />
                        <span className="text-white font-black text-2xl tracking-wider uppercase" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                            FLASH SALE
                        </span>
                        <Zap className="fill-yellow-300 text-yellow-300 w-8 h-8 animate-pulse" />
                    </div>
                    {activeFlashSale && (
                        <div className="flex items-center gap-2">
                            <span className="text-white/80 text-sm">Kết thúc trong</span>
                            <CountdownTimer targetDate={activeFlashSale.endTime} />
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-b-xl shadow-sm p-6">
                    {allItems.length === 0 ? (
                        <div className="text-center py-16">
                            <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Hiện tại không có Flash Sale nào đang diễn ra.</p>
                            <Link to="/" className="text-primary-dark hover:underline mt-2 inline-block">Quay về trang chủ</Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {currentItems.map((item, idx) => {
                                    const product = item.product;
                                    if (!product) return null;

                                    const originalPrice = product.price || 0;
                                    const salePrice = item.discountedPrice || product.discountedPrice || originalPrice;
                                    const discountPercent = originalPrice > 0 ? Math.round((1 - salePrice / originalPrice) * 100) : 0;
                                    const soldCount = item.soldQuantity || 0;
                                    const stockTotal = (item.stockQuantity || 0) + soldCount;
                                    const soldPercent = stockTotal > 0 ? Math.min(100, Math.round((soldCount / stockTotal) * 100)) : 0;

                                    return (
                                        <Link
                                            to={toProductSlug(product.name, product.id)}
                                            key={item.id || idx}
                                            className="bg-white border border-gray-100 hover:border-primary-dark rounded-lg overflow-hidden cursor-pointer block transition-all hover:shadow-md group"
                                        >
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
                                                {discountPercent > 0 && (
                                                    <div className="absolute top-0 right-0">
                                                        <div className="bg-gradient-to-b from-yellow-400 to-primary-dark text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                                            <div className="text-[10px] leading-tight">GIẢM</div>
                                                            <div className="text-sm font-black leading-tight">{discountPercent}%</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-2">
                                                <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] mb-2">{product.name}</h3>
                                                <div className="text-primary-dark font-bold text-lg leading-tight">
                                                    {salePrice.toLocaleString('vi-VN')}
                                                    <span className="text-xs align-top">₫</span>
                                                </div>
                                                {originalPrice > salePrice && (
                                                    <div className="text-gray-400 text-xs line-through mt-0.5">
                                                        {originalPrice.toLocaleString('vi-VN')}₫
                                                    </div>
                                                )}
                                                <div className="relative w-full h-[18px] bg-primary-light rounded-full mt-2 overflow-hidden">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-dark to-primary rounded-full"
                                                        style={{ width: `${Math.max(5, soldPercent)}%` }}
                                                    ></div>
                                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold uppercase drop-shadow-sm">
                                                        Đã bán {soldCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-8">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded font-medium text-sm ${currentPage === page
                                                ? 'bg-primary-dark text-white'
                                                : 'bg-white border hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlashSalePage;
