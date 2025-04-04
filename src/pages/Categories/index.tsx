import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoIosAdd } from "@react-icons/all-files/io/IoIosAdd";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
import { MdCheckBoxOutlineBlank } from "@react-icons/all-files/md/MdCheckBoxOutlineBlank";
import { MdCheckBox } from "@react-icons/all-files/md/MdCheckBox";
import { CgArrowsExchange } from "@react-icons/all-files/cg/CgArrowsExchange";

import { Modal, PageTitle, Table } from "src/components";
import services from "src/services";
import { Constants } from "src/common";
import ResponseError, { errorHandler } from "src/utils/Error";
import { useAppStore } from "src/stores";

import AddModal from "./AddModal";
import StatusChangeModal from "./StatusChangeModal";

interface UpdatedCategory {
  updatedCategoryId: number;
  updatedCategoryStatus: number;
  updatedCategoryTitle: string;
}

interface Category {
  categoryId: number;
  categoryStatus: 1 | 2 | 3;
  categoryTitle: string;
}

const Categories = () => {
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Category | null>(null); // for modify title
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // for modify status
  const [isOpen, setIsOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categoryList"],
    queryFn: () => services.Category.fetchCategories(),
  });

  const { mutate: updateCategory } = useMutation({
    mutationFn: ({ category }: { category: Category }) => {
      setIsUpdateLoading(true);

      return services.Category.updateCategory({
        updatedCategories: [
          {
            updatedCategoryId: category.categoryId,
            updatedCategoryStatus: category.categoryStatus,
            updatedCategoryTitle: category.categoryTitle,
          },
        ],
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categoryList"],
      });
      setIsOpen(false);
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
      setIsOpen(false);
    },
    onSettled: () => {
      setIsUpdateLoading(false);
    },
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: ({ categories }: { categories: UpdatedCategory[] }) => {
      setIsUpdateLoading(true);

      // console.log(categories);

      return services.Category.updateCategory({
        updatedCategories: categories,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categoryList"],
      });
      setIsOpen(false);
      setToastState({
        isOpen: true,
        type: "success",
        title: "삭제 완료",
        message: "성공적으로 삭제되었습니다.",
      });
    },
    onError: (e) => {
      setToastState({
        isOpen: true,
        type: "error",
        title: "삭제 실패",
        message: "오류가 발생했습니다. 다시 시도해주세요.",
      });
      if (e instanceof ResponseError) errorHandler(e);
      setIsOpen(false);
    },
    onSettled: () => {
      setIsUpdateLoading(false);
    },
  });

  const handleChangeStatus = () => {
    if (!selectedIds.length) {
      setToastState({
        isOpen: true,
        type: "warn",
        title: "변경할 카테고리가 없습니다.",
        message: "상태를 변경할 카테고리를 선택해주세요.",
      });
      return;
    }

    setIsStatusModalOpen(true);
  };

  const handleDelete = (row: Category) => {
    if (row.categoryStatus === 3) {
      setToastState({
        isOpen: true,
        type: "error",
        title: "삭제 불가",
        message: "이미 삭제된 카테고리입니다.",
      });
    } else {
      deleteCategory({
        categories: [
          {
            updatedCategoryId: row.categoryId,
            updatedCategoryStatus: 3,
            updatedCategoryTitle: row.categoryTitle,
          },
        ],
      });
    }
  };

  return (
    <div className="relative h-full">
      <PageTitle title="카테고리 목록" count={data?.length || 0} />
      <div className="flex justify-end">
        <button
          className="flex border-[1px] border-blue-6 pr-16 pl-8 mr-12 py-6 rounded hover:bg-blue-0"
          onClick={handleChangeStatus}
        >
          <CgArrowsExchange className="text-blue-6 text-22 mr-4" />
          <span className="text-blue-6 text-16 font-medium">상태 변경</span>
        </button>
        <button
          className="flex bg-blue-6 pr-16 pl-8 py-6 rounded hover:bg-blue-8"
          onClick={() => {
            setIsAddModalOpen(true);
          }}
        >
          <IoIosAdd className="text-white text-22" />
          <span className="text-white text-16">카테고리 추가</span>
        </button>
      </div>
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center h-[400px]">
          <AiOutlineLoading3Quarters className="text-40 animate-spin text-blue-6" />
        </div>
      ) : (
        <Table
          columnRatios={[0.5, 0.5, 3, 6]}
          columns={[
            {
              key: "checkbox",
              label: "",
              render: (_, row) => (
                <button
                  className="flex w-full text-start cursor-pointer"
                  onClick={() => {
                    if (selectedIds.includes(row.categoryId)) {
                      setSelectedIds(
                        selectedIds.filter((id) => id !== row.categoryId)
                      );
                    } else {
                      setSelectedIds([...selectedIds, row.categoryId]);
                    }
                  }}
                >
                  {selectedIds.includes(row.categoryId) ? (
                    <MdCheckBox className="text-blue-6 text-24" />
                  ) : (
                    <MdCheckBoxOutlineBlank className="text-gray-3 text-24" />
                  )}
                </button>
              ),
            },
            {
              key: "categoryId",
              label: "ID",
            },
            {
              key: "categoryTitle",
              label: "이름",
              render: (_, row) => (
                <button
                  className="flex w-full text-start cursor-pointer"
                  onClick={() => {
                    if (row.categoryStatus === 3) {
                      setToastState({
                        isOpen: true,
                        type: "error",
                        title: "수정 불가",
                        message: "이미 삭제된 카테고리입니다.",
                      });
                      return;
                    }
                    setSelectedItem(row);
                    setIsOpen((prev) => !prev);
                  }}
                >
                  <p className="text-blue-6 font-medium underline underline-offset-2">
                    {row.categoryTitle}
                  </p>
                </button>
              ),
            },
            {
              key: "categoryStatus",
              label: "상태",
              render: (_, row) => {
                return Constants.CATEGORY_STATUS?.[
                  row.categoryStatus as keyof typeof Constants.CATEGORY_STATUS
                ] ? (
                  <p
                    className={`${row.categoryStatus === 1 ? "bg-yellow-1 text-yellow-7" : row.categoryStatus === 2 ? "bg-blue-0 text-blue-6" : "bg-gray-2 text-gray-6"} inline-block px-8 py-3 rounded text-14`}
                  >
                    {
                      Constants.CATEGORY_STATUS?.[
                        row.categoryStatus as keyof typeof Constants.CATEGORY_STATUS
                      ]
                    }
                  </p>
                ) : (
                  <p className="px-5 text-gray-5">-</p>
                );
              },
            },
            // {
            //   key: "actions",
            //   label: "",
            //   render: (_, row) => (
            //     <div>
            //       <button onClick={() => handleDelete(row)}>
            //         <RiDeleteBin6Line className="text-gray-5 text-xl hover:text-dark-6" />
            //       </button>
            //     </div>
            //   ),
            // },
          ]}
          data={
            data?.sort(
              (a, b) => a.categoryStatus - b.categoryStatus
            ) as Category[]
          }
        />
      )}
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
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
      />
      <StatusChangeModal
        selectedData={data?.filter((item) =>
          selectedIds.includes(item.categoryId)
        )}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
        }}
      />
      {/* <Modal
        isOpen={isStatusModalOpen}
        title="상태 변경"
        onClose={() => {
          setIsStatusModalOpen(false);
        }}
        buttonTitle="변경하기"
      >
        <div>{}</div>
      </Modal> */}
    </div>
  );
};

export default Categories;
