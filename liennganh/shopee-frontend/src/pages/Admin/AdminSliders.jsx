import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Plus, Trash2, Edit, Image as ImageIcon, CheckCircle, XCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { getImageUrl } from '../../utils';
import { useToast } from '../../context/ToastContext';

const AdminSliders = () => {
    const [sliders, setSliders] = useState([]);
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        imageUrl: '',
        title: '',
        link: '',
        displayOrder: 0,
        isActive: true
    });

    // Thêm state để lưu 1 file
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        try {
            const res = await api.get('/sliders');
            const data = res.data?.data || res.data || [];

            // Xắp xếp theo displayOrder
            const sorted = Array.isArray(data) ? data.sort((a, b) => a.displayOrder - b.displayOrder) : [];
            setSliders(sorted);
        } catch (error) {
            console.error('Error fetching sliders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;

        const file = fileList[0];
        setSelectedFile(file);

        // Tạo URL preview cho file mới chọn
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Cần reset lại input để có thể chọn lại chính file đó nếu cần
        e.target.value = '';
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl); // Cleanup memory
            setPreviewUrl(null);
        }
        document.getElementById('slider-file-input').value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile && !form.imageUrl) {
            toast.warning('Vui lòng tải lên một ảnh cho slider!');
            return;
        }

        setUploading(true);
        try {
            let finalImageUrl = form.imageUrl;

            // Xử lý Upload file nếu người dùng có chọn file mới
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const res = await api.post('/files/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const uploadData = res.data?.data;
                finalImageUrl = typeof uploadData === 'string' ? uploadData : (uploadData?.url || res.data?.url || res.data);
            }

            if (!finalImageUrl) {
                throw new Error("Không có đường dẫn ảnh hợp lệ");
            }

            const payload = { ...form, imageUrl: finalImageUrl };

            if (editingId) {
                await api.put(`/sliders/${editingId}`, payload);
            } else {
                await api.post('/sliders', payload);
            }

            // Dọn dẹp Modal
            setShowModal(false);
            setForm({ imageUrl: '', title: '', link: '', displayOrder: 0, isActive: true });
            setSelectedFile(null);
            setPreviewUrl(null);
            setEditingId(null);
            fetchSliders();

        } catch (error) {
            console.error(error);
            toast.info('Lưu slider thất bại!');
        } finally {
            setUploading(false);
        }
    };

    const handleEditClick = (slider) => {
        setEditingId(slider.id);
        setForm({
            imageUrl: slider.imageUrl || '',
            title: slider.title || '',
            link: slider.link || '',
            displayOrder: slider.displayOrder || 0,
            isActive: slider.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa slider này?')) {
            try {
                await api.delete(`/sliders/${id}`);
                fetchSliders();
            } catch (error) {
                console.error(error);
                toast.info('Xóa thất bại!');
            }
        }
    };

    const toggleActive = async (slider) => {
        try {
            await api.put(`/sliders/${slider.id}`, { ...slider, isActive: !slider.isActive });
            fetchSliders();
        } catch (error) {
            console.error(error);
        }
    };

    const changeOrder = async (index, direction) => {
        // Prevent moving up if first, or down if last
        if (direction === -1 && index === 0) return;
        if (direction === 1 && index === sliders.length - 1) return;

        const newSliders = [...sliders];

        // Swap elements in memory
        const temp = newSliders[index];
        newSliders[index] = newSliders[index + direction];
        newSliders[index + direction] = temp;

        // Auto-heal all sliders' displayOrder to be strictly sequential (1, 2, 3...)
        const updatePromises = newSliders.map((slider, idx) => {
            const newOrder = idx + 1;
            if (slider.displayOrder !== newOrder) {
                return api.put(`/sliders/${slider.id}`, { ...slider, displayOrder: newOrder });
            }
            return Promise.resolve();
        });

        try {
            setSliders(newSliders); // Optimistic UI update
            await Promise.all(updatePromises);
            fetchSliders();
        } catch (error) {
            console.error(error);
            toast.info('Lỗi khi thay đổi thứ tự!');
            fetchSliders(); // Revert back if fail
        }
    };



    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý sliders / Slider</h1>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setForm({ imageUrl: '', title: '', link: '', displayOrder: sliders.length + 1, isActive: true });
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" /> Thêm slider
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Đang tải dữ liệu...</div>
            ) : sliders.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">Chưa có slider nào</h3>
                    <p className="text-gray-500 mt-1">Hãy thêm slider đầu tiên để hiển thị trên trang chủ.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 text-sm font-semibold text-gray-600">Thứ tự</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 w-1/3">Hình ảnh</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Thông tin</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Trạng thái</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sliders.map((slider, index) => (
                                <tr key={slider.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col items-center gap-1 w-8">
                                            <button
                                                onClick={() => changeOrder(index, -1)}
                                                disabled={index === 0}
                                                className={`transition ${index === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-600'}`}
                                            ><ArrowUp className="w-4 h-4" /></button>
                                            <span className="font-bold text-gray-700">{slider.displayOrder}</span>
                                            <button
                                                onClick={() => changeOrder(index, 1)}
                                                disabled={index === sliders.length - 1}
                                                className={`transition ${index === sliders.length - 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-600'}`}
                                            ><ArrowDown className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-full aspect-[4/1] bg-gray-100 rounded overflow-hidden border border-gray-200">
                                            <img src={getImageUrl(slider.imageUrl)} alt={slider.title} className="w-full h-full object-contain" />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{slider.title || 'Không có tiêu đề'}</div>
                                        {slider.link && (
                                            <a href={slider.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline line-clamp-1 mt-1">
                                                {slider.link}
                                            </a>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => toggleActive(slider)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 mx-auto transition-colors ${slider.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {slider.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {slider.isActive ? 'Hiển thị' : 'Đang ẩn'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEditClick(slider)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                                title="Sửa"
                                            ><Edit className="w-5 h-5" /></button>
                                            <button
                                                onClick={() => handleDelete(slider.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                                title="Xóa"
                                            ><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-blue-600" />
                                {editingId ? 'Chỉnh Sửa slider' : 'Thêm slider Mới'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh Slider *</label>

                                {/** Hiển thị ảnh đang chỉnh sửa (khi không lấy list file mới) **/}
                                {form.imageUrl && !selectedFile ? (
                                    <div className="relative w-full aspect-[4/1] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-3 group">
                                        <img src={getImageUrl(form.imageUrl)} alt="Preview" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                                                className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 shadow"
                                            >Xóa ảnh</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 mb-3">
                                        {/** Nút chọn ảnh nhỏ gọn **/}
                                        <div className="flex items-center gap-4">
                                            <div className="relative inline-block">
                                                <input
                                                    id="slider-file-input"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    disabled={uploading}
                                                />
                                                <button type="button" className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4" />
                                                    {uploading ? 'Đang xử lý...' : 'Chọn ảnh slider'}
                                                </button>
                                            </div>
                                            <span className="text-xs text-gray-500">Tỷ lệ khuyên dùng: 21:9 ngang (Ví dụ: 1920x820)</span>
                                        </div>

                                        {/** Preview of selected single file **/}
                                        {previewUrl && (
                                            <div className="w-full bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative z-20 mt-4">
                                                <div className="flex justify-between items-center mb-2 px-1">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ảnh đã chọn</span>
                                                    <button
                                                        type="button"
                                                        onClick={removeSelectedFile}
                                                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                                    >
                                                        Hủy bỏ
                                                    </button>
                                                </div>
                                                <div className="relative w-full aspect-[4/1] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (Tùy chọn)</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ví dụ: Siêu Sale Giữa Tháng"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn liên kết (Tùy chọn)</label>
                                <input
                                    type="text"
                                    value={form.link}
                                    onChange={e => setForm({ ...form, link: e.target.value })}
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://shopee.vn/..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                                    <input
                                        type="number"
                                        value={form.displayOrder}
                                        onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex flex-col justify-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.isActive}
                                            onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Đang hiển thị trên trang chủ</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                                >Hủy</button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {editingId ? 'Cập Nhật' : 'Thêm Mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSliders;
