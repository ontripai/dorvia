/**
 * Document upload constants and allowed MIME types for Supabase Storage bucket 'lead-documents'.
 */

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
