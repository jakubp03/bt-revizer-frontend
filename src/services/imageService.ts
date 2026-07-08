import api from './Api';

/** Module-level cache: filename → blob URL. Lives for the entire browser session. */
const imageCache = new Map<string, string>();

/**
 * Returns a blob URL for the given server-side image filename.
 * Fetches from the API on first call; subsequent calls return the cached URL instantly.
 */
export async function getImageBlobUrl(filename: string): Promise<string> {
    if (imageCache.has(filename)) {
        return imageCache.get(filename)!;
    }
    const response = await api.get(`/images/${filename}`, { responseType: 'blob' });
    const blobUrl = URL.createObjectURL(response.data as Blob);
    imageCache.set(filename, blobUrl);
    return blobUrl;
}

/**
 * Uploads an image file to the server and returns the stored filename.
 */
export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ filename: string }>('/images', formData);
    return response.data.filename;
}
