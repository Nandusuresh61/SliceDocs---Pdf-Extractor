import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants/routes";
import { AxiosError } from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadArea from "./UploadArea";
import UploadButton from "./UploadButton";
import { toast } from "sonner";

import type { Document } from "@/types/document.types";
import { uploadPdf } from "@/services/document.api";

export default function UploadCard() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isUploading, setIsUploading] = useState(false);

    const [document, setDocument] = useState<Document | null>(null);

    const handleFileSelect = (file: File | null) => {
        if (file) {
            if (file.type !== "application/pdf") {
                toast.warning("Please upload a valid PDF file.");
                return;
            }
        }
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);

            const response = await uploadPdf(selectedFile);

            setDocument(response.data);
            console.log("data", response.data)

            toast.success(response.message);

            setSelectedFile(null);
            
            if (response.data && response.data.id) {
                navigate(APP_ROUTES.DOCUMENT_PREVIEW.replace(':id', response.data.id));
            }
        } catch (error) {
            console.error(error);

            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Failed to upload PDF.");
            } else {
                toast.error((error as Error).message || "Failed to upload PDF.");
            }
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
                    onFileSelect={handleFileSelect}
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