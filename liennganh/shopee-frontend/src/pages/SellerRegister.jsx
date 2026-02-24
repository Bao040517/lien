import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Store, CheckCircle, AlertCircle } from 'lucide-react';

const SellerRegister = () => {
    const { user, requestSellerUpgrade } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setError('');
        const result = await requestSellerUpgrade();
        setLoading(false);

        if (result.success) {
            setMessage("Đăng ký thành công! Yêu cầu của bạn đang chờ Admin duyệt.");
        } else {
            setError(result.message);
        }
    };

    if (!user) return (
        <div className="max-w-md mx-auto bg-white p-10 rounded-lg shadow mt-10 text-center">
            <p className="text-gray-500">Vui lòng đăng nhập trước.</p>
        </div>
    );

    // If already seller
    if (user.role === 'SELLER') return (
        <div className="max-w-md mx-auto bg-green-50 border border-green-200 p-10 rounded-lg shadow mt-10 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-green-800 mb-2">Bạn đã là Seller!</h2>
            <p className="text-green-600 mb-4">Bạn đã có quyền bán hàng trên nền tảng.</p>
            <button
                onClick={() => navigate('/seller')}
                className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
            >
                Vào kênh bán hàng
            </button>
        </div>
    );

    // If pending
    if (user.sellerStatus === 'PENDING') return (
        <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 p-10 rounded-lg shadow mt-10 text-center">
            <Store className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Đang chờ duyệt</h2>
            <p className="text-yellow-600">Yêu cầu của bạn đang được Admin xem xét. Vui lòng quay lại sau.</p>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-lg shadow mt-10 text-center">
            <Store className="w-16 h-16 mx-auto text-orange-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Đăng ký bán hàng trên Shopee Clone</h1>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Bắt đầu kinh doanh sản phẩm cho hàng triệu người dùng.
                Đăng ký ngay để tạo shop và quản lý kho hàng của bạn.
            </p>

            {message && (
                <div className="bg-green-100 text-green-700 p-4 rounded mb-6 flex items-center gap-2 justify-center">
                    <CheckCircle className="w-5 h-5" /> {message}
                </div>
            )}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-6 flex items-center gap-2 justify-center">
                    <AlertCircle className="w-5 h-5" /> {error}
                </div>
            )}

            <button
                onClick={handleRegister}
                disabled={loading}
                className="px-8 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition disabled:opacity-70"
            >
                {loading ? 'Đang xử lý...' : 'Đăng ký trở thành Seller'}
            </button>
        </div>
    );
};

export default SellerRegister;
