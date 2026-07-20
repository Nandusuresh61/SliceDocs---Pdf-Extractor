import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { IStorageService, UploadResult } from "../../application/interface/IStorageService";
import { env } from "../../config/env";

export class S3StorageService implements IStorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = env.AWS_S3_BUCKET_NAME;
  }

  async upload(file: Buffer, fileName: string): Promise<UploadResult> {
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const key = `documents/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: "application/pdf",
    });

    try {
      await this.s3Client.send(command);

      return {
        storageId: key,
        url: `s3://${this.bucketName}/${key}`, // Internal reference to fetch it later securely
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw error;
    }
  }

  async download(url: string): Promise<Buffer> {
    // Expected url format: s3://bucketName/key
    const parts = url.split('/');
    const key = parts.slice(3).join('/'); // Extracts 'documents/123-file.pdf'

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    
    if (!response.Body) {
      throw new Error("Failed to download file from S3");
    }
    
    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  }
}
