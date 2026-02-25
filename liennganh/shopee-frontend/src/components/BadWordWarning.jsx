import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';
import { findBadWords, highlightBadWords } from '../utils/badWordChecker';

const BadWordWarning = ({ productName, variant = 'admin' }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState({});
    const [tooltipPos, setTooltipPos] = useState('bottom');
    const iconRef = useRef(null);
    const tooltipRef = useRef(null);

    const matches = findBadWords(productName);
    if (matches.length === 0) return null;

    const parts = highlightBadWords(productName);

    useEffect(() => {
        if (showTooltip && iconRef.current) {
            const iconRect = iconRef.current.getBoundingClientRect();
            const tooltipWidth = 320;
            const tooltipHeight = tooltipRef.current?.offsetHeight || 200;
            
            const spaceBelow = window.innerHeight - iconRect.bottom;
            const spaceAbove = iconRect.top;
            
            const isTop = spaceBelow < tooltipHeight + 16 && spaceAbove > spaceBelow;
            setTooltipPos(isTop ? 'top' : 'bottom');
            
            let left = iconRect.left + iconRect.width / 2 - tooltipWidth / 2;
            left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));
            
            const style = {
                position: 'fixed',
                left: `${left}px`,
                width: `${tooltipWidth}px`,
                zIndex: 9999,
            };
            
            if (isTop) {
                style.bottom = `${window.innerHeight - iconRect.top + 8}px`;
            } else {
                style.top = `${iconRect.bottom + 8}px`;
            }
            
            setTooltipStyle(style);
        }
    }, [showTooltip]);

    const isAdmin = variant === 'admin';

    const tooltipContent = showTooltip && (
        <div
            ref={tooltipRef}
            style={tooltipStyle}
        >
                    {/* Arrow */}
                    <div
                        className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-amber-200 ${
                            tooltipPos === 'bottom'
                                ? '-top-1.5 border-l border-t'
                                : '-bottom-1.5 border-r border-b'
                        }`}
                    />

                    <div className="relative bg-white rounded-xl shadow-xl border border-amber-200 overflow-hidden max-h-[400px] flex flex-col">
                        {/* Header */}
                        <div className={`px-3.5 py-2.5 flex-shrink-0 ${
                            isAdmin
                                ? 'bg-gradient-to-r from-amber-50 to-orange-50'
                                : 'bg-gradient-to-r from-red-50 to-orange-50'
                        }`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isAdmin ? 'bg-amber-500' : 'bg-red-500'
                                }`}>
                                    <AlertTriangle className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className={`text-xs font-bold break-words ${
                                    isAdmin ? 'text-amber-800' : 'text-red-800'
                                }`}>
                                    {isAdmin
                                        ? 'Tên sản phẩm có chứa từ nhạy cảm'
                                        : 'Tên sản phẩm của bạn đang chứa từ nhạy cảm, cần sửa lại'}
                                </span>
                            </div>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="px-3.5 py-3 overflow-y-auto custom-scrollbar">
                            <p className="text-xs text-gray-500 mb-2">Tên sản phẩm:</p>
                            <p className="text-sm leading-relaxed break-words overflow-wrap-anywhere">
                                {parts.map((part, i) =>
                                    part.isBad ? (
                                        <span
                                            key={i}
                                            className="font-bold text-red-600 bg-red-50 border-b-2 border-red-400 px-0.5 rounded"
                                        >
                                            {part.text}
                                        </span>
                                    ) : (
                                        <span key={i} className="text-gray-700">{part.text}</span>
                                    )
                                )}
                            </p>

                            <div className="mt-2.5 pt-2 border-t border-gray-100">
                                <p className="text-[11px] text-gray-400 break-words">
                                    Phát hiện <span className="font-bold text-red-500">{matches.length}</span> từ nhạy cảm:
                                    {' '}
                                    {matches.map((m, i) => (
                                        <span key={i}>
                                            <span className="font-semibold text-red-500">"{m.word}"</span>
                                            {i < matches.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>
        </div>
    );

    return (
        <span
            className="relative inline-flex items-center ml-1.5"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <span
                ref={iconRef}
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 border border-amber-300 cursor-help animate-pulse"
            >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            </span>

            {createPortal(tooltipContent, document.body)}
        </span>
    );
};

export default BadWordWarning;
