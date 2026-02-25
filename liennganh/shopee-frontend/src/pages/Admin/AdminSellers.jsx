import { useState, useEffect } from 'react';
import api from '../../api';
import { UserCheck, Search, Check, X, Ban, Store, Sparkles } from 'lucide-react';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/Admin/ConfirmModal';

const statusConfig = {
    PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    APPROVED: { label: 'Đã duyệt', color: 'bg-green-50 text-green-700 border-green-200' },
    REJECTED: { label: 'Đã từ chối', color: 'bg-red-50 text-red-700 border-red-200' },
    SUSPENDED: { label: 'Tạm khoá', color: 'bg-gray-100 text-gray-700 border-gray-200' }
};

const AdminSellers = () => {
    const [sellers, setSellers] = useState([]);
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('ALL');
    const [search, setSearch] = useState('');
    const [lastSeenMaxId, setLastSeenMaxId] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const sellersPerPage = 10;

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: 'danger', title: '', message: '', targetId: null, actionType: null });

    useEffect(() => {
        setCurrentPage(1);
    }, [search, tab]);

    useEffect(() => {
        const savedMaxId = parseInt(localStorage.getItem('admin_sellers_last_seen_max_id') || '0');
        setLastSeenMaxId(savedMaxId);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [allRes, pendingRes] = await Promise.all([
                api.get('/admin/sellers'),
                api.get('/admin/sellers/pending')
            ]);
            const allSellers = allRes.data.data || [];
            const allPending = pendingRes.data.data || [];

            // Sắp xếp ID giảm dần → mới nhất lên đầu
            allSellers.sort((a, b) => b.id - a.id);
            allPending.sort((a, b) => b.id - a.id);

            setSellers(allSellers);
            setPending(allPending);

            // Lưu maxId hiện tại
            const allIds = [...allSellers, ...allPending].map(s => s.id);
            if (allIds.length > 0) {
                localStorage.setItem('admin_sellers_last_seen_max_id', Math.max(...allIds).toString());
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const isNewSeller = (seller) => lastSeenMaxId > 0 && seller.id > lastSeenMaxId;

    const handleActionClick = (id, actionType) => {
        const msgs = {
            approve: { title: 'Duyệt người bán này?', type: 'success', msg: 'Họ sẽ được phép đăng sản phẩm và bán hàng.' },
            reject: { title: 'Từ chối người bán này?', type: 'danger', msg: 'Yêu cầu mở shop sẽ bị huỷ bỏ.' },
            suspend: { title: 'Tạm khoá người bán này?', type: 'warning', msg: 'Họ sẽ không thể truy cập trang quản trị shop.' }
        };

        if (actionType === 'approve') {
            confirmAction(id, actionType);
            return;
        }

        setConfirmModal({
            isOpen: true,
            type: msgs[actionType].type,
            title: msgs[actionType].title,
            message: msgs[actionType].msg,
            targetId: id,
            actionType: actionType
        });
    };

    const confirmAction = async (id, action) => {
        try {
            await api.put(`/ admin / sellers / ${id}/${action}`);
            const newStatus = action === 'approve' ? 'APPROVED' : action === 'reject' ? 'REJECTED' : 'SUSPENDED';
            setSellers(prev => prev.map(s =>
                s.id === id ? { ...s, sellerStatus: newStatus } : s
            ));
            setPending(prev => prev.filter(s => s.id !== id));
        } catch { alert('Thao tác thất bại!'); }
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    const tabs = [
        { key: 'ALL', label: 'Tất cả', count: sellers.length },
        { key: 'PENDING', label: 'Chờ duyệt', count: pending.length },
        { key: 'APPROVED', label: 'Đã duyệt', count: sellers.filter(s => s.sellerStatus === 'APPROVED').length },
        { key: 'REJECTED', label: 'Đã từ chối', count: sellers.filter(s => s.sellerStatus === 'REJECTED').length },
        { key: 'SUSPENDED', label: 'Tạm khoá', count: sellers.filter(s => s.sellerStatus === 'SUSPENDED').length },
    ];

    const getList = () => {
        let list = tab === 'PENDING' ? pending : tab === 'ALL' ? sellers : sellers.filter(s => s.sellerStatus === tab);
        if (search) {
            list = list.filter(s => s.username?.toLowerCase().includes(search.toLowerCase()) ||
                s.email?.toLowerCase().includes(search.toLowerCase()));
        }
        return list;
    };

    const newCount = [...sellers, ...pending].filter(s => isNewSeller(s)).length;

    const filteredList = getList();
    const indexOfLastSeller = currentPage * sellersPerPage;
    const indexOfFirstSeller = indexOfLastSeller - sellersPerPage;
    const currentSellers = filteredList.slice(indexOfFirstSeller, indexOfLastSeller);
    const totalPages = Math.ceil(filteredList.length / sellersPerPage);



    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Người bán</h1>
                    <p className="text-sm text-gray-500 mt-1">{sellers.length} người bán · {pending.length} chờ duyệt</p>
                </div>
            </div>

            {/* Banner thông báo seller mới */}
            {newCount > 0 && (
                <div className="bg-gradient-to-r from-primary-lighter to-amber-50 border border-primary rounded-xl p-4 mb-6 flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-primary-text font-semibold">🆕 Có {newCount} người bán mới đăng ký!</p>
                        <p className="text-primary-darker text-sm">Người bán mới đã được đưa lên đầu danh sách và đánh dấu nổi bật.</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${tab === t.key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}>
                        {t.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
                            }`}>{t.count}</span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm theo tên hoặc email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
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
                                    <th className="px-6 py-3">Người bán</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentSellers.map(seller => {
                                    const status = statusConfig[seller.sellerStatus] || statusConfig.PENDING;
                                    const isNew = isNewSeller(seller);
                                    return (
                                        <tr key={seller.id} className={`hover:bg-gray-50/50 transition-colors ${isNew ? 'bg-primary-lighter border-l-4 border-primary-dark' : ''
                                            }`}>
                                            <td className="px-6 py-3 text-sm text-gray-400">#{seller.id}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-gradient-to-br from-primary-dark to-primary-darker rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                        {seller.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {seller.username}
                                                        {isNew && (
                                                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-primary-dark text-white text-[10px] font-bold rounded-full animate-bounce">
                                                                <Sparkles className="w-3 h-3" /> MỚI
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-500">{seller.email}</td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center space-x-1">
                                                {seller.sellerStatus === 'PENDING' && (
                                                    <>
                                                        <button onClick={() => handleActionClick(seller.id, 'approve')}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition">
                                                            <Check className="w-3 h-3" /> Duyệt
                                                        </button>
                                                        <button onClick={() => handleActionClick(seller.id, 'reject')}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition">
                                                            <X className="w-3 h-3" /> Từ chối
                                                        </button>
                                                    </>
                                                )}
                                                {seller.sellerStatus === 'APPROVED' && (
                                                    <button onClick={() => handleActionClick(seller.id, 'suspend')}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 transition">
                                                        <Ban className="w-3 h-3" /> Tạm khoá
                                                    </button>
                                                )}
                                                {seller.sellerStatus === 'SUSPENDED' && (
                                                    <button onClick={() => handleActionClick(seller.id, 'approve')}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition">
                                                        <Check className="w-3 h-3" /> Mở khoá
                                                    </button>
                                                )}
                                                {seller.sellerStatus === 'REJECTED' && (
                                                    <button onClick={() => handleActionClick(seller.id, 'approve')}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition">
                                                        <Check className="w-3 h-3" /> Duyệt lại
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredList.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                <Store className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                <p>Không có người bán nào</p>
                            </div>
                        )}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredList.length}
                            startItem={indexOfFirstSeller + 1}
                            endItem={Math.min(indexOfLastSeller, filteredList.length)}
                            itemLabel="người bán"
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
                onConfirm={() => confirmAction(confirmModal.targetId, confirmModal.actionType)}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />
        </div>
    );
};

export default AdminSellers;
