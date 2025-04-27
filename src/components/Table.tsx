import { ReactNode } from "react";

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  columnRatios?: number[];
}

const Table = <T,>({ columns, data, columnRatios }: TableProps<T>) => {
  const totalRatio =
    columnRatios?.reduce((sum, r) => sum + r, 0) || columns.length;
  const computedWidths = columnRatios
    ? columnRatios.map((r) => Math.round((r / totalRatio) * 100) + "%")
    : Array(columns.length).fill(`${100 / columns.length}%`);

  return (
    <table className="border-collapse mt-20 table-fixed w-full">
      <thead>
        <tr className="text-left border-b-1 border-gray-1">
          {columns.map((column, index) => (
            <th
              key={String(column.key)}
              scope="col"
              className="py-16 font-semibold"
              style={{ width: computedWidths[index] }}
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
            className={`text-left border-b-1 ${index !== data.length - 1 ? "border-gray-1" : "border-transparent"} hover:bg-[#f8fdffee]`}
          >
            {columns.map((column, index) => (
              <td
                key={String(column.key)}
                className={`py-12 text-gray-6 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis px-3`}
                style={{ width: computedWidths[index] }}
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
