import { Outlet } from "react-router-dom";
import { Toast } from "src/components";
import SideBar from "./SideBar";

const MainLayout = () => {
  return (
    <div className="md:flex">
      <SideBar />
      <main className="bg-gray-1 min-h-screen flex-[6_6] p-24">
        <Outlet />
        <Toast />
      </main>
    </div>
  );
};

export default MainLayout;
