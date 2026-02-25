import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { MessageCircle, Send, Search, ArrowLeft, Users, Shield, Store, Circle } from 'lucide-react';

/**
 * Trang Chat dùng chung cho USER, SELLER, ADMIN
 * - Cột trái: Danh sách hội thoại
 * - Cột phải: Khung chat
 * - Hỗ trợ nhận openConv từ navigation state (từ nút Chat Ngay)
 */
const ChatPage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const messagesEndRef = useRef(null);

    // Lấy danh sách hội thoại
    const fetchConversations = async () => {
        if (!user) return;
        try {
            const res = await api.get('/messages/conversations', { params: { userId: user.id } });
            setConversations(res.data.data || []);
        } catch (e) { console.error('Lỗi tải hội thoại:', e); }
    };

    // Lấy tin nhắn trong hội thoại đang mở
    const fetchMessages = async (convId) => {
        if (!convId || !user) return;
        try {
            const res = await api.get(`/messages/${convId}`, { params: { userId: user.id } });
            setMessages(res.data.data || []);
        } catch (e) { console.error('Lỗi tải tin nhắn:', e); }
    };

    // Polling: refresh hội thoại + tin nhắn mỗi 5s
    useEffect(() => {
        fetchConversations();
        const interval = setInterval(() => {
            fetchConversations();
            if (activeConv) fetchMessages(activeConv.id);
        }, 5000);
        return () => clearInterval(interval);
    }, [user, activeConv]);

    // Xử lý khi nhận openConv từ navigation state (Chat Ngay)
    useEffect(() => {
        if (location.state?.openConv && !initialLoaded) {
            const conv = location.state.openConv;
            setActiveConv(conv);
            fetchMessages(conv.id);
            setInitialLoaded(true);
            // Clear state để không open lại khi re-render
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Scroll xuống cuối khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mở hội thoại
    const openConversation = async (conv) => {
        setActiveConv(conv);
        setShowSearch(false);
        await fetchMessages(conv.id);
        // Cập nhật unread
        fetchConversations();
    };

    // Gửi tin nhắn
    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConv) return;

        try {
            await api.post(`/messages/${activeConv.id}?senderId=${user.id}`, { content: newMessage.trim() });
            setNewMessage('');
            await fetchMessages(activeConv.id);
            fetchConversations();
        } catch (e) { console.error('Lỗi gửi tin nhắn:', e); }
    };

    // Tìm kiếm user
    const handleSearch = async () => {
        if (!searchKeyword.trim()) return;
        try {
            const res = await api.get('/messages/users/search', {
                params: { keyword: searchKeyword, currentUserId: user.id }
            });
            setSearchResults(res.data.data || []);
        } catch (e) { console.error('Lỗi tìm kiếm:', e); }
    };

    // Bắt đầu hội thoại với user được chọn
    const startConversation = async (otherUserId) => {
        try {
            const res = await api.post(`/messages/conversations?userId1=${user.id}&userId2=${otherUserId}`);
            const conv = res.data.data;
            setShowSearch(false);
            setSearchKeyword('');
            setSearchResults([]);
            // Tìm otherUser info
            const otherUser = conv.user1.id === user.id ? conv.user2 : conv.user1;
            const convObj = { id: conv.id, otherUser };
            setActiveConv(convObj);
            await fetchMessages(conv.id);
            fetchConversations();
        } catch (e) { console.error('Lỗi tạo hội thoại:', e); }
    };

    // Role badge
    const getRoleBadge = (role) => {
        if (role === 'ADMIN') return <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium"><Shield className="w-3 h-3" /> Admin</span>;
        if (role === 'SELLER') return <span className="inline-flex items-center gap-1 text-[10px] bg-primary-light text-primary-darker px-1.5 py-0.5 rounded-full font-medium"><Store className="w-3 h-3" /> Seller</span>;
        return <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium"><Users className="w-3 h-3" /> User</span>;
    };

    // Thời gian
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ`;
        return d.toLocaleDateString('vi-VN');
    };

    if (!user) return <div className="flex items-center justify-center h-96 text-gray-400">Vui lòng đăng nhập</div>;

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl shadow-lg overflow-hidden border">
            {/* ===== CỘT TRÁI: Danh sách hội thoại ===== */}
            <div className="w-80 border-r flex flex-col bg-gray-50">
                {/* Header */}
                <div className="p-4 border-b bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-primary-dark" /> Tin nhắn
                        </h2>
                        <button
                            onClick={() => { setShowSearch(!showSearch); setSearchResults([]); setSearchKeyword(''); }}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                            title="Tin nhắn mới"
                        >
                            <Search className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Tìm kiếm user mới */}
                    {showSearch && (
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={e => setSearchKeyword(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    placeholder="Tìm theo tên hoặc email..."
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button onClick={handleSearch} className="px-3 py-2 bg-primary-dark text-white rounded-lg text-sm hover:bg-primary-darker transition">
                                    Tìm
                                </button>
                            </div>
                            {searchResults.length > 0 && (
                                <div className="max-h-48 overflow-y-auto border rounded-lg bg-white">
                                    {searchResults.map(u => (
                                        <button
                                            key={u.id}
                                            onClick={() => startConversation(u.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary-lighter transition text-left"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-br from-primary-dark to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {u.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-800 truncate">{u.username}</p>
                                                <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                            </div>
                                            {getRoleBadge(u.role)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Danh sách hội thoại */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm p-4">
                            <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
                            <p>Chưa có hội thoại nào</p>
                            <p className="text-xs mt-1">Nhấn 🔍 để bắt đầu trò chuyện</p>
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => openConversation(conv)}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition text-left border-b hover:bg-primary-lighter/50 ${activeConv?.id === conv.id ? 'bg-primary-lighter border-l-4 border-l-primary-dark' : ''}`}
                            >
                                <div className="relative">
                                    <div className="w-11 h-11 bg-gradient-to-br from-primary-dark to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                        {conv.otherUser?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {conv.otherUser?.username}
                                        </p>
                                        <span className="text-[10px] text-gray-400 flex-shrink-0">{formatTime(conv.lastMessageTime || conv.updatedAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        {getRoleBadge(conv.otherUser?.role)}
                                        <p className={`text-xs truncate flex-1 ${conv.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                                            {conv.lastMessage || 'Bắt đầu trò chuyện...'}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* ===== CỘT PHẢI: Khung chat ===== */}
            <div className="flex-1 flex flex-col">
                {!activeConv ? (
                    // Trạng thái chưa chọn hội thoại
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageCircle className="w-20 h-20 mb-4 text-gray-200" />
                        <p className="text-lg font-medium text-gray-500">Chọn một hội thoại để bắt đầu</p>
                        <p className="text-sm mt-1">Hoặc tìm kiếm người dùng mới để nhắn tin</p>
                    </div>
                ) : (
                    <>
                        {/* Header chat */}
                        <div className="px-5 py-3 border-b bg-white flex items-center gap-3 shadow-sm">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-dark to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                                {activeConv.otherUser?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{activeConv.otherUser?.username}</p>
                                <div>{getRoleBadge(activeConv.otherUser?.role)}</div>
                            </div>
                        </div>

                        {/* Messages area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 text-sm py-8">
                                    Bắt đầu cuộc trò chuyện! 👋
                                </div>
                            )}
                            {messages.map(msg => {
                                const isMine = msg.senderId === user.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] ${isMine ? 'order-2' : ''}`}>
                                            {!isMine && (
                                                <p className="text-[10px] text-gray-400 mb-0.5 ml-1">{msg.senderName}</p>
                                            )}
                                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine
                                                ? 'bg-primary-dark text-white rounded-br-md'
                                                : 'bg-white text-gray-800 border rounded-bl-md shadow-sm'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <p className={`text-[10px] text-gray-400 mt-0.5 ${isMine ? 'text-right mr-1' : 'ml-1'}`}>
                                                {formatTime(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <form onSubmit={handleSend} className="px-4 py-3 border-t bg-white flex items-center gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 px-4 py-2.5 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-2.5 bg-primary-dark text-white rounded-full hover:bg-primary-darker transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
