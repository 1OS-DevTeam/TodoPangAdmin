import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaHome } from "@react-icons/all-files/fa/FaHome";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { FaThList } from "@react-icons/all-files/fa/FaThList";
import { FaUserCircle } from "@react-icons/all-files/fa/FaUserCircle";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { IoLogOutOutline } from "@react-icons/all-files/io5/IoLogOutOutline";
import { signOut } from "firebase/auth";
import { auth } from "src/firebase";
import { useNavigate } from "react-router-dom";

import ROUTES from "src/common/Routes";
import { Toast } from "src/components";
import Auth from "src/services/Auth";
import { useAppStore } from "src/stores";

const MainLayout = () => {
  const location = useLocation();
  const [isSelected, setIsSelected] = useState(location.pathname);
  const navigate = useNavigate();
  const { me } = useAppStore();

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      await Auth.logout();
      await signOut(auth);
      localStorage.removeItem("accessToken");

      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      localStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex mx-auto items-center max-w-[120rem] justify-between w-full bg-white">
        {/* <div className="flex max-w-[120rem] mx-auto items-center px-30 py-20"> */}
        <div className="flex items-center px-30">
          <img
            src="images/logo-icon-pencil.png"
            alt="Todopang Logo Icon"
            className="w-35 h-35 mr-12"
          />
          <img
            src="images/logo-title.png"
            alt="Todopang Logo Title"
            className="w-75 mr-12"
          />
        </div>
        <div className="flex items-center p-16">
          <div className="">
            <p className="text-12 font-normal text-gray-6 tracking-tight leading-5">
              {me.email}
            </p>
            <button
              className="text-gray-6 flex items-center justify-end w-full"
              onClick={handleLogout}
            >
              <span className="text-12 leading-5">로그아웃</span>
              <IoLogOutOutline className="text-18 ml-3" />
            </button>
            {/* <p className="text-14 font-medium text-gray-6 leading-5">
              {me.name}
            </p> */}
          </div>
          <FaUserCircle className="text-35 text-gray-5 ml-12 mr-12" />
        </div>
      </header>
      <div className="flex flex-1 bg-blue-0">
        <div className="flex flex-1 max-w-[120rem] mx-auto">
          <aside className="flex-[1_6] my-30 ml-30">
            <nav>
              <p className="mb-24 text-14 font-bold text-gray-7 tracking-tight">
                MENU
              </p>
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
                        className={`flex py-20 px-20 mb-10 items-center leading-5 rounded-lg hover:bg-blue-1 ${isSelected === ROUTE.PATH ? "bg-blue-5 text-white hover:bg-blue-5" : "bg-blue-0 text-gray-6"}`}
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
                          <FaStar className="text-18 mr-8" />
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
            {/* <div className="flex justify-end mt-40">
              <button
                className="text-gray-6 flex items-center"
                onClick={handleLogout}
              >
                <span className="text-13 leading-5">로그아웃</span>
                <IoLogOutOutline className="text-18 ml-3" />
              </button>
            </div> */}
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
