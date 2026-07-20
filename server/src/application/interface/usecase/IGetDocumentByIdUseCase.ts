import { Document } from "../../../domain/entities/Document";

export interface IGetDocumentByIdUseCase {
  execute(documentId: string, ownerId: string): Promise<Document>;
}
