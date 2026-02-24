import Navbar from '../components/Navbar';
import { Outlet, Link } from 'react-router-dom';
import { Facebook, Instagram, Headphones, ShieldCheck, Truck, RotateCcw, Phone, Mail, MapPin } from 'lucide-react';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* === PREMIUM FOOTER === */}
            <footer className="bg-gray-50 border-t mt-8">

                {/* Trust Badges */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex items-center gap-3 justify-center">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Miễn phí vận chuyển</p>
                                    <p className="text-xs text-gray-500">Đơn từ 200K</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 justify-center">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Hàng chính hãng</p>
                                    <p className="text-xs text-gray-500">100% authentic</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 justify-center">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                    <RotateCcw className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Đổi trả miễn phí</p>
                                    <p className="text-xs text-gray-500">Trong 15 ngày</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 justify-center">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                                    <Headphones className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Hỗ trợ 24/7</p>
                                    <p className="text-xs text-gray-500">Luôn sẵn sàng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer Links */}
                <div className="container mx-auto px-4 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        {/* Column 1 */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4">Chăm sóc khách hàng</h3>
                            <ul className="space-y-2.5">
                                {['Trung tâm trợ giúp', 'Hướng dẫn mua hàng', 'Hướng dẫn bán hàng', 'Thanh toán', 'Vận chuyển', 'Trả hàng & Hoàn tiền', 'Chăm sóc khách hàng'].map(item => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4">Về Shopee</h3>
                            <ul className="space-y-2.5">
                                {['Giới thiệu', 'Tuyển dụng', 'Điều khoản Shopee', 'Chính sách bảo mật', 'Flash Sale', 'Chương trình Affiliate', 'Liên hệ truyền thông'].map(item => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4">Thanh toán</h3>
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                {['Visa', 'Master', 'JCB', 'COD', 'Trả góp', 'Ví ShopeePay'].map(item => (
                                    <div key={item} className="bg-white border border-gray-200 rounded-md px-2 py-1.5 text-center shadow-sm">
                                        <span className="text-[10px] text-gray-600 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4">Đơn vị vận chuyển</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['SPX', 'GHN', 'GHTK', 'J&T', 'Ninja Van', 'Best'].map(item => (
                                    <div key={item} className="bg-white border border-gray-200 rounded-md px-2 py-1.5 text-center shadow-sm">
                                        <span className="text-[10px] text-gray-600 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Column 4 */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4">Theo dõi chúng tôi</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors">
                                        <Facebook className="w-4 h-4" /> Facebook
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors">
                                        <Instagram className="w-4 h-4" /> Instagram
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.05a8.16 8.16 0 004.76 1.52V7.18a4.83 4.83 0 01-1-.49z" /></svg>
                                        TikTok
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 5 - Contact */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 uppercase mb-4">Liên hệ</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-sm text-gray-500">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-400" />
                                    <span>Đại học Phenikaa</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-500">
                                    <Phone className="w-4 h-4 flex-shrink-0 text-orange-400" />
                                    <span>1900 1234 56</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-500">
                                    <Mail className="w-4 h-4 flex-shrink-0 text-orange-400" />
                                    <span>support@shopee.vn</span>
                                </li>
                            </ul>
                            <div className="mt-6">
                                <Link
                                    to="/seller"
                                    className="inline-block bg-orange-500 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                                >
                                    🛒 Bán hàng cùng Shopee
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t bg-gray-100">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">S</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Shopee Clone</span>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                &copy; 2024 Shopee Clone. Tất cả các quyền được bảo lưu. Đây là dự án học tập, không phải sản phẩm thương mại.
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500">Quốc gia:</span>
                                <span className="text-xs font-medium text-gray-700">🇻🇳 Việt Nam</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
