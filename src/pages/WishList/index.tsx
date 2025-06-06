import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
import { IoIosAdd } from "@react-icons/all-files/io/IoIosAdd";
import { MdCheckBoxOutlineBlank } from "@react-icons/all-files/md/MdCheckBoxOutlineBlank";
import { MdCheckBox } from "@react-icons/all-files/md/MdCheckBox";
import { MdErrorOutline } from "@react-icons/all-files/md/MdErrorOutline";
import { CgArrowsExchange } from "@react-icons/all-files/cg/CgArrowsExchange";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { PageTitle, Table, Footer, Section } from "src/components";
import services from "src/services";
import { Constants } from "src/common";
import DetailModal from "./DetailModal";
import AddModal from "./AddModal";
import { useAppStore } from "src/stores";
import StatusChangeModal from "./StatusChangeModal";

const WishList = () => {
  const { setToastState } = useAppStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const {
    data: challengeList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["challengeList", selectedPage],
    queryFn: () =>
      services.Challenge.fetchChallenges({
        page: selectedPage,
        pageSize: 20,
      }),
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
      <PageTitle title="위시리스트" />
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
                <span className="text-white text-14">위시 추가</span>
              </button>
            </div>
            <div className="w-full overflow-x-scroll pb-16">
              <Table
                columns={[
                  {
                    key: "checkbox",
                    label: "checkbox",
                    render: (_, row) => (
                      <button
                        className="cursor-pointer px-6 flex"
                        onClick={() => {
                          if (selectedIds.includes(row.challengeId)) {
                            setSelectedIds(
                              selectedIds.filter((id) => id !== row.challengeId)
                            );
                          } else {
                            setSelectedIds([...selectedIds, row.challengeId]);
                          }
                        }}
                      >
                        {selectedIds.includes(row.challengeId) ? (
                          <MdCheckBox className="text-blue-6 text-24" />
                        ) : (
                          <MdCheckBoxOutlineBlank className="text-gray-3 text-24" />
                        )}
                      </button>
                    ),
                  },
                  {
                    key: "challengeId",
                    label: "ID",
                  },
                  {
                    key: "name",
                    label: "이름",
                    render: (_, row) => (
                      <button
                        className="flex w-full text-start cursor-pointer"
                        onClick={() => {
                          setSelectedRow(row);
                        }}
                      >
                        <p className="text-blue-6 pr-16 text-14 font-medium underline whitespace-nowrap underline-offset-2">
                          {row.challengeName}
                        </p>
                      </button>
                    ),
                  },
                  {
                    key: "categoryStatus",
                    label: "상태",
                    render: (_, row) => {
                      return Constants.CATEGORY_STATUS?.[
                        row.challengeStatus as keyof typeof Constants.CATEGORY_STATUS
                      ] ? (
                        <p
                          className={`text-14 ${row.challengeStatus === 1 ? "bg-yellow-1 text-yellow-7" : row.challengeStatus === 2 ? "bg-blue-0 text-blue-6" : "bg-gray-2 text-gray-6"} inline-block px-8 py-3 rounded text-14`}
                        >
                          {
                            Constants.CATEGORY_STATUS?.[
                              row.challengeStatus as keyof typeof Constants.CATEGORY_STATUS
                            ]
                          }
                        </p>
                      ) : (
                        <p className="px-5 text-gray-5 text-14">-</p>
                      );
                    },
                  },
                  { key: "categoryId", label: "카테고리ID" },
                  { key: "challengeDiff", label: "난이도" },
                  {
                    key: "challengeTerm",
                    label: "기간",
                    render: (_, row) => {
                      return (
                        <p className="text-14">{row?.challengeTerm || 0}일</p>
                      );
                    },
                  },
                  {
                    key: "challengeTodoCount",
                    label: "할일 갯수",
                    render: (_, row) => {
                      return (
                        <p className="text-14">
                          {row?.challengeTodoCount || 0}개
                        </p>
                      );
                    },
                  },
                  { key: "lastUpdatedBy", label: "수정인" },
                  {
                    key: "lastUpdatedAt",
                    label: "수정일시",
                    render: (_, row) => {
                      dayjs.extend(utc);
                      dayjs.extend(timezone);

                      const time = row?.lastUpdatedAt || "";
                      const formatted = dayjs(time)
                        .utc()
                        .tz("Asia/Seoul")
                        .format("YYYY-MM-DD HH:mm");

                      return <p className="text-14">{formatted}</p>;
                    },
                  },
                ]}
                data={
                  challengeList?.content?.sort(
                    (a, b) => a.challengeStatus - b.challengeStatus
                  ) || []
                }
              />
            </div>
            <Footer
              totalElementPerPage={challengeList?.content?.length}
              totalPages={challengeList?.totalPages}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </>
        )}
      </Section>

      {selectedRow && (
        <DetailModal
          isOpen={!!selectedRow}
          close={() => {
            setSelectedRow(null);
          }}
          challenge={selectedRow}
        />
      )}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
      />
      <StatusChangeModal
        selectedData={
          challengeList?.content?.filter((item) =>
            selectedIds.includes(item.challengeId)
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

export default WishList;
