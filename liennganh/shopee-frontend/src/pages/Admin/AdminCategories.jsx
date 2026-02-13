import { useState, useEffect } from 'react';
import api from '../../api';
import { Tag, Plus, Trash2, FolderOpen } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setSaving(true);
        try {
            const res = await api.post('/categories', form);
            const newCat = res.data.data || res.data;
            setCategories(prev => [...prev, newCat]);
            setForm({ name: '', description: '' });
            setShowForm(false);
        } catch { alert('Tạo danh mục thất bại!'); }
        finally { setSaving(false); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
                    <p className="text-sm text-gray-500 mt-1">{categories.length} danh mục</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${showForm ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}>
                    {showForm ? 'Đóng' : <><Plus className="w-4 h-4" /> Thêm danh mục</>}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                    <h3 className="font-bold text-gray-700 mb-4">Tạo danh mục mới</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    </div>
                    <button type="submit" disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
                        {saving ? 'Đang tạo...' : 'Tạo danh mục'}
                    </button>
                </form>
            )}

            {/* Categories Grid */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Đang tải...
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                        {categories.map((cat, i) => (
                            <div key={cat.id}
                                className={`p-5 flex items-start gap-4 hover:bg-blue-50/30 transition ${i < categories.length - (categories.length % 3 || 3) ? 'border-b border-gray-100' : ''
                                    } ${(i + 1) % 3 !== 0 ? 'sm:border-r border-gray-100' : ''}`}>
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Tag className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{cat.description || 'Không có mô tả'}</p>
                                    <p className="text-xs text-gray-300 mt-1">ID: {cat.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-400">
                        <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                        <p>Chưa có danh mục nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
