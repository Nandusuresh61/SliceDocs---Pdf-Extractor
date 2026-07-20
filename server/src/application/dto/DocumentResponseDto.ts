import { DocumentType } from "../../domain/types/DocumentType";

export interface DocumentResponseDto {
    id?: string;
    originalName: string;
    url: string;
    pageCount: number;
    size: number;
    type: DocumentType;
}