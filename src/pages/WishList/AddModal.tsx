import { useRef, useState } from "react";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { FaCaretDown } from "@react-icons/all-files/fa/FaCaretDown";
import { FaCaretUp } from "@react-icons/all-files/fa/FaCaretUp";

import Modal from "src/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import services from "src/services";
import { useAppStore } from "src/stores";
import ResponseError, { errorHandler } from "src/utils/Error";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories?: { [key: number]: string };
}

const AddModal = ({ isOpen, onClose, categories }: Props) => {
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isSelectBoxOpen, setIsSelectBoxOpen] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState<{
    title: string;
    category: { key: number | null; value: string };
    diff: string;
    term: string;
    todoList: string[];
  }>({
    title: "",
    category: { key: null, value: "" },
    diff: "",
    term: "",
    todoList: [""],
  });

  const handleTodoChange = (index: number, value: string) => {
    const updatedTodos = [...input.todoList];
    updatedTodos[index] = value;
    setInput((prev) => ({ ...prev, todoList: updatedTodos }));
  };

  const handleAddTodo = (e: any) => {
    e.preventDefault();
    setInput((prev) => ({ ...prev, todoList: [...prev.todoList, ""] }));
  };

  const resetForm = () => {
    setInput({
      title: "",
      category: { key: null, value: "" },
      diff: "",
      term: "",
      todoList: [""],
    });
  };

  const handleSubmit = () => {
    if (
      !input.title.trim() ||
      !input.category.value ||
      !input.diff.trim() ||
      !input.term.trim()
    ) {
      setToastState({
        isOpen: true,
        type: "error",
        title: "입력값 부족",
        message: "모든 필드를 입력해주세요.",
      });
      return;
    }
    addChallenge();
  };

  const { mutate: addChallenge } = useMutation({
    mutationFn: () => {
      setIsAddLoading(true);

      return services.Challenge.addChallenges({
        title: input.title,
        categoryId: Number(input.category.key),
        diff: Number(input.diff),
        term: Number(input.term),
        todoList: input.todoList
          .filter((todo) => todo.trim() !== "")
          ?.map((el, index) => ({ order: index, title: el })),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["challengeList"],
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
        title: "추가 실패",
        message: "오류가 발생했습니다. 다시 시도해주세요.",
      });
      if (e instanceof ResponseError) errorHandler(e);
    },
    onSettled: () => {
      setIsAddLoading(false);
      resetForm();
      onClose();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="위시리스트 추가"
      buttonTitle="추가하기"
      handleClickButton={handleSubmit}
      isButtonLoading={isAddLoading}
    >
      <div>
        {/* 제목 */}
        <div className="mb-30">
          <label className="flex text-14 text-gray-6 mb-8">이름</label>
          <input
            value={input.title}
            onChange={(e) => {
              setInput((prev) => ({ ...prev, title: e.target.value }));
            }}
            placeholder="위시리스트 이름"
            className="p-16 placeholder:text-gray-5 border-solid focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-1 w-full rounded border-gray-3"
          />
        </div>

        {/* 카테고리 */}
        <div className="relative flex flex-col mb-20" ref={selectBoxRef}>
          <label className="mb-5 text-gray-6 text-14">카테고리</label>
          <button
            className="w-full px-16 py-12 border border-gray-3 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5  bg-white relative"
            onClick={(e) => {
              e.preventDefault();
              setIsSelectBoxOpen(!isSelectBoxOpen);
            }}
          >
            <span
              className={`${!!input.category.value ? "text-black" : "text-gray-5"}`}
            >
              {!!input.category.value
                ? input.category.value
                : "카테고리를 선택해주세요"}
            </span>
            {isSelectBoxOpen ? (
              <FaCaretUp className="absolute right-16 text-24 top-1/2 -translate-y-1/2 text-blue-6" />
            ) : (
              <FaCaretDown className="absolute right-16 text-24 top-1/2 -translate-y-1/2 text-gray-4" />
            )}
          </button>

          {isSelectBoxOpen && categories && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-3 rounded-md shadow-md mt-1 z-[100] max-h-220 overflow-y-auto">
              {Object.entries(categories)
                .map(
                  ([key, value]) =>
                    ({
                      key: Number(key),
                      value,
                    }) as {
                      key: number | null;
                      value: string;
                    }
                )
                .map((item) => (
                  <li
                    key={item.key}
                    className="px-16 py-12 cursor-pointer hover:bg-blue-0"
                    onClick={() => {
                      setInput((prev) => ({ ...prev, category: item }));
                      setIsSelectBoxOpen(false);
                    }}
                  >
                    {item.value}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* 난이도 */}
        <div className="mb-30">
          <label className="flex text-14 text-gray-6 mb-8">난이도</label>
          <input
            value={input.diff}
            type="number"
            inputMode="numeric"
            onChange={(e) => {
              setInput((prev) => ({ ...prev, diff: e.target.value }));
            }}
            placeholder="난이도"
            className="p-16 placeholder:text-gray-5 border-solid focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-1 w-full rounded border-gray-3"
          />
        </div>

        {/* 기간 */}
        <div className="mb-30">
          <label className="flex text-14 text-gray-6 mb-8">기간</label>
          <input
            value={input.term}
            type="number"
            inputMode="numeric"
            onChange={(e) => {
              setInput((prev) => ({ ...prev, term: e.target.value }));
            }}
            placeholder="기간 (일 수)"
            className="p-16 placeholder:text-gray-5 border-solid focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-1 w-full rounded border-gray-3"
          />
        </div>

        {/* 할일 */}
        <div className="flex flex-col relative">
          <label className="text-gray-6 text-14 mb-10">할일</label>
          <button
            className="absolute right-0 cursor-pointer flex items-center"
            onClick={handleAddTodo}
          >
            <span className="mr-2 text-14 tracking-tight text-blue-6 font-semibold">
              추가하기
            </span>
            <FiPlus className="text-blue-6 text-16" />
          </button>

          {input.todoList.map((todo, index) => (
            <input
              key={index}
              placeholder="할일"
              type="text"
              value={todo}
              onChange={(e) => handleTodoChange(index, e.target.value)}
              className="mb-16 focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 placeholder:text-gray-5 border-solid border-1 border-gray-3 rounded-md px-16 py-12"
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AddModal;
