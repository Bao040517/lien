import React, { useState } from 'react';
import { KeyRound, Copy, CheckCircle, ShieldAlert } from 'lucide-react';

const PasswordModal = ({ isOpen, username, password, onClose }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !password) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback cho trình duyệt không hỗ trợ clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = password;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[scaleUp_0.2s_ease-out]">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <KeyRound className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Mật khẩu mới</h3>
                        {username && (
                            <p className="text-white/80 text-sm">Tài khoản: {username}</p>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Password display */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 font-mono text-lg text-gray-800 tracking-wider select-all">
                            <span className="flex-1 text-center font-bold">{password}</span>
                            <button
                                onClick={handleCopy}
                                className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${copied
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-200 text-gray-500 hover:bg-amber-100 hover:text-amber-600'
                                    }`}
                                title={copied ? 'Đã copy!' : 'Copy mật khẩu'}
                            >
                                {copied ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : (
                                    <Copy className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {copied && (
                            <p className="text-center text-green-600 text-sm font-medium mt-2 animate-bounce">
                                ✅ Đã copy vào clipboard!
                            </p>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-700 text-xs leading-relaxed">
                            Hãy gửi mật khẩu này cho người dùng một cách an toàn.
                            Mật khẩu sẽ <strong>không thể xem lại</strong> sau khi đóng hộp thoại này.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                    <button
                        onClick={handleCopy}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${copied
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                    >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Đã copy!' : 'Copy mật khẩu'}
                    </button>
                    <button
                        onClick={() => {
                            setCopied(false);
                            onClose();
                        }}
                        className="px-5 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>

            <style>{`
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

export default PasswordModal;
