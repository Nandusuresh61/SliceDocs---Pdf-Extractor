import UploadCard from "@/components/upload/UploadCard";
import Navbar from "@/components/ui/Navbar";
import MyFiles from "@/components/upload/MyFiles";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12">
                <div className="flex justify-center mb-12">
                    <UploadCard />
                </div>
                <MyFiles />
            </main>
        </div>
    );
}