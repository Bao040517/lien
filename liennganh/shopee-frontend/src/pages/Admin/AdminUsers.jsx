import { useState, useEffect } from 'react';
import api from '../../api';
import { Users, Search, Lock, Unlock, Shield, Sparkles, KeyRound } from 'lucide-react';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/Admin/ConfirmModal';
import PasswordModal from '../../components/Admin/PasswordModal';
import { useToast } from '../../context/ToastContext';

const roleLabels = { USER: 'Người dùng', SELLER: 'Người bán', ADMIN: 'Quản trị viên' };
const roleColors = {
    USER: 'bg-blue-50 text-blue-700',
    SELLER: 'bg-primary-lighter text-primary-darker',
    ADMIN: 'bg-purple-50 text-purple-700'
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [lastSeenMaxId, setLastSeenMaxId] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', action: null, targetId: null });
    const [passwordModal, setPasswordModal] = useState({ isOpen: false, username: '', password: '' });

    const handleResetPassword = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'warning',
            title: 'Reset mật khẩu tài khoản này?',
            message: 'Mật khẩu sẽ được đặt lại ngẫu nhiên (10 ký tự). Người dùng cần đổi mật khẩu sau khi đăng nhập.',
            targetId: id,
            action: 'reset-password'
        });
    };

    const confirmResetPassword = async (id) => {
        try {
            const res = await api.put(`/admin/users/${id}/reset-password`);
            const newPassword = res.data.data;
            const user = users.find(u => u.id === id);
            setPasswordModal({ isOpen: true, username: user?.username || '', password: newPassword });
        } catch { toast.error('Reset mật khẩu thất bại!'); }
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter]);

    useEffect(() => {
        const savedMaxId = parseInt(localStorage.getItem('admin_users_last_seen_max_id') || '0');
        setLastSeenMaxId(savedMaxId);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            const allUsers = res.data.data || [];
            // Sắp xếp ID giảm dần → mới nhất lên đầu
            allUsers.sort((a, b) => b.id - a.id);
            setUsers(allUsers);

            // Lưu maxId hiện tại
            if (allUsers.length > 0) {
                const currentMaxId = Math.max(...allUsers.map(u => u.id));
                localStorage.setItem('admin_users_last_seen_max_id', currentMaxId.toString());
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const isNewUser = (user) => lastSeenMaxId > 0 && user.id > lastSeenMaxId;

    const handleLock = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'warning',
            title: 'Khoá tài khoản này?',
            message: 'Tài khoản này sẽ không thể đăng nhập hoặc thực hiện bất kỳ thao tác nào.',
            targetId: id,
            action: 'lock'
        });
    };

    const confirmLock = async (id) => {
        try {
            await api.put(`/admin/users/${id}/lock`);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, isLocked: true, locked: true } : u));
        } catch { toast.info('Khoá thất bại!'); }
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    const handleUnlock = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'success',
            title: 'Mở khoá tài khoản này?',
            message: 'Tài khoản này sẽ được khôi phục quyền truy cập bình thường.',
            targetId: id,
            action: 'unlock'
        });
    };

    const confirmUnlock = async (id) => {
        try {
            await api.put(`/admin/users/${id}/unlock`);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, isLocked: false, locked: false } : u));
        } catch { toast.info('Mở khoá thất bại!'); }
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    const newCount = users.filter(u => isNewUser(u)).length;

    const filtered = users.filter(u => {
        const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filtered.length / usersPerPage);



    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
                    <p className="text-sm text-gray-500 mt-1">{users.length} tài khoản trong hệ thống</p>
                </div>
            </div>

            {/* Banner thông báo user mới */}
            {newCount > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-blue-800 font-semibold">👤 Có {newCount} người dùng mới đăng ký!</p>
                        <p className="text-blue-600 text-sm">Người dùng mới đã được đưa lên đầu danh sách và đánh dấu nổi bật.</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm theo tên hoặc email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
                </div>
                <div className="flex gap-2">
                    {['ALL', 'USER', 'SELLER', 'ADMIN'].map(role => (
                        <button key={role} onClick={() => setRoleFilter(role)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg transition ${roleFilter === role
                                ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {role === 'ALL' ? 'Tất cả' : roleLabels[role]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Đang tải...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Người dùng</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Vai trò</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3">Ngày tạo</th>
                                    <th className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentUsers.map(user => {
                                    const isLocked = user.isLocked || user.locked;
                                    const isNew = isNewUser(user);
                                    return (
                                        <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors ${isLocked ? 'bg-red-50/30'
                                            : isNew ? 'bg-blue-50 border-l-4 border-blue-500'
                                                : ''
                                            }`}>
                                            <td className="px-6 py-3 text-sm text-gray-400">#{user.id}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${user.role === 'ADMIN' ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                                                        : user.role === 'SELLER' ? 'bg-gradient-to-br from-primary-dark to-primary-darker'
                                                            : 'bg-gradient-to-br from-blue-400 to-blue-600'
                                                        }`}>
                                                        {user.role === 'ADMIN' ? <Shield className="w-4 h-4" /> : user.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {user.username}
                                                        {isNew && (
                                                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full animate-bounce">
                                                                <Sparkles className="w-3 h-3" /> MỚI
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                                                    {roleLabels[user.role] || user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${isLocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                    {isLocked ? '🔒 Đã khoá' : '✅ Hoạt động'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-400">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                                            </td>
                                            <td className="px-6 py-3 text-center space-x-1">
                                                {user.role !== 'ADMIN' && (
                                                    <>
                                                        {isLocked ? (
                                                            <button onClick={() => handleUnlock(user.id)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition">
                                                                <Unlock className="w-3 h-3" /> Mở khoá
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleLock(user.id)}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition">
                                                                <Lock className="w-3 h-3" /> Khoá
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleResetPassword(user.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600 transition"
                                                            title="Reset mật khẩu về 123456">
                                                            <KeyRound className="w-3 h-3" /> Reset MK
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="p-8 text-center text-gray-400">Không tìm thấy người dùng</div>
                        )}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filtered.length}
                            startItem={indexOfFirstUser + 1}
                            endItem={Math.min(indexOfLastUser, filtered.length)}
                            itemLabel="người dùng"
                            accentColor="blue"
                        />
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                type={confirmModal.type}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={() => {
                    if (confirmModal.action === 'lock') confirmLock(confirmModal.targetId);
                    else if (confirmModal.action === 'unlock') confirmUnlock(confirmModal.targetId);
                    else if (confirmModal.action === 'reset-password') confirmResetPassword(confirmModal.targetId);
                }}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />

            <PasswordModal
                isOpen={passwordModal.isOpen}
                username={passwordModal.username}
                password={passwordModal.password}
                onClose={() => setPasswordModal({ isOpen: false, username: '', password: '' })}
            />
        </div>
    );
};

export default AdminUsers;
