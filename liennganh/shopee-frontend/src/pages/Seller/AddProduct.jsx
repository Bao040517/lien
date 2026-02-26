import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Trash2, Package, Image as ImageIcon, Save, X } from 'lucide-react';

const AddProduct = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [categories, setCategories] = useState([]);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Product form
    const [form, setForm] = useState({
        name: '', description: '', price: '', stockQuantity: '', categoryId: '', shopId: ''
    });

    // Attributes (seller-defined)
    const [attributes, setAttributes] = useState([]);
    // Variants
    const [variants, setVariants] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, shopRes] = await Promise.all([
                    api.get('/categories', { params: { size: 1000 } }),
                    api.get(`/shops/my-shop?userId=${user?.id}`)
                ]);
                setCategories(catRes.data.data?.content || catRes.data.data || catRes.data || []);
                const shopData = shopRes.data.data || shopRes.data;
                if (Array.isArray(shopData)) {
                    setShops(shopData);
                    if (shopData.length > 0) setForm(f => ({ ...f, shopId: shopData[0].id }));
                } else if (shopData?.id) {
                    setShops([shopData]);
                    setForm(f => ({ ...f, shopId: shopData.id }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [user]);

    // --- Attribute management ---
    const addAttribute = () => {
        setAttributes([...attributes, { name: '', options: [''] }]);
    };

    const updateAttributeName = (index, name) => {
        const updated = [...attributes];
        updated[index].name = name;
        setAttributes(updated);
    };

    const addOption = (attrIndex) => {
        const updated = [...attributes];
        updated[attrIndex].options.push('');
        setAttributes(updated);
    };

    const updateOption = (attrIndex, optIndex, value) => {
        const updated = [...attributes];
        updated[attrIndex].options[optIndex] = value;
        setAttributes(updated);
    };

    const removeOption = (attrIndex, optIndex) => {
        const updated = [...attributes];
        updated[attrIndex].options.splice(optIndex, 1);
        setAttributes(updated);
    };

    const removeAttribute = (attrIndex) => {
        const updated = [...attributes];
        updated.splice(attrIndex, 1);
        setAttributes(updated);
        setVariants([]);
    };

    // --- Generate variants from attribute combinations ---
    const generateVariants = () => {
        const validAttrs = attributes.filter(a => a.name && a.options.some(o => o));
        if (validAttrs.length === 0) return;

        const combinations = validAttrs.reduce((acc, attr) => {
            const validOptions = attr.options.filter(o => o);
            if (acc.length === 0) {
                return validOptions.map(opt => ({ [attr.name]: opt }));
            }
            const result = [];
            acc.forEach(combo => {
                validOptions.forEach(opt => {
                    result.push({ ...combo, [attr.name]: opt });
                });
            });
            return result;
        }, []);

        setVariants(combinations.map(combo => ({
            attributes: combo,
            price: form.price || '',
            stockQuantity: form.stockQuantity || '10',
        })));
    };

    const updateVariant = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const removeVariant = (index) => {
        const updated = [...variants];
        updated.splice(index, 1);
        setVariants(updated);
    };

    // --- Multi-image handling ---
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + imageFiles.length > 9) {
            toast.warning('Tối đa 9 ảnh sản phẩm!');
            return;
        }
        const newFiles = [...imageFiles, ...files];
        const newPreviews = [...imagePreviews, ...files.map(f => URL.createObjectURL(f))];
        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    const removeImage = (index) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    // --- Submit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let product;

            if (imageFiles.length > 0) {
                // Create with images
                const formData = new FormData();
                formData.append('shopId', form.shopId);
                formData.append('categoryId', form.categoryId);
                formData.append('name', form.name);
                formData.append('description', form.description);
                formData.append('price', form.price);
                formData.append('stockQuantity', form.stockQuantity || '0');
                imageFiles.forEach(file => {
                    formData.append('images', file);
                });

                const res = await api.post('/products/with-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                product = res.data.data || res.data;
            } else {
                // Create without image
                const res = await api.post('/products', {
                    shop: { id: form.shopId },
                    category: { id: form.categoryId },
                    name: form.name,
                    description: form.description,
                    price: parseFloat(form.price),
                    stockQuantity: parseInt(form.stockQuantity) || 0
                });
                product = res.data.data || res.data;
            }

            // Create attributes and options
            for (const attr of attributes) {
                if (!attr.name) continue;
                const attrRes = await api.post(`/products/${product.id}/attributes`, { name: attr.name });
                const savedAttr = attrRes.data.data || attrRes.data;

                for (const optValue of attr.options) {
                    if (!optValue) continue;
                    await api.post(`/products/attributes/${savedAttr.id}/options`, { value: optValue });
                }
            }

            // Create variants
            for (const variant of variants) {
                await api.post(`/products/${product.id}/variants`, {
                    attributes: JSON.stringify(variant.attributes),
                    price: parseFloat(variant.price),
                    stockQuantity: parseInt(variant.stockQuantity) || 0
                });
            }

            toast.success('Tạo sản phẩm thành công!');
            navigate('/seller');
        } catch (error) {
            console.error("Error creating product:", error);
            toast.error('Tạo sản phẩm thất bại: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Package className="w-8 h-8 text-primary-dark" />
                <h1 className="text-2xl font-bold text-gray-800">Thêm Sản Phẩm Mới</h1>
            </div>

            {shops.length === 0 && !loading && (
                <div className="bg-red-50 text-red-700 p-4 rounded mb-6 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Bạn chưa có Cửa hàng (Shop). Vui lòng liên hệ Admin để kiểm tra tài khoản Seller.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Thông tin cơ bản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Tên sản phẩm *</label>
                            <input
                                type="text" required value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary-dark outline-none"
                                placeholder="VD: Áo thun nam cổ tròn Cotton"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Danh mục *</label>
                            <select required value={form.categoryId}
                                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none">
                                <option value="">Chọn danh mục</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Giá gốc (₫) *</label>
                            <input type="number" required value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="250000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Số lượng kho</label>
                            <input type="number" value={form.stockQuantity}
                                onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                placeholder="100"
                            />
                        </div>
                        <div>
                            {/* Spacer */}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
                            <textarea value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none h-24 resize-none"
                                placeholder="Mô tả chi tiết sản phẩm..."
                            />
                        </div>
                    </div>
                </div>

                {/* Multi-Image Upload */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Ảnh sản phẩm <span className="text-sm font-normal text-gray-400">(Tối đa 9 ảnh, ảnh đầu tiên làm ảnh đại diện)</span></h2>
                    <div className="flex flex-wrap gap-3">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 group">
                                <img src={preview} alt={`preview-${index}`} className="w-full h-full object-cover" />
                                {index === 0 && (
                                    <span className="absolute top-0.5 left-0.5 bg-primary-dark text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Bìa</span>
                                )}
                                <button type="button" onClick={() => removeImage(index)}
                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {imageFiles.length < 9 && (
                            <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-dark hover:bg-primary-lighter/50 transition">
                                <Plus className="w-6 h-6 text-gray-400" />
                                <span className="text-[10px] text-gray-400 mt-1">Thêm ảnh</span>
                                <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                {/* Attributes Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Phân loại hàng</h2>
                        <button type="button" onClick={addAttribute}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary-lighter text-primary-dark border border-primary rounded-lg text-sm hover:bg-primary-light transition">
                            <Plus className="w-4 h-4" /> Thêm nhóm phân loại
                        </button>
                    </div>

                    {attributes.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <Package className="w-12 h-12 mx-auto mb-2 opacity-40" />
                            <p>Chưa có phân loại nào. Nhấn "Thêm nhóm phân loại" để bắt đầu.</p>
                            <p className="text-xs mt-1">VD: Size (S, M, L, XL) • Màu sắc (Đen, Trắng, Xanh)</p>
                        </div>
                    )}

                    {attributes.map((attr, ai) => (
                        <div key={ai} className="border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <input
                                    type="text" value={attr.name}
                                    onChange={e => updateAttributeName(ai, e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Tên nhóm (VD: Size, Màu sắc, RAM)"
                                />
                                <button type="button" onClick={() => removeAttribute(ai)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {attr.options.map((opt, oi) => (
                                    <div key={oi} className="flex items-center gap-1">
                                        <input
                                            type="text" value={opt}
                                            onChange={e => updateOption(ai, oi, e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-28 focus:ring-2 focus:ring-primary outline-none"
                                            placeholder={`Giá trị ${oi + 1}`}
                                        />
                                        {attr.options.length > 1 && (
                                            <button type="button" onClick={() => removeOption(ai, oi)}
                                                className="text-gray-400 hover:text-red-500">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addOption(ai)}
                                    className="px-3 py-1.5 border border-dashed border-gray-300 rounded text-sm text-gray-500 hover:border-primary-dark hover:text-primary-dark transition">
                                    + Thêm
                                </button>
                            </div>
                        </div>
                    ))}

                    {attributes.length > 0 && (
                        <button type="button" onClick={generateVariants}
                            className="w-full py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition font-medium">
                            Tạo danh sách phân loại ({attributes.reduce((acc, a) => acc * Math.max(1, a.options.filter(o => o).length), 1)} tổ hợp)
                        </button>
                    )}
                </div>

                {/* Variants Table */}
                {variants.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Danh sách phân loại ({variants.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600">
                                        {attributes.filter(a => a.name).map(a => (
                                            <th key={a.name} className="px-3 py-2 text-left font-medium">{a.name}</th>
                                        ))}
                                        <th className="px-3 py-2 text-left font-medium">Giá (₫)</th>
                                        <th className="px-3 py-2 text-left font-medium">Kho</th>
                                        <th className="px-3 py-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map((v, vi) => (
                                        <tr key={vi} className="border-t border-gray-100 hover:bg-gray-50">
                                            {Object.values(v.attributes).map((val, i) => (
                                                <td key={i} className="px-3 py-2">
                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">{val}</span>
                                                </td>
                                            ))}
                                            <td className="px-3 py-2">
                                                <input type="number" value={v.price}
                                                    onChange={e => updateVariant(vi, 'price', e.target.value)}
                                                    className="w-28 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="number" value={v.stockQuantity}
                                                    onChange={e => updateVariant(vi, 'stockQuantity', e.target.value)}
                                                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <button type="button" onClick={() => removeVariant(vi)}
                                                    className="text-red-400 hover:text-red-600">
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

                {/* Submit */}
                <div className="flex gap-4">
                    <button type="submit" disabled={loading}
                        className="flex-1 py-3 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-60">
                        <Save className="w-5 h-5" />
                        {loading ? 'Đang tạo...' : 'Đăng Sản Phẩm'}
                    </button>
                    <button type="button" onClick={() => navigate('/seller')}
                        className="px-8 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                        Huỷ
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
