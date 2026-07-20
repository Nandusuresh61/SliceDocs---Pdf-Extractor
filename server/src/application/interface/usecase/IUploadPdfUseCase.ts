import { Document } from "../../../domain/entities/Document";
import { UploadPdfDto } from "../../dto/UploadPdfDto";

export interface IUploadPdfUseCase {
  execute(input: UploadPdfDto): Promise<Document>;
}
