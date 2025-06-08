import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCaretDown } from "@react-icons/all-files/fa/FaCaretDown";
import { FaCaretUp } from "@react-icons/all-files/fa/FaCaretUp";

import { Modal } from "src/components";
import { Challenge, UpdatedChallenge, Todo } from "src/types/challenge";
import ResponseError, { errorHandler } from "src/utils/Error";
import services from "src/services";
import { useAppStore } from "src/stores";

import DraggableTodoList from "./DraggableTodoList";

interface Props {
  isOpen: boolean;
  challenge: Challenge;
  close: () => void;
  categories?: { [key: number]: string };
}

const DetailModal = ({ isOpen, close, challenge, categories }: Props) => {
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<Challenge>(challenge);
  const [isSelectBoxOpen, setIsSelectBoxOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState({
    key: challenge.categoryId,
    value: categories?.[challenge.categoryId],
  });
  const [isLoading, setIsLoading] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectBoxRef.current &&
        !selectBoxRef.current.contains(event.target as Node)
      ) {
        setIsSelectBoxOpen(false);
      }
    };

    if (isSelectBoxOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelectBoxOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedItem(challenge);
      setIsSelectBoxOpen(false);
    }
  }, [challenge, isOpen]);

  const { mutate: updateChallengeMutation } = useMutation({
    mutationFn: (challengesToUpdate: UpdatedChallenge) => {
      setIsLoading(true);
      return services.Challenge.updateChallenges(challengesToUpdate);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["challengeList"],
      });
      setToastState({
        isOpen: true,
        type: "success",
        title: "수정 완료",
        message: "성공적으로 반영되었습니다.",
      });
      close();
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
      setIsLoading(false);
    },
  });

  const handleClickButton = () => {
    const originalTodosMap = new Map(
      (challenge.todoList || []).map((todo) => [todo.todoId, todo])
    );
    const currentTodosMap = new Map(
      (selectedItem.todoList || []).map((todo) => [todo.todoId, todo])
    );

    const todosToAdd: UpdatedChallenge["todosToAdd"] = [];
    const todosToUpdate: UpdatedChallenge["todosToUpdate"] = [];
    const todosToDelete: UpdatedChallenge["todosToDelete"] = [];

    currentTodosMap.forEach((currentTodo, todoId) => {
      const originalTodo = originalTodosMap.get(todoId);

      if (!originalTodo) {
        todosToAdd.push({
          newTodoOrder: currentTodo.todoOrder,
          newTodoTitle: currentTodo.todoTitle,
        });
      } else {
        if (
          originalTodo.todoOrder !== currentTodo.todoOrder ||
          originalTodo.todoTitle !== currentTodo.todoTitle
        ) {
          todosToUpdate.push({
            todoId: currentTodo.todoId,
            newTodoOrder: currentTodo.todoOrder,
            newTodoTitle: currentTodo.todoTitle,
          });
        }
      }
    });

    originalTodosMap.forEach((originalTodo, todoId) => {
      if (!currentTodosMap.has(todoId)) {
        todosToDelete.push({
          todoId: originalTodo.todoId,
          newTodoStatus: 3,
        });
      }
    });

    const updatedChallengePayload: UpdatedChallenge = {
      challengeId: selectedItem.challengeId,
      newCategoryId: selectedItem.categoryId,
      newChallengeTitle: selectedItem.challengeName,
      newChallengeTerm: selectedItem.challengeTerm,
      newChallengeDiff: selectedItem.challengeDiff,
      todosToAdd,
      todosToUpdate,
      todosToDelete,
    };

    const challengesToUpdate: UpdatedChallenge = updatedChallengePayload;
    updateChallengeMutation(challengesToUpdate);
  };

  return (
    <Modal
      title="위시 수정하기"
      buttonTitle="완료"
      isOpen={isOpen}
      onClose={() => {
        close();
      }}
      handleClickButton={handleClickButton}
      isButtonLoading={isLoading}
    >
      <div className="max-h-400 overflow-y-auto">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col mb-20">
            <label className="mb-5 text-gray-6 text-14">제목</label>
            <input
              placeholder="제목을 작성해주세요."
              value={selectedItem?.challengeName || ""}
              type="text"
              className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5  border-solid border-1 border-gray-3 rounded-md px-16 py-12"
              onChange={(e) => {
                setSelectedItem((prev) => ({
                  ...prev,
                  challengeName: e.target.value,
                }));
              }}
            />
          </div>
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
                className={`${!!selectedCategory.value ? "text-black" : "text-gray-5"}`}
              >
                {!!selectedCategory.value
                  ? selectedCategory.value
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
                        key: 1 | 2 | 3;
                        value: string;
                      }
                  )
                  .map((item) => (
                    <li
                      key={item.key}
                      className="px-16 py-12 cursor-pointer hover:bg-blue-0"
                      onClick={() => {
                        setSelectedCategory(item);
                        setSelectedItem((prev) => ({
                          ...prev,
                          categoryId: item.key,
                        }));
                        setIsSelectBoxOpen(false);
                      }}
                    >
                      {item.value}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col mb-20">
            <label className="mb-5 text-gray-6 text-14">난이도</label>
            <input
              placeholder="난이도를 작성해주세요."
              value={selectedItem?.challengeDiff || ""}
              type="number"
              className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5   border-solid border-1 border-gray-3 rounded-md px-16 py-12"
              onChange={(e) => {
                const value = e.target.value;
                setSelectedItem((prev) => ({
                  ...prev,
                  challengeDiff: value === "" ? 0 : Number(value),
                }));
              }}
            />
          </div>
          <div className="flex flex-col mb-20">
            <label className="mb-5 text-gray-6 text-14">기간(일)</label>
            <input
              placeholder="기간을 작성해주세요."
              value={selectedItem?.challengeTerm || ""}
              type="number"
              className="focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-solid border-1 border-gray-3 rounded-md px-16 py-12"
              onChange={(e) => {
                const value = e.target.value;
                setSelectedItem((prev) => ({
                  ...prev,
                  challengeTerm: value === "" ? 0 : Number(value),
                }));
              }}
            />
          </div>
          <DraggableTodoList
            todoList={[...(selectedItem?.todoList || [])].sort(
              (a, b) => a.todoOrder - b.todoOrder
            )}
            setTodoList={(list: Todo[]) => {
              setSelectedItem((prev) => ({
                ...prev,
                todoList: list,
              }));
            }}
          />
        </form>
      </div>
    </Modal>
  );
};

export default DetailModal;
