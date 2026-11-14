const MEGABYTE = 1024 * 1024;

export const MAX_TWEET_MEDIA = 4;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_MB = 50;

export const isVideoFile = (file: File): boolean => file.type.startsWith('video/');

const isImageFile = (file: File): boolean => file.type.startsWith('image/');

export const getFileError = (file: File, allowVideo = true): string => {
  const isVideo = allowVideo && isVideoFile(file);

  if (!isImageFile(file) && !isVideo) {
    return `${file.name} is not a supported ${allowVideo ? 'image or video' : 'image'}.`;
  }

  const maxSizeMb = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;
  if (file.size > maxSizeMb * MEGABYTE) {
    return `${file.name} is larger than ${maxSizeMb} MB.`;
  }

  return '';
};
