const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;

/**
 * Compress an image file using a canvas before upload.
 * Images wider/taller than MAX_DIMENSION are scaled down proportionally.
 * GIF and SVG files are returned as-is.
 */
const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
        // Skip compression for formats that canvas cannot handle well
        if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
            resolve(file);
            return;
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width >= height) {
                    height = Math.round((height * MAX_DIMENSION) / width);
                    width = MAX_DIMENSION;
                } else {
                    width = Math.round((width * MAX_DIMENSION) / height);
                    height = MAX_DIMENSION;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(file);
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);

            const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else resolve(file);
                },
                outputType,
                outputType === 'image/jpeg' ? JPEG_QUALITY : undefined,
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file); // fall back to original on error
        };

        img.src = url;
    });
};

/**
 * Upload an image file to ImgBB.
 * Reads the API key from env var VITE_IMGBB_API_KEY first,
 * then falls back to localStorage key 'imgbb_api_key'.
 * Compresses the image before uploading to reduce file size and upload time.
 * Returns the public URL of the uploaded image, or null on failure.
 */
export const uploadImageToImgBB = async (file: File): Promise<string | null> => {
    const apiKey =
        import.meta.env.VITE_IMGBB_API_KEY ||
        (typeof window !== 'undefined' ? localStorage.getItem('imgbb_api_key') : null);
    if (!apiKey) {
        alert('ImgBB API Key មិនទាន់កំណត់! សូមចូល Settings ហើយបញ្ចូល ImgBB API Key');
        return null;
    }

    const compressed = await compressImage(file);

    const formData = new FormData();
    formData.append('image', compressed, file.name);

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
