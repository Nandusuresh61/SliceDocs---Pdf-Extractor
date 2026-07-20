export interface Document {
    id: string;
    originalName: string;
    storageId: string;
    url: string;
    pageCount: number;
    size: number;
    type: "ORIGINAL" | "GENERATED";
    createdAt: string;
    updatedAt: string;
}