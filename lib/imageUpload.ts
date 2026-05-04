/**
 * Upload an image file to ImgBB.
 * Reads the API key from localStorage key 'imgbb_api_key'.
 * Returns the public URL of the uploaded image, or null on failure.
 */
export const uploadImageToImgBB = async (file: File): Promise<string | null> => {
    const apiKey = typeof window !== 'undefined' ? localStorage.getItem('imgbb_api_key') : null;
    if (!apiKey) {
        alert('ImgBB API Key មិនទាន់កំណត់! សូមចូល Settings ហើយបញ្ចូល ImgBB API Key');
        return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`ImgBB upload failed: ${response.statusText}`);
    }

    const json = await response.json();
    if (!json.success) {
        throw new Error(json.error?.message || 'ImgBB upload failed');
    }

    return json.data.url as string;
};
