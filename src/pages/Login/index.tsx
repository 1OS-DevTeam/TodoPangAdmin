import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "src/firebase";
import { useNavigate } from "react-router-dom";
import Auth from "src/services/Auth";

const Login = () => {
  const navigate = useNavigate();

  const socialLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result?.user;

      return user;
    } catch (error) {
      console.error("소셜 로그인 실패:", error);
    }
  };

  const serverLogin = async (user) => {
    try {
      console.log("소셜로그인 정보: ", user);

      localStorage.setItem("accessToken", user.accessToken);
      await Auth.login(user.accessToken);
      console.log("/auth/login 성공이당!");

      navigate("/");
    } catch (error) {
      console.error("서버 로그인 실패:", error);
    }
  };

  const handleLogin = async () => {
    const socialData = await socialLogin();
    if (socialData) await serverLogin(socialData);
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
