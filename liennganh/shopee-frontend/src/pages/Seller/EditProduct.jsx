import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { Save, ArrowLeft, Package, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: '', description: '', price: '', stockQuantity: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Existing attributes & variants from DB
    const [attributes, setAttributes] = useState([]);
    const [variants, setVariants] = useState([]);

    // New attributes to add
    const [newAttributes, setNewAttributes] = useState([]);
    const [newVariants, setNewVariants] = useState([]);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            const product = res.data.data || res.data;
            setForm({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                stockQuantity: product.stockQuantity?.toString() || ''
            });
            if (product.imageUrl) {
                setImagePreview(product.imageUrl);
            }

            // Load attributes
            if (product.attributes) {
                setAttributes(product.attributes);
            }
            // Load variants
            if (product.variants) {
                setVariants(product.variants.map(v => ({
                    ...v,
                    parsedAttrs: (() => { try { return JSON.parse(v.attributes); } catch { return {}; } })()
                })));
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            alert('Không tìm thấy sản phẩm!');
            navigate('/seller/products');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // --- New Attribute Management ---
    const addNewAttribute = () => {
        setNewAttributes([...newAttributes, { name: '', options: [''] }]);
    };

    const updateNewAttrName = (i, name) => {
        const u = [...newAttributes]; u[i].name = name; setNewAttributes(u);
    };

    const addNewOption = (ai) => {
        const u = [...newAttributes]; u[ai].options.push(''); setNewAttributes(u);
    };

    const updateNewOption = (ai, oi, val) => {
        const u = [...newAttributes]; u[ai].options[oi] = val; setNewAttributes(u);
    };

    const removeNewOption = (ai, oi) => {
        const u = [...newAttributes]; u[ai].options.splice(oi, 1); setNewAttributes(u);
    };

    const removeNewAttribute = (ai) => {
        const u = [...newAttributes]; u.splice(ai, 1); setNewAttributes(u);
    };

    // --- Delete existing variant ---
    const handleDeleteVariant = async (variantId) => {
        if (!window.confirm('Xoá biến thể này?')) return;
        try {
            await api.delete(`/products/variants/${variantId}`);
            setVariants(prev => prev.filter(v => v.id !== variantId));
        } catch (error) {
            alert('Xoá biến thể thất bại!');
        }
    };

    // --- Save ---
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Update basic product info
            // Update basic product info
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('price', parseFloat(form.price));
            formData.append('stockQuantity', parseInt(form.stockQuantity) || 0);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            await api.put(`/products/${id}/with-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Create new attributes + options
            for (const attr of newAttributes) {
                if (!attr.name) continue;
                const attrRes = await api.post(`/products/${id}/attributes`, { name: attr.name });
                const savedAttr = attrRes.data.data || attrRes.data;
                for (const opt of attr.options) {
                    if (!opt) continue;
                    await api.post(`/products/attributes/${savedAttr.id}/options`, { value: opt });
                }
            }

            // Create new variants
            for (const v of newVariants) {
                await api.post(`/products/${id}/variants`, {
                    attributes: JSON.stringify(v.attributes),
                    price: parseFloat(v.price),
                    stockQuantity: parseInt(v.stockQuantity) || 0
                });
            }

            alert('Cập nhật sản phẩm thành công!');
            navigate('/seller/products');
        } catch (error) {
            console.error("Error updating:", error);
            alert('Cập nhật thất bại! ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/seller/products')}
                className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-4 transition">
                <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
            </button>

            <div className="flex items-center gap-3 mb-6">
                <Package className="w-8 h-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Thông tin cơ bản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Tên sản phẩm</label>
                            <input type="text" required value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-300 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Giá (₫)</label>
                            <input type="number" required value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-300 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Kho</label>
                            <input type="number" value={form.stockQuantity}
                                onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-300 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Ảnh sản phẩm</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition">
                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-500">Thay đổi ảnh</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                                {imagePreview && (
                                    <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded border" />
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
                            <textarea value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-300 outline-none h-24 resize-none" />
                        </div>
                    </div>
                </div>

                {/* Existing Attributes */}
                {attributes.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Phân loại hiện tại</h2>
                        <div className="space-y-3">
                            {attributes.map(attr => (
                                <div key={attr.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700 w-24">{attr.name}:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {attr.options?.map(opt => (
                                            <span key={opt.id} className="px-3 py-1 bg-white border border-gray-200 rounded text-sm text-gray-600">
                                                {opt.value}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Existing Variants */}
                {variants.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Biến thể hiện tại ({variants.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600">
                                        <th className="px-3 py-2 text-left font-medium">Phân loại</th>
                                        <th className="px-3 py-2 text-left font-medium">Giá</th>
                                        <th className="px-3 py-2 text-left font-medium">Kho</th>
                                        <th className="px-3 py-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map(v => (
                                        <tr key={v.id} className="border-t border-gray-100">
                                            <td className="px-3 py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {Object.entries(v.parsedAttrs).map(([k, val]) => (
                                                        <span key={k} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                                                            {k}: {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 font-medium text-orange-600">{formatPrice(v.price)}</td>
                                            <td className="px-3 py-2">{v.stockQuantity}</td>
                                            <td className="px-3 py-2">
                                                <button type="button" onClick={() => handleDeleteVariant(v.id)}
                                                    className="text-red-400 hover:text-red-600 p-1">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add New Attributes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Thêm phân loại mới</h2>
                        <button type="button" onClick={addNewAttribute}
                            className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-500 border border-orange-300 rounded-lg text-sm hover:bg-orange-100 transition">
                            <Plus className="w-4 h-4" /> Thêm nhóm
                        </button>
                    </div>

                    {newAttributes.length === 0 ? (
                        <p className="text-center text-gray-400 py-4 text-sm">Nhấn "Thêm nhóm" để thêm phân loại mới</p>
                    ) : (
                        newAttributes.map((attr, ai) => (
                            <div key={ai} className="border border-gray-200 rounded-lg p-4 mb-3">
                                <div className="flex items-center gap-3 mb-3">
                                    <input type="text" value={attr.name}
                                        onChange={e => updateNewAttrName(ai, e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-300 outline-none"
                                        placeholder="Tên (VD: Kích cỡ, Màu sắc)" />
                                    <button type="button" onClick={() => removeNewAttribute(ai)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {attr.options.map((opt, oi) => (
                                        <div key={oi} className="flex items-center gap-1">
                                            <input type="text" value={opt}
                                                onChange={e => updateNewOption(ai, oi, e.target.value)}
                                                className="border border-gray-300 rounded px-3 py-1.5 text-sm w-28 focus:ring-2 focus:ring-orange-300 outline-none"
                                                placeholder={`Giá trị ${oi + 1}`} />
                                            {attr.options.length > 1 && (
                                                <button type="button" onClick={() => removeNewOption(ai, oi)}
                                                    className="text-gray-400 hover:text-red-500">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addNewOption(ai)}
                                        className="px-3 py-1.5 border border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-orange-400 hover:text-orange-400 transition">
                                        + Thêm
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button type="submit" disabled={saving}
                        className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        <Save className="w-5 h-5" />
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button type="button" onClick={() => navigate('/seller/products')}
                        className="px-8 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                        Huỷ
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
