import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "src/components";
import services from "src/services";
import { useAppStore } from "src/stores";
import { Review } from "src/types/review";
import ResponseError, { errorHandler } from "src/utils/Error";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetReview: Review;
}

const DetailModal = ({ isOpen, onClose, targetReview }: Props) => {
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [input, setInput] = useState({
    reviewId: targetReview.reviewId,
    newTitle: targetReview.title,
    newEmoji: targetReview.emoji,
  });

  const { mutate: addReview } = useMutation({
    mutationFn: () => {
      setIsUpdateLoading(true);
      return services.Reveiw.updateReview(input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["review"] });
      setToastState({
        isOpen: true,
        type: "success",
        title: "수정 완료",
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
      setIsUpdateLoading(false);
      onClose();
    },
  });

  const handleSubmit = () => {
    addReview();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      title="리뷰 수정"
      buttonTitle="완료"
      handleClickButton={handleSubmit}
      isButtonLoading={isUpdateLoading}
    >
      <div>
        <div className="mb-30">
          <label className="flex text-14 text-gray-6 mb-8">제목</label>
          <input
            value={input.newTitle}
            onChange={(e) => {
              setInput((prev) => ({ ...prev, newTitle: e.target.value }));
            }}
            placeholder="리뷰 제목"
            className="p-16 text-14 placeholder:text-gray-5 border-solid focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-1 w-full rounded border-gray-3"
          />
        </div>
        <div className="mb-30">
          <label className="flex text-14 text-gray-6 mb-8">이모지</label>
          <input
            value={input.newEmoji}
            type="text"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              setInput((prev) => ({
                ...prev,
                newEmoji: Number(value),
              }));
            }}
            placeholder="리뷰 이모지"
            className="p-16 text-14 placeholder:text-gray-5 border-solid focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-1 w-full rounded border-gray-3"
          />
        </div>
      </div>
    </Modal>
  );
};

export default DetailModal;
