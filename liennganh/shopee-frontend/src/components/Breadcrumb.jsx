import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb component dùng chung cho toàn bộ ứng dụng.
 * 
 * @param {Array} items - Mảng các breadcrumb item: [{ label: string, path?: string }]
 *   Item cuối cùng (không có path) sẽ hiển thị như trang hiện tại.
 * @param {string} variant - "light" (nền sáng, mặc định) | "admin" (nền tối)
 */
const Breadcrumb = ({ items = [], variant = 'light' }) => {
    if (!items || items.length === 0) return null;

    const isAdmin = variant === 'admin';

    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm flex-wrap">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isFirst = index === 0;

                return (
                    <span key={index} className="flex items-center gap-1.5">
                        {/* Separator */}
                        {index > 0 && (
                            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isAdmin ? 'text-gray-500' : 'text-gray-400'
                                }`} />
                        )}

                        {/* Item */}
                        {isLast ? (
                            <span className={`font-medium truncate max-w-[250px] ${isAdmin ? 'text-white' : 'text-gray-800'
                                }`}>
                                {isFirst && <Home className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path || '/'}
                                className={`transition-colors duration-200 hover:underline flex items-center gap-1 ${isAdmin
                                        ? 'text-gray-400 hover:text-blue-400'
                                        : 'text-gray-500 hover:text-orange-500'
                                    }`}
                            >
                                {isFirst && <Home className="w-3.5 h-3.5 flex-shrink-0" />}
                                {item.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
