import { useState } from "react";
import { RiDeleteBin6Line } from "@react-icons/all-files/ri/RiDeleteBin6Line";
import { FaCaretDown } from "@react-icons/all-files/fa/FaCaretDown";
import { IoIosAdd } from "@react-icons/all-files/io/IoIosAdd";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { Modal, PageTitle, Table, Footer } from "src/components";

const Challenges = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selected, setSelected] = useState("운동");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  return (
    <div className="relative h-full">
      <PageTitle title="도전과제 목록" count={1} />
      <div className="flex justify-end">
        <button className="flex bg-blue-6 pr-16 pl-8 py-6 rounded">
          <IoIosAdd className="text-white text-22" />
          <span className="text-white text-16">추가</span>
        </button>
      </div>
      <Table
        columns={[
          {
            key: "name",
            label: "이름",
            render: (_, row) => (
              <button
                className="flex w-full text-start cursor-pointer"
                onClick={() => {
                  setSelectedRow(row);
                  setIsOpen((prev) => !prev);
                }}
              >
                <p className="text-blue-6 font-medium">{row.name}</p>
              </button>
            ),
          },
          { key: "category", label: "카테고리" },
          { key: "duration", label: "기간" },
          { key: "level", label: "난이도" },
          { key: "todo", label: "할일" },
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
        data={DATA}
      />
      {selectedRow && (
        <Modal
          title="도전과제 수정"
          buttonTitle="수정하기"
          isOpen={!!selectedRow}
          onClose={() => {
            setSelectedRow(null);
            setIsOpen(false);
          }}
          handleClickButton={() => {
            alert("hi");
            setSelectedRow(null);
            setIsOpen(false);
          }}
        >
          <div className="max-h-400">
            <form>
              <div className="flex flex-col mb-20">
                <label className="mb-5 text-gray-6 text-14">제목</label>
                <input
                  placeholder="제목을 작성해주세요."
                  defaultValue={selectedRow.name}
                  type="text"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5  border-solid border-1 border-gray-3 rounded-md px-16 py-12"
                />
              </div>
              <div className="flex flex-col mb-20 relative">
                <label htmlFor="category" className="mb-5 text-gray-6 text-14">
                  카테고리
                </label>
                <button
                  className="w-full px-16 py-12 border border-gray-3 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5  bg-white relative"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSelectOpen(!isSelectOpen);
                  }}
                >
                  {selected}
                  <FaCaretDown className="absolute right-16 text-24 top-1/2 -translate-y-1/2 text-gray-4" />
                </button>

                {isSelectOpen && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-3 rounded-md shadow-md mt-1 z-10 max-h-220 overflow-y-auto">
                    {OPTIONS.map((option) => (
                      <li
                        key={option.value}
                        className="px-16 py-12 cursor-pointer hover:bg-blue-0"
                        onClick={() => {
                          setSelected(option.label);
                          setIsSelectOpen(false);
                        }}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col mb-20">
                <label className="mb-5 text-gray-6 text-14">난이도</label>
                <input
                  placeholder="난이도를 작성해주세요."
                  defaultValue={selectedRow.level}
                  type="text"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5   border-solid border-1 border-gray-3 rounded-md px-16 py-12"
                />
              </div>
              <div className="flex flex-col mb-20">
                <label className="mb-5 text-gray-6 text-14">기간</label>
                <input
                  placeholder="기간을 작성해주세요."
                  defaultValue={selectedRow.duration}
                  type="text"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-solid border-1 border-gray-3 rounded-md px-16 py-12"
                />
              </div>
              <div className="flex flex-col mb-20">
                <label className="mb-5 text-gray-6 text-14">할일</label>
                <button
                  className="absolute right-30 cursor-pointer flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    // add todos
                  }}
                >
                  <span className="mr-2 text-13 tracking-tight text-blue-6 font-semibold">
                    추가하기
                  </span>
                  <FiPlus className="text-blue-6 text-16" />
                </button>
                <input
                  placeholder="할일을 작성해주세요."
                  type="text"
                  className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-solid border-1 border-gray-3 rounded-md px-16 py-12"
                />
              </div>
            </form>
          </div>
        </Modal>
      )}
      <Footer total={1} />
    </div>
  );
};

export default Challenges;

const OPTIONS = [
  { value: "volvo", label: "운동" },
  { value: "saab", label: "기상" },
  { value: "mercedes", label: "공부" },
  { value: "mercedes1", label: "공부" },
  { value: "mercedes2", label: "공부" },
  { value: "mercedes3", label: "공부" },
  { value: "mercedes4", label: "공부" },
  { value: "mercedes5", label: "공부" },
  { value: "mercedes6", label: "공부" },
  { value: "mercedes7", label: "공부" },
];

const DATA = [
  {
    name: "도전과제1",
    id: "1",
    category: "운동",
    duration: "30",
    level: "상",
    todo: ["할일1", "할일2"],
  },
  {
    name: "도전과제2",
    id: "2",
    category: "운동",
    duration: "20",
    level: "중",
    todo: ["할일2"],
  },
  {
    name: "도전과제3",
    id: "3",
    category: "기상",
    duration: "8",
    level: "하",
    todo: ["할일3"],
  },
];
