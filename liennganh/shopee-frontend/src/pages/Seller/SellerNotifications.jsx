import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SellerNotifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications', { params: { userId: user.id } });
            setNotifications(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (notif) => {
        if (!notif.read) {
            try {
                await api.put(`/notifications/${notif.id}/read`);
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
            } catch (error) { console.error(error); }
        }

        if (notif.type === 'Product' || notif.type === 'PRODUCT_BAN' || notif.type === 'PRODUCT_UNBAN') {
            navigate('/seller/products');
        } else if (notif.type === 'Review' || notif.type === 'REVIEW') {
            // navigate('/seller/reviews'); // Placeholder
            navigate('/seller/products'); // Redirect to products since review connects to product
        } else if (notif.type === 'Order' || notif.type === 'ORDER') {
            navigate('/seller/orders');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải thông báo...</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[600px]">
            <h1 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-primary-dark" />
                Thông báo của Shop
            </h1>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center text-gray-400 py-12 flex flex-col items-center">
                        <Bell className="w-12 h-12 mb-4 text-gray-200" />
                        <p>Chưa có thông báo nào</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            onClick={() => handleMarkRead(notif)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-200'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-semibold ${notif.read ? 'text-gray-700' : 'text-blue-700'}`}>{notif.title}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                    {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                            {!notif.read && (
                                <div className="flex justify-end mt-2">
                                    <span className="text-xs text-blue-500 flex items-center gap-1 font-medium">
                                        <CheckCheck className="w-3 h-3" /> Đánh dấu đã đọc
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SellerNotifications;
