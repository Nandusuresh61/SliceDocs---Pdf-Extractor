import { IDocumentRepository } from "../../application/interface/IDocumentRepository";
import { Document } from "../../domain/entities/Document";
import { DocumentType } from "../../domain/types/DocumentType";
import { DocumentModel } from "../database/models/DocumentModel";

export class MongoDocumentRepository implements IDocumentRepository {
  async save(document: Document): Promise<Document> {
    const savedDocument = await DocumentModel.create({
      ownerId: document.ownerId,
      originalName: document.originalName,
      storageId: document.storageId,
      url: document.url,
      pageCount: document.pageCount,
      size: document.size,
      type: document.type,
    });

    return new Document({
      id: savedDocument.id,
      ownerId: savedDocument.ownerId?.toString(),
      originalName: savedDocument.originalName,
      storageId: savedDocument.storageId,
      url: savedDocument.url,
      pageCount: savedDocument.pageCount,
      size: savedDocument.size,
      type: savedDocument.type as DocumentType,
      createdAt: savedDocument.createdAt,
      updatedAt: savedDocument.updatedAt,
    });
  }

  async findById(id: string): Promise<Document | null> {
    throw new Error("Method not implemented.");
  }

  async findAllByOwner(ownerId: string): Promise<Document[]> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}