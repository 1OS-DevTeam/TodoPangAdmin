import { FaTools } from "@react-icons/all-files/fa/FaTools";

const Dashboard = () => {
  return (
    <div className="flex justify-center h-full w-full items-center">
      <div className="flex flex-col items-center">
        <FaTools className="text-9xl text-blue-2 mb-30" />
        <p className="text-blue-2 text-center font-semibold text-24 tracking-tight">
          ... 작업중 ...
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
