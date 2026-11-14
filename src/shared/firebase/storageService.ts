import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { FirebaseStorage } from './firebaseConfig';

export const uploadFile = async (path: string, file: File): Promise<string> => {
  const fileRef = ref(FirebaseStorage, path);
  await uploadBytes(fileRef, file, { contentType: file.type });
  return getDownloadURL(fileRef);
};

export const deleteFile = async (url: string): Promise<void> => {
  try {
    await deleteObject(ref(FirebaseStorage, url));
  } catch {
    // The file may already be deleted; nothing else depends on it.
  }
};
