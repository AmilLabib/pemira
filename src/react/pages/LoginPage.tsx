import { useNavigate } from "react-router";
import LoginForm from "../components/Login/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (nim: string, token: string) => {
    try {
      // Send login request, backend sets session cookie
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim, token }),
        credentials: "include", // ensure cookies are sent
      });
      const data = await res.json();
      if (res.ok && data.success) {
        navigate("/ballot");
      } else {
        alert("NIM atau token salah.");
      }
    } catch (err) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-blue-100">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
