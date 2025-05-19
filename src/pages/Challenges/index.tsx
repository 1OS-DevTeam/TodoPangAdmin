import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
import { IoIosAdd } from "@react-icons/all-files/io/IoIosAdd";
import { MdCheckBoxOutlineBlank } from "@react-icons/all-files/md/MdCheckBoxOutlineBlank";
import { MdCheckBox } from "@react-icons/all-files/md/MdCheckBox";
import { CgArrowsExchange } from "@react-icons/all-files/cg/CgArrowsExchange";

import { PageTitle, Table, Footer } from "src/components";
import services from "src/services";
import { Constants } from "src/common";
import DetailModal from "./DetailModal";
import AddModal from "./AddModal";
import { useAppStore } from "src/stores";
import StatusChangeModal from "./StatusChangeModal";

const Challenges = () => {
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

  return isError ? (
    <div className="flex justify-center h-full w-full items-center">
      <div className="flex flex-col items-center">
        <img
          src="images/logo-icon-pencil.png"
          className="w-180 mb-30 opacity-40"
        />
        <p className="text-gray-4 leading-8 text-center font-medium text-24 tracking-tight">
          해당 결과가 없습니다.
        </p>
      </div>
    </div>
  ) : isLoading ? (
    <div className="flex justify-center items-center h-[400px]">
      <AiOutlineLoading3Quarters className="text-40 animate-spin text-blue-6" />
    </div>
  ) : (
    <div className="flex flex-col justify-between items-stretch h-full">
      <div>
        <PageTitle
          title="위시리스트"
          count={challengeList?.totalElements || 0}
        />
        <div className="flex justify-end">
          <button
            className="flex border-[1px] border-blue-6 pr-16 pl-8 mr-12 py-6 rounded hover:bg-blue-0"
            onClick={handleChangeStatus}
          >
            <CgArrowsExchange className="text-blue-6 text-22 mr-4" />
            <span className="text-blue-6 text-16 font-medium">상태 변경</span>
          </button>
          <button
            className="flex bg-blue-6 pr-16 pl-8 py-6 rounded"
            onClick={() => {
              setIsAddModalOpen(true);
            }}
          >
            <IoIosAdd className="text-white text-22" />
            <span className="text-white text-16">추가</span>
          </button>
        </div>
        <Table
          columnRatios={[0.5, 0.7, 2.0, 0.8, 0.8, 0.8, 0.8, 0.8, 1.5, 1.5]}
          columns={[
            {
              key: "checkbox",
              label: "",
              render: (_, row) => (
                <button
                  className="flex w-full text-start cursor-pointer"
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
                  <p className="text-blue-6 font-medium underline underline-offset-2">
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
                    className={`${row.challengeStatus === 1 ? "bg-yellow-1 text-yellow-7" : row.challengeStatus === 2 ? "bg-blue-0 text-blue-6" : "bg-gray-2 text-gray-6"} inline-block px-8 py-3 rounded text-14`}
                  >
                    {
                      Constants.CATEGORY_STATUS?.[
                        row.challengeStatus as keyof typeof Constants.CATEGORY_STATUS
                      ]
                    }
                  </p>
                ) : (
                  <p className="px-5 text-gray-5">-</p>
                );
              },
            },
            { key: "categoryId", label: "카테고리ID" },
            { key: "challengeDiff", label: "난이도" },
            {
              key: "challengeTerm",
              label: "기간",
              render: (_, row) => {
                return <p>{row?.challengeTerm || 0}일</p>;
              },
            },
            {
              key: "challengeTodoCount",
              label: "할일 갯수",
              render: (_, row) => {
                return <p>{row?.challengeTodoCount || 0}개</p>;
              },
            },
            { key: "lastUpdatedBy", label: "수정인" },
            {
              key: "lastUpdatedAt",
              label: "수정일",
              render: (_, row) => {
                const original = row?.lastUpdatedAt || "";
                const dateOnly = original.split("T")[0];

                return <p>{dateOnly}</p>;
              },
            },
          ]}
          data={
            challengeList?.content?.sort(
              (a, b) => a.challengeStatus - b.challengeStatus
            ) || []
          }
        />
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

      <Footer
        totalElementPerPage={challengeList?.content?.length}
        totalPages={challengeList?.totalPages}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
    </div>
  );
};

export default Challenges;
