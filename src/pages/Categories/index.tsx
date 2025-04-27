import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoIosAdd } from "@react-icons/all-files/io/IoIosAdd";
import { FaCaretDown } from "@react-icons/all-files/fa/FaCaretDown";
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

interface Category {
  categoryId: number;
  categoryStatus: 1 | 2 | 3;
  categoryTitle: string;
  challengesInvolved: number;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

const Categories = () => {
  const queryClient = useQueryClient();
  const { setToastState } = useAppStore();

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null); // for modify title
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // for modify status
  const [isOpen, setIsOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [selected, setSelected] = useState<{
    key: 1 | 2 | 3;
    status: string;
  } | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categoryList"],
    queryFn: () => services.Category.fetchCategories(),
  });

  const { mutate: updateCategory } = useMutation({
    mutationFn: ({ category }: { category: Category }) => {
      setIsUpdateLoading(true);

      return services.Category.updateCategory({
        updatedCategories: [category],
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

  return (
    <div className="relative h-full">
      <PageTitle title="카테고리 목록" count={data?.length || 0} />
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center h-[400px]">
          <AiOutlineLoading3Quarters className="text-40 animate-spin text-blue-6" />
        </div>
      ) : (
        <>
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
          <Table
            columnRatios={[0.5, 0.5, 3, 1, 1, 1, 1]}
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
                      if (row.categoryStatus < 1 || row.categoryStatus > 2) {
                        setToastState({
                          isOpen: true,
                          type: "error",
                          title: "수정 불가",
                          message: "수정이 불가능한 상태입니다.",
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
              {
                key: "challengesInvolved",
                label: "포함된 위시",
                render: (_, row) => {
                  return (
                    <p className="text-gray-6 tracking-tight">
                      {row?.challengesInvolved || 0}개
                    </p>
                  );
                },
              },
              {
                key: "lastUpdatedBy",
                label: "수정인",
                render: (_, row) => {
                  return (
                    <p className="text-gray-6 tracking-tight">
                      {row?.lastUpdatedBy || ""}
                    </p>
                  );
                },
              },
              {
                key: "lastUpdatedAt",
                label: "수정일",
                render: (_, row) => {
                  const original = row?.lastUpdatedAt || "";
                  const dateOnly = original.split("T")[0];

                  return (
                    <p className="text-gray-6 tracking-tight">{dateOnly}</p>
                  );
                },
              },
            ]}
            data={
              data?.sort(
                (a: Category, b: Category) =>
                  new Date(b.lastUpdatedAt).valueOf() -
                  new Date(a.lastUpdatedAt).valueOf()
              ) as Category[]
            }
          />
        </>
      )}
      <Modal
        title="카테고리 수정"
        buttonTitle="수정하기"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedItem(null);
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
        <div className="mb-30">
          <label className="flex text-14 text-gray-6 mb-8">이름</label>
          <input
            defaultValue={selectedItem?.categoryTitle}
            className="p-16 border-solid border-1 w-full rounded border-gray-3"
            placeholder="카테고리명을 작성해주세요."
            onChange={(e) => {
              setSelectedItem((prev: any) => ({
                ...prev,
                categoryTitle: e.target.value,
              }));
            }}
          />
        </div>
        <div className="flex flex-col relative">
          <label htmlFor="category" className="mb-5 text-gray-6 tracking-tight">
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
              {!!selected
                ? selected.status
                : Constants.CATEGORY_STATUS?.[
                    selectedItem?.categoryStatus as keyof typeof Constants.CATEGORY_STATUS
                  ]}
            </span>
            <FaCaretDown className="absolute right-16 text-24 top-1/2 -translate-y-1/2 text-gray-4" />
          </button>

          {isSelectOpen && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-3 rounded-md shadow-md mt-1 z-10 max-h-220 overflow-y-auto">
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
                    className="px-16 py-12 cursor-pointer hover:bg-blue-0"
                    onClick={() => {
                      setSelected(item);
                      setSelectedItem((prev: any) => ({
                        ...prev,
                        categoryStatus: item.key,
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
      </Modal>
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
      />
      <StatusChangeModal
        selectedData={data?.filter((item: any) =>
          selectedIds.includes(item.categoryId)
        )}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedIds([]);
        }}
      />
    </div>
  );
};

export default Categories;
