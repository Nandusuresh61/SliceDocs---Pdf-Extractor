import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UploadButtonProps {
    disabled: boolean;
    loading: boolean;
    onUpload: () => void;
}

export default function UploadButton({
    disabled,
    loading,
    onUpload,
}: UploadButtonProps) {
    return (
        <Button
            className="w-full"
            disabled={disabled || loading}
            onClick={onUpload}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                </>
            ) : (
                "Upload PDF"
            )}
        </Button>
    );
}