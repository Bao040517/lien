import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { PackageX, ShieldAlert, Clock, XCircle, Home, ArrowLeft, Search } from 'lucide-react';

const ERROR_CONFIGS = {
    404: {
        icon: PackageX,
        iconColor: 'text-gray-400',
        bgColor: 'bg-gray-100',
        title: 'Không tìm thấy trang',
        description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
        badge: null,
    },
    product_not_found: {
        icon: PackageX,
        iconColor: 'text-gray-400',
        bgColor: 'bg-gray-100',
        title: 'Sản phẩm không tồn tại',
        description: 'Sản phẩm này không tồn tại hoặc đã bị xóa khỏi hệ thống.',
        badge: null,
    },
    product_pending: {
        icon: Clock,
        iconColor: 'text-amber-500',
        bgColor: 'bg-amber-50',
        title: 'Sản phẩm đang chờ duyệt',
        description: 'Sản phẩm này đang được kiểm duyệt và chưa được công khai. Vui lòng quay lại sau.',
        badge: { text: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700 border border-amber-200' },
    },
    product_rejected: {
        icon: XCircle,
        iconColor: 'text-orange-500',
        bgColor: 'bg-orange-50',
        title: 'Sản phẩm không được duyệt',
        description: 'Sản phẩm này đã bị từ chối và không còn hiển thị công khai.',
        badge: { text: 'Đã từ chối', color: 'bg-orange-100 text-orange-700 border border-orange-200' },
    },
    product_banned: {
        icon: ShieldAlert,
        iconColor: 'text-red-500',
        bgColor: 'bg-red-50',
        title: 'Sản phẩm đã bị khóa',
        description: 'Sản phẩm này vi phạm tiêu chuẩn cộng đồng và đã bị tạm khóa.',
        badge: { text: 'Tạm khóa', color: 'bg-red-100 text-red-700 border border-red-200' },
    },
};

const ErrorPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const type = searchParams.get('type') || '404';
    const config = ERROR_CONFIGS[type] || ERROR_CONFIGS['404'];
    const Icon = config.icon;

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md w-full">
                {/* Icon */}
                <div className={`w-24 h-24 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`w-12 h-12 ${config.iconColor}`} />
                </div>

                {/* Badge */}
                {config.badge && (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${config.badge.color}`}>
                        {config.badge.text}
                    </span>
                )}

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-3">{config.title}</h1>

                {/* Description */}
                <p className="text-gray-500 mb-8 leading-relaxed">{config.description}</p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Quay lại
                    </button>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition font-medium"
                    >
                        <Home className="w-4 h-4" /> Trang chủ
                    </Link>
                    <Link
                        to="/search"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                        <Search className="w-4 h-4" /> Tìm kiếm
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
