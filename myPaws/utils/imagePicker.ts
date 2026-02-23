import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../auth/firebase';

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

/**
 * Pick an image from the device library
 */
export async function pickImageFromLibrary(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) return null;

  return result.assets[0].uri;
}

/**
 * Upload a local image URI to Cloudinary and update client document with photoURL
 */
export async function uploadImageToCloudinary(uri: string, clientId: string): Promise<string | null> {
  if (!uri) return null;

  try {
    const data = new FormData();
    data.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    data.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: data });
    const json = await res.json();

    if (!json.secure_url) {
      console.log('Cloudinary upload failed:', json);
      return null;
    }

    const uploadedUrl = json.secure_url;

    // Update client document
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, {
      photoURL: uploadedUrl,
    });

    return uploadedUrl;
  } catch (err) {
    console.log('Upload failed:', err);
    return null;
  }
}
