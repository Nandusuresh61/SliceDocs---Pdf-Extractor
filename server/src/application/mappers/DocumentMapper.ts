import { Document } from "../../domain/entities/Document";
import { DocumentResponseDto } from "../dto/DocumentResponseDto";

export class DocumentMapper {
    static toResponse(document: Document): DocumentResponseDto {
        return {
            id: document.id,
            originalName: document.originalName,
            url: document.url,
            pageCount: document.pageCount,
            size: document.size,
            type: document.type,
        };
    }
}