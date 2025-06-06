import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "src/firebase";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
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

      localStorage.setItem("accessToken", user.accessToken);
      await Auth.login();

      console.log("/auth/login 성공이당!");
      navigate("/");
    } catch (error) {
      alert("로그인에 실패했습니다.");
      console.error("서버 로그인 실패:", error);
    }
  };

  const handleLogin = async () => {
    const socialData = await socialLogin();
    if (socialData) await serverLogin(socialData);
  };

  return (
    <div className="md:bg-gray-1 flex md:flex-row flex-col w-full h-screen mx-auto items-center justify-center">
      <div className="md:bg-blue-3 md:w-[460px] md:h-[400px] rounded-3xl md:mr-30 flex justify-center items-center mb-30 md:mb-0">
        <img src="images/logo-icon-todo.png" className="w-200 mb-20" />
      </div>
      <div className="bg-white md:w-[460px] md:h-[400px] rounded-3xl flex flex-col justify-center items-center">
        <div className="mb-50 text-center">
          <h1 className="text-24 font-bold tracking-tighter mb-16">
            투두팡 어드민 로그인
          </h1>
          <p className="text-gray-6 font-medium text-16 tracking-tight">
            구글 계정으로 로그인해주세요.
          </p>
        </div>
        <button
          className="rounded-lg bg-blue-0 py-16 hover:bg-blue-1 hover:text-white border-gray-3 w-[340px] flex items-center justify-center"
          onClick={handleLogin}
        >
          <FcGoogle className="text-22 mr-12" />
          <span className="text-16 text-blue-7 tracking-tight">
            Google 로그인
          </span>
        </button>
        <p className="mt-50 tracking-tight text-gray-6 text-center">
          관리자를 통해 승인된 사람에 한해
          <br />
          어드민 페이지 로그인이 가능합니다.
        </p>
      </div>
    </div>
  );
};

export default Login;
