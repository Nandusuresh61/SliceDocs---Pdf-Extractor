import { Document } from "../../../domain/entities/Document";

export interface IExtractPdfUseCase {
  execute(documentId: string, ownerId: string, selectedPages: number[]): Promise<Document>;
}
