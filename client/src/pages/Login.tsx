import GoogleLoginButton from "../components/auth/GoogleLoginButton";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome to SliceDocs</h1>
          <p className="mt-2 text-slate-500">Sign in to manage your documents</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}
