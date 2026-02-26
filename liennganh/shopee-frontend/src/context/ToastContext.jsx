import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

const ICONS = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const COLORS = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-400', icon: 'text-emerald-500', bar: 'bg-emerald-500' },
    error: { bg: 'bg-red-50', border: 'border-red-400', icon: 'text-red-500', bar: 'bg-red-500' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-400', icon: 'text-amber-500', bar: 'bg-amber-500' },
    info: { bg: 'bg-blue-50', border: 'border-blue-400', icon: 'text-blue-500', bar: 'bg-blue-500' },
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, duration, exiting: false }]);
        if (duration > 0) setTimeout(() => removeToast(id), duration);
        return id;
    }, [removeToast]);

    const toast = useCallback((message) => addToast(message, 'info'), [addToast]);
    toast.success = useCallback((msg, duration) => addToast(msg, 'success', duration || 3500), [addToast]);
    toast.error = useCallback((msg, duration) => addToast(msg, 'error', duration || 5000), [addToast]);
    toast.warning = useCallback((msg, duration) => addToast(msg, 'warning', duration || 4000), [addToast]);
    toast.info = useCallback((msg, duration) => addToast(msg, 'info', duration || 3500), [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: '420px' }}>
                {toasts.map((t) => {
                    const Icon = ICONS[t.type];
                    const color = COLORS[t.type];
                    return (
                        <div
                            key={t.id}
                            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border ${color.bg} ${color.border} 
                                ${t.exiting ? 'toast-exit' : 'toast-enter'}`}
                            style={{ minWidth: '300px' }}
                        >
                            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color.icon}`} />
                            <p className="flex-1 text-sm text-gray-800 leading-relaxed">{t.message}</p>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="flex-shrink-0 p-0.5 text-gray-400 hover:text-gray-600 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {/* Progress bar */}
                            <div className={`absolute bottom-0 left-0 h-0.5 rounded-b-xl ${color.bar} toast-progress`}
                                style={{ animationDuration: `${(t.duration || 3500) / 1000}s` }} />
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes toastSlideOut {
                    from { opacity: 1; transform: translateX(0); max-height: 100px; }
                    to { opacity: 0; transform: translateX(100px); max-height: 0; }
                }
                @keyframes toastProgress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .toast-enter { animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards; }
                .toast-exit { animation: toastSlideOut 0.3s ease-in forwards; }
                .toast-progress { animation: toastProgress linear forwards; }
            `}</style>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
