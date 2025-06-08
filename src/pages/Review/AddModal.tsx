import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "src/components";
import services from "src/services";
import { useAppStore } from "src/stores";
import ResponseError, { errorHandler } from "src/utils/Error";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddModal = ({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();
  const [input, setInput] = useState({
    title: "",
    emoji: 0,
  });

  const { mutate: addReview } = useMutation({
    mutationFn: () => {
      return services.Reveiw.addReview(input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["review"] });
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
      title="리뷰 추가"
      buttonTitle="완료"
      handleClickButton={handleSubmit}
    >
      <div>
        <div className="mb-30">
          <label className="flex text-14 text-gray-6 mb-8">제목</label>
          <input
            value={input.title}
            onChange={(e) => {
              setInput((prev) => ({ ...prev, title: e.target.value }));
            }}
            placeholder="리뷰 제목"
            className="p-16 text-14 placeholder:text-gray-5 border-solid focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-1 w-full rounded border-gray-3"
          />
        </div>
        <div className="mb-30">
          <label className="flex text-14 text-gray-6 mb-8">이모지</label>
          <input
            value={input.emoji}
            type="text"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              setInput((prev) => ({ ...prev, emoji: Number(value) }));
            }}
            placeholder="리뷰 이모지"
            className="text-14 p-16 placeholder:text-gray-5 border-solid focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-5 border-1 w-full rounded border-gray-3"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddModal;
