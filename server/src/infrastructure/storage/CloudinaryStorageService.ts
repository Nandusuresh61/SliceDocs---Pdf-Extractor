import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

import cloudinary from "../../config/cloudinary";
import { IStorageService, UploadResult } from "../../application/interface/IStorageService";


export class CloudinaryStorageService implements IStorageService {
  async upload(
    file: Buffer,
    fileName: string
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "slice-docs",
          public_id: fileName,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve({
            storageId: result.public_id,
            url: result.secure_url,
          });
        }
      );

      Readable.from(file).pipe(uploadStream);
    });
  }
}