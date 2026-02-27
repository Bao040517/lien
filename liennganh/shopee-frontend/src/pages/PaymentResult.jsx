import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, ShoppingBag } from 'lucide-react';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading | success | failed | error

    const responseCode = searchParams.get('vnp_ResponseCode');
    const amount = searchParams.get('vnp_Amount');
    const orderId = searchParams.get('vnp_TxnRef');
    const transactionNo = searchParams.get('vnp_TransactionNo');
    const bankCode = searchParams.get('vnp_BankCode');
    const orderInfo = searchParams.get('vnp_OrderInfo');

    useEffect(() => {
        if (responseCode === '00') {
            setStatus('success');
        } else if (responseCode) {
            setStatus('failed');
        } else {
            setStatus('error');
        }
    }, [responseCode]);

    const formatPrice = (price) => {
        if (!price) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price / 100);
    };

    const getErrorMessage = (code) => {
        const errors = {
            '07': 'Trừ tiền thành công nhưng giao dịch bị nghi ngờ',
            '09': 'Thẻ/Tài khoản chưa đăng ký Internet Banking',
            '10': 'Xác thực thông tin thẻ không đúng quá 3 lần',
            '11': 'Đã hết hạn chờ thanh toán',
            '12': 'Thẻ/Tài khoản bị khóa',
            '13': 'Nhập sai mật khẩu OTP',
            '24': 'Khách hàng hủy giao dịch',
            '51': 'Tài khoản không đủ số dư',
            '65': 'Tài khoản vượt quá hạn mức giao dịch trong ngày',
            '75': 'Ngân hàng thanh toán đang bảo trì',
            '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định',
            '99': 'Lỗi không xác định',
        };
        return errors[code] || 'Giao dịch không thành công';
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                {status === 'success' && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center text-white">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold">Thanh toán thành công!</h1>
                        <p className="text-green-100 mt-2">Đơn hàng của bạn đã được xác nhận</p>
                    </div>
                )}
                {status === 'failed' && (
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 p-8 text-center text-white">
                        <XCircle className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold">Thanh toán thất bại</h1>
                        <p className="text-red-100 mt-2">{getErrorMessage(responseCode)}</p>
                    </div>
                )}
                {status === 'error' && (
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-8 text-center text-white">
                        <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold">Không xác định</h1>
                        <p className="text-yellow-100 mt-2">Không nhận được kết quả từ VNPay</p>
                    </div>
                )}
                {status === 'loading' && (
                    <div className="p-8 text-center">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-dark rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Đang xử lý...</p>
                    </div>
                )}

                {/* Details */}
                {status !== 'loading' && (
                    <div className="p-6">
                        <div className="space-y-3 text-sm">
                            {orderId && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Mã đơn hàng</span>
                                    <span className="font-semibold text-gray-800">#{orderId}</span>
                                </div>
                            )}
                            {amount && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Số tiền</span>
                                    <span className="font-bold text-primary-dark text-lg">{formatPrice(amount)}</span>
                                </div>
                            )}
                            {transactionNo && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Mã giao dịch VNPay</span>
                                    <span className="font-mono text-gray-800">{transactionNo}</span>
                                </div>
                            )}
                            {bankCode && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Ngân hàng</span>
                                    <span className="font-semibold text-gray-800">{bankCode}</span>
                                </div>
                            )}
                            {orderInfo && (
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Nội dung</span>
                                    <span className="text-gray-800 text-right max-w-[200px] truncate">{decodeURIComponent(orderInfo)}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Link to="/purchase"
                                className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition text-sm">
                                <ShoppingBag className="w-4 h-4" /> Đơn hàng
                            </Link>
                            <Link to="/"
                                className="flex items-center justify-center gap-2 py-3 bg-primary-dark text-white font-medium rounded-xl hover:bg-primary-darker transition text-sm">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
