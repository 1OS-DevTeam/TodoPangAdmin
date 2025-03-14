import { FaCheckCircle } from "@react-icons/all-files/fa/FaCheckCircle";
import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";
import { RiDeleteBin6Line } from "@react-icons/all-files/ri/RiDeleteBin6Line";

import { PageTitle, Table } from "src/components";

const Users = () => {
  const handleDelete = (id: string) => {};

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
            label: "계정 삭제",
            render: (_, row) => (
              <button onClick={() => handleDelete(row.id)}>
                <RiDeleteBin6Line className="text-gray-6 text-xl hover:text-red-5" />
              </button>
            ),
          },
        ]}
        data={DATA}
      />
      <div className="absolute bottom-0 right-0 border-t-1 w-full border-solid border-gray-1">
        {/* total count */}
        <p className="mt-16 text-right mb-20 tracking-tight text-gray-5 font-medium">
          총 {DATA.length || 0}개의 결과
        </p>
        {/* pagination */}
        <div className="flex items-center justify-end">
          <button>
            <FaChevronLeft className="text-gray-4 text-20 mr-14 hover:text-blue-6" />
          </button>
          {PAGINATION_TEST.map((page, index) => {
            const isSelected = index === 0;
            return (
              <button
                className={`px-10 text-16 mr-12 h-35 w-35 font-medium py-5 rounded ${isSelected ? "bg-blue-6 text-white" : "bg-gray-1 text-gray-6 hover:bg-gray-3"}`}
              >
                {page}
              </button>
            );
          })}
          <button>
            <FaChevronRight className="text-gray-4 text-20 hover:text-blue-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;

const PAGINATION_TEST = [1, 2, 3, 4, 5];
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
