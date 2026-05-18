import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a cover image file to Firebase Storage.
 * Stores the file under `covers/<folder>/<filename>`.
 * Returns the public download URL, or null on failure.
 */
export const uploadCoverToFirebase = async (
  file: File,
  folder: string = 'insights'
): Promise<string | null> => {
  try {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `covers/${folder}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading cover to Firebase Storage:', error);
    return null;
  }
};
