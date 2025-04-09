import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "src/firebase";
import { useNavigate } from "react-router-dom";
import Auth from "src/services/Auth";
import { useAppStore } from "src/stores";

const Login = () => {
  const navigate = useNavigate();
  const { setMe } = useAppStore();

  const socialLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result?.user;

      setMe({
        name: user.displayName || "",
        email: user.email || "",
      });
      return user;
    } catch (error) {
      console.error("소셜 로그인 실패:", error);
      return;
    }
  };

  const serverLogin = async (user: any) => {
    try {
      console.log("소셜로그인 정보: ", user);
      await Auth.login(user.accessToken);

      console.log("/auth/login 성공이당!");
      localStorage.setItem("accessToken", user.accessToken);
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
