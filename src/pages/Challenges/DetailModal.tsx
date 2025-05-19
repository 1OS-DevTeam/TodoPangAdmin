import { useState, useEffect } from "react";
import { FaCaretDown } from "@react-icons/all-files/fa/FaCaretDown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Modal } from "src/components";
import { Challenge, UpdatedChallenge, Todo } from "src/types/challenge";
import { Constants } from "src/common";
import DraggableTodoList from "./DraggableTodoList";
import ResponseError, { errorHandler } from "src/utils/Error";
import services from "src/services";
import { useAppStore } from "src/stores";

interface Props {
  isOpen: boolean;
  challenge: Challenge;
  close: () => void;
}

const DetailModal = ({ isOpen, close, challenge }: Props) => {
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Challenge>(challenge);
  const [selected, setSelected] = useState<{
    key: 1 | 2 | 3;
    status: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedItem(challenge);
      const currentStatus = Object.entries(Constants.CATEGORY_STATUS).find(
        ([key]) => Number(key) === challenge.challengeStatus
      );
      if (currentStatus) {
        setSelected({
          key: Number(currentStatus[0]) as 1 | 2 | 3,
          status: currentStatus[1],
        });
      } else {
        setSelected(null);
      }
      setIsSelectOpen(false);
    }
  }, [challenge, isOpen]);

  const { mutate: updateChallengeMutation } = useMutation({
    mutationFn: (challengesToUpdate: UpdatedChallenge[]) => {
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
    const changedOrNewTodosForPayload: UpdatedChallenge["newTodoList"] = [];
    const originalTodosMap = new Map(
      (challenge.todoList || []).map((todo) => [Number(todo.todoId), todo])
    );

    (selectedItem.todoList || []).forEach((currentTodo) => {
      const numericCurrentTodoId = Number(currentTodo.todoId);
      const originalTodo = originalTodosMap.get(numericCurrentTodoId);

      const transformedTodo = {
        todoId: numericCurrentTodoId,
        newTodoOrder: currentTodo.todoOrder,
        newTodoTitle: currentTodo.todoTitle,
      };

      if (!originalTodo) {
        changedOrNewTodosForPayload.push(transformedTodo);
      } else {
        if (
          currentTodo.todoOrder !== originalTodo.todoOrder ||
          currentTodo.todoTitle !== originalTodo.todoTitle
        ) {
          changedOrNewTodosForPayload.push(transformedTodo);
        }
      }
    });

    const updatedChallengePayload: UpdatedChallenge = {
      challengeId: selectedItem.challengeId,
      categoryId: selectedItem.categoryId,
      newChallengeTitle: selectedItem.challengeName,
      newChallengeTerm: selectedItem.challengeTerm,
      newChallengeDiff: selectedItem.challengeDiff,
      newChallengeStatus: selectedItem.challengeStatus,
      newTodoList: changedOrNewTodosForPayload,
    };

    const challengesToUpdate: UpdatedChallenge[] = [updatedChallengePayload];
    updateChallengeMutation(challengesToUpdate);
  };

  return (
    <Modal
      title={challenge?.challengeName || "위시"}
      buttonTitle="수정하기"
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
          <div className="flex flex-col relative mb-20">
            <label className="mb-5 text-gray-6 tracking-tight">
              변경할 상태
            </label>
            <button
              className="w-full px-16 py-12 border border-gray-3 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5  bg-white relative"
              onClick={(e) => {
                e.preventDefault();
                setIsSelectOpen(!isSelectOpen);
              }}
            >
              <span>
                {selected?.status
                  ? selected.status
                  : Constants.CATEGORY_STATUS?.[
                      selectedItem?.challengeStatus as keyof typeof Constants.CATEGORY_STATUS
                    ] || "상태 선택"}
              </span>
              <FaCaretDown className="absolute right-16 text-24 top-1/2 -translate-y-1/2 text-gray-4" />
            </button>

            {isSelectOpen && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-3 rounded-md shadow-md mt-1 z-10 max-h-220 overflow-y-auto">
                {Object.entries(Constants.CATEGORY_STATUS)
                  .map(([key, value]) => ({
                    key: Number(key) as 1 | 2 | 3,
                    status: value,
                  }))
                  .map((item) => (
                    <li
                      key={item.key}
                      className="px-16 py-12 cursor-pointer hover:bg-blue-0"
                      onClick={() => {
                        setSelected(item);
                        setSelectedItem((prev) => ({
                          ...prev,
                          challengeStatus: item.key,
                        }));
                        setIsSelectOpen(false);
                      }}
                    >
                      {item.status}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <DraggableTodoList
            todoList={
              selectedItem?.todoList?.sort(
                (a, b) => a.todoOrder - b.todoOrder
              ) || []
            }
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
