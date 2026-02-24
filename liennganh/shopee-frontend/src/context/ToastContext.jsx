import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let globalToastId = 0;

/**
 * Toast Provider — Wrap toàn bộ App để dùng toast thay alert()
 * 
 * Sử dụng: const toast = useToast();
 *   toast.success('Thành công!');
 *   toast.error('Lỗi rồi!');
 *   toast.warning('Cảnh báo!');
 *   toast.info('Thông tin');
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 300);
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = ++globalToastId;
        setToasts(prev => [...prev, { id, message, type, exiting: false }]);

        if (duration > 0) {
            timersRef.current[id] = setTimeout(() => {
                removeToast(id);
                delete timersRef.current[id];
            }, duration);
        }

        return id;
    }, [removeToast]);

    const toast = useCallback({
        success: (msg, duration) => addToast(msg, 'success', duration),
        error: (msg, duration) => addToast(msg, 'error', duration ?? 4000),
        warning: (msg, duration) => addToast(msg, 'warning', duration),
        info: (msg, duration) => addToast(msg, 'info', duration),
    }, [addToast]);

    // Reassign to make it callable
    const toastApi = Object.assign(
        (msg) => addToast(msg, 'info'),
        {
            success: (msg, duration) => addToast(msg, 'success', duration),
            error: (msg, duration) => addToast(msg, 'error', duration ?? 4000),
            warning: (msg, duration) => addToast(msg, 'warning', duration),
            info: (msg, duration) => addToast(msg, 'info', duration),
        }
    );

    const iconMap = {
        success: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
        error: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />,
        info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
    };

    const bgMap = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200',
    };

    const barMap = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    return (
        <ToastContext.Provider value={toastApi}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: '400px' }}>
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 ${bgMap[t.type]} ${t.exiting
                                ? 'opacity-0 translate-x-8'
                                : 'opacity-100 translate-x-0 animate-[slideIn_0.3s_ease-out]'
                            }`}
                        style={{ minWidth: '280px' }}
                    >
                        {/* Color bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${barMap[t.type]}`} />

                        {iconMap[t.type]}
                        <p className="text-sm text-gray-800 flex-1 leading-relaxed pt-0.5">{t.message}</p>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Keyframe animation */}
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};
