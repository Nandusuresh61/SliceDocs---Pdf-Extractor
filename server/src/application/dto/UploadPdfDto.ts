export interface UploadPdfDto {
  file: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  ownerId?: string;
}