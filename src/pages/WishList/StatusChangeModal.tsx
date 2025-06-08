import { useState } from "react";

import { IoMdRadioButtonOn } from "@react-icons/all-files/io/IoMdRadioButtonOn";
import Modal from "src/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import services from "src/services";
import { useAppStore } from "src/stores";
import ResponseError, { errorHandler } from "src/utils/Error";
import { Constants } from "src/common";
import { Challenge, DeployChallenge } from "src/types/challenge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedData: Challenge[];
}

const StatusChangeModal = ({ isOpen, onClose, selectedData }: Props) => {
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [selected, setSelected] = useState<{
    key: 1 | 2 | 3;
    status: string;
  } | null>(null);

  const { mutate: updateCategories } = useMutation({
    mutationFn: (challenges: DeployChallenge[]) => {
      setIsAddLoading(true);

      return services.Challenge.deployChallenges(challenges);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["challengeList"],
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
    const updatedList: DeployChallenge[] = [];

    if (selected) {
      selectedData.forEach((item) => {
        updatedList.push({
          challengeId: item.challengeId,
          newStatus: selected.key,
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
        <p className="mb-10 text-gray-6 tracking-tight">선택한 위시리스트</p>
        {selectedData?.map((selected, index) => (
          <div
            key={selected.challengeId}
            className="flex px-10 py-7 items-center justify-between bg-gray-1"
          >
            <div className="flex items-center">
              <p className="font-medium mr-4">{index + 1}.</p>
              <p className="tracking-tight font-normal mr-10 text-14">
                {selected.challengeName} (ID: {selected.challengeId})
              </p>
            </div>
            <p
              className={`${selected.challengeStatus === 1 ? "bg-yellow-0 text-yellow-6" : selected.challengeStatus === 2 ? "bg-blue-0 text-blue-6" : "bg-gray-1 text-gray-6"} inline-block px-6 py-2 rounded text-14`}
            >
              {
                Constants.CATEGORY_STATUS[
                  selected.challengeStatus as keyof typeof Constants.CATEGORY_STATUS
                ]
              }
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col relative">
        <label htmlFor="category" className="mb-5 text-gray-6 tracking-tight">
          일괄 변경할 상태
        </label>
        <ul className="flex">
          {Object.entries(Constants.CATEGORY_STATUS)
            .map(
              ([key, value]) =>
                ({
                  key: Number(key),
                  status: value,
                }) as {
                  key: 1 | 2 | 3;
                  status: string;
                }
            )
            .map((item) => (
              <li
                key={item.key}
                className={`py-10 pr-24 flex ${selected?.key === item.key ? "text-blue-6 font-semibold hover:text-blue-6" : "text-gray-5 hover:text-gray-8"} items-center cursor-pointer`}
                onClick={() => {
                  setSelected(item);
                }}
              >
                <IoMdRadioButtonOn className="mr-6 text-22" />
                <p className="text-14">{item.status}</p>
              </li>
            ))}
        </ul>
      </div>
    </Modal>
  );
};

export default StatusChangeModal;
