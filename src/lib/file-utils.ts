// Client-safe file utilities for document handling
// This file can be safely imported in both client and server components

/**
 * Get supported MIME types
 */
export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Get supported file extensions
 */
export const SUPPORTED_EXTENSIONS = ['.pdf', '.txt', '.csv', '.md', '.docx'];

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate file before parsing
 */
export function validateFile(
  file: { size: number; type: string; name: string },
  maxSize: number = 10 * 1024 * 1024 // 10MB default
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Le fichier est trop volumineux. Taille maximum: ${formatFileSize(maxSize)}`,
    };
  }

  // Check file type
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidType = SUPPORTED_MIME_TYPES.includes(file.type) ||
                      SUPPORTED_EXTENSIONS.includes(extension);

  if (!isValidType) {
    return {
      valid: false,
      error: `Type de fichier non supporte. Formats acceptes: ${SUPPORTED_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}
