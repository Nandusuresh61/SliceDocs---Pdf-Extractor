import { Document } from "../../domain/entities/Document";

export interface IDocumentRepository {
  save(document: Document): Promise<Document>;
  findById(id: string): Promise<Document | null>;
  findAllByOwner(ownerId: string): Promise<Document[]>;
  delete(id: string): Promise<void>;
}
