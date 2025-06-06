import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";

interface Props {
  totalElementPerPage?: number;
  totalPages?: number;
  selectedPage: number;
  setSelectedPage: (page: number) => void;
}

const Footer = ({
  totalElementPerPage = 0,
  totalPages = 0,
  selectedPage = 0,
  setSelectedPage,
}: Props) => {
  const PAGES_PER_GROUP = 5;

  const currentGroup = Math.floor(selectedPage / PAGES_PER_GROUP);
  const startPage = currentGroup * PAGES_PER_GROUP;
  const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages - 1);

  const handlePrevGroup = () => {
    const newPage = Math.max(0, startPage - PAGES_PER_GROUP);
    setSelectedPage(newPage);
  };

  const handleNextGroup = () => {
    const newPage = Math.min(totalPages - 1, endPage + 1);
    setSelectedPage(newPage);
  };

  return (
    <div className="w-full mt-48">
      <p className="mt-16 text-right mb-20 tracking-tight text-gray-5 text-14 font-medium">
        {selectedPage + 1}페이지 {totalElementPerPage}개의 결과
      </p>
      <div className="flex items-center justify-end">
        <button onClick={handlePrevGroup} disabled={startPage <= 0}>
          <FaChevronLeft className="text-gray-4 text-16 mr-14 hover:text-blue-6" />
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const pageNumber = startPage + i;
          const isSelected = selectedPage === pageNumber;
          return (
            <button
              key={pageNumber}
              onClick={() => setSelectedPage(pageNumber)}
              className={`px-10 text-14 mr-12 h-30 w-30 font-medium py-5 rounded ${
                isSelected
                  ? "bg-blue-6 text-white"
                  : "bg-gray-1 text-gray-6 hover:bg-gray-3"
              }`}
            >
              {pageNumber + 1}
            </button>
          );
        })}
        <button onClick={handleNextGroup} disabled={endPage >= totalPages - 1}>
          <FaChevronRight className="text-gray-4 text-16 hover:text-blue-6" />
        </button>
      </div>
    </div>
  );
};

export default Footer;
