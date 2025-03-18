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
    <table className="w-full border-collapse mt-30">
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
            className={`text-left border-b-1 ${index !== data.length - 1 ? "border-gray-1" : "border-transparent"}`}
          >
            {columns.map((column, index) => (
              <td
                key={String(column.key)}
                className={`px-4 py-16 text-gray-7 ${index === columns.length - 1 ? "text-right" : "text-left"}`}
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
