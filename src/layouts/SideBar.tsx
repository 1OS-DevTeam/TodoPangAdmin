import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { FaHome } from "@react-icons/all-files/fa/FaHome";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { FaThList } from "@react-icons/all-files/fa/FaThList";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { IoLogOutOutline } from "@react-icons/all-files/io5/IoLogOutOutline";

import { auth } from "src/firebase";
import ROUTES from "src/common/Routes";
import Auth from "src/services/Auth";
import { useAppStore } from "src/stores";

const SideBar = () => {
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
    <div className="flex flex-1 bg-blue-14 md:w-[240px]">
      <aside className="w-full">
        <div className="flex items-center my-32 ml-24">
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
        <div className="m-24">
          <p className="mb-4 text-14 font-normal text-gray-4 tracking-tight leading-5">
            {me.email}
          </p>
          <button
            className="text-gray-4 flex items-center w-full"
            onClick={handleLogout}
          >
            <span className="text-14 leading-5">로그아웃</span>
            <IoLogOutOutline className="text-18 ml-3" />
          </button>
        </div>
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
                    className={`flex py-24 px-24 leading-5 hover:bg-blue-11 hover:text-white ${isSelected === ROUTE.PATH ? "bg-blue-6 text-white hover:bg-blue-6" : "bg-blue-14 text-gray-4"}`}
                  >
                    <div className="flex items-center">
                      {ROUTE.KEY === "dashboard" && (
                        <FaHome className="text-18 mr-8" />
                      )}
                      {ROUTE.KEY === "review" && (
                        <FaStar className="text-18 mr-8" />
                      )}
                      {ROUTE.KEY === "categories" && (
                        <FaThList className="text-18 mr-8" />
                      )}
                      {ROUTE.KEY === "wishlist" && (
                        <FaHeart className="text-18 mr-8" />
                      )}
                      <p className="ml-6 text-16 font-medium">{ROUTE.TITLE}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideBar;
