import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Premium Pagination Component
 * 
 * Props:
 *   currentPage: number (1-indexed)
 *   totalPages: number
 *   onPageChange: (page: number) => void
 *   totalItems: number (optional)
 *   startItem: number (optional, 1-indexed)
 *   endItem: number (optional)
 *   itemLabel: string (optional, e.g. "sản phẩm", "người dùng")
 *   accentColor: 'green' | 'blue' (default: 'green')
 */
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    startItem,
    endItem,
    itemLabel = 'mục',
    accentColor = 'green'
}) => {
    if (totalPages <= 1) return null;

    const getPaginationRange = (current, total) => {
        const delta = 1;
        const range = [];
        for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            range.push(i);
        }
        if (current - delta > 2) range.unshift('...');
        if (current + delta < total - 1) range.push('...');
        range.unshift(1);
        if (total > 1) range.push(total);
        return range;
    };

    const paginationRange = getPaginationRange(currentPage, totalPages);

    const colors = {
        green: {
            active: 'bg-primary-dark text-white border-primary-dark shadow-sm shadow-primary-light',
            hover: 'hover:border-primary hover:text-primary-darker',
            text: 'text-primary-darker',
        },
        orange: {
            active: 'bg-primary-dark text-white border-primary-dark shadow-sm shadow-primary-light',
            hover: 'hover:border-primary hover:text-primary-darker',
            text: 'text-primary-darker',
        },
        blue: {
            active: 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200',
            hover: 'hover:border-blue-300 hover:text-blue-600',
            text: 'text-blue-600',
        }
    };

    const c = colors[accentColor] || colors.green;

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            {/* Info */}
            <div className="text-sm text-gray-500">
                {totalItems !== undefined && startItem !== undefined && endItem !== undefined ? (
                    <>
                        Hiển thị <span className={`font-semibold ${c.text}`}>{startItem}</span> – <span className={`font-semibold ${c.text}`}>{endItem}</span> trong số <span className="font-semibold text-gray-700">{totalItems}</span> {itemLabel}
                    </>
                ) : (
                    <>
                        Trang <span className={`font-semibold ${c.text}`}>{currentPage}</span> / <span className="font-semibold text-gray-700">{totalPages}</span>
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Trước</span>
                </button>

                {paginationRange.map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-gray-400 text-sm select-none">•••</span>
                    ) : (
                        <button
                            key={`page-${page}`}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[36px] h-9 flex items-center justify-center border rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === page
                                ? c.active
                                : `border-gray-200 text-gray-600 ${c.hover} hover:bg-gray-50`
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    <span className="hidden sm:inline">Sau</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
