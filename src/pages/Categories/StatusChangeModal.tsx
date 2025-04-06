import { useState } from "react";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { FaCaretDown } from "@react-icons/all-files/fa/FaCaretDown";
import Modal from "src/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import services from "src/services";
import { useAppStore } from "src/stores";
import ResponseError, { errorHandler } from "src/utils/Error";
import { Constants } from "src/common";

interface Category {
  categoryId: number;
  categoryStatus: 1 | 2 | 3;
  categoryTitle: string;
}
const StatusChangeModal = ({ isOpen, onClose, selectedData }) => {
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [selected, setSelected] = useState<{
    key: 1 | 2 | 3;
    status: string;
  } | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { mutate: updateCategories } = useMutation({
    mutationFn: (categoryList: Category[]) => {
      setIsAddLoading(true);

      return services.Category.updateCategory({
        updatedCategories: categoryList,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categoryList"],
      });
      setToastState({
        isOpen: true,
        type: "success",
        title: "상태 변경 완료",
        message: "성공적으로 반영되었습니다.",
      });
    },
    onError: (e) => {
      setToastState({
        isOpen: true,
        type: "error",
        title: "상태 변경 실패",
        message: "오류가 발생했습니다. 다시 시도해주세요.",
      });
      if (e instanceof ResponseError) errorHandler(e);
    },
    onSettled: () => {
      setIsAddLoading(false);
      setSelected(null);
      onClose();
    },
  });

  const handleSubmit = () => {
    const updatedList: Category[] = [];

    if (selected) {
      selectedData.forEach((item) => {
        updatedList.push({
          categoryId: item.categoryId,
          categoryStatus: selected.key,
          categoryTitle: item.categoryTitle,
        });
      });
    }

    updateCategories(updatedList);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      title="상태 변경하기"
      buttonTitle="변경하기"
      handleClickButton={handleSubmit}
      isButtonLoading={isAddLoading}
    >
      <div className="mb-40">
        <p className="mb-10 text-gray-6 tracking-tight">선택한 카테고리</p>
        {selectedData?.map((selected, index) => (
          <div
            key={selected.categoryId}
            className="flex px-10 py-7 items-center justify-between bg-gray-1"
          >
            <div className="flex items-center">
              <p className="font-medium mr-4">{index + 1}.</p>
              <p className="tracking-tight font-normal mr-10">
                {selected.categoryTitle} (ID: {selected.categoryId})
              </p>
            </div>
            <p
              className={`${selected.categoryStatus === 1 ? "bg-yellow-0 text-yellow-6" : selected.categoryStatus === 2 ? "bg-blue-0 text-blue-6" : "bg-gray-1 text-gray-6"} inline-block px-6 py-2 rounded text-14`}
            >
              {Constants.CATEGORY_STATUS[selected.categoryStatus]}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col relative">
        <label htmlFor="category" className="mb-5 text-gray-6 tracking-tight">
          일괄 변경할 상태
        </label>
        <button
          className="w-full px-16 py-12 border border-gray-3 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5  bg-white relative"
          onClick={(e) => {
            e.preventDefault();
            setIsSelectOpen(!isSelectOpen);
          }}
        >
          <span className={`${!!selected ? "text-black" : "text-gray-5"}`}>
            {!!selected ? selected.status : "상태를 선택해주세요"}
          </span>
          <FaCaretDown className="absolute right-16 text-24 top-1/2 -translate-y-1/2 text-gray-4" />
        </button>

        {isSelectOpen && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-3 rounded-md shadow-md mt-1 z-10 max-h-220 overflow-y-auto">
            {Object.entries(Constants.CATEGORY_STATUS)
              .map(([key, value]) => ({
                key: Number(key),
                status: value,
              }))
              .map((item) => (
                <li
                  key={item.key}
                  className="px-16 py-12 cursor-pointer hover:bg-blue-0"
                  onClick={() => {
                    setSelected(item);
                    setIsSelectOpen(false);
                  }}
                >
                  {item.status}
                </li>
              ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default StatusChangeModal;
