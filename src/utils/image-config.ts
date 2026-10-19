export const IMAGE_CONFIG = {
  UPLOAD_DIR: 'public/img-data',
  MAX_FILE_SIZE: 2097152, //2MB
  ALLOWED_TYPES: new Set<string>(['image/jpeg', 'image/png', 'image/avif']),
} as const;
