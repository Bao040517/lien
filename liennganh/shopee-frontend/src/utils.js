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
