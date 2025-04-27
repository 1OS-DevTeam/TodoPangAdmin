import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
import { IoIosAdd } from "@react-icons/all-files/io/IoIosAdd";
import { PageTitle, Table, Footer } from "src/components";
import services from "src/services";
import { Constants } from "src/common";
import DetailModal from "./DetailModal";
import AddModal from "./AddModal";

const Challenges = () => {
  // const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState(0);

  const {
    data: challengeList,
    isLoading,
    // isFetching,
    isError,
  } = useQuery({
    queryKey: ["challengeList", selectedPage],
    queryFn: () =>
      services.Challenge.fetchChallenges({
        page: selectedPage,
        pageSize: 10,
      }),
  });

  console.log(challengeList);

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
        ㅣ
        <PageTitle
          title="위시리스트"
          count={challengeList?.totalElements || 0}
        />
        <div className="flex justify-end">
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
          columnRatios={[0.7, 2.5, 0.8, 0.8, 0.8, 0.8, 0.8, 1.5, 1.5]}
          columns={[
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
          data={challengeList?.content || []}
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
