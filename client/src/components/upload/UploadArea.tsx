import { useRef } from "react";
import { UploadCloud } from "lucide-react";

interface UploadAreaProps {
    selectedFile: File | null;
    onFileSelect: (file: File | null) => void;
}

export default function UploadArea({
    selectedFile,
    onFileSelect,
}: UploadAreaProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        onFileSelect(file);
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                hidden
                onChange={handleChange}
            />

            <div
                onClick={handleClick}
                className="flex min-h-60 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-purple-500 hover:bg-purple-50"
            >
                <UploadCloud className="mb-4 h-12 w-12 text-slate-400" />

                {selectedFile ? (
                    <>
                        <p className="font-semibold">
                            {selectedFile.name}
                        </p>

                        <p className="text-sm text-slate-500">
                            Click to choose another PDF
                        </p>
                    </>
                ) : (
                    <>
                        <p className="font-medium">
                            Drag & Drop your PDF here
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            or click to browse
                        </p>
                    </>
                )}
            </div>
        </>
    );
}