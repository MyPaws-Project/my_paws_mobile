import * as MediaLibrary from 'expo-media-library';
// Use the legacy import to avoid the 'undefined' class issues
import * as FileSystem from 'expo-file-system/legacy'; 
import { Platform } from 'react-native';

export const downloadImage = async (imageUrl: string) => {
  if (Platform.OS === 'web') {
    alert('Download not supported on web');
    return;
  }

  // Guard: if for some reason the URL is empty
  if (!imageUrl) {
    console.log('Download Error: No URL provided');
    return;
  }

  try {
    // 1. Request Permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required to save images');
      return;
    }

    // 2. Create a unique local path in the cache
    // We add a timestamp so different images don't overwrite each other
    const filename = `record_${Date.now()}.jpg`;
    const fileUri = FileSystem.cacheDirectory + filename;

    // 3. Download the file
    // In the legacy API, this returns an object containing the URI
    const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

    // 4. Save to Gallery
    if (downloadResult && downloadResult.uri) {
      await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
      alert('Image saved to gallery 🐾');
    } else {
      throw new Error("Download succeeded but no URI was returned");
    }

  } catch (e) {
    console.log('DOWNLOAD ERROR:', e);
    alert('Failed to save image. Please check your internet connection.');
  }
};