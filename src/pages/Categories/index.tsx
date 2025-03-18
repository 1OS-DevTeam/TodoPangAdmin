import { useState } from "react";
import { RiDeleteBin6Line } from "@react-icons/all-files/ri/RiDeleteBin6Line";
import { Modal, PageTitle, Table, Footer } from "src/components";

const Categories = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative h-full">
      <PageTitle title="카테고리 목록" count={1} />
      <Table
        columns={[
          {
            key: "name",
            label: "이름",
            render: (_, row) => (
              <button
                className="flex w-full text-start cursor-pointer"
                onClick={() => {
                  setIsOpen((prev) => !prev);
                }}
              >
                <p className="text-blue-6 font-medium">{row.name}</p>
              </button>
            ),
          },
          {
            key: "actions",
            label: "",
            render: (_, row) => (
              <div>
                <button
                  onClick={() => {
                    console.log(row.id);
                  }}
                >
                  <RiDeleteBin6Line className="text-gray-6 text-xl hover:text-red-5" />
                </button>
              </div>
            ),
          },
        ]}
        data={[
          { name: "기상", id: "1" },
          { name: "공부", id: "2" },
          { name: "운동", id: "3" },
        ]}
      />
      <Modal
        title="카테고리 수정"
        buttonTitle="수정하기"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <label className="flex text-14 text-gray-6 mb-8">이름</label>
        <input
          className="p-16 border-solid border-1 w-full rounded border-gray-3"
          placeholder="카테고리명을 작성해주세요."
        />
      </Modal>
      <Footer total={1} />
    </div>
  );
};

export default Categories;
