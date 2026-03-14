import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { getImageUrl } from '../../utils';
import { Save, ArrowLeft, Package, Plus, Trash2, X, ShieldCheck, Edit2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const EditProduct = ({ isAdmin = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const backPath = isAdmin ? '/admin/products' : '/seller/products';
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [productInfo, setProductInfo] = useState(null);

    const [form, setForm] = useState({
        name: '', description: '', price: '', stockQuantity: ''
    });

    // Existing images from DB
    const [existingImages, setExistingImages] = useState([]);
    // New images to upload
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);

    // Existing attributes and variants
    const [attributes, setAttributes] = useState([]);
    const [variants, setVariants] = useState([]);

    // Edit variant state
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [editVariantForm, setEditVariantForm] = useState({ price: '', stockQuantity: '' });
    
    // Edit attribute & option state
    const [editingAttrId, setEditingAttrId] = useState(null);
    const [editAttrNameForm, setEditAttrNameForm] = useState('');
    
    // Add attribute state
    const [addingAttr, setAddingAttr] = useState(false);
    const [newAttrName, setNewAttrName] = useState('');

    const [editingOptionId, setEditingOptionId] = useState(null);
    const [editOptionForm, setEditOptionForm] = useState('');

    // Add option state
    const [addingOptionToAttrId, setAddingOptionToAttrId] = useState(null);
    const [newOptionValue, setNewOptionValue] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            const product = res.data.data || res.data;
            setProductInfo(product);
            setForm({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                stockQuantity: product.stockQuantity?.toString() || ''
            });

            // Load images
            if (product.images && product.images.length > 0) {
                setExistingImages(product.images);
            } else if (product.imageUrl) {
                setExistingImages([product.imageUrl]);
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
            toast.info('Không tìm thấy sản phẩm!');
            navigate(backPath);
        } finally {
            setLoading(false);
        }
    };

    // --- Multi-image handling ---
    const handleNewImages = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = existingImages.length + newImageFiles.length + files.length;
        if (totalImages > 9) {
            toast.info('Tối đa 9 ảnh sản phẩm!');
            return;
        }
        setNewImageFiles(prev => [...prev, ...files]);
        setNewImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(newImagePreviews[index]);
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };


    // --- Delete existing variant ---
    const handleDeleteVariant = async (variantId) => {
        if (!window.confirm('Xoá biến thể này?')) return;
        try {
            await api.delete(`/products/variants/${variantId}`);
            setVariants(prev => prev.filter(v => v.id !== variantId));
        } catch (error) {
            toast.info('Xoá biến thể thất bại!');
        }
    };

    // --- Inline edit existing variant ---
    const handleEditVariant = (variant) => {
        setEditingVariantId(variant.id);
        setEditVariantForm({
            price: variant.price.toString(),
            stockQuantity: variant.stockQuantity.toString()
        });
    };

    const handleCancelEditVariant = () => {
        setEditingVariantId(null);
        setEditVariantForm({ price: '', stockQuantity: '' });
    };

    const handleSaveVariant = async (variantId) => {
        try {
            const price = parseFloat(editVariantForm.price);
            const stockQuantity = parseInt(editVariantForm.stockQuantity);
            
            if (isNaN(price) || isNaN(stockQuantity) || price < 0 || stockQuantity < 0) {
                toast.info('Giá và số lượng phải là số hợp lệ');
                return;
            }

            await api.put(`/products/variants/${variantId}`, {
                price,
                stockQuantity
            });
            
            toast.success('Cập nhật biến thể thành công!');
            
            // Update local state
            setVariants(prev => prev.map(v => 
                v.id === variantId 
                    ? { ...v, price: price, stockQuantity: stockQuantity }
                    : v
            ));
            
            setEditingVariantId(null);
        } catch (error) {
            console.error("Lỗi cập nhật biến thể:", error);
            toast.info('Cập nhật biến thể thất bại!');
        }
    };

    // --- Inline edit existing attribute & option ---
    const handleEditAttr = (attr) => {
        setEditingAttrId(attr.id);
        setEditAttrNameForm(attr.name);
    };

    const handleSaveAttr = async (attrId) => {
        if (!editAttrNameForm.trim()) {
            toast.info('Tên phân loại không được để trống');
            return;
        }
        try {
            await api.put(`/products/attributes/${attrId}`, {
                name: editAttrNameForm
            });
            toast.success('Đổi tên phân loại thành công!');
            
            // Update local state by mapping over attributes array
            setAttributes(prev => prev.map(a => 
                a.id === attrId ? { ...a, name: editAttrNameForm } : a
            ));
            
            // Update variants state as variant.parsedAttrs might use the old name (optional, only affects UI until refresh)
            setEditingAttrId(null);
        } catch (error) {
            console.error("Lỗi đổi tên phân loại:", error);
            toast.info('Cập nhật thất bại!');
        }
    };

    const handleEditOption = (opt) => {
        setEditingOptionId(opt.id);
        setEditOptionForm(opt.value);
    };

    const handleSaveOption = async (optionId, attrId) => {
        if (!editOptionForm.trim()) {
            toast.info('Giá trị không được để trống');
            return;
        }
        try {
            await api.put(`/products/attributes/options/${optionId}`, {
                value: editOptionForm
            });
            toast.success('Đổi giá trị thành công!');
            
            // Update local state by mapping over the nested array
            setAttributes(prev => prev.map(a => {
                if (a.id === attrId) {
                    return {
                        ...a,
                        options: a.options.map(o => o.id === optionId ? { ...o, value: editOptionForm } : o)
                    };
                }
                return a;
            }));
            
            setEditingOptionId(null);
        } catch (error) {
            console.error("Lỗi đổi giá trị:", error);
            toast.info('Cập nhật thất bại!');
        }
    };

    const handleDeleteAttr = async (attrId) => {
        if (!window.confirm('Bạn có chắc muốn xoá phân loại này không? Tất cả tuỳ chọn bên trong sẽ bị xoá.')) return;
        try {
            await api.delete(`/products/attributes/${attrId}`);
            toast.success('Xoá phân loại thành công!');
            setAttributes(prev => prev.filter(a => a.id !== attrId));
        } catch (error) {
            console.error("Lỗi xoá phân loại:", error);
            toast.info('Xoá thất bại!');
        }
    };

    const handleDeleteOption = async (optionId, attrId) => {
        if (!window.confirm('Bạn có chắc muốn xoá tuỳ chọn này không?')) return;
        try {
            await api.delete(`/products/attributes/options/${optionId}`);
            toast.success('Xoá tuỳ chọn thành công!');
            setAttributes(prev => prev.map(a => {
                if (a.id === attrId) {
                    return { ...a, options: a.options.filter(o => o.id !== optionId) };
                }
                return a;
            }));
        } catch (error) {
            console.error("Lỗi xoá tuỳ chọn:", error);
            toast.info('Xoá thất bại!');
        }
    };

    const handleAddOption = async (attrId) => {
        if (!newOptionValue.trim()) {
            toast.info('Giá trị không được để trống');
            return;
        }
        try {
            const response = await api.post(`/products/attributes/${attrId}/options`, {
                value: newOptionValue,
                imageUrl: ''
            });
            toast.success('Thêm tuỳ chọn thành công!');
            setAttributes(prev => prev.map(a => {
                if (a.id === attrId) {
                    return { ...a, options: [...a.options, response.data.data] };
                }
                return a;
            }));
            setAddingOptionToAttrId(null);
            setNewOptionValue('');
        } catch (error) {
            console.error("Lỗi thêm tuỳ chọn:", error);
            toast.info('Thêm thất bại!');
        }
    };

    const handleAddAttr = async () => {
        if (!newAttrName.trim()) {
            toast.info('Tên phân loại không được để trống');
            return;
        }
        try {
            const response = await api.post(`/products/${id}/attributes`, {
                name: newAttrName
            });
            toast.success('Thêm phân loại thành công!');
            // Attribute returns without options array initially
            const newAttr = { ...response.data.data, options: [] };
            setAttributes(prev => [...prev, newAttr]);
            setAddingAttr(false);
            setNewAttrName('');
        } catch (error) {
            console.error("Lỗi thêm phân loại:", error);
            toast.info('Thêm thất bại!');
        }
    };

    // --- Save ---
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('price', parseFloat(form.price));
            formData.append('stockQuantity', parseInt(form.stockQuantity) || 0);

            // Append new image files
            if (newImageFiles.length > 0) {
                newImageFiles.forEach(file => {
                    formData.append('images', file);
                });
            }

            await api.put(`/products/${id}/with-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.info('Cập nhật sản phẩm thành công!');
            navigate(backPath);
        } catch (error) {
            console.error("Error updating:", error);
            toast.info('Cập nhật thất bại! ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

    const totalImages = existingImages.length + newImageFiles.length;

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary-dark border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate(backPath)}
                className="flex items-center gap-2 text-gray-500 hover:text-primary-dark mb-4 transition">
                <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
            </button>

            <div className="flex items-center gap-3 mb-2">
                <Package className="w-8 h-8 text-primary-dark" />
                <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
                {isAdmin && (
                    <span className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-sm font-medium">
                        <ShieldCheck className="w-4 h-4" /> Quyền Admin
                    </span>
                )}
            </div>

            {isAdmin && productInfo && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 flex flex-wrap gap-4">
                    <span>ID: <strong className="text-gray-800">{productInfo.id}</strong></span>
                    {productInfo.shop?.name && (
                        <span>Shop: <strong className="text-gray-800">{productInfo.shop.name}</strong>
                            {productInfo.shop.ownerUsername && <span className="text-gray-400"> ({productInfo.shop.ownerUsername})</span>}
                        </span>
                    )}
                    {productInfo.category?.name && (
                        <span>Danh mục: <strong className="text-gray-800">{productInfo.category.name}</strong></span>
                    )}
                    <span>Trạng thái: <strong className="text-gray-800">{productInfo.productStatus || 'PENDING'}</strong></span>
                </div>
            )}
            {!isAdmin && <div className="mb-6" />}

            <form onSubmit={handleSave} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Thông tin cơ bản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Tên sản phẩm</label>
                            <input type="text" required value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Giá (₫)</label>
                            <input type="number" required value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Kho</label>
                            <input type="number" value={form.stockQuantity}
                                onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
                            <textarea value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none h-24 resize-none" />
                        </div>
                    </div>
                </div>

                {/* Multi-Image Management */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Ảnh sản phẩm <span className="text-sm font-normal text-gray-400">(Tối đa 9 ảnh)</span></h2>
                    <div className="flex flex-wrap gap-3">
                        {/* Existing images */}
                        {existingImages.map((url, index) => (
                            <div key={`existing-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 group">
                                <img src={getImageUrl(url)} alt={`img-${index}`} className="w-full h-full object-cover" />
                                {index === 0 && existingImages.length > 0 && newImageFiles.length === 0 && (
                                    <span className="absolute top-0.5 left-0.5 bg-primary-dark text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Bìa</span>
                                )}
                                <button type="button" onClick={() => removeExistingImage(index)}
                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {/* New images */}
                        {newImagePreviews.map((preview, index) => (
                            <div key={`new-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-blue-200 group">
                                <img src={preview} alt={`new-${index}`} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0.5 left-0.5 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Mới</span>
                                <button type="button" onClick={() => removeNewImage(index)}
                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {/* Add button */}
                        {totalImages < 9 && (
                            <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-dark hover:bg-primary-lighter/50 transition">
                                <Plus className="w-6 h-6 text-gray-400" />
                                <span className="text-[10px] text-gray-400 mt-1">Thêm ảnh</span>
                                <input type="file" accept="image/*" multiple onChange={handleNewImages} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                {/* Existing Attributes */}
                {attributes.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Phân loại hiện tại</h2>
                        <div className="space-y-3">
                            {attributes.map(attr => (
                                <div key={attr.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="font-medium text-gray-700 w-32 flex items-center gap-2">
                                        {editingAttrId === attr.id ? (
                                            <div className="flex bg-white border border-gray-300 rounded overflow-hidden">
                                                <input 
                                                    type="text" 
                                                    className="w-20 px-2 py-1 text-sm focus:outline-none"
                                                    value={editAttrNameForm}
                                                    onChange={(e) => setEditAttrNameForm(e.target.value)}
                                                />
                                                <button type="button" onClick={() => handleSaveAttr(attr.id)}
                                                    className="bg-green-100 text-green-700 px-2 hover:bg-green-200" title="Lưu">
                                                    <Save className="w-3 h-3" />
                                                </button>
                                                <button type="button" onClick={() => setEditingAttrId(null)}
                                                    className="bg-gray-100 text-gray-600 px-2 hover:bg-gray-200" title="Hủy">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="truncate">{attr.name}:</span>
                                                <button type="button" onClick={() => handleEditAttr(attr)}
                                                    className="text-blue-400 hover:text-blue-600 p-1" title="Sửa tên">
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button type="button" onClick={() => handleDeleteAttr(attr.id)}
                                                    className="text-red-400 hover:text-red-600 p-1" title="Xoá">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {attr.options?.map(opt => (
                                            <div key={opt.id} className="flex items-center group relative">
                                                {editingOptionId === opt.id ? (
                                                    <div className="flex bg-white border border-primary-dark rounded shadow-sm overflow-hidden z-10">
                                                        <input 
                                                            type="text" 
                                                            className="w-20 px-2 py-1 text-sm focus:outline-none"
                                                            value={editOptionForm}
                                                            onChange={(e) => setEditOptionForm(e.target.value)}
                                                        />
                                                        <button type="button" onClick={() => handleSaveOption(opt.id, attr.id)}
                                                            className="bg-green-100 text-green-700 px-2 hover:bg-green-200" title="Lưu">
                                                            <Save className="w-3 h-3" />
                                                        </button>
                                                        <button type="button" onClick={() => setEditingOptionId(null)}
                                                            className="bg-gray-100 text-gray-600 px-2 hover:bg-gray-200" title="Hủy">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center px-3 py-1 bg-white border border-gray-200 rounded text-sm text-gray-600">
                                                        <span>{opt.value}</span>
                                                        <button type="button" onClick={() => handleEditOption(opt)}
                                                            className="ml-2 text-blue-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity" title="Sửa">
                                                            <Edit2 className="w-3 h-3" />
                                                        </button>
                                                        <button type="button" onClick={() => handleDeleteOption(opt.id, attr.id)}
                                                            className="ml-1 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity" title="Xoá">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {/* Add Option Button */}
                                        {addingOptionToAttrId === attr.id ? (
                                            <div className="flex bg-white border border-primary-dark rounded shadow-sm overflow-hidden z-10 h-7 items-center">
                                                <input 
                                                    type="text" 
                                                    className="w-20 px-2 py-0.5 text-sm focus:outline-none"
                                                    placeholder="Giá trị..."
                                                    value={newOptionValue}
                                                    onChange={(e) => setNewOptionValue(e.target.value)}
                                                    autoFocus
                                                />
                                                <button type="button" onClick={() => handleAddOption(attr.id)}
                                                    className="bg-green-100 text-green-700 h-full px-2 hover:bg-green-200" title="Thêm">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button type="button" onClick={() => setAddingOptionToAttrId(null)}
                                                    className="bg-gray-100 text-gray-600 h-full px-2 hover:bg-gray-200" title="Hủy">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                type="button" 
                                                onClick={() => { setAddingOptionToAttrId(attr.id); setNewOptionValue(''); }}
                                                className="flex items-center gap-1 px-2 py-1 border border-dashed border-primary text-primary hover:bg-primary-50 rounded text-xs transition-colors"
                                            >
                                                <Plus className="w-3 h-3" /> Thêm tuỳ chọn
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {/* Add Attribute Button */}
                            <div className="pt-2">
                                {addingAttr ? (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-primary-dark">
                                        <div className="flex bg-white border border-gray-300 rounded overflow-hidden">
                                            <input 
                                                type="text" 
                                                className="w-32 px-2 py-1 text-sm focus:outline-none"
                                                placeholder="Tên nhóm phân loại..."
                                                value={newAttrName}
                                                onChange={(e) => setNewAttrName(e.target.value)}
                                                autoFocus
                                            />
                                            <button type="button" onClick={handleAddAttr}
                                                className="bg-green-100 text-green-700 px-3 py-1 hover:bg-green-200" title="Thêm">
                                                Lưu
                                            </button>
                                            <button type="button" onClick={() => setAddingAttr(false)}
                                                className="bg-gray-100 text-gray-600 px-3 py-1 hover:bg-gray-200" title="Hủy">
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={() => { setAddingAttr(true); setNewAttrName(''); }}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-dark hover:bg-primary-100 rounded-lg border border-dashed border-primary transition-colors text-sm font-medium"
                                    >
                                        <Plus className="w-4 h-4" /> Thêm phân loại mới
                                    </button>
                                )}
                            </div>
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
                                                        <span key={k} className="px-2 py-0.5 bg-primary-lighter text-primary-darker rounded text-xs">
                                                            {k}: {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            
                                            {editingVariantId === v.id ? (
                                                <>
                                                    <td className="px-3 py-2">
                                                        <input 
                                                            type="number" 
                                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-dark"
                                                            value={editVariantForm.price}
                                                            onChange={(e) => setEditVariantForm({...editVariantForm, price: e.target.value})}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input 
                                                            type="number" 
                                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-dark"
                                                            value={editVariantForm.stockQuantity}
                                                            onChange={(e) => setEditVariantForm({...editVariantForm, stockQuantity: e.target.value})}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <div className="flex gap-1">
                                                            <button type="button" onClick={() => handleSaveVariant(v.id)}
                                                                className="text-green-600 hover:text-green-800 p-1 bg-green-50 rounded" title="Lưu">
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button type="button" onClick={handleCancelEditVariant}
                                                                className="text-gray-500 hover:text-gray-700 p-1 bg-gray-100 rounded" title="Huỷ">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-3 py-2 font-medium text-primary-darker">{formatPrice(v.price)}</td>
                                                    <td className="px-3 py-2">{v.stockQuantity}</td>
                                                    <td className="px-3 py-2">
                                                        <div className="flex gap-1 justify-end">
                                                            <button type="button" onClick={() => handleEditVariant(v)}
                                                                className="text-blue-500 hover:text-blue-700 p-1" title="Sửa">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button type="button" onClick={() => handleDeleteVariant(v.id)}
                                                                className="text-red-400 hover:text-red-600 p-1" title="Xoá">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {/* Submit */}
                <div className="flex gap-4">
                    <button type="submit" disabled={saving}
                        className="flex-1 py-3 bg-primary-dark text-white rounded-lg hover:bg-primary-darker transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                        <Save className="w-5 h-5" />
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button type="button" onClick={() => navigate(backPath)}
                        className="px-8 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                        Huỷ
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
