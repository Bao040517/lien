import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { Bell, Check, Info, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const SellerNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await api.get('/notifications', {
                params: { userId: user.id }
            });
            setNotifications(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-orange-500" />
                Thông báo
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải thông báo...</div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {notifications.map(notif => (
                            <div
                                key={notif.id}
                                className={`p-4 flex gap-4 transition hover:bg-gray-50 ${!notif.read ? 'bg-orange-50/50' : ''}`}
                                onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 
                                    ${notif.type === 'PRODUCT_BAN' ? 'bg-red-100 text-red-500'
                                        : notif.type === 'PRODUCT_UNBAN' ? 'bg-green-100 text-green-500'
                                            : 'bg-blue-100 text-blue-500'}`}>
                                    {notif.type === 'PRODUCT_BAN' ? <AlertTriangle className="w-5 h-5" />
                                        : notif.type === 'PRODUCT_UNBAN' ? <Check className="w-5 h-5" />
                                            : <Info className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold text-gray-800 ${!notif.read ? 'text-orange-900' : ''}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {format(new Date(notif.createdAt), 'dd/MM/yyyy HH:mm')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                    {notif.relatedUrl && (
                                        <a href={notif.relatedUrl} className="text-xs text-blue-500 hover:underline mt-2 inline-block">
                                            Xem chi tiết
                                        </a>
                                    )}
                                </div>
                                {!notif.read && (
                                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                        <p>Bạn chưa có thông báo nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerNotifications;
