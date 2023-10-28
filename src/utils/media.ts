export const sanitizeFileName = (fileName: string) =>
  fileName.replace(/[^a-zA-Z0-9.]/g, '');
