import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from '../config/firebase';

export async function uploadImage(
  file: File,
  path: string,
): Promise<string> {
  const storage = getFirebaseStorage();
  const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: { uploadedAt: new Date().toISOString() },
  });
  return getDownloadURL(storageRef);
}

export async function uploadOccurrencePhotos(
  files: File[],
  occurrenceId: string,
): Promise<string[]> {
  return Promise.all(
    files.map((file) => uploadImage(file, `occurrences/${occurrenceId}`)),
  );
}
