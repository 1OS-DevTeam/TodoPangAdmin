import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
import { MdCheckBoxOutlineBlank } from "@react-icons/all-files/md/MdCheckBoxOutlineBlank";
import { MdCheckBox } from "@react-icons/all-files/md/MdCheckBox";
import { MdErrorOutline } from "@react-icons/all-files/md/MdErrorOutline";
import { IoIosAdd } from "@react-icons/all-files/io/IoIosAdd";
import { CgArrowsExchange } from "@react-icons/all-files/cg/CgArrowsExchange";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { PageTitle, Section, Table } from "src/components";
import services from "src/services";
import AddModal from "./AddModal";
import { Constants } from "src/common";
import { Review as ReviewType } from "src/types/review";
import DetailModal from "./DetailModal";
import StatusChangeModal from "./StatusChangeModal";
import { useAppStore } from "src/stores";

const Review = () => {
  const { setToastState } = useAppStore();
  const [selectedRow, setSelectedRow] = useState<ReviewType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["review"],
    queryFn: () => services.Reveiw.fetchReivews(),
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
    <div>
      <PageTitle title="리뷰" />
      <Section>
        {isError ? (
          <div className="flex flex-col justify-center h-full w-full items-center my-32">
            <MdErrorOutline className="text-40 text-gray-5" />
            <p className="text-gray-5 leading-8 text-center text-14 tracking-normal">
              오류가 발생했습니다.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <AiOutlineLoading3Quarters className="text-40 animate-spin text-blue-6" />
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-20">
              <button
                className="flex items-center border-[1px] border-blue-6 pr-16 pl-8 mr-12 py-6 rounded hover:bg-blue-0"
                onClick={handleChangeStatus}
              >
                <CgArrowsExchange className="text-blue-6 text-22 mr-4" />
                <span className="text-blue-6 text-14 font-medium">
                  상태 변경
                </span>
              </button>
              <button
                className="flex items-center bg-blue-6 pr-16 pl-8 py-6 rounded"
                onClick={() => {
                  setIsAddModalOpen(true);
                }}
              >
                <IoIosAdd className="text-white text-22" />
                <span className="text-white text-14">리뷰 추가</span>
              </button>
            </div>
            <div className="w-full overflow-x-scroll pb-16">
              <Table
                columns={[
                  {
                    key: "checkbox",
                    label: "",
                    render: (_, row) => (
                      <button
                        onClick={() => {
                          if (selectedIds.includes(row.reviewId)) {
                            setSelectedIds(
                              selectedIds.filter((id) => id !== row.reviewId)
                            );
                          } else {
                            setSelectedIds([...selectedIds, row.reviewId]);
                          }
                        }}
                      >
                        {selectedIds.includes(row.reviewId) ? (
                          <MdCheckBox className="text-blue-6 text-24" />
                        ) : (
                          <MdCheckBoxOutlineBlank className="text-gray-3 text-24" />
                        )}
                      </button>
                    ),
                  },
                  {
                    key: "reviewId",
                    label: "ID",
                  },
                  {
                    key: "title",
                    label: "제목",
                    render: (_, row) => (
                      <button
                        className="flex w-full text-start cursor-pointer"
                        onClick={() => {
                          setSelectedRow(row);
                        }}
                      >
                        <p className="text-blue-6 pr-16 text-14 font-medium underline whitespace-nowrap underline-offset-2">
                          {row.title}
                        </p>
                      </button>
                    ),
                  },
                  {
                    key: "emoji",
                    label: "이모지",
                  },
                  {
                    key: "status",
                    label: "상태",
                    render: (_, row) => {
                      return Constants.CATEGORY_STATUS?.[
                        row.status as keyof typeof Constants.CATEGORY_STATUS
                      ] ? (
                        <p
                          className={`text-14 ${row.status === 1 ? "bg-yellow-1 text-yellow-7" : row.status === 2 ? "bg-blue-0 text-blue-6" : "bg-gray-2 text-gray-6"} inline-block px-8 py-3 rounded text-14`}
                        >
                          {
                            Constants.CATEGORY_STATUS?.[
                              row.status as keyof typeof Constants.CATEGORY_STATUS
                            ]
                          }
                        </p>
                      ) : (
                        <p className="px-5 text-gray-5 text-14">-</p>
                      );
                    },
                  },
                  {
                    key: "lastUpdatedBy",
                    label: "수정인",
                  },
                  {
                    key: "lastUpdatedAt",
                    label: "수정일시",
                    render: (_, row) => {
                      dayjs.extend(utc);
                      dayjs.extend(timezone);

                      const time = row?.lastUpdatedAt || "";
                      const formatted = dayjs
                        .utc(time)
                        .tz("Asia/Seoul")
                        .format("YYYY-MM-DD HH:mm");

                      return <p className="text-14">{formatted}</p>;
                    },
                  },
                ]}
                data={data?.content?.sort((a, b) => a.status - b.status) || []}
              />
            </div>
          </>
        )}
      </Section>

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
      />
      {selectedRow && (
        <DetailModal
          isOpen={!!selectedRow}
          onClose={() => {
            setSelectedRow(null);
          }}
          targetReview={selectedRow}
        />
      )}
      <StatusChangeModal
        selectedData={
          data?.content?.filter((item) =>
            selectedIds.includes(item.reviewId)
          ) || []
        }
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedIds([]);
        }}
      />
    </div>
  );
};

export default Review;
