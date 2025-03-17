import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";

interface Props {
  total: number;
}

const Footer = ({ total }: Props) => {
  return (
    <div className="absolute bottom-0 right-0 border-t-1 w-full border-solid border-gray-1">
      {/* total count */}
      <p className="mt-16 text-right mb-20 tracking-tight text-gray-5 font-medium">
        총 {total}개의 결과
      </p>
      {/* pagination */}
      <div className="flex items-center justify-end">
        <button>
          <FaChevronLeft className="text-gray-4 text-20 mr-14 hover:text-blue-6" />
        </button>
        {PAGINATION_TEST.map((page, index) => {
          const isSelected = index === 0;
          return (
            <button
              className={`px-10 text-16 mr-12 h-35 w-35 font-medium py-5 rounded ${isSelected ? "bg-blue-6 text-white" : "bg-gray-1 text-gray-6 hover:bg-gray-3"}`}
            >
              {page}
            </button>
          );
        })}
        <button>
          <FaChevronRight className="text-gray-4 text-20 hover:text-blue-6" />
        </button>
      </div>
    </div>
  );
};

export default Footer;

const PAGINATION_TEST = [1, 2, 3, 4, 5];
