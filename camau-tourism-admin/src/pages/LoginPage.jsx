import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#007b8a] to-[#00c6e6]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-7">
          <span className="font-bold text-3xl text-[#00b9d7] tracking-wide">AdminPanel</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}