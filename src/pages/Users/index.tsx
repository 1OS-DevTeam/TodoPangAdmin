import { FaCheckCircle } from "@react-icons/all-files/fa/FaCheckCircle";
// import { RiDeleteBin6Line } from "@react-icons/all-files/ri/RiDeleteBin6Line";
import { Footer } from "src/components";

import { PageTitle, Table } from "src/components";

const Users = () => {
  return (
    <div className="relative h-full">
      <PageTitle title="사용자 목록" count={DATA.length} />
      <Table
        columns={[
          { key: "name", label: "이름" },
          { key: "id", label: "ID" },
          { key: "date", label: "가입일" },
          {
            key: "isActive",
            label: "계정 활성화 여부",
            render: (value) => (
              <FaCheckCircle
                className={
                  value ? "text-blue-6 text-xl" : "text-gray-4 text-xl"
                }
              />
            ),
          },
          {
            key: "actions",
            label: "",
            // render: (_, row) => (
            //   <button onClick={() => {}}>
            //     <RiDeleteBin6Line className="text-gray-6 text-xl hover:text-red-5" />
            //   </button>
            // ),
          },
        ]}
        data={DATA}
      />
      <Footer total={DATA.length} />
    </div>
  );
};

export default Users;

const DATA = [
  {
    name: "주혜린",
    id: "980426",
    date: "2025.02.16",
    isActive: true,
  },
  {
    name: "주찬혁",
    id: "950125",
    date: "2025.01.10",
    isActive: false,
  },
  {
    name: "김민수",
    id: "990305",
    date: "2024.12.20",
    isActive: true,
  },
  {
    name: "주혜린",
    id: "980426",
    date: "2025.02.16",
    isActive: true,
  },
  {
    name: "주찬혁",
    id: "950125",
    date: "2025.01.10",
    isActive: false,
  },
  {
    name: "김민수",
    id: "990305",
    date: "2024.12.20",
    isActive: true,
  },
];
