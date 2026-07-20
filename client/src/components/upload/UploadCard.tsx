import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadArea from "./UploadArea";
import UploadButton from "./UploadButton";
import { toast } from "sonner";

import type { Document } from "@/types/document.types";
import { uploadPdf } from "@/services/document.api";

export default function UploadCard() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isUploading, setIsUploading] = useState(false);

    const [document, setDocument] = useState<Document | null>(null);

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);

            const response = await uploadPdf(selectedFile);

            setDocument(response.data);
            console.log("data", response.data)

            toast.success(response.message);

            setSelectedFile(null);
        } catch (error) {
            console.error(error);

            toast.error("Failed to upload PDF.");
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <Card className="mx-auto w-full max-w-xl shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-2xl">
                    Upload PDF
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <UploadArea
                    selectedFile={selectedFile}
                    onFileSelect={setSelectedFile}
                />

                <UploadButton
                    disabled={!selectedFile}
                    loading={isUploading}
                    onUpload={handleUpload}
                />
                {
                    document && (
                        <div className="rounded-lg border bg-muted/30 p-4">
                            <h3 className="font-semibold">
                                Upload Successful 🎉
                            </h3>

                            <div className="mt-3 space-y-2 text-sm">
                                <p>
                                    <strong>Name:</strong> {document.originalName}
                                </p>

                                <p>
                                    <strong>Pages:</strong> {document.pageCount}
                                </p>

                                <p>
                                    <strong>Size:</strong>{" "}
                                    {(document.size / 1024).toFixed(2)} KB
                                </p>

                                <p>
                                    <strong>Type:</strong> {document.type}
                                </p>
                            </div>
                        </div>
                    )
                }

            </CardContent>
        </Card>
    );
}