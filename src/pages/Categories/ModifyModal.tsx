import React from "react";

const ModifyModal = () => {
  return (
    <Modal
      title="카테고리 수정"
      buttonTitle="수정하기"
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      isButtonLoading={isUpdateLoading}
      handleClickButton={() => {
        if ((selectedItem?.categoryTitle.length || 0) < 2) {
          setToastState({
            isOpen: true,
            type: "info",
            title: "글자수 제한",
            message: "두글자 이상 작성해주세요.",
          });
          return;
        }
        if (selectedItem) updateCategory({ category: selectedItem });
      }}
    >
      <div className="mb-30">
        <label className="flex text-14 text-gray-6 mb-8">ID</label>
        <input
          disabled
          defaultValue={selectedItem?.categoryId}
          className="p-16 cursor-not-allowed border-solid border-1 w-full rounded border-gray-3"
        />
      </div>
      <div>
        <label className="flex text-14 text-gray-6 mb-8">이름</label>
        <input
          defaultValue={selectedItem?.categoryTitle}
          className="p-16 border-solid border-1 w-full rounded border-gray-3"
          placeholder="카테고리명을 작성해주세요."
          onChange={(e) => {
            setSelectedItem((prev) => ({
              ...prev,
              categoryTitle: e.target.value,
            }));
          }}
        />
      </div>
    </Modal>
  );
};

export default ModifyModal;
