import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    ArrowLeft, 
    FileText, 
    CheckCircle2, 
    LayoutGrid, 
    Maximize2, 
    Download, 
    Trash2, 
    Search, 
    Sparkles,
    RotateCw,
    Loader2
} from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getDocumentById, extractPages, downloadDocument } from "@/services/document.api";
import type { Document as DocumentType } from "@/types/document.types";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function DocumentPreview() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [document, setDocument] = useState<DocumentType | null>(null);
    const [pdfFile, setPdfFile] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
    const [isExtracting, setIsExtracting] = useState(false);
    
    useEffect(() => {
        const fetchDocument = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const response = await getDocumentById(id);
                setDocument(response.data);
                
                const blob = await downloadDocument(id);
                setPdfFile(blob);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load document");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocument();
    }, [id]);

    const handleTogglePage = (pageNumber: number) => {
        setSelectedPages(prev => {
            const next = new Set(prev);
            if (next.has(pageNumber)) {
                next.delete(pageNumber);
            } else {
                next.add(pageNumber);
            }
            return next;
        });
    };

    const handleSelectAll = () => {
        if (!document) return;
        const allPages = new Set(Array.from({ length: document.pageCount }, (_, i) => i + 1));
        setSelectedPages(allPages);
    };

    const handleClearSelection = () => {
        setSelectedPages(new Set());
    };

    const handleExtract = async () => {
        if (!id || selectedPages.size === 0) return;
        
        try {
            setIsExtracting(true);
            const response = await extractPages(id, Array.from(selectedPages));
            toast.success("Pages extracted successfully!");
            
            // Trigger download of the newly generated PDF
            const generatedDoc = response.data;
            if (generatedDoc && generatedDoc.url) {
                // Fetch the file and create a blob to force download
                const fileRes = await fetch(generatedDoc.url);
                const blob = await fileRes.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = window.document.createElement('a');
                link.href = downloadUrl;
                link.download = generatedDoc.originalName || "extracted.pdf";
                window.document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to extract pages");
        } finally {
            setIsExtracting(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const renderSkeleton = () => {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <p className="text-slate-500 font-medium">Rendering document...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full max-w-6xl mt-8 px-6">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="aspect-[1/1.414] bg-slate-200 rounded-xl animate-pulse shadow-sm"></div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 md:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => navigate(APP_ROUTES.HOME)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        aria-label="Back to dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="hidden sm:flex items-center space-x-2 font-bold text-lg text-slate-800 border-r border-slate-200 pr-4">
                        <div className="bg-blue-600 text-white p-1 rounded">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span>SliceDocs</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 sm:pl-2">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-slate-900 text-sm md:text-base leading-tight truncate max-w-[200px] md:max-w-md">
                                {document?.originalName || "Loading..."}
                            </h1>
                            <div className="text-xs text-slate-500 flex items-center space-x-2">
                                <span>{document?.pageCount || 0} pages</span>
                                <span>&bull;</span>
                                <span>{formatFileSize(document?.size || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">


                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-medium text-sm shadow-sm cursor-pointer">
                        US
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto w-full flex flex-col items-center py-8 pb-32">
                {isLoading || !document || !pdfFile ? (
                    renderSkeleton()
                ) : (
                    <div className="w-full max-w-7xl px-4 md:px-8">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-lg font-semibold text-slate-800">Select pages to extract</h2>

                        </div>

                        <Document 
                            file={pdfFile} 
                            loading={renderSkeleton()}
                            className="w-full"
                            onLoadError={(error) => console.error("PDF Load Error:", error)}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {Array.from({ length: document.pageCount }).map((_, i) => {
                                    const pageNumber = i + 1;
                                    const isSelected = selectedPages.has(pageNumber);

                                    return (
                                        <div 
                                            key={pageNumber}
                                            onClick={() => handleTogglePage(pageNumber)}
                                            className={`
                                                group relative cursor-pointer rounded-xl transition-all duration-200 ease-out
                                                ${isSelected ? 'ring-2 ring-blue-500 shadow-md transform scale-[1.02]' : 'hover:shadow-lg hover:scale-[1.01]'}
                                            `}
                                        >
                                            <div className={`
                                                aspect-[1/1.414] rounded-xl overflow-hidden bg-white border relative
                                                ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200'}
                                            `}>
                                                
                                                <div className="w-full h-full flex items-center justify-center bg-slate-50 pointer-events-none">
                                                    <Page 
                                                        pageNumber={pageNumber} 
                                                        renderTextLayer={false}
                                                        renderAnnotationLayer={false}
                                                        className="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:!w-full [&>canvas]:!h-auto [&>canvas]:object-contain"
                                                    />
                                                </div>

                                                {/* Page Number Badge */}
                                                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium text-slate-600 shadow-sm border border-slate-100 z-10">
                                                    Pg {pageNumber}
                                                </div>

                                                {/* Selection Indicator */}
                                                <div className={`
                                                    absolute top-3 left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 z-10
                                                    ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white/50 group-hover:border-blue-400'}
                                                `}>
                                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                </div>
                                                
                                                {/* Selected Overlay */}
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-blue-500/10 pointer-events-none z-0"></div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Document>
                    </div>
                )}
            </main>

            {/* Selection Toolbar (Sticky Bottom) */}
            <div className={`
                fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] 
                transition-transform duration-300 ease-in-out z-50
                ${isLoading ? 'translate-y-full' : 'translate-y-0'}
            `}>
                <div className="max-w-5xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                        <div className="text-sm font-medium text-slate-700 mb-1 md:mb-0">
                            <span className="text-blue-600 font-bold text-base">{selectedPages.size}</span>
                            <span className="text-slate-500 font-normal"> / {document?.pageCount || 0} pages selected</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleSelectAll}
                                className="text-xs md:text-sm text-slate-600 border-slate-300 hover:bg-slate-50"
                            >
                                Select All
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={handleClearSelection}
                                disabled={selectedPages.size === 0}
                                className="text-xs md:text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Button 
                            onClick={handleExtract}
                            disabled={selectedPages.size === 0 || isExtracting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:shadow-md flex items-center space-x-2"
                        >
                            {isExtracting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Extracting...</span>
                                </>
                            ) : (
                                <span>Extract {selectedPages.size > 0 ? selectedPages.size : ''} {selectedPages.size === 1 ? 'Page' : 'Pages'}</span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
