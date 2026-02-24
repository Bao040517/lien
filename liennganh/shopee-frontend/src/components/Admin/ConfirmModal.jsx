import React from 'react';
import { AlertCircle, AlertTriangle, Info, Check, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'danger', confirmText = 'Xác nhận', cancelText = 'Hủy' }) => {
    if (!isOpen) return null;

    const config = {
        danger: {
            icon: AlertCircle,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            btnBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        },
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            btnBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        },
        info: {
            icon: Info,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            btnBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        },
        success: {
            icon: Check,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            btnBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        }
    };

    const currentConfig = config[type] || config.info;
    const Icon = currentConfig.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-[scaleUp_0.2s_ease-out]">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${currentConfig.iconBg}`}>
                            <Icon className={`w-5 h-5 ${currentConfig.iconColor}`} />
                        </div>
                        <div className="flex-1 mt-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${currentConfig.btnBg}`}
                    >
                        {currentConfig.icon === Check && <Check className="w-4 h-4" />}
                        {currentConfig.icon === AlertCircle && <X className="w-4 h-4" />}
                        {confirmText}
                    </button>
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;
