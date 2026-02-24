export const getImageUrl = (url) => {
    if (!url) return '';

    if (url.startsWith('http') && !url.includes('localhost:8080')) {
        return url; // External image URL (e.g. from Cloudinary/S3)
    }

    // For local paths, backend endpoints, or old "/uploads/" paths: extract filename
    const filename = url.replace(/\\/g, '/').split('/').pop();
    return `http://localhost:8080/api/files/${filename}`;
};
