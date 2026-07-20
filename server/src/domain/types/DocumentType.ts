export enum DocumentType {
    ORIGINAL = "ORIGINAL",
    GENERATED = "GENERATED",
}

export interface DocumentProps {
    id?: string;
    ownerId?: string;

    originalName: string;

    storageId: string;
    url: string;

    pageCount: number;
    size: number;

    type: DocumentType;

    createdAt?: Date;
    updatedAt?: Date;
}