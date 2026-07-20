export interface UploadResult {
  storageId: string;
  url: string;
}

export interface IStorageService {
  upload(
    file: Buffer,
    fileName: string
  ): Promise<UploadResult>;
}