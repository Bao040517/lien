import { useState, useEffect, useRef } from 'react';
import api from '../../api';
import { Tag, Plus, Trash2, FolderOpen, Pencil, X, ImagePlus } from 'lucide-react';
import { getImageUrl } from '../../utils';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 5;

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories', { params: { size: 1000 } });
            setCategories(res.data.data?.content || res.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const resetForm = () => {
        setForm({ name: '', description: '' });
        setImageFile(null);
        setImagePreview(null);
        setEditingId(null);
        setShowForm(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setForm({ name: cat.name, description: cat.description || '' });
        setImagePreview(cat.imageUrl || null);
        setImageFile(null);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description || '');
            if (imageFile) {
                formData.append('image', imageFile);
            }

            let res;
            if (editingId) {
                // Cập nhật danh mục
                res = await api.put(`/categories/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setCategories(prev => prev.map(c => c.id === editingId ? (res.data.data || res.data) : c));
            } else {
                // Tạo mới kèm ảnh
                res = await api.post('/categories/with-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const newCat = res.data.data || res.data;
                setCategories(prev => [...prev, newCat]);
            }
            resetForm();
        } catch (err) {
            console.error(err);
            alert(editingId ? 'Cập nhật danh mục thất bại!' : 'Tạo danh mục thất bại!');
        }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xoá danh mục này? Hành động không thể hoàn tác.')) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch { alert('Xoá danh mục thất bại!'); }
    };

    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
    const totalPages = Math.ceil(categories.length / categoriesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPaginationRange = (current, total) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

        if (current <= 3) return [1, 2, 3, 4, '...', total];
        if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];

        return [1, '...', current - 1, current, current + 1, '...', total];
    };

    const paginationRange = getPaginationRange(currentPage, totalPages);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
                    <p className="text-sm text-gray-500 mt-1">{categories.length} danh mục</p>
                </div>
                <button onClick={() => { if (showForm && !editingId) { resetForm(); } else { resetForm(); setShowForm(true); } }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${showForm && !editingId ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}>
                    {showForm && !editingId ? 'Đóng' : <><Plus className="w-4 h-4" /> Thêm danh mục</>}
                </button>
            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-700">
                            {editingId ? 'Sửa danh mục' : 'Tạo danh mục mới'}
                        </h3>
                        {editingId && (
                            <button type="button" onClick={resetForm}
                                className="text-gray-400 hover:text-gray-600 transition">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Tên danh mục *</label>
                            <input type="text" required value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="VD: Điện thoại, Thời trang..."
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
                            <input type="text" value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Mô tả ngắn..."
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Ảnh danh mục</label>
                            <div className="flex items-center gap-3">
                                {imagePreview && (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50 transition flex-1">
                                    <ImagePlus className="w-4 h-4" />
                                    {imageFile ? imageFile.name : (editingId && imagePreview ? 'Đổi ảnh...' : 'Chọn ảnh...')}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                        {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Tạo danh mục')}
                    </button>
                </form>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Đang tải...
                    </div>
                ) : categories.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/80 text-xs text-gray-500 uppercase border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium tracking-wider">Danh mục</th>
                                    <th className="px-6 py-4 font-medium tracking-wider w-1/2">Mô tả</th>
                                    <th className="px-6 py-4 text-center font-medium tracking-wider w-32">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {currentCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 bg-white flex items-center justify-center shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow">
                                                    {cat.imageUrl ? (
                                                        <img src={getImageUrl(cat.imageUrl)} alt={cat.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                                    ) : null}
                                                    <Tag className={`w-6 h-6 text-blue-400 ${cat.imageUrl ? 'hidden' : ''}`} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{cat.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">ID: {cat.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {cat.description || <span className="text-gray-400 italic">Không có mô tả</span>}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(cat)}
                                                    className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                                                    title="Sửa">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(cat.id)}
                                                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                                    title="Xoá">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white">
                                <div className="text-sm text-gray-500">
                                    Hiển thị <span className="font-medium">{indexOfFirstCategory + 1}</span> đến <span className="font-medium">{Math.min(indexOfLastCategory, categories.length)}</span> trong số <span className="font-medium">{categories.length}</span> danh mục
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Trước
                                    </button>
                                    {paginationRange.map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">...</span>
                                        ) : (
                                            <button
                                                key={`page-${page}`}
                                                onClick={() => paginate(page)}
                                                className={`px-3 py-1 border rounded text-sm ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                            <FolderOpen className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="font-medium text-gray-600 text-lg">Chưa có danh mục nào</p>
                        <p className="text-sm text-gray-400 mt-1">Hãy tạo danh mục đầu tiên của bạn</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
