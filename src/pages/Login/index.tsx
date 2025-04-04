import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "src/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //   const allowedAdmins = ["admin@example.com"];
      //   if (!allowedAdmins.includes(user.email || "")) {
      //     alert("관리자 권한이 없습니다.");
      //     return;
      //   }

      console.log("로그인 성공:", user);
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <button className="bg-blue-6 py-12 text-white" onClick={handleLogin}>
        Google 로그인
      </button>
    </div>
  );
};

export default Login;
