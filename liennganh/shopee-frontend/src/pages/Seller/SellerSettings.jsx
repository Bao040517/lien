import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Save, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../api';

const SellerSettings = () => {
    const { user } = useAuth();
    const { setShopProfile } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [shopName, setShopName] = useState('');
    const [shopDescription, setShopDescription] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            fetchShopDetails();
        }
    }, [user]);

    const fetchShopDetails = async () => {
        try {
            const res = await api.get('/seller/shop', { params: { sellerId: user.id } });
            const shop = res.data.data;
            if (shop) {
                setShopName(shop.name || '');
                setShopDescription(shop.description || '');
            }
        } catch (error) {
            console.error("Failed to fetch shop details", error);
            setMessage({ type: 'error', text: 'Không thể tải thông tin Shop.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateShop = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!shopName.trim()) {
            setMessage({ type: 'error', text: 'Tên Shop không được để trống.' });
            return;
        }

        setIsUpdating(true);
        try {
            await api.put('/seller/shop', {
                name: shopName,
                description: shopDescription
            }, {
                params: { sellerId: user.id }
            });
            setShopProfile(prev => ({ ...prev, name: shopName, description: shopDescription }));
            setMessage({ type: 'success', text: 'Cập nhật thông tin Shop thành công!' });
        } catch (error) {
            console.error("Failed to update shop", error);
            setMessage({ type: 'error', text: 'Cập nhật thất bại. Vui lòng thử lại.' });
        } finally {
            setIsUpdating(false);
            // Hide success message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <div className="animate-spin w-8 h-8 border-2 border-primary-dark border-t-transparent rounded-full mb-3"></div>
                Đang tải thông tin...
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary-dark">
                    <Store className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cài đặt Cửa hàng</h1>
                    <p className="text-gray-500 text-sm mt-1">Quản lý thông tin hiển thị của Shop với khách hàng</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleUpdateShop} className="p-6">

                    {message.text && (
                        <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            <p className="font-medium text-sm">{message.text}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên Shop <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                placeholder="Nhập tên hiển thị của Shop..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark outline-none transition-colors"
                                required
                                maxLength={50}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Tên Shop là thương hiệu của bạn, tên chuyên nghiệp sẽ giúp khách hàng tin tưởng hơn. (Tối đa 50 ký tự)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mô tả Shop
                            </label>
                            <textarea
                                value={shopDescription}
                                onChange={(e) => setShopDescription(e.target.value)}
                                placeholder="Viết giới thiệu ngắn về các mặt hàng bạn kinh doanh..."
                                rows="5"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-primary-dark outline-none transition-colors resize-y"
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                (Tối đa 500 ký tự)
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-primary-dark hover:bg-primary-darker text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Lưu thay đổi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerSettings;
