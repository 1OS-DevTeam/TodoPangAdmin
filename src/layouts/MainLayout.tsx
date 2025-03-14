import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { FaHome } from "@react-icons/all-files/fa/FaHome";
import { FaUser } from "@react-icons/all-files/fa/FaUser";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { FaThList } from "@react-icons/all-files/fa/FaThList";

import ROUTES from "src/constants/routes";

const MainLayout = () => {
  const [isSelected, setIsSelected] = useState(ROUTES.MAIN.KEY);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-white">
        <div className="flex max-w-[120rem] mx-auto items-center justify-between px-30 py-20">
          <Link to="/">
            {/* (+) logo */}
            <h1 className="text-20 font-bold text-blue-6 tracking-widest">
              TODOPANG ADMIN
            </h1>
          </Link>
          <div>
            <p className="text-gray-6 text-14">hyerin@gmail.com</p>
          </div>
        </div>
      </header>
      <div className="flex flex-1 bg-blue-0">
        <div className="flex flex-1 max-w-[120rem] mx-auto">
          <aside className="flex-[1_6] my-30 ml-30">
            <h3 className="font-bold text-18 mb-20 mt-10">MENU</h3>
            <nav>
              <ul>
                {Object.values(ROUTES).map((ROUTE) => {
                  return (
                    <li
                      key={ROUTE.KEY}
                      onClick={() => {
                        setIsSelected(ROUTE.KEY);
                      }}
                    >
                      <Link
                        to={ROUTE.PATH || "/"}
                        className={`flex py-20 px-20 mb-10 leading-5 rounded-lg hover:bg-blue-1 ${isSelected === ROUTE.KEY ? "bg-blue-5 text-white hover:bg-blue-5" : "bg-blue-0 text-gray-6"}`}
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
