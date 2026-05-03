const IMGBB_KEY = 'imgbb_api_key';

export function getImgBBKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(IMGBB_KEY);
}

export function saveImgBBKey(key: string): void {
    localStorage.setItem(IMGBB_KEY, key.trim());
}

export function clearImgBBKey(): void {
    localStorage.removeItem(IMGBB_KEY);
}

/** Upload an image file to imgbb.com and return the public URL */
export async function uploadImage(file: File): Promise<string> {
    const apiKey = getImgBBKey();
    if (!apiKey) {
        throw new Error(
            'Image upload key not configured.\nPlease add your imgbb API key in Settings.\n\nGet a free key at: https://imgbb.com/signup'
        );
    }

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Image upload failed (HTTP ${res.status})`);
    }

    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error?.message || 'Upload failed');
    }

    return data.data.url as string;
}
