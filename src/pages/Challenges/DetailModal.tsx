import { Modal } from "src/components";
import { Challenge } from "src/types/challenge";

interface Props {
  isOpen: boolean;
  challenge: Challenge;
  close: () => void;
}

const DetailModal = ({ isOpen, close, challenge }: Props) => {
  return (
    <Modal
      title={challenge.challengeName || "위시"}
      buttonTitle="수정하기"
      isOpen={isOpen}
      //   isOpen={!!selectedRow}
      onClose={() => {
        close();
        // setSelectedRow(null);
      }}
      handleClickButton={() => {
        alert("hi");
        close();
        // setSelectedRow(null);
      }}
    >
      <div className="max-h-400">
        <form>
          <div className="flex flex-col mb-20">
            <label className="mb-5 text-gray-6 text-14">제목</label>
            <input
              placeholder="제목을 작성해주세요."
              defaultValue=""
              type="text"
              className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5  border-solid border-1 border-gray-3 rounded-md px-16 py-12"
            />
          </div>
          {/* <div className="flex flex-col mb-20 relative">
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
          </div> */}
          <div className="flex flex-col mb-20">
            <label className="mb-5 text-gray-6 text-14">난이도</label>
            <input
              placeholder="난이도를 작성해주세요."
              //   defaultValue={selectedRow.level}
              defaultValue=""
              type="text"
              className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5   border-solid border-1 border-gray-3 rounded-md px-16 py-12"
            />
          </div>
          <div className="flex flex-col mb-20">
            <label className="mb-5 text-gray-6 text-14">기간</label>
            <input
              placeholder="기간을 작성해주세요."
              //   defaultValue={selectedRow.duration}
              defaultValue=""
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
              }}
            >
              <span className="mr-2 text-13 tracking-tight text-blue-6 font-semibold">
                추가하기
              </span>
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
  );
};

export default DetailModal;
