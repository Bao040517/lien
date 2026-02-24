import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';

const PromptModal = ({ isOpen, title, message, defaultValue = '', placeholder = '', onConfirm, onCancel, confirmText = 'Xác nhận', cancelText = 'Hủy' }) => {
    const [inputValue, setInputValue] = useState(defaultValue);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setInputValue(defaultValue);
            setError('');
        }
    }, [isOpen, defaultValue]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!inputValue.trim()) {
            setError('Trường này không được để trống.');
            return;
        }
        onConfirm(inputValue);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-[scaleUp_0.2s_ease-out]">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 mt-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {title}
                            </h3>
                            {message && (
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {message}
                                </p>
                            )}

                            <div>
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        if (e.target.value.trim()) setError('');
                                    }}
                                    placeholder={placeholder}
                                    rows={3}
                                    autoFocus
                                    className={`w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${error
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                />
                                {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><X className="w-3 h-3" />{error}</p>}
                            </div>
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
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
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

export default PromptModal;
