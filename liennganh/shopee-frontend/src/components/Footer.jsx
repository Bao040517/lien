import { Link } from 'react-router-dom';
import { Store, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 mt-10">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

                    {/* Chăm sóc khách hàng */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Chăm Sóc Khách Hàng</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/" className="hover:text-primary-dark transition">Trung Tâm Trợ Giúp</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Hướng Dẫn Mua Hàng</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Hướng Dẫn Bán Hàng</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Thanh Toán</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Vận Chuyển</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Trả Hàng & Hoàn Tiền</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Liên Hệ Shopee</Link></li>
                        </ul>
                    </div>

                    {/* Về Shopee */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Về Nikki</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/" className="hover:text-primary-dark transition">Giới Thiệu</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Tuyển Dụng</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Điều Khoản</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Chính Sách Bảo Mật</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Kênh Người Bán</Link></li>
                            <li><Link to="/" className="hover:text-primary-dark transition">Flash Sale</Link></li>
                        </ul>
                    </div>

                    {/* Thanh toán */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Thanh Toán</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Visa', 'MasterCard', 'JCB', 'COD', 'Trả góp', 'Ví Shopee'].map((item) => (
                                <span key={item} className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-600 shadow-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 mt-6">Đơn Vị Vận Chuyển</h3>
                        <div className="flex flex-wrap gap-2">
                            {['GHN', 'GHTK', 'J&T', 'Viettel Post', 'Grab'].map((item) => (
                                <span key={item} className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-600 shadow-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Theo dõi */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Theo Dõi Chúng Tôi</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li>
                                <a href="#" className="flex items-center gap-2 hover:text-primary-dark transition">
                                    <Facebook className="w-4 h-4" /> Facebook
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 hover:text-primary-dark transition">
                                    <Instagram className="w-4 h-4" /> Instagram
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2 hover:text-primary-dark transition">
                                    <Youtube className="w-4 h-4" /> Youtube
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Tải ứng dụng */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Tải Ứng Dụng</h3>
                        <div className="flex gap-3">
                            <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                                <Store className="w-10 h-10 text-primary-dark" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-600 shadow-sm text-center">App Store</span>
                                <span className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-600 shadow-sm text-center">Google Play</span>
                                <span className="bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-600 shadow-sm text-center">AppGallery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                        <p>&copy; 2024 Nikki. Đồ án thực hành — Tất cả quyền được bảo lưu.</p>
                        <div className="flex gap-4">
                            <span>Quốc gia: 🇻🇳 Việt Nam</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
