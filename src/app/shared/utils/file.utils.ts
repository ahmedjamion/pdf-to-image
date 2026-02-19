const ALLOWED_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function isValidPdfFile(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type);
}

export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  if (!isValidPdfFile(file)) {
    return { valid: false, error: 'Invalid file type. Please upload a PDF file.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size is 50MB.' };
  }

  return { valid: true };
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

export function removeFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.substring(0, lastDot) : filename;
}
