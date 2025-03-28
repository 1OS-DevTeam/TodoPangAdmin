import { useState } from "react";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import Modal from "src/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import services from "src/services";
import { useAppStore } from "src/stores";
import ResponseError, { errorHandler } from "src/utils/Error";

const AddModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([""]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    setCategories([...categories, ""]); // Add a new empty input
  };

  const handleTodoChange = (index: number, value: string) => {
    const updated = [...categories];
    updated[index] = value;
    setCategories(updated);
  };

  const { mutate: addCategories } = useMutation({
    mutationFn: (categoryList: string[]) => {
      setIsAddLoading(true);

      return services.Category.addCategory({
        newCategories: categoryList,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categoryList"],
      });
      setToastState({
        isOpen: true,
        type: "success",
        title: "추가 완료",
        message: "성공적으로 반영되었습니다.",
      });
    },
    onError: (e) => {
      setToastState({
        isOpen: true,
        type: "error",
        title: "수정 실패",
        message: "오류가 발생했습니다. 다시 시도해주세요.",
      });
      if (e instanceof ResponseError) errorHandler(e);
    },
    onSettled: () => {
      setIsAddLoading(false);
      setCategories([""]);
      onClose();
    },
  });

  const handleSubmit = () => {
    const submitList = categories.filter((t) => t.trim() !== "");

    if (!submitList.length) {
      setToastState({
        isOpen: true,
        type: "error",
        title: "추가 실패",
        message: "카테고리명을 입력해주세요.",
      });
    } else {
      addCategories(submitList);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setCategories([""]);
        onClose();
      }}
      title="카테고리 추가"
      buttonTitle="추가하기"
      handleClickButton={handleSubmit}
      isButtonLoading={isAddLoading}
    >
      <div className="flex flex-col relative max-h-350 overflow-auto">
        <label className="text-gray-6 text-14 mb-10">이름</label>
        <button
          className="absolute right-0 cursor-pointer flex items-center"
          onClick={handleAddTodo}
        >
          <span className="mr-2 text-14 tracking-tight text-blue-6 font-semibold">
            추가하기
          </span>
          <FiPlus className="text-blue-6 text-16" />
        </button>

        {categories.map((todo, index) => (
          <input
            key={index}
            placeholder="카테고리명을 입력해주세요."
            type="text"
            value={todo}
            onChange={(e) => handleTodoChange(index, e.target.value)}
            className="mb-16 focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 placeholder:text-gray-5 border-solid border-1 border-gray-3 rounded-md px-16 py-12"
          />
        ))}
      </div>
    </Modal>
  );
};

export default AddModal;
