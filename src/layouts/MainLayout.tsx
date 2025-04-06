import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaHome } from "@react-icons/all-files/fa/FaHome";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { FaThList } from "@react-icons/all-files/fa/FaThList";
import { IoLogOutOutline } from "@react-icons/all-files/io5/IoLogOutOutline";
import { signOut } from "firebase/auth";
import { auth } from "src/firebase";
import { useNavigate } from "react-router-dom";

import ROUTES from "src/common/Routes";
import { Toast } from "src/components";
import Auth from "src/services/Auth";

const MainLayout = () => {
  const location = useLocation();
  const [isSelected, setIsSelected] = useState(location.pathname);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) await Auth.logout(accessToken);
      localStorage.removeItem("accessToken");

      console.log("로그아웃 완료");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-white">
        <div className="flex max-w-[120rem] mx-auto items-center justify-between px-30 py-20">
          <Link to="/">
            {/* (+) logo */}
            <h1 className="text-20 font-semibold">TODOPANG ADMIN</h1>
          </Link>
        </div>
      </header>
      <div className="flex flex-1 bg-blue-0">
        <div className="flex flex-1 max-w-[120rem] mx-auto">
          <aside className="flex-[1_6] my-30 ml-30">
            <div className="mb-50">
              <h3 className="font-bold text-blue-6 text-18 mb-20 mt-10 tracking-tight">
                ACCOUNT
              </h3>
              {/* <p className="text-14 mb-8 font-semibold">000000000@gmail.com</p> */}
              <button
                className="text-gray-6 flex items-center tracking-tight"
                onClick={handleLogout}
              >
                <span className="text-14 leading-5">로그아웃</span>
                <IoLogOutOutline className="text-20 ml-5" />
              </button>
            </div>
            <h3 className="text-blue-6 font-bold text-18 mb-20 mt-10 tracking-tight">
              MENU
            </h3>
            <nav>
              <ul>
                {Object.values(ROUTES).map((ROUTE) => {
                  return (
                    <li
                      key={ROUTE.KEY}
                      onClick={() => {
                        setIsSelected(ROUTE.PATH);
                      }}
                    >
                      <Link
                        to={ROUTE.PATH || "/"}
                        className={`flex py-20 px-20 mb-10 leading-5 rounded-lg hover:bg-blue-1 ${isSelected === ROUTE.PATH ? "bg-blue-5 text-white hover:bg-blue-5" : "bg-blue-0 text-gray-6"}`}
                      >
                        {ROUTE.KEY === "dashboard" && (
                          <FaHome className="text-18 mr-8" />
                        )}
                        {ROUTE.KEY === "users" && (
                          <FaUser className="text-18 mr-8" />
                        )}
                        {ROUTE.KEY === "categories" && (
                          <FaThList className="text-18 mr-8" />
                        )}
                        {ROUTE.KEY === "challenges" && (
                          <FaCheck className="text-18 mr-8" />
                        )}
                        <p className="ml-8 text-18 inline-block">
                          {ROUTE.TITLE}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
          <main className="bg-white flex-[6_6] m-30 rounded-3xl px-30 py-40">
            <Outlet />
            <Toast />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
