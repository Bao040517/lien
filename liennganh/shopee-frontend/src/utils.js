export const toProductSlug = (name, id) => {
    const slug = (name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    return `/product/${slug}-${id}`;
};

export const getProductIdFromSlug = (slug) => {
    const parts = (slug || '').split('-');
    return parseInt(parts[parts.length - 1], 10) || null;
};

export const getImageUrl = (url) => {
    if (!url) return '';

    // Already a relative /api/files/... path
    if (url.startsWith('/api/files/')) {
        return url;
    }

    // Extract filename from any full URL or path, then build relative URL
    const filename = url.replace(/\\/g, '/').split('/').pop();
    return `/api/files/${filename}`;
};
