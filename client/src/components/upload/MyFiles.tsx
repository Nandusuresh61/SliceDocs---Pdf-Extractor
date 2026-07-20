import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyFiles } from "@/services/document.api";
import type { Document } from "@/types/document.types";
import { toast } from "sonner";

export default function MyFiles() {
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getMyFiles();
        setFiles(data.data || []);
      } catch {
        toast.error("Failed to load your files");
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 flex justify-center text-slate-500">
        Loading your files...
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="text-slate-400 text-lg mb-2">No files yet</div>
        <div className="text-slate-500 text-sm">Upload a PDF above to get started.</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">My Files</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div 
            key={file.id} 
            onClick={() => navigate(`/document/${file.id}`)}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer hover:border-blue-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 truncate">
                <h3 className="font-semibold text-slate-700 truncate group-hover:text-blue-600 transition-colors" title={file.originalName}>
                  {file.originalName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.pageCount} pages
                </p>
              </div>
              <span
                className="text-blue-600 text-sm font-medium ml-4 bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-100 transition-colors"
              >
                Preview
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
