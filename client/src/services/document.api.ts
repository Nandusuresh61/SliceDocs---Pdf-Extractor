import { api } from "./api";

export const uploadPdf = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post("/documents/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getMyFiles = async () => {
    const response = await api.get("/documents/my-files");
    return response.data;
};

export const getDocumentById = async (id: string) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
};

export const extractPages = async (id: string, selectedPages: number[]) => {
    const response = await api.post(`/documents/${id}/extract`, { selectedPages });
    return response.data;
};

export const downloadDocument = async (id: string) => {
    const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob',
    });
    return response.data;
};