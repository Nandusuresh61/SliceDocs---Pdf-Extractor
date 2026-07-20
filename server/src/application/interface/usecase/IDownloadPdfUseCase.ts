export interface IDownloadPdfUseCase {
  execute(documentId: string, ownerId: string): Promise<{ buffer: Buffer; originalName: string }>;
}
