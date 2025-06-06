import { ReactNode } from "react";
import { MdCheckBoxOutlineBlank } from "@react-icons/all-files/md/MdCheckBoxOutlineBlank";
// import { MdCheckBox } from "@react-icons/all-files/md/MdCheckBox";

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
}

const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-left border-b-1 border-gray-1 bg-gray-1">
          {columns.map((column) => (
            <th
              key={String(column.key)}
              scope="col"
              className="whitespace-nowrap py-12"
            >
              {column.label === "checkbox" ? (
                <button className="px-6 flex cursor-pointer" onClick={() => {}}>
                  <MdCheckBoxOutlineBlank className="text-gray-4 text-24" />
                </button>
              ) : (
                <p className="text-14 text-gray-6 font-medium">
                  {column.label}
                </p>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            className={`text-left border-b-1 ${index !== data.length - 1 ? "border-gray-1" : "border-transparent"} ${index % 2 === 0 ? "bg-white" : "bg-gray-0"}`}
          >
            {columns.map((column) => (
              <td
                key={String(column.key)}
                className={`whitespace-nowrap py-12 text-gray-6 text-14 tracking-tight px-3`}
              >
                {column.render
                  ? column.render(row[column.key as keyof T], row)
                  : (row[column.key as keyof T] as ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
