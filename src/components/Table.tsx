import { ReactNode } from "react";

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
    <table className="w-full border-collapse mt-30">
      <thead>
        <tr className="bg-gray-100 text-left border-b-1 border-gray-1">
          {columns.map((column) => (
            <th
              key={String(column.key)}
              scope="col"
              className="py-16 font-semibold"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            className={`text-left border-b-1 ${index !== data.length - 1 ? "border-gray-1" : "border-transparent"}`}
          >
            {columns.map((column) => (
              <td key={String(column.key)} className="px-4 py-16 text-gray-7">
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
